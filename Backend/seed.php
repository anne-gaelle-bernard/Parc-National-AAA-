<?php

require_once __DIR__ . '/config/db.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Seeding database...\n";

    // Clear existing data
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("TRUNCATE TABLE `camping`;");
    $pdo->exec("TRUNCATE TABLE `campsite`;");
    $pdo->exec("TRUNCATE TABLE `user`;");
    $pdo->exec("TRUNCATE TABLE `reservation`;"); // Ajouter cette ligne
    $pdo->exec("TRUNCATE TABLE `point_of_interest`;");
    $pdo->exec("TRUNCATE TABLE `resource`;");
    $pdo->exec("TRUNCATE TABLE `trail`;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    // Insertion des données pour la table `camping`
    $pdo->exec("INSERT INTO `camping` (`id`, `name`, `location`, `description`) VALUES
(1, 'Camping SORMIOU', 'Calanque de Sormiou, Marseille', 'Camping situé dans la magnifique calanque de Sormiou, offrant des vues imprenables sur la mer Méditerranée.'),
(2, 'Camping MORGIOU', 'Calanque de Morgiou, Marseille', 'Profitez d\'un séjour paisible dans la calanque de Morgiou, avec accès direct à la plage et aux sentiers de randonnée.'),
(3, 'Camping CALLELONGUE', 'Calanque de Callelongue, Marseille', 'Petit camping familial niché au cœur de la calanque de Callelongue, idéal pour la détente et les activités nautiques;');");

    // Insertion des données pour la table `campsite`
    $pdo->exec("INSERT INTO `campsite` (`id`, `number`, `max_capacity`, `price_per_night`, `camping_id`) VALUES
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
(15, 'C5', 10, 20.00, 3);");

    // Insertion des données pour la table `user`
    $pdo->exec("INSERT INTO `user` (`id`, `email`, `password_hash`, `last_name`, `first_name`, `role`) VALUES
(1, 'test@example.com', '$2y\$10\$wO3t4GqA3N1X5J6H7K8L9.B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2', 'Doe', 'John', 'visitor'),
(2, 'admin@example.com', '$2y\$10\$wO3t4GqA3N1X5J6H7K8L9.B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2', 'Admin', 'Parc', 'admin');");

    // Insertion des données pour la table `trail` (sentiers des calanques)
    $pdo->exec("INSERT INTO `trail` (`id`, `name`, `difficulty`, `estimated_duration`, `description`, `map_url`) VALUES
(1, 'Calanque de Sormiou', 'medium', '00:40:00', 'Grande calanque avec plage de sable, départ depuis le parking de la Cayolle.', NULL),
(2, 'Calanque de Morgiou', 'medium', '01:00:00', 'Petit port et falaises, départ depuis les Baumettes.', NULL),
(3, 'Calanque de Sugiton', 'easy', '00:20:00', 'Très fréquentée, accessible depuis le campus de Luminy.', NULL),
(4, 'Calanque d''En-Vau', 'hard', '01:15:00', 'Superbe mais difficile d''accès, départ depuis le col de la Gardiole.', NULL),
(5, 'Calanque de Port-Miou', 'easy', '00:10:00', 'La plus proche de Cassis, avec un port.', NULL);");

    // Insertion des points d'intérêt associés aux sentiers
    $pdo->exec("INSERT INTO `point_of_interest` (`name`, `description`, `gps_coordinates`, `trail_id`) VALUES
('Parking de la Cayolle', 'Point de départ du sentier.', '43.2180,5.4410', 1),
('Calanque de Sormiou', 'Arrivée : grande plage de sable.', '43.2131,5.4410', 1),
('Les Baumettes', 'Point de départ du sentier.', '43.2165,5.4360', 2),
('Calanque de Morgiou', 'Arrivée : petit port typique.', '43.2129,5.4433', 2),
('Campus Luminy', 'Point de départ du sentier.', '43.2305,5.4388', 3),
('Calanque de Sugiton', 'Arrivée : calanque très fréquentée.', '43.2307,5.4399', 3),
('Col de la Gardiole', 'Point de départ du sentier.', '43.2075,5.5075', 4),
('Calanque d''En-Vau', 'Arrivée : calanque spectaculaire mais escarpée.', '43.2024,5.4977', 4),
('Cassis centre', 'Point de départ du sentier.', '43.2100,5.5170', 5),
('Calanque de Port-Miou', 'Arrivée : port abrité proche de Cassis.', '43.2084,5.5179', 5);");

    // Insertion des ressources naturelles observées
    $pdo->exec("INSERT INTO `resource` (`species_type`, `species_name`, `description`, `location`, `trail_id`, `author_id`) VALUES
('flora', 'Pin d''Alep', 'Forêt de pins caractéristique du massif des Calanques.', 'Zone forestière entre Sormiou et Morgiou', 1, 2),
('fauna', 'Goéland leucophée', 'Colonie observée le long du littoral.', 'Falaises de Sormiou', 1, 2),
('flora', 'Posidonie', 'Herbier marin protégé, essentiel à l''écosystème sous-marin.', 'Baie de Port-Miou', 5, 2),
('fauna', 'Aigle de Bonelli', 'Espèce protégée nichant sur les falaises.', 'Falaises entre En-Vau et Port-Pin', 4, 2);");

    echo "Database seeded successfully!
";

} catch (PDOException $e) {
    echo "Database seeding failed: " . $e->getMessage() . "
";
}

?>
