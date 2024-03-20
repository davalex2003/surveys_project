import json
import logging
import sys
import uuid
from dateutil import parser
from fastapi import FastAPI, Request, Response, BackgroundTasks, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
from starlette.responses import JSONResponse

from database import BD
from active_directory import find_email_in_ad, validate, find_fio_in_ad, find_email_on_address

app = FastAPI()


@app.post("/authorization")
async def authorization(request: Request):
    body = await request.json()
    login = body["username"]
    if validate(login, body["password"]):
        bd = BD()
        info = bd.check_owner(login)
        if info is None:
            return {"message": "Not a owner"}
        return {"token": info["token"], "username": body["username"], "fio": info["fio"]}
    return {"message": "Wrong username or password"}


@app.post("/create_survey")
async def create_survey(request: Request, username: str = Header(...),
                        token: str = Header(...)):
    body = await request.json()
    if token is None or username is None:
        return JSONResponse(content={"message": "Not authorized"}, status_code=401)
    logging.basicConfig(level=logging.INFO, filename="create_survey.log",
                        format="%(asctime)s %(levelname)s %(message)s")
    bd = BD()
    info = bd.validate_token(username, token)
    if info is None:
        return JSONResponse(content={"message": "Not authorized"}, status_code=401)
    logging.info(f"Новый опрос: {body}")
    survey_name = body["name"]
    survey_owner = body["owner"].lower()
    survey_visitors = ','.join(body["visitors"])
    try:
        time = parser.parse(body["send_date"])
    except Exception:
        time = None
    errors = []
    for email in body["emails"]:
        if "@" not in email:
            continue
        tabnum = find_email_in_ad(email)
        if tabnum == "000000":
            errors.append(email)
    if len(errors) > 0:
        return errors
    else:
        if time is not None:
            copy = 0
        else:
            copy = 1
        bd.insert_new_survey(survey_name, survey_owner, survey_visitors, time, copy)
        survey_id = bd.get_last_survey_id()
        survey_questions = body["questions"]
        for question in survey_questions:
            survey_text, typ, comment = question.split("$")
            if typ == "0":
                survey_type = 0
                bd.insert_new_question(survey_id, survey_text, survey_type, comment)
            elif typ == "1":
                survey_type = 1
                bd.insert_new_question(survey_id, survey_text, survey_type, comment)
            else:
                survey_type = 2
                bd.insert_new_question(survey_id, survey_text, survey_type, comment)
                question_id = bd.get_last_question_id()
                variants = typ.split(',')
                for variant in variants:
                    variant_to_bd = variant.strip().replace('(', '').replace(')', '')
                    bd.insert_new_variant(question_id, variant_to_bd)
        emails = []
        for email in body["emails"]:
            if "@" not in email:
                address = email
                emails += find_email_on_address(address)
            else:
                emails.append(email)
        for email in emails:
            tabnum = find_email_in_ad(email)
            guid = uuid.uuid4()
            bd.insert_new_email(tabnum, email, survey_id, guid)
        response = Response()
        response.status_code = 200
        logging.info(f"Новый опрос записан в БД")
        return []


@app.get("/get_questions/{guid}")
async def get_questions(guid: str):
    logging.basicConfig(level=logging.INFO, filename="create_survey.log",
                        format="%(asctime)s %(levelname)s %(message)s")
    logging.info(f"Получаем опрос для {guid}")
    bd = BD()
    data = bd.get_recall_survey(guid)
    if len(data) != 0:
        return {"survey_name": "recall", "questions": []}
    data = bd.get_survey(guid)
    if len(data) == 0:
        return {"survey_name": "already", "questions": []}
    logging.info(f"Получена информация для опроса: {data}")
    data_to_frontend = {
        "survey_name": data[0]["survey_name"],
        "questions": []
    }
    already_question_id = set()
    for i in range(len(data)):
        question_id = data[i]["question_id"]
        if question_id in already_question_id:
            continue
        else:
            already_question_id.add(question_id)
        question = {
            "question_text": data[i]['text'],
            "question_type": data[i]['type'],
            "comment": data[i]['comment'],
            "variants": []
        }
        if data[i]['variant'] is not None:
            variants = [data[i]['variant']]
            for j in range(i + 1, len(data)):
                if data[j]['question_id'] == question_id:
                    already_question_id.add(question_id)
                    variants.append(data[j]['variant'])
            question["variants"] = variants[::-1]
        data_to_frontend["questions"].append(question)
    return data_to_frontend


