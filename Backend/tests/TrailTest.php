<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../models/Trail.php';

class TrailTest extends TestCase {
    private PDO $db;
    private Trail $trail;

    protected function setUp(): void {
        $this->db = new PDO('sqlite::memory:');
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->db->exec("
            CREATE TABLE trail (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100),
                difficulty VARCHAR(20) NOT NULL,
                estimated_duration TIME,
                description TEXT,
                map_url VARCHAR(255)
            )
        ");
        $this->db->exec("
            CREATE TABLE point_of_interest (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100),
                description TEXT,
                gps_coordinates VARCHAR(255),
                trail_id INTEGER
            )
        ");

        $this->trail = new Trail($this->db);
    }

    public function testCreateAndReadOne(): void {
        $this->trail->name = "Calanque de Sugiton";
        $this->trail->difficulty = "easy";
        $this->trail->estimated_duration = "00:20:00";
        $this->trail->description = "Sentier très fréquenté.";
        $this->trail->map_url = null;

        $this->assertTrue($this->trail->create());

        $id = (int) $this->db->lastInsertId();
        $fetched = new Trail($this->db);
        $fetched->id = $id;

        $this->assertTrue($fetched->readOne());
        $this->assertSame("Calanque de Sugiton", $fetched->name);
        $this->assertSame("easy", $fetched->difficulty);
    }

    public function testReadOneReturnsFalseForUnknownId(): void {
        $missing = new Trail($this->db);
        $missing->id = 999;

        $this->assertFalse($missing->readOne());
    }

    public function testUpdateChangesFields(): void {
        $this->trail->name = "Ancien nom";
        $this->trail->difficulty = "medium";
        $this->trail->create();
        $this->trail->id = (int) $this->db->lastInsertId();

        $this->trail->name = "Nouveau nom";
        $this->trail->difficulty = "hard";
        $this->assertTrue($this->trail->update());

        $reloaded = new Trail($this->db);
        $reloaded->id = $this->trail->id;
        $reloaded->readOne();

        $this->assertSame("Nouveau nom", $reloaded->name);
        $this->assertSame("hard", $reloaded->difficulty);
    }

    public function testDeleteRemovesTrail(): void {
        $this->trail->name = "À supprimer";
        $this->trail->difficulty = "easy";
        $this->trail->create();
        $this->trail->id = (int) $this->db->lastInsertId();

        $this->assertTrue($this->trail->delete());

        $reloaded = new Trail($this->db);
        $reloaded->id = $this->trail->id;
        $this->assertFalse($reloaded->readOne());
    }

    public function testReplacePointsOfInterestReplacesAllOfThem(): void {
        $this->trail->name = "Sentier avec POI";
        $this->trail->difficulty = "medium";
        $this->trail->create();
        $trailId = (int) $this->db->lastInsertId();

        $this->trail->replacePointsOfInterest($trailId, [
            (object) ["name" => "Départ", "description" => "Point de départ", "gps_coordinates" => "43.21,5.45"],
            (object) ["name" => "Arrivée", "description" => "Point d'arrivée", "gps_coordinates" => "43.22,5.46"],
        ]);

        $points = $this->trail->readPointsOfInterest($trailId);
        $this->assertCount(2, $points);
        $this->assertSame("Départ", $points[0]['name']);

        // Replacing again should not accumulate rows.
        $this->trail->replacePointsOfInterest($trailId, [
            (object) ["name" => "Seul point", "description" => "", "gps_coordinates" => "43.20,5.40"],
        ]);
        $this->assertCount(1, $this->trail->readPointsOfInterest($trailId));
    }
}
