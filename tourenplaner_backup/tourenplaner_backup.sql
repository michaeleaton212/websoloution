-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: tourenplaner
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mitarbeiter`
--

DROP TABLE IF EXISTS `mitarbeiter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mitarbeiter` (
  `id` int(11) NOT NULL,
  `vorname` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `telefonnummer` varchar(50) DEFAULT NULL,
  `fs_vorgesetzter` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fs_vorgesetzter` (`fs_vorgesetzter`),
  CONSTRAINT `mitarbeiter_ibfk_1` FOREIGN KEY (`fs_vorgesetzter`) REFERENCES `mitarbeiter` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mitarbeiter`
--

LOCK TABLES `mitarbeiter` WRITE;
/*!40000 ALTER TABLE `mitarbeiter` DISABLE KEYS */;
INSERT INTO `mitarbeiter` VALUES (1,'Hans','Muster','+41 76 764 23 23',NULL),(2,'Theo','Dohr','+41 79 324 55 78',3),(3,'Justin','Biber','+41 79 872 12 32',NULL),(4,'Johann S.','Fluss','+41 79 298 98 76',2),(5,'Diana','Knecht','+41 78 323 77 00',2),(6,'Anna','Schöni','+41 76 569 67 80',NULL),(8,'Lucy','Schmidt','+49 420 232 2232',6),(9,'Ardit','Azubi',NULL,6);
/*!40000 ALTER TABLE `mitarbeiter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour`
--

DROP TABLE IF EXISTS `tour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tour` (
  `id` int(11) NOT NULL,
  `start_ort` varchar(100) DEFAULT NULL,
  `ziel_ort` varchar(100) DEFAULT NULL,
  `disponent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `disponent_id` (`disponent_id`),
  CONSTRAINT `tour_ibfk_1` FOREIGN KEY (`disponent_id`) REFERENCES `mitarbeiter` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour`
--

LOCK TABLES `tour` WRITE;
/*!40000 ALTER TABLE `tour` DISABLE KEYS */;
INSERT INTO `tour` VALUES (12,'HB, 8000 Zürich','HB, 4000 Basel',6),(32,'Schulhausstr.23, 8400 Winterthur','HB, 8000 Zürich',6),(45,'HB, 8001 Zürich','HB, D-70180 Stuttgart',6),(51,'Ausstellungsstr. 80, 8090 Zürich','Flughafen, 1200 Genf',6);
/*!40000 ALTER TABLE `tour` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_via`
--

DROP TABLE IF EXISTS `tour_via`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tour_via` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tour_id` int(11) DEFAULT NULL,
  `via_ort` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `tour_via_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tour` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_via`
--

LOCK TABLES `tour_via` WRITE;
/*!40000 ALTER TABLE `tour_via` DISABLE KEYS */;
INSERT INTO `tour_via` VALUES (1,12,'Flughafen, 8309 Kloten'),(2,12,'Bahnhofstr.1, 4410 Liestal'),(3,32,'Schaffhauserstr. 123, 8400 Winterthur'),(4,32,'Eggweg 45, 8400 Winterthur'),(5,45,'HB, D-78224 Singen'),(6,51,'Direkt');
/*!40000 ALTER TABLE `tour_via` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-03 13:32:17
