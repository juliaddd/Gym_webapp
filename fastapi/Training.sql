-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 15, 2025 at 02:24 PM
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
-- Table structure for table `Training`
--

CREATE TABLE `Training` (
  `training_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `date` date NOT NULL,
  `training_duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Training`
--

INSERT INTO `Training` (`training_id`, `user_id`, `category_id`, `date`, `training_duration`) VALUES
(1, NULL, 4, '2025-04-23', 1),
(2, NULL, 5, '2025-04-24', 50),
(3, NULL, 5, '2025-04-23', 50),
(4, NULL, 2, '2025-03-24', 15),
(5, NULL, 2, '2025-04-21', 25),
(6, NULL, 2, '2025-04-14', 17),
(7, NULL, 3, '2025-05-04', 61),
(8, NULL, 1, '2025-05-04', 33),
(9, NULL, 5, '2025-05-04', 2),
(10, NULL, 2, '2025-05-01', 53),
(11, NULL, 6, '2025-04-28', 25),
(12, NULL, 5, '2025-04-30', 35),
(13, NULL, 1, '2025-04-30', 15),
(14, NULL, 1, '2025-04-30', 15),
(15, NULL, 2, '2025-04-29', 57),
(16, NULL, 4, '2025-05-05', 79),
(17, NULL, 4, '2025-05-03', 31),
(18, NULL, 4, '2025-05-03', 41),
(19, NULL, 6, '2025-05-02', 47),
(20, NULL, 3, '2025-04-02', 40),
(21, NULL, 3, '2025-04-13', 140),
(22, NULL, 2, '2025-05-08', 123),
(23, NULL, 1, '2025-05-08', 1),
(24, NULL, 3, '2025-05-08', 56),
(25, NULL, 4, '2025-05-08', 15),
(26, NULL, 3, '2025-05-12', 192),
(27, NULL, 2, '2025-05-13', 1),
(28, NULL, 4, '2025-05-13', 15),
(29, NULL, 3, '2025-05-14', 75),
(30, NULL, 3, '2025-05-15', 70),
(31, NULL, 1, '2025-05-15', 30),
(32, NULL, 1, '2025-05-15', 20),
(33, NULL, 6, '2025-05-15', 1),
(34, NULL, 1, '2025-05-15', 47),
(35, NULL, 2, '2025-05-16', 45),
(36, 20, 1, '2025-09-15', 45),
(37, 20, 2, '2025-09-14', 75),
(38, 20, 2, '2025-09-13', 15),
(39, 20, 3, '2025-09-13', 30),
(40, 20, 4, '2025-09-13', 40),
(41, 20, 4, '2025-09-11', 70),
(42, 20, 1, '2025-09-11', 20),
(43, 20, 5, '2025-09-11', 20),
(44, 20, 5, '2025-09-10', 60),
(45, 20, 6, '2025-09-10', 30),
(46, 20, 6, '2025-09-15', 30),
(47, 21, 1, '2025-09-15', 25),
(48, 21, 4, '2025-09-15', 25),
(49, 21, 6, '2025-09-15', 25),
(50, 21, 5, '2025-09-13', 45),
(51, 21, 2, '2025-09-13', 40),
(52, 21, 3, '2025-09-13', 15),
(53, 21, 4, '2025-09-13', 35),
(54, 21, 5, '2025-09-12', 35),
(55, 21, 6, '2025-09-12', 30),
(56, 21, 6, '2025-09-11', 20),
(57, 21, 5, '2025-09-11', 20),
(58, 21, 4, '2025-09-11', 20),
(59, 21, 3, '2025-09-10', 21),
(60, 21, 2, '2025-09-10', 37),
(61, 21, 1, '2025-09-09', 26),
(62, 21, 5, '2025-09-09', 18),
(63, 21, 3, '2025-09-09', 70),
(64, 21, 2, '2025-09-08', 60),
(65, 22, 1, '2025-09-15', 60),
(66, 22, 2, '2025-09-14', 60),
(67, 22, 3, '2025-09-13', 45),
(68, 22, 1, '2025-09-13', 15),
(69, 22, 4, '2025-09-12', 35),
(70, 22, 2, '2025-09-12', 25),
(71, 22, 5, '2025-09-11', 50),
(72, 22, 6, '2025-09-11', 30),
(73, 22, 3, '2025-09-10', 37),
(74, 22, 4, '2025-09-10', 33),
(75, 22, 4, '2025-09-09', 31),
(76, 22, 6, '2025-09-09', 45),
(77, 22, 5, '2025-09-07', 35),
(78, 22, 1, '2025-09-07', 35);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Training`
--
ALTER TABLE `Training`
  ADD PRIMARY KEY (`training_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Training`
--
ALTER TABLE `Training`
  MODIFY `training_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Training`
--
ALTER TABLE `Training`
  ADD CONSTRAINT `Training_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`),
  ADD CONSTRAINT `Training_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `Category` (`category_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
