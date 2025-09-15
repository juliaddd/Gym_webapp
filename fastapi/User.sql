-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 15, 2025 at 02:04 PM
-- Server version: 10.6.22-MariaDB-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `subscription_type` enum('vip','premium','standard') NOT NULL DEFAULT 'standard',
  `role` enum('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`user_id`, `name`, `surname`, `phone_number`, `email`, `address`, `password`, `subscription_type`, `role`) VALUES
(10, 'Yuliya', 'Dabreha', '+48 731899413', 'dobregojulia@gmail.com', 'Warsaw, al. KEN 95', '$2b$12$QYiFkf52oRhh5tcrw8sNEurJE7216jTqks0V3/DjdYCR4Yk3iVdLy', 'vip', 'admin'),
(19, 'Cool', 'Admin', '+34 731899899', 'cooladmin2@gmail.com', '', '$2b$12$wu9n4FhV0yDlCcc.45qkGOGL6hwWinLiQj2GMLhriYZIQjBX7H7Ae', 'standard', 'admin'),
(20, 'Test', 'User', '+12 344321233', 'testuser@gmail.com', '', '$2b$12$qosttmQpLm0tIGkuaYJ0gegpwPGprosrFn1OGX/unldQdrdeQ0amC', 'premium', 'user'),
(21, 'Test', 'User2', '+23 234234432', 'testuser2@gmail.com', '', '$2b$12$2xdH4.p4Ox9YbiA/XSp/C.cEOaW/4SlkGqCvhyNr0kjITmslgpt9W', 'vip', 'user'),
(22, 'Onemore', 'Testuser', '+34 456456654', 'testuser3@gmail.com', 'Luxury city, str. Super Rich 999', '$2b$12$OBeNq7Qh6Q7gz5WYpJKfBO0HJZ8sWHsrWgDC6T94XKBG.xujRjNIK', 'standard', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
