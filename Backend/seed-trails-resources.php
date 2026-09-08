<?php
// One-time, non-destructive seed for the trail / point_of_interest /
// resource tables and the admin user, added after the initial deploy.
// Safe to run against a live database: it only inserts and skips
// entirely if the `trail` table already has data, so it never touches
// existing camping/campsite/user/reservation rows.
//
// Run once via Railway, e.g.:
//   railway run --service <backend-service> php Backend/seed-trails-resources.php

require_once __DIR__ . '/config/db.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $existing = (int) $pdo->query("SELECT COUNT(*) FROM `trail`")->fetchColumn();
    if ($existing > 0) {
        echo "Trails already seeded ($existing rows). Nothing to do.\n";
        exit(0);
    }

    echo "Seeding trails, points of interest, resources and admin user...\n";

    $pdo->exec("INSERT IGNORE INTO `user` (`id`, `email`, `password_hash`, `last_name`, `first_name`, `role`) VALUES
(2, 'admin@example.com', '\$2y\$10\$wO3t4GqA3N1X5J6H7K8L9.B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2', 'Admin', 'Parc', 'admin');");

    $pdo->exec("INSERT INTO `trail` (`id`, `name`, `difficulty`, `estimated_duration`, `description`, `map_url`) VALUES
(1, 'Calanque de Sormiou', 'medium', '00:40:00', 'Grande calanque avec plage de sable, départ depuis le parking de la Cayolle.', NULL),
(2, 'Calanque de Morgiou', 'medium', '01:00:00', 'Petit port et falaises, départ depuis les Baumettes.', NULL),
(3, 'Calanque de Sugiton', 'easy', '00:20:00', 'Très fréquentée, accessible depuis le campus de Luminy.', NULL),
(4, 'Calanque d\'En-Vau', 'hard', '01:15:00', 'Superbe mais difficile d\'accès, départ depuis le col de la Gardiole.', NULL),
(5, 'Calanque de Port-Miou', 'easy', '00:10:00', 'La plus proche de Cassis, avec un port.', NULL);");

    $pdo->exec("INSERT INTO `point_of_interest` (`name`, `description`, `gps_coordinates`, `trail_id`) VALUES
('Parking de la Cayolle', 'Point de départ du sentier.', '43.2180,5.4410', 1),
('Calanque de Sormiou', 'Arrivée : grande plage de sable.', '43.2131,5.4410', 1),
('Les Baumettes', 'Point de départ du sentier.', '43.2165,5.4360', 2),
('Calanque de Morgiou', 'Arrivée : petit port typique.', '43.2129,5.4433', 2),
('Campus Luminy', 'Point de départ du sentier.', '43.2305,5.4388', 3),
('Calanque de Sugiton', 'Arrivée : calanque très fréquentée.', '43.2307,5.4399', 3),
('Col de la Gardiole', 'Point de départ du sentier.', '43.2075,5.5075', 4),
('Calanque d\'En-Vau', 'Arrivée : calanque spectaculaire mais escarpée.', '43.2024,5.4977', 4),
('Cassis centre', 'Point de départ du sentier.', '43.2100,5.5170', 5),
('Calanque de Port-Miou', 'Arrivée : port abrité proche de Cassis.', '43.2084,5.5179', 5);");

    $pdo->exec("INSERT INTO `resource` (`species_type`, `species_name`, `description`, `location`, `trail_id`, `author_id`) VALUES
('flora', 'Pin d\'Alep', 'Forêt de pins caractéristique du massif des Calanques.', 'Zone forestière entre Sormiou et Morgiou', 1, 2),
('fauna', 'Goéland leucophée', 'Colonie observée le long du littoral.', 'Falaises de Sormiou', 1, 2),
('flora', 'Posidonie', 'Herbier marin protégé, essentiel à l\'écosystème sous-marin.', 'Baie de Port-Miou', 5, 2),
('fauna', 'Aigle de Bonelli', 'Espèce protégée nichant sur les falaises.', 'Falaises entre En-Vau et Port-Pin', 4, 2);");

    echo "Done.\n";
} catch (PDOException $e) {
    echo "Seeding failed: " . $e->getMessage() . "\n";
    exit(1);
}
