CREATE TABLE `survey` (
  `id` int PRIMARY KEY AUTO_INCREMENT COMMENT 'ID опроса',
  `name` varchar(100) NOT NULL COMMENT 'Название опроса',
  `create_date` timestamp NOT NULL DEFAULT (now()) COMMENT 'Дата создания опроса',
  `owner` varchar(30) NOT NULL COMMENT 'Создатель опроса',
  `visitors` varchar(255) COMMENT 'Кому можно смотреть опрос',
  `send_date` timestamp COMMENT 'Дата отправки опроса',
  `send` boolean NOT NULL DEFAULT false COMMENT 'Был ли опрос отправлен',
  `recall` boolean NOT NULL DEFAULT false COMMENT 'Был ли опрос отозван',
  `deleted` boolean NOT NULL DEFAULT false COMMENT 'Был ли опрос удалён',
  `copy` boolean NOT NULL DEFAULT false COMMENT 'Является ли опрос копией'
);

CREATE TABLE `question` (
  `id` int PRIMARY KEY AUTO_INCREMENT COMMENT 'ID вопроса',
  `survey_id` int NOT NULL COMMENT 'ID опроса с этим вопросом',
  `text` varchar(100) NOT NULL COMMENT 'Текст вопроса',
  `type` int NOT NULL COMMENT '
    0 - Числовой
    1 - Словесный
    2 - С вариантами ответа
  '
);

CREATE TABLE `variant` (
  `id` int PRIMARY KEY AUTO_INCREMENT COMMENT 'ID вопроса',
  `question_id` int NOT NULL COMMENT 'ID вопроса с этим вариантом',
  `variant` varchar(30) NOT NULL COMMENT 'Текст варианта'
);

CREATE TABLE `user` (
  `id` int PRIMARY KEY AUTO_INCREMENT COMMENT 'ID пользователя',
  `tabnum` varchar(6) NOT NULL COMMENT 'Табельный номер пользователя',
  `e_mail` varchar(30) NOT NULL COMMENT 'e-mail пользователя',
  `status` boolean NOT NULL DEFAULT false COMMENT 'Прошёл ли пользователь опрос',
  `survey_id` int NOT NULL COMMENT 'ID опроса, который должен пройти пользователь',
  `guid` varchar(50) NOT NULL COMMENT 'GUID опроса для пользователя',
  `date` timestamp COMMENT 'Когда пользователь прошёл опрос'
);

CREATE TABLE `answer` (
  `id` int PRIMARY KEY AUTO_INCREMENT COMMENT 'ID ответа',
  `user_id` int NOT NULL COMMENT 'ID пользователя чей ответ',
  `question_id` int NOT NULL COMMENT 'ID вопроса',
  `answer` varchar(100) NOT NULL COMMENT 'Текст ответа'
);

CREATE TABLE `owner` (
    `id` int PRIMARY KEY AUTO_INCREMENT COMMENT 'ID создателя опросов',
    `tabnum` varchar(6) NOT NULL COMMENT 'Табельный создателя опросов',
    `login` varchar(20) NOT NULL COMMENT 'Логин создателя опросов',
    `token` varchar(50) NOT NULL COMMENT 'Токен для авторизации',
    `fio` varchar(50) NOT NULL COMMENT 'ФИО создателя опросов'
);

ALTER TABLE `question` ADD FOREIGN KEY (`survey_id`) REFERENCES `survey` (`id`) ON DELETE CASCADE;

ALTER TABLE `variant` ADD FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;

ALTER TABLE `user` ADD FOREIGN KEY (`survey_id`) REFERENCES `survey` (`id`) ON DELETE CASCADE;

ALTER TABLE `answer` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `answer` ADD FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;
