-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 03, 2020 at 04:10 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `seenima`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `acc_ID` int(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`acc_ID`, `username`, `password`, `type`) VALUES
(1, 'maggienator', 'chinese ', 0),
(2, 'isma', 'gay', 1);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `event_ID` int(10) NOT NULL,
  `eventName` varchar(255) NOT NULL,
  `descript` longtext NOT NULL,
  `eventPrice` int(10) NOT NULL,
  `eventVenue` varchar(255) NOT NULL,
  `eventDateTime` datetime NOT NULL,
  `num_Tickets` int(10) NOT NULL,
  `tickets_Sold` int(10) NOT NULL DEFAULT 0,
  `total_Sales` int(10) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_ID`, `eventName`, `descript`, `eventPrice`, `eventVenue`, `eventDateTime`, `num_Tickets`, `tickets_Sold`, `total_Sales`) VALUES
(1, 'HatchIt Jumpstart ', 'Come one, come all', 10, 'Discord HatchIt Server', '2020-10-01 21:18:00', 40, 4, 40),
(4, 'Data Struct TUtorial', 'Mam pena blahv blha tutorial', 20, 'LB483', '2020-10-23 14:30:00', 30, 3, 60),
(5, 'Mulan', 'DISHONOR TO US ALL', 180, 'AYALA CENTER CEBU', '2020-10-31 13:21:00', 30, 0, 0),
(6, 'Open Mic', 'Hey come here', 25, 'Isma Cafe , Brggy. Talamban, Cebu City, Cebu, 6000', '2020-10-13 19:30:00', 500, 0, 0),
(7, 'Saturday Night Dance off', 'Dance the night away', 20, 'LB403', '2020-10-08 19:30:00', 200, 2, 40),
(8, 'Lady Gaga Live in my House', 'Let us all come little monsters', 200, 'My House', '2020-10-01 19:30:00', 1000, 0, 0),
(9, 'Magpauwan', 'Ta pasipon ta', 500, 'Eskina Cabangcalan', '2020-10-01 19:30:00', 8, 8, 4000),
(10, 'Algo Test', 'GGWP sa ta but pls believe in yourself  GGWP sa ta but pls believe in yourself GGWP sa ta but pls believe in yourself GGWP sa ta but pls believe in yourself GGWP sa ta but pls believe in yourself', 0, 'Your home', '2020-10-01 19:30:00', 1, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `requestforcollab`
--

CREATE TABLE `requestforcollab` (
  `ID` int(10) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `message` longtext NOT NULL,
  `isReplied` int(10) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `requestforcollab`
--

INSERT INTO `requestforcollab` (`ID`, `email`, `fullName`, `message`, `isReplied`) VALUES
(3, 'youknowna@gmail.com', 'Beyonce Knowles', 'Plug me.', 1),
(4, 'isyotfrancisco@yahoo.com', 'Isma Minaj', 'Plug beyonce', 0),
(5, 'smiiiileeeey11@gmail.com', 'Estelle William', 'Plug Isma Minaj', 0),
(6, 'gad@gmail.com', 'Kanye ', 'Plug Estelle', 0),
(7, 'pianopotatoboy@yahoo.com', 'Me Yay', 'Do not plug Kanye. Ako lang', 1),
(8, 'MMMM@gmail.com', 'Mamamoo', 'I know you are a moomoo. Plug us', 0),
(9, 'badgalriri@gmail.com', 'Rihanna', 'My money', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `ticket_ID` int(255) NOT NULL,
  `event_ID` int(255) DEFAULT NULL,
  `acc_ID` int(255) DEFAULT NULL,
  `qty` int(255) DEFAULT NULL,
  `isPurchased` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`ticket_ID`, `event_ID`, `acc_ID`, `qty`, `isPurchased`) VALUES
(1, 7, 1, 2, 1),
(7, 1, 2, 2, 1),
(8, 4, 2, 3, 1),
(10, 1, 2, 2, 1),
(12, 5, 2, 3, 0),
(13, 9, 2, 8, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`acc_ID`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_ID`);

--
-- Indexes for table `requestforcollab`
--
ALTER TABLE `requestforcollab`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticket_ID`),
  ADD KEY `event_ID` (`event_ID`),
  ADD KEY `acc_ID` (`acc_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `acc_ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `requestforcollab`
--
ALTER TABLE `requestforcollab`
  MODIFY `ID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticket_ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`event_ID`) REFERENCES `events` (`event_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`acc_ID`) REFERENCES `account` (`acc_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
