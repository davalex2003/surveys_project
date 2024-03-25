CREATE TABLE `survey` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT (now()),
  `owner` varchar(30) NOT NULL,
  `visitors` varchar(255),
  `send_date` timestamp,
  `send` boolean NOT NULL DEFAULT false,
  `recall` boolean NOT NULL DEFAULT false,
  `deleted` boolean NOT NULL DEFAULT false,
  `copy` boolean NOT NULL DEFAULT false
);

CREATE TABLE `question` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `survey_id` int NOT NULL,
  `text` varchar(100) NOT NULL,
  `type` int NOT NULL,
  `has_comment` boolean NOT NULL DEFAULT false
);

CREATE TABLE `variant` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `variant` varchar(30) NOT NULL
);

CREATE TABLE `user` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `e_mail` varchar(30) NOT NULL,
  `status` boolean NOT NULL DEFAULT false,
  `survey_id` int NOT NULL,
  `guid` varchar(50) NOT NULL,
  `date` timestamp
);

CREATE TABLE `answer` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `question_id` int NOT NULL,
  `answer` varchar(100) NOT NULL,
  `comment` varchar(100)
);

CREATE TABLE `owner` (
    `id` int PRIMARY KEY AUTO_INCREMENT,
    `login` varchar(20) NOT NULL,
    `fio` varchar(50) NOT NULL,
    `hash_password` varchar (50) NOT NULL
);

ALTER TABLE `question` ADD FOREIGN KEY (`survey_id`) REFERENCES `survey` (`id`) ON DELETE CASCADE;

ALTER TABLE `variant` ADD FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;

ALTER TABLE `user` ADD FOREIGN KEY (`survey_id`) REFERENCES `survey` (`id`) ON DELETE CASCADE;

ALTER TABLE `answer` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

ALTER TABLE `answer` ADD FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;
