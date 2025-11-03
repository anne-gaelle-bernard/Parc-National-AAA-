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
    $stmt = $pdo->prepare("INSERT INTO `user` (`id`, `email`, `password_hash`, `last_name`, `first_name`, `role`) VALUES (1, :email, :password_hash, :last_name, :first_name, :role)");
    $stmt->execute([
        ':email' => 'test@example.com',
        ':password_hash' => '$2y$10$B7z/SW1lJJ6N97oVnt.MIOvNSEcqEjLwaiC0l8GGQeJaGmTMGcUgu',
        ':last_name' => 'Doe',
        ':first_name' => 'John',
        ':role' => 'visitor',
    ]);

    echo "Database seeded successfully!
";

} catch (PDOException $e) {
    echo "Database seeding failed: " . $e->getMessage() . "
";
}

?>
