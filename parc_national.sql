SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;
SET UNIQUE_CHECKS = 0;

DROP TABLE IF EXISTS `camping`;
CREATE TABLE IF NOT EXISTS `camping` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `campsite`;
CREATE TABLE IF NOT EXISTS `campsite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` varchar(50) DEFAULT NULL,
  `max_capacity` int DEFAULT NULL,
  `price_per_night` decimal(10,2) DEFAULT NULL,
  `camping_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `camping_id` (`camping_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `notification`;
CREATE TABLE IF NOT EXISTS `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text,
  `type` enum('info','alert','weather') DEFAULT 'info',
  `sent_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0',
  `user_id` int DEFAULT NULL,
  `author_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `author_id` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `point_of_interest`;
CREATE TABLE IF NOT EXISTS `point_of_interest` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `gps_coordinates` varchar(255) DEFAULT NULL,
  `trail_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trail_id` (`trail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `reservation`;
CREATE TABLE IF NOT EXISTS `reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `campsite_id` int DEFAULT NULL,
  `check_in_date` date DEFAULT NULL,
  `check_out_date` date DEFAULT NULL,
  `number_of_persons` int DEFAULT NULL,
  `status` enum('confirmed','cancelled') DEFAULT 'confirmed',
  `total_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `campsite_id` (`campsite_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `resource`;
CREATE TABLE IF NOT EXISTS `resource` (
  `id` int NOT NULL AUTO_INCREMENT,
  `observation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `species_type` enum('fauna','flora') NOT NULL,
  `species_name` varchar(100) DEFAULT NULL,
  `description` text,
  `location` varchar(255) DEFAULT NULL,
  `trail_id` int DEFAULT NULL,
  `author_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trail_id` (`trail_id`),
  KEY `author_id` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `time_slot`;
CREATE TABLE IF NOT EXISTS `time_slot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `remaining_capacity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `trail`;
CREATE TABLE IF NOT EXISTS `trail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `difficulty` enum('easy','medium','hard') NOT NULL,
  `estimated_duration` time DEFAULT NULL,
  `description` text,
  `map_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(190) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `role` enum('visitor','admin') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `campsite`
  ADD CONSTRAINT `campsite_ibfk_1` FOREIGN KEY (`camping_id`) REFERENCES `camping` (`id`);

ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`);

ALTER TABLE `point_of_interest`
  ADD CONSTRAINT `point_of_interest_ibfk_1` FOREIGN KEY (`trail_id`) REFERENCES `trail` (`id`);

ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`campsite_id`) REFERENCES `campsite` (`id`);

ALTER TABLE `resource`
  ADD CONSTRAINT `resource_ibfk_1` FOREIGN KEY (`trail_id`) REFERENCES `trail` (`id`),
  ADD CONSTRAINT `resource_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`);

SET FOREIGN_KEY_CHECKS = 1;
SET UNIQUE_CHECKS = 1;
COMMIT;

--
-- Insertion des données pour la table `camping`
--

INSERT INTO `camping` (`id`, `name`, `location`, `description`)
VALUES
(1, 'Camping SORMIOU', 'Calanque de Sormiou, Marseille', 'Camping situé dans la magnifique calanque de Sormiou, offrant des vues imprenables sur la mer Méditerranée.'),
(2, 'Camping MORGIOU', 'Calanque de Morgiou, Marseille', 'Profitez d\'un séjour paisible dans la calanque de Morgiou, avec accès direct à la plage et aux sentiers de randonnée.'),
(3, 'Camping CALLELONGUE', 'Calanque de Callelongue, Marseille', 'Petit camping familial niché au cœur de la calanque de Callelongue, idéal pour la détente et les activités nautiques.');

--
-- Insertion des données pour la table `campsite`
--

INSERT INTO `campsite` (`id`, `number`, `max_capacity`, `price_per_night`, `camping_id`)
VALUES
(1, 'A1', 10, 20.00, 1),
(2, 'A2', 10, 20.00, 1),
(3, 'A3', 10, 20.00, 1),
(4, 'A4', 10, 20.00, 1),
(5, 'A5', 10, 20.00, 1),
(6, 'B1', 10, 20.00, 2),
(7, 'B2', 10, 20.00, 2),
(8, 'B3', 10, 20.00, 2),
(9, 'B4', 10, 20.00, 2),
(10, 'B5', 10, 20.00, 2),
(11, 'C1', 10, 20.00, 3),
(12, 'C2', 10, 20.00, 3),
(13, 'C3', 10, 20.00, 3),
(14, 'C4', 10, 20.00, 3),
(15, 'C5', 10, 20.00, 3);

--
-- Insertion des données pour la table `user`
--

INSERT INTO `user` (`id`, `email`, `password_hash`, `last_name`, `first_name`, `role`)
VALUES
(1, 'test@example.com', '$2y$10$wO3t4GqA3N1X5J6H7K8L9.B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2', 'Doe', 'John', 'visitor');

