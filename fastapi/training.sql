-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Хост: localhost:3306
-- Время создания: Май 08 2025 г., 14:38
-- Версия сервера: 10.6.21-MariaDB-0ubuntu0.22.04.2
-- Версия PHP: 8.1.2-1ubuntu2.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `webapp`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Training`
--

DROP TABLE IF EXISTS `Training`;

CREATE TABLE IF NOT EXISTS `Training` (
  `training_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `training_duration` int(11) NOT NULL,
  PRIMARY KEY (`training_id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `Training`
--

INSERT INTO `Training` (`training_id`, `user_id`, `category_id`, `date`, `training_duration`) VALUES
(1, NULL, 4, '2025-04-23', 1),
(2, 6, 5, '2025-04-24', 50),
(3, 6, 5, '2025-04-23', 50),
(4, 6, 2, '2025-03-24', 15),
(5, 6, 2, '2025-04-21', 25),
(6, 6, 2, '2025-04-14', 17),
(7, 6, 3, '2025-05-04', 61),
(8, 6, 1, '2025-05-04', 33),
(9, 6, 5, '2025-05-04', 2),
(10, 6, 2, '2025-05-01', 53),
(11, 6, 6, '2025-04-28', 25),
(12, 6, 5, '2025-04-30', 35),
(13, 6, 1, '2025-04-30', 15),
(14, NULL, 1, '2025-04-30', 15),
(15, NULL, 2, '2025-04-29', 57),
(16, NULL, 4, '2025-05-05', 79),
(17, NULL, 4, '2025-05-03', 31),
(18, 12, 4, '2025-05-03', 41),
(19, 12, 6, '2025-05-02', 47),
(20, 12, 3, '2025-04-02', 40),
(21, 12, 3, '2025-04-13', 140),
(22, 6, 2, '2025-05-08', 123),
(23, 6, 1, '2025-05-08', 1);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Training`
--

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Training`
--
ALTER TABLE `Training`
  MODIFY `training_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Training`
--
ALTER TABLE `Training`
  ADD CONSTRAINT `Training_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  ADD CONSTRAINT `Training_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `Category` (`category_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