@app.post("/answers/{guid}")
async def answers(guid: str, request: Request, bgtasks: BackgroundTasks):
    body = await request.json()
    list_answers = list(body['answers'].values())
    bd = BD()
    bd.set_status_answer(guid)
    bgtasks.add_task(insert_answers, guid, list_answers)
    bgtasks.add_task(insert_comments, guid, body['comments'])
    return 200


def insert_answers(guid, list_answers):
    bd = BD()
    questions_id = bd.get_user_questions(guid)
    user_id = bd.get_user_id(guid)['id']
    for i in range(len(list_answers)):
        bd.insert_answers(user_id, questions_id[i]['id'], list_answers[i])


def insert_comments(guid, comments):
    bd = BD()
    user_id = bd.get_user_id(guid)['id']
    questions_id = bd.get_user_questions(guid)
    for i in comments:
        bd.insert_comments(user_id, questions_id[int(i)]['id'], comments[i])


@app.get("/get_surveys/{login}")
async def get_surveys(login: str, username: str = Header(...), token: str = Header(...)):
    if token is None or username is None:
        return JSONResponse(content={"message": "Not authorized"}, status_code=401)
    bd = BD()
    info = bd.validate_token(username, token)
    if info is None:
        return JSONResponse(content={"message": "Not authorized"}, status_code=401)
    return bd.get_surveys(login)[::-1]


@app.get("/get_survey_file/{survey_id}")
async def get_survey_file(survey_id: int, username: str = Header(...), token: str = Header(...)):
    if token is None or username is None:
        return JSONResponse(content={"message": "Not authorized"}, status_code=401)
    bd = BD()
    info = bd.validate_token(username, token)
    if info is None:
        return JSONResponse(content={"message": "Not authorized"}, status_code=401)
    data = bd.get_survey_answers(survey_id)
    columns = ["Участник", "Почта"]
    num_of_questions = bd.get_num_surveys_questions(survey_id)['total']
    for i in range(0, num_of_questions):
        columns.append(data[i]['text'])
        if data[i]['has_comment'] == 1:
            columns.append("Комментарий")
    df = pd.DataFrame(columns=columns)
    for i in range(0, len(data), num_of_questions):
        fio = find_fio_in_ad(data[i]['e_mail'])
        row = [fio, data[i]['e_mail']]
        for j in range(i, i + num_of_questions):
            row.append(data[j]['answer'] if data[j]['answer'] is not None else "-")
            if data[j]['has_comment'] == 1:
                row.append(data[j]['comment'] if data[j]['comment'] is not None else "-")
        df.loc[len(df)] = row
    filename = f"survey_{survey_id}.xlsx"
    df.to_excel(filename, index=False)
    return FileResponse(filename, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        filename=filename)


@app.delete("/delete_survey/{survey_id}")
async def delete_survey(survey_id: int, username: str = Header(...), token: str = Header(...)):
    if token is None or username is None:
        return JSONResponse(content={"message": "Not authorized"}, status_code=401)
    bd = BD()
    info = bd.validate_token(username, token)
    if info is None:
        return JSONResponse(content={"message": "Not authorized"}, status_code=401)
    bd.delete_survey(survey_id)


@app.delete("/delete_front_survey/{survey_id}")
async def delete_front_survey(survey_id: int, username: str = Header(...), token: str = Header(...)):
    if token is None or username is None:
        return JSONResponse(content={"message": "Not authorized"})
    bd = BD()
    info = bd.validate_token(username, token)
    if info is None:
        return JSONResponse(content={"message": "Not authorized"})
    bd.delete_survey_from_frontend(survey_id)


@app.get("/survey_info/{survey_id}")
async def get_survey_info(survey_id: int):
    bd = BD()
    return bd.get_survey_info(survey_id)


@app.post("/recall_survey/{survey_id}")
async def recall_survey(survey_id: int, token: str = Header(...), username: str = Header(...)):
    if token is None or username is None:
        return JSONResponse(content={"message": "Not authorized"})
    bd = BD()
    info = bd.validate_token(username, token)
    if info is None:
        return JSONResponse(content={"message": "Not authorized"})
    bd.recall_survey(survey_id)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, filename="create_survey.log",
                    format="%(asctime)s %(levelname)s %(message)s")
try:
    f = open('config.json')
    conf = json.load(f)
    logging.info("Конфиг для IP успешно прочитан")
except Exception as e:
    logging.critical(f"Не удалось прочитать конфиг для IP: {e}")
    sys.exit(-1)
