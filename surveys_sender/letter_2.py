import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
import json
import sys
import pymysql.cursors

logging.basicConfig(level=logging.INFO, filename="send_surveys.log", format="%(asctime)s %(levelname)s %("
                                                                            "message)s")

json_path = os.path.dirname(os.path.abspath(__file__))
with open(rf'{json_path}\config.json', encoding='utf8') as f:
    params = json.load(f)
    ip = params["ip"]
    params = params["database"]
    f.close()
try:
    connection = pymysql.connect(**params, cursorclass=pymysql.cursors.DictCursor)
    logging.info("Подключились к БД")
except Exception as e:
    logging.error(f"Не подключились к БД: {e}")
    sys.exit(-1)

with connection.cursor() as cursor:
    sql = """SELECT 
                 e_mail, guid, survey.name 
             FROM 
                 survey
                 JOIN user on survey.id = user.survey_id 
             WHERE send = 1 AND send_date < NOW() AND user.status = 0"""
    cursor.execute(sql)
    need_users = cursor.fetchall()
    logging.info(f"Необходимо отправить опросы пользователям: {need_users}")
    for row in need_users:
        email = row["e_mail"]
        guid = row["guid"]
        survey_name = row["name"]
        mes = MIMEMultipart()
        From = 'surveys@mgts.ru'
        To = 'a.i.davidenko@mgts.ru'
        mes['Subject'] = "Прохождение опроса"
        mes['From'] = From
        mes['To'] = To
        msgText = MIMEText(f"""Добрый день!<br><br> 
        Приглашаем вас принять участие в опросе: <a href="http://{ip}/take_survey/{guid}">
        {survey_name}</a>. Опрос займёт не более 5 минут. Ссылка работает только из корпоративной 
        сети.<br><br> Данное письмо сформировано автоматически, просьба на него не отвечать.""", 'html')
        mes.attach(msgText)
        server = smtplib.SMTP("mail.mgts.ru")
        try:
            server.sendmail(From, To, mes.as_string())
            logging.info(f"Отправили письмо на {email}")
        except Exception as e:
            logging.error(f"Не удалось отправить письмо на {email}: {e}")
        logging.info(f"Отправили опрос пользователю: f{row}")
