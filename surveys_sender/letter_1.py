import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
import json
import sys
import pymysql.cursors
from time import sleep

logging.basicConfig(level=logging.INFO, filename="send_surveys.log", format="%(asctime)s %(levelname)s %("
                                                                            "message)s")

while True:
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
        sql = "SELECT id, name FROM survey WHERE send = 0 AND send_date < NOW() AND deleted = 0 AND recall = 0 AND copy = 0"
        cursor.execute(sql)
        need_surveys = cursor.fetchall()
        logging.info(f"Необходимо отправить опросы: {need_surveys}")
        for row in need_surveys:
            sql = "UPDATE survey SET send = 1 WHERE id = %s"
            survey_name = row["name"]
            cursor.execute(sql, row["id"])
            connection.commit()
            sql = "SELECT e_mail, guid from user WHERE survey_id = %s"
            cursor.execute(sql, row["id"])
            need_emails = cursor.fetchall()
            for row_1 in need_emails:
                email = row_1["e_mail"]
                guid = row_1["guid"]
                mes = MIMEMultipart()
                From = 'surveys@mgts.ru'
                To = email
                mes['Subject'] = "Прохождение опроса"
                mes['From'] = From
                mes['To'] = To
                msgText = MIMEText(f"""Добрый день!<br><br> 
                Приглашаем вас принять участие в опросе: <a href="https://{ip}/take_survey/{guid}">
                {survey_name}</a>. Опрос займёт не более 5 минут. Ссылка работает только из корпоративной 
                сети.<br><br> Данное письмо сформировано автоматически, просьба на него не отвечать.""", 'html')
                mes.attach(msgText)
                server = smtplib.SMTP("mail.mgts.ru")
                try:
                    server.sendmail(From, To, mes.as_string())
                    logging.info(f"Отправили письмо на {email}")
                except Exception as e:
                    logging.error(f"Не удалось отправить письмо на {email}: {e}")
            logging.info(f"Отправили опрос: f{row}")
    sleep(300)
