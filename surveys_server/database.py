import logging
import os
import json
import sys

import pymysql
import pymysql.cursors


class BD:
    def __init__(self):
        logging.basicConfig(level=logging.INFO, filename="create_survey.log", format="%(asctime)s %(levelname)s %("
                                                                                     "message)s")
        json_path = os.path.dirname(os.path.abspath(__file__))
        with open(rf'{json_path}\config.json', encoding='utf8') as f:
            self.__params = json.load(f)['database']
            f.close()
        try:
            self.connection = pymysql.connect(**self.__params, cursorclass=pymysql.cursors.DictCursor)
            logging.info("Подключились к БД")
        except Exception as e:
            logging.error(f"Не подключились к БД: {e}")
            sys.exit(-1)

    def check_owner(self, login):
        with self.connection.cursor() as cursor:
            sql = "SELECT * FROM owner WHERE login = %s"
            cursor.execute(sql, login)
            logging.info(f"Проверили допуск в БД для {login}")
        return cursor.fetchone()

    def validate_token(self, login, token):
        with self.connection.cursor() as cursor:
            sql = "SELECT * FROM owner WHERE login = %s AND token = %s"
            cursor.execute(sql, (login, token))
            logging.info(f"Проверили токен для {login}")
        return cursor.fetchone()

    def insert_new_survey(self, name, owner, visitors, time, copy):
        with self.connection.cursor() as cursor:
            sql = "INSERT INTO survey(name, owner, visitors, send_date, send, copy) VALUES (%s, %s, %s, %s, %s, %s)"
            cursor.execute(sql, (name, owner, visitors, time, 0, copy))
        self.connection.commit()
        logging.info("Новая запись опроса в БД создана")

    def get_last_survey_id(self):
        with self.connection.cursor() as cursor:
            sql = "SELECT id FROM survey ORDER BY id DESC LIMIT 1"
            cursor.execute(sql)
            last_id = cursor.fetchone()
        logging.info(f"Нашли id опроса: {last_id}")
        return last_id['id']

    def insert_new_question(self, survey_id, text, typ, comment):
        with self.connection.cursor() as cursor:
            sql = "INSERT INTO question(survey_id, text, type, has_comment) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (survey_id, text, typ, comment))
        self.connection.commit()
        logging.info("Новая запись вопроса в БД создана")

    def get_last_question_id(self):
        with self.connection.cursor() as cursor:
            sql = "SELECT id FROM question ORDER BY id DESC LIMIT 1"
            cursor.execute(sql)
            last_id = cursor.fetchone()
        logging.info(f"Нашли id вопроса: {last_id}")
        return last_id['id']

    def insert_new_variant(self, question_id, text):
        with self.connection.cursor() as cursor:
            sql = "INSERT INTO variant(question_id, variant) VALUES (%s, %s)"
            cursor.execute(sql, (question_id, text))
        self.connection.commit()
        logging.info("Новая запись варианта в БД создана")

    def insert_new_email(self, tabnum, email, survey_id, guid):
        with self.connection.cursor() as cursor:
            sql = "INSERT INTO user(tabnum, e_mail, status, survey_id, guid) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(sql, (tabnum, email, False, survey_id, guid))
        self.connection.commit()
        logging.info("Новая запись участника в БД создана")

    def get_survey(self, guid):
        with self.connection.cursor() as cursor:
            sql = """
            SELECT 
                survey.name as survey_name, question.text as text, question.id as question_id,question.type as type, question.has_comment as comment, variant.variant as variant
            FROM 
                survey
                JOIN user on user.survey_id = survey.id 
                JOIN question ON survey.id = question.survey_id
                LEFT JOIN variant on question.id = variant.question_id
            WHERE
                user.guid = %s AND user.status = 0
            """
            cursor.execute(sql, guid)
            logging.info("Получили опрос из БД")
            return cursor.fetchall()

    def get_recall_survey(self, guid):
        with self.connection.cursor() as cursor:
            sql = """SELECT survey.name as survey_name FROM survey JOIN user on user.survey_id = survey.id
            WHERE user.guid = %s AND survey.recall = 1"""
            cursor.execute(sql, guid)
            return cursor.fetchall()

    def set_status_answer(self, guid):
        with self.connection.cursor() as cursor:
            sql = "UPDATE user SET status = 1, date = NOW() WHERE guid = %s"
            cursor.execute(sql, guid)
            self.connection.commit()
        logging.info(f"{guid} прошёл опрос")

    def get_user_questions(self, guid):
        with self.connection.cursor() as cursor:
            sql = """SELECT 
                        question.id
                     FROM
                        question
                        JOIN user on question.survey_id = user.survey_id
                     WHERE user.guid = %s
            """
            cursor.execute(sql, guid)
            logging.info("Получили id вопросов из БД")
            return cursor.fetchall()

    def get_user_id(self, guid):
        with self.connection.cursor() as cursor:
            sql = """SELECT 
                        user.id
                     FROM
                        user
                     WHERE user.guid = %s
            """
            cursor.execute(sql, guid)
            logging.info("Получили id участника из БД")
            return cursor.fetchone()

    def get_num_surveys_questions(self, survey_id):
        with self.connection.cursor() as cursor:
            sql = """SELECT
                         COUNT(*) as total
                     FROM
                         survey
                         JOIN question ON survey.id = question.survey_id
                     WHERE survey.id = %s"""
            cursor.execute(sql, survey_id)
            return cursor.fetchone()

    def insert_answers(self, user_id, question_id, answer):
        with self.connection.cursor() as cursor:
            sql = "INSERT INTO answer(user_id, question_id, answer) VALUE (%s, %s, %s)"
            cursor.execute(sql, (user_id, question_id, answer))
            self.connection.commit()
            logging.info(f"Вставили вопросы участника с id {user_id}")

    def insert_comments(self, user_id, question_id, comment):
        with self.connection.cursor() as cursor:
            sql = "UPDATE answer SET comment = %s WHERE user_id = %s AND question_id = %s"
            cursor.execute(sql, (comment, user_id, question_id))
            self.connection.commit()
            logging.info(f"Вставили комментарии участника с id {user_id}")

    def get_surveys(self, login):
        with self.connection.cursor() as cursor:
            sql = """SELECT
                         survey.name,
                         survey.id,
                         COUNT(*) as total,
                         SUM(user.status) as completed,
                         survey.send_date as date,
                         survey.recall,
                         survey.copy
                     FROM
                         survey
                         JOIN user ON survey.id = user.survey_id
                     WHERE 
                         (survey.owner = %s OR INSTR(survey.visitors, %s) > 0)
                         AND
                         survey.deleted = 0
                     GROUP BY 1, 2"""
            cursor.execute(sql, (login, login))
            logging.info(f"Получили опросы для {login}")
            return cursor.fetchall()

    def get_num_survey_users(self, survey_id):
        with self.connection.cursor() as cursor:
            sql = """SELECT
                         COUNT(*) as total
                     FROM
                         survey
                         JOIN user ON survey.id = user.survey_id
                     WHERE survey.id = %s"""
            cursor.execute(sql, survey_id)
            return cursor.fetchone()

    def get_survey_answers(self, survey_id):
        with self.connection.cursor() as cursor:
            sql = """SELECT
                         survey.name,
                         question.text,
                         user.e_mail,
                         answer.answer,
                         question.has_comment,
                         answer.comment
                     FROM
                         survey
                         JOIN question on survey.id = question.survey_id
                         JOIN user on survey.id = user.survey_id
                         LEFT JOIN answer on question.id = answer.question_id and user.id = answer.user_id
                     WHERE survey.id = %s"""
            cursor.execute(sql, survey_id)
            logging.info(f"Получили результаты для опроса {survey_id}")
            return cursor.fetchall()

    def delete_survey(self, survey_id):
        with self.connection.cursor() as cursor:
            sql = """DELETE FROM survey WHERE survey.id = %s"""
            cursor.execute(sql, survey_id)
            logging.info(f"Удалили опрос {survey_id}")
        self.connection.commit()

    def delete_survey_from_frontend(self, survey_id):
        with self.connection.cursor() as cursor:
            sql = """UPDATE survey SET deleted = 1 WHERE survey.id = %s"""
            cursor.execute(sql, survey_id)
        self.connection.commit()

    def recall_survey(self, survey_id):
        with self.connection.cursor() as cursor:
            sql = """UPDATE survey SET recall = 1 WHERE survey.id = %s"""
            cursor.execute(sql, survey_id)
        self.connection.commit()

    def get_survey_info(self, survey_id):
        answer = {
            "survey_name": "",
            "survey_visitors": [],
            "survey_email": [],
            "survey_send_date": [],
            "questions": []
        }
        with self.connection.cursor() as cursor:
            sql = """SELECT 
                        survey.name,
                        survey.send_date,
                        survey.visitors
                     FROM 
                         survey
                     WHERE survey.id = %s"""
            cursor.execute(sql, survey_id)
            data = cursor.fetchone()
            answer["survey_name"] = data["name"]
            answer["survey_visitors"] = data["visitors"].split(',') if len(data["visitors"]) > 3 else []
            answer["survey_send_date"] = data["send_date"]
            sql = """SELECT user.e_mail FROM user WHERE user.survey_id = %s"""
            cursor.execute(sql, survey_id)
            for row in cursor.fetchall():
                answer["survey_email"].append(row["e_mail"])
            sql = """SELECT question.text, question.type, question.id, question.has_comment FROM question WHERE 
            question.survey_id = %s"""
            cursor.execute(sql, survey_id)
            questions_data = cursor.fetchall()
            for row in questions_data:
                if row["type"] == 2:
                    sql = """SELECT variant.variant FROM variant WHERE variant.question_id = %s"""
                    cursor.execute(sql, row["id"])
                    question = row["text"] + '$('
                    for row_1 in cursor.fetchall():
                        question += row_1["variant"] + ', '
                    question = question[:-2]
                    question += ')'
                    answer["questions"].append(question + '$' + str(row["has_comment"]))
                else:
                    answer["questions"].append(row["text"] + '$' + str(row["type"]) + '$' + str(row["has_comment"]))
            return answer


if __name__ == "__main__":
    print("Вспомогательный класс для работы с БД. Необходимо запускать main.py")
