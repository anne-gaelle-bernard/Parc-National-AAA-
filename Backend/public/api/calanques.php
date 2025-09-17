<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../config/db.php';

try {
    $conn = getDbConnection();
    $sql = 'SELECT id, name, description, difficulty, lng, lat FROM calanques';
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();

    $features = [];
    while ($row = $result->fetch_assoc()) {
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
    echo json_encode([ 'type' => 'FeatureCollection', 'features' => $features ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB error']);
}
// End of file
