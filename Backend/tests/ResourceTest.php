<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../models/Resource.php';

class ResourceTest extends TestCase {
    private PDO $db;
    private Resource $resource;

    protected function setUp(): void {
        $this->db = new PDO('sqlite::memory:');
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->db->exec("
            CREATE TABLE resource (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                observation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                species_type VARCHAR(10) NOT NULL,
                species_name VARCHAR(100),
                description TEXT,
                location VARCHAR(255),
                trail_id INTEGER,
                author_id INTEGER
            )
        ");

        $this->resource = new Resource($this->db);
    }

    private function seed(string $type, string $name): void {
        $resource = new Resource($this->db);
        $resource->species_type = $type;
        $resource->species_name = $name;
        $resource->description = "desc $name";
        $resource->location = "loc $name";
        $resource->trail_id = 1;
        $resource->author_id = 2;
        $resource->create();
    }

    public function testCreateAndReadOne(): void {
        $this->resource->species_type = "fauna";
        $this->resource->species_name = "Aigle de Bonelli";
        $this->resource->description = "Espèce protégée.";
        $this->resource->location = "Falaises d'En-Vau";
        $this->resource->trail_id = 4;
        $this->resource->author_id = 2;

        $this->assertTrue($this->resource->create());

        $fetched = new Resource($this->db);
        $fetched->id = (int) $this->db->lastInsertId();
        $this->assertTrue($fetched->readOne());
        $this->assertSame("fauna", $fetched->species_type);
        $this->assertSame("Aigle de Bonelli", $fetched->species_name);
    }

    public function testReadAllFiltersBySpeciesType(): void {
        $this->seed("fauna", "Goéland");
        $this->seed("flora", "Pin d'Alep");
        $this->seed("fauna", "Aigle");

        $faunaOnly = $this->resource->readAll("fauna")->fetchAll(PDO::FETCH_ASSOC);
        $this->assertCount(2, $faunaOnly);

        $all = $this->resource->readAll()->fetchAll(PDO::FETCH_ASSOC);
        $this->assertCount(3, $all);
    }

    public function testUpdateChangesFields(): void {
        $this->seed("flora", "Posidonie");
        $this->resource->id = (int) $this->db->lastInsertId();
        $this->resource->readOne();

        $this->resource->species_name = "Posidonie oceanica";
        $this->assertTrue($this->resource->update());

        $reloaded = new Resource($this->db);
        $reloaded->id = $this->resource->id;
        $reloaded->readOne();
        $this->assertSame("Posidonie oceanica", $reloaded->species_name);
    }

    public function testDeleteRemovesResource(): void {
        $this->seed("fauna", "À supprimer");
        $id = (int) $this->db->lastInsertId();

        $toDelete = new Resource($this->db);
        $toDelete->id = $id;
        $this->assertTrue($toDelete->delete());

        $reloaded = new Resource($this->db);
        $reloaded->id = $id;
        $this->assertFalse($reloaded->readOne());
    }

    public function testReportGroupsBySpecies(): void {
        $this->seed("fauna", "Goéland");
        $this->seed("fauna", "Goéland");
        $this->seed("flora", "Pin d'Alep");

        $report = $this->resource->report();
        $this->assertCount(2, $report);

        $goeland = current(array_filter($report, fn($r) => $r['species_name'] === 'Goéland'));
        $this->assertSame(2, (int) $goeland['observation_count']);
    }
}
