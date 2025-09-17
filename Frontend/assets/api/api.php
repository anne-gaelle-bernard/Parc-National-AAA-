<?php
// api/calanques.php
header('Content-Type: application/json; charset=utf-8');

$host = '127.0.0.1';
$db   = 'votre_db';
$user = 'votre_user';
$pass = 'votre_pass';
$charset = 'utf8mb4';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}

$stmt = $pdo->query('SELECT id, name, description, difficulty, lng, lat FROM calanques');
$features = [];
while ($row = $stmt->fetch()) {
    $features[] = [
        'type' => 'Feature',
        'properties' => [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'difficulty' => $row['difficulty']
        ],
        'geometry' => [
            'type' => 'Point',
            'coordinates' => [ (float)$row['lng'], (float)$row['lat'] ]
        ]
    ];
}

$collection = [ 'type' => 'FeatureCollection', 'features' => $features ];
echo json_encode($collection, JSON_UNESCAPED_UNICODE);
