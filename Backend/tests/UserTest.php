<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../src/controllers/UserController.php';

/**
 * Exercises User/UserController against a real (SQLite in-memory) database
 * instead of mocking PDO, so the actual SQL run by the app is what's tested.
 */
class UserTest extends TestCase {
    private PDO $db;
    private UserController $controller;

    protected function setUp(): void {
        $this->db = new PDO('sqlite::memory:');
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->db->exec("
            CREATE TABLE user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email VARCHAR(190) NOT NULL UNIQUE,
                password_hash VARCHAR(190) NOT NULL,
                last_name VARCHAR(100),
                first_name VARCHAR(100),
                role VARCHAR(20) NOT NULL
            )
        ");

        $this->controller = new UserController($this->db);
    }

    public function testRegisterCreatesUserWithHashedPassword(): void {
        $result = $this->controller->register((object) [
            "first_name" => "Anne",
            "last_name" => "Bernard",
            "email" => "anne@example.com",
            "password" => "S3cret!",
        ]);

        $this->assertSame("success", $result["status"]);

        $stmt = $this->db->query("SELECT * FROM user WHERE email = 'anne@example.com'");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $this->assertNotFalse($row, "The user should have been persisted.");
        $this->assertSame("visitor", $row["role"], "New users should default to the visitor role.");
        $this->assertNotSame("S3cret!", $row["password_hash"], "The password must never be stored in clear text.");
        $this->assertTrue(password_verify("S3cret!", $row["password_hash"]));
    }

    public function testRegisterRejectsMissingFields(): void {
        $result = $this->controller->register((object) [
            "first_name" => "Anne",
            "email" => "anne@example.com",
            // last_name and password missing
        ]);

        $this->assertSame("error", $result["status"]);
    }

    public function testRegisterRejectsDuplicateEmail(): void {
        $payload = (object) [
            "first_name" => "Anne",
            "last_name" => "Bernard",
            "email" => "dup@example.com",
            "password" => "S3cret!",
        ];

        $this->controller->register($payload);
        $result = $this->controller->register($payload);

        $this->assertSame("error", $result["status"]);
    }

    public function testLoginSucceedsWithValidCredentialsAndReturnsAToken(): void {
        $this->controller->register((object) [
            "first_name" => "Anne",
            "last_name" => "Bernard",
            "email" => "login@example.com",
            "password" => "S3cret!",
        ]);

        $result = $this->controller->login((object) [
            "email" => "login@example.com",
            "password" => "S3cret!",
        ]);

        $this->assertSame("success", $result["status"]);
        $this->assertArrayHasKey("token", $result);
        $this->assertNotEmpty($result["token"]);
        $this->assertSame("login@example.com", $result["user"]["email"]);
    }

    public function testLoginFailsWithWrongPassword(): void {
        $this->controller->register((object) [
            "first_name" => "Anne",
            "last_name" => "Bernard",
            "email" => "wrongpass@example.com",
            "password" => "S3cret!",
        ]);

        $result = $this->controller->login((object) [
            "email" => "wrongpass@example.com",
            "password" => "not-the-password",
        ]);

        $this->assertSame("error", $result["status"]);
        $this->assertArrayNotHasKey("token", $result);
    }

    public function testLoginFailsForUnknownEmail(): void {
        $result = $this->controller->login((object) [
            "email" => "nobody@example.com",
            "password" => "whatever",
        ]);

        $this->assertSame("error", $result["status"]);
    }
}
