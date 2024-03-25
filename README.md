В surveys_client находится клиентская часть на реакте, запуск - npm run start
В surveys_server находится серверная часть, для запуска необходим python и docker. Запуск:
1. docker compose up 
2. pip install -r requirements.txt
3. uvicorn main:app
В surveys_sender находится дополнительная программа для отправки электронных писем, цикличная. Запуск:
1. pip install -r requirements.txt
2. python main.py
