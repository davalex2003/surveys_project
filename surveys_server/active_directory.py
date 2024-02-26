import sys

import ldap3
import json
import logging


def find_email_in_ad(email: str) -> str:
    logging.basicConfig(level=logging.INFO, filename="create_survey.log",
                        format="%(asctime)s %(levelname)s %(message)s")
    try:
        f = open('config.json')
        conf = json.load(f)
        logging.info("Конфиг для поиска в АД успешно прочитан")
    except Exception as e:
        logging.critical(f"Не удалось прочитать конфиг для поиска в АД: {e}")
        sys.exit(-1)
    # Подключаемся к АД
    try:
        server = ldap3.Server('ldap://mgts.corp.net', get_info=ldap3.NONE)
        conn = ldap3.Connection(server, user=conf["user"], password=conf["password"], auto_bind=True)
        logging.info("Подключились к АД")
    except Exception as e:
        logging.critical(f"Не удалось подключиться к АД: {e}")
        sys.exit(-1)
    conn.search('OU=MGTS,dc=mgts,dc=corp,dc=net', '(mail={})'.format(email),
                attributes=["*"])
    try:
        tabnum = conn.entries[0]['EmployeeID']
    except Exception as e:
        logging.warning(f"Не удалось найти табельный МГТС. {e}")
        server = ldap3.Server('ldap://msk.mts.ru', get_info=ldap3.NONE)
        conn = ldap3.Connection(server, user="ADMSK\\sa0400ivrhdmgts", password="pxuWkhPr(bdnQR9", auto_bind=True)
        conn.search('OU=MTSUsers,dc=msk,dc=mts,dc=ru', '(mail={})'.format(email), attributes=["*"])
        logging.info("Подключились к АД")
        try:
            tabnum = conn.entries[0]['EmployeeID']
        except Exception as e:
            logging.warning(f"Не удалось найти табельный нигде")
            tabnum = "000000"
    return tabnum


def find_fio_in_ad(email: str):
    logging.basicConfig(level=logging.INFO, filename="create_survey.log",
                        format="%(asctime)s %(levelname)s %(message)s")
    try:
        f = open('config.json')
        conf = json.load(f)
        logging.info("Конфиг для поиска в АД успешно прочитан")
    except Exception as e:
        logging.critical(f"Не удалось прочитать конфиг для поиска в АД: {e}")
        sys.exit(-1)
    # Подключаемся к АД
    try:
        server = ldap3.Server('ldap://mgts.corp.net', get_info=ldap3.NONE)
        conn = ldap3.Connection(server, user=conf["user"], password=conf["password"], auto_bind=True)
        logging.info("Подключились к АД")
    except Exception as e:
        logging.critical(f"Не удалось подключиться к АД: {e}")
        sys.exit(-1)
    conn.search('OU=MGTS,dc=mgts,dc=corp,dc=net', '(mail={})'.format(email),
                attributes=["*"])
    try:
        name = conn.entries[0]["displayName"]
    except Exception as e:
        server = ldap3.Server('ldap://msk.mts.ru', get_info=ldap3.NONE)
        conn = ldap3.Connection(server, user="ADMSK\\sa0400ivrhdmgts", password="pxuWkhPr(bdnQR9", auto_bind=True)
        conn.search('OU=MTSUsers,dc=msk,dc=mts,dc=ru', '(mail={})'.format(email), attributes=["*"])
        name = conn.entries[0]["name"]
    return name


def validate(login: str, password: str) -> bool:
    logging.basicConfig(level=logging.INFO, filename="create_survey.log",
                        format="%(asctime)s %(levelname)s %(message)s")
    try:
        server = ldap3.Server('ldap://mgts.corp.net', get_info=ldap3.NONE)
        ldap3.Connection(server, user="mgts\\" + login, password=password, auto_bind=True)
    except Exception as e:
        logging.error(f"Не удалось войти в АД: {e}")
        return False
    logging.info(f"Удалось проверить пароль для пользователя {login}")
    return True


def find_email_on_address(address: str):
    logging.basicConfig(level=logging.INFO, filename="create_survey.log",
                        format="%(asctime)s %(levelname)s %(message)s")
    try:
        f = open('config.json')
        conf = json.load(f)
        logging.info("Конфиг для поиска в АД успешно прочитан")
    except Exception as e:
        logging.critical(f"Не удалось прочитать конфиг для поиска в АД: {e}")
        sys.exit(-1)
    try:
        server = ldap3.Server('ldap://mgts.corp.net', get_info=ldap3.NONE)
        conn = ldap3.Connection(server, user=conf["user"], password=conf["password"], auto_bind=True)
        logging.info("Подключились к АД")
    except Exception as e:
        logging.critical(f"Не удалось подключиться к АД: {e}")
        sys.exit(-1)
    conn.search('OU=MGTS,dc=mgts,dc=corp,dc=net', f'(extensionattribute7=*{address}*)',
                attributes=["mail"])
    e_mails = []
    for i in conn.entries:
        e_mails.append(i["mail"])
    return e_mails


if __name__ == "__main__":
    print("Файл со вспомогательной функцией. Требуется запускать файл main.py")
