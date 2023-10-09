-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 03, 2023 at 10:54 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `luckydrawdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `account_id` int(100) NOT NULL,
  `account_phone` varchar(50) NOT NULL,
  `account_name` varchar(200) NOT NULL,
  `account_email` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`account_id`, `account_phone`, `account_name`, `account_email`) VALUES
(9, '9748653992', 'dsfsds sasa', 'msh.sun20@outlook.com'),
(11, '9147108386', 'Sunny Shiv', 'digital.support@shyammetalics.com'),
(12, '8100514697', 'M S Halder', 'msh.sun20@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `contest`
--

CREATE TABLE `contest` (
  `contest_id` int(100) NOT NULL,
  `createdby_id` int(100) NOT NULL,
  `contest_name` varchar(200) NOT NULL,
  `state` varchar(100) NOT NULL,
  `contest_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest`
--

INSERT INTO `contest` (`contest_id`, `createdby_id`, `contest_name`, `state`, `contest_date`) VALUES
(11, 1000000, 'Premium Test', 'West Bengal', '2023-08-03 21:17:54'),
(12, 1000000, 'Pro Test', 'Assam', '2023-08-03 21:19:11'),
(13, 1000000, 'Starter Test', 'Odisha', '2023-08-03 21:20:17');

-- --------------------------------------------------------

--
-- Table structure for table `prize`
--

CREATE TABLE `prize` (
  `prize_id` int(100) NOT NULL,
  `contest_id` int(100) NOT NULL,
  `prize_name` varchar(100) NOT NULL,
  `prize_details` text NOT NULL,
  `prize_link` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questionnair`
--

CREATE TABLE `questionnair` (
  `qr_id` int(100) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `qr_status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `ticket_no` int(100) NOT NULL,
  `account_id` int(100) NOT NULL,
  `contest_id` int(100) NOT NULL,
  `ticket_details` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket`
--

INSERT INTO `ticket` (`ticket_no`, `account_id`, `contest_id`, `ticket_details`) VALUES
(100001, 12, 11, '1st Class'),
(100002, 11, 11, '2nd Class'),
(100003, 12, 13, 'General'),
(100004, 9, 13, '2nd Class'),
(100005, 9, 12, '2nd Class'),
(100006, 11, 12, '1st Class'),
(100007, 9, 11, 'General');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(100) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_phone` varchar(50) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_pass` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `user_phone`, `user_email`, `user_pass`) VALUES
(1000000, 'Mriganka Sekhar Halder', '9147108386', 'msh.sun20@gmail.com', 'mshs_123');

-- --------------------------------------------------------

--
-- Table structure for table `winner`
--

CREATE TABLE `winner` (
  `winner_id` int(100) NOT NULL,
  `account_id` int(100) NOT NULL,
  `qr_id` int(100) NOT NULL,
  `contest_id` int(100) NOT NULL,
  `prize_id` int(100) NOT NULL,
  `ticket_no` int(100) NOT NULL,
  `winning_details` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`account_id`);

--
-- Indexes for table `contest`
--
ALTER TABLE `contest`
  ADD PRIMARY KEY (`contest_id`),
  ADD KEY `createdby_id` (`createdby_id`);

--
-- Indexes for table `prize`
--
ALTER TABLE `prize`
  ADD PRIMARY KEY (`prize_id`),
  ADD KEY `contest_id` (`contest_id`);

--
-- Indexes for table `questionnair`
--
ALTER TABLE `questionnair`
  ADD PRIMARY KEY (`qr_id`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`ticket_no`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `contest_id` (`contest_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `winner`
--
ALTER TABLE `winner`
  ADD PRIMARY KEY (`winner_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `contest_id` (`contest_id`),
  ADD KEY `prize_id` (`prize_id`),
  ADD KEY `ticket_no` (`ticket_no`),
  ADD KEY `qr_id` (`qr_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `account_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `contest`
--
ALTER TABLE `contest`
  MODIFY `contest_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `prize`
--
ALTER TABLE `prize`
  MODIFY `prize_id` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `questionnair`
--
ALTER TABLE `questionnair`
  MODIFY `qr_id` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `ticket_no` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100008;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1000001;

--
-- AUTO_INCREMENT for table `winner`
--
ALTER TABLE `winner`
  MODIFY `winner_id` int(100) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contest`
--
ALTER TABLE `contest`
  ADD CONSTRAINT `contest_ibfk_1` FOREIGN KEY (`createdby_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE;

--
-- Constraints for table `prize`
--
ALTER TABLE `prize`
  ADD CONSTRAINT `prize_ibfk_1` FOREIGN KEY (`contest_id`) REFERENCES `contest` (`contest_id`) ON UPDATE CASCADE;

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`contest_id`) REFERENCES `contest` (`contest_id`) ON UPDATE CASCADE;

--
-- Constraints for table `winner`
--
ALTER TABLE `winner`
  ADD CONSTRAINT `winner_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `winner_ibfk_2` FOREIGN KEY (`contest_id`) REFERENCES `contest` (`contest_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `winner_ibfk_3` FOREIGN KEY (`prize_id`) REFERENCES `prize` (`prize_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `winner_ibfk_4` FOREIGN KEY (`ticket_no`) REFERENCES `ticket` (`ticket_no`) ON UPDATE CASCADE,
  ADD CONSTRAINT `winner_ibfk_5` FOREIGN KEY (`qr_id`) REFERENCES `questionnair` (`qr_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
