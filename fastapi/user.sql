-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Хост: localhost:3306
-- Время создания: Май 08 2025 г., 14:09
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
-- Структура таблицы `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `subscription_type` enum('vip','premium','standard') NOT NULL DEFAULT 'standard',
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
--
-- Дамп данных таблицы `User`
--

INSERT INTO `User` (`user_id`, `name`, `surname`, `phone_number`, `email`, `address`, `password`, `subscription_type`, `role`) VALUES
(6, 'Katia', 'Rybka', '+999999999', 'rybka@gmail.com', 'Minsk', '$2b$12$pR9GmpmqfPuFcEs3HS.iNubd7qEn3Ggivma8csEyPeF0NFgAJFNxy', 'vip', 'user'),
(7, 'Admin', 'Cool', '+324557846', 'bigandscary@gmail.com', 'string', '$2b$12$WNxmSGMvzQmppO4/Z/jMMu5R6lgMi6yz1vnoHbLblOX2elqXefTLW', 'standard', 'admin'),
(8, 'Naughty', 'User', '+04373 3937533', 'reallybad@example.com', 'Far away from God, Hell 13/666', '$2b$12$gTnqUqLZ6zfMk98LXjUwWuxFytWc8mT7hhTTfHmmPhxC9UZpiqGUe', 'standard', 'user'),
(9, 'Good', 'User', '+04373393 7', 'reallygood@example.com', 'Heaven, 777', '$2b$12$L2kYsZHngsaHaGcN.Uwh1..CvY4OzLOdTbZq0.YiBWc5vo0dKQ5.6', 'premium', 'user'),
(10, 'Yuliya', 'Dabreha', '+999 9999 999', 'goddess@boss.com', 'Super luxury street, house 777', '$2b$12$QYiFkf52oRhh5tcrw8sNEurJE7216jTqks0V3/DjdYCR4Yk3iVdLy', 'vip', 'admin'),
(12, 'Simple', 'user', '+5183688577', 'simpleuser@example.com', 'simple address', '$2b$12$hy2AdFcCP.fKM/RLt.zsXOuc2XZVKUYRQIXp8UR/nXQp4GvFCi4Qy', 'premium', 'user'),
(13, 'Cool', 'User', '+999999999', 'cooluser@gmail.com', 'Minsk', '$2b$12$opCesQYOeSwbGTZULgQ2ZOoROFZ87cn5NgoVzPRm6.x9S93/f26wW', 'premium', 'user'),
(14, 'Cool', 'User', '+34 731899899', 'cooluser2@gmail.com', '', '$2b$12$n7bZO8I1ictuBC6M0Qd11uN/8478RINkZhlIByCjJKrTuJIm9jnpW', 'standard', 'user'),
(15, 'Marta', 'Martyszkowska', '+8585858585', 'm.malpa@gmail.com', 'Gibraltar', '$2b$12$NsQBb/GixxMcASfYupbE0upOsWhhfpac9PLYsvAf90R29X/.k2SFi', 'premium', 'user'),
(16, 'Mama', 'Admin', '+34 731899899', 'mamaadmin@gmail.com', 'Home', '$2b$12$TgLIx4PYG2HZd49coZruZuJ0AY8QZcj8AfiCNdXw8QnISy3NVdSe2', 'standard', 'user'),
(17, 'Gigi', 'Piggy', '+23 9494949', 'GIGIpiggy@gmail.com', '', '$2b$12$k0nEADyPp2T0uMvqIPujwun/lusm9LLiYjVQpe6E3VBFKV9qVTpvW', 'vip', 'user'),
(18, 'Papa', 'User', '+8585858585', 'papauser@gmail.com', 'Av. de Minsk', '$2b$12$K3te7nNhwUJvbX0SPQL8keOVBIK3oBqGxccKorqSMNRYtHtmRLMAW', 'premium', 'user'),
(19, 'Cool', 'Admin', '+34 731899899', 'cooladmin2@gmail.com', '', '$2b$12$wu9n4FhV0yDlCcc.45qkGOGL6hwWinLiQj2GMLhriYZIQjBX7H7Ae', 'standard', 'admin');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `User`
--


--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `User`
--
ALTER TABLE `User`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
