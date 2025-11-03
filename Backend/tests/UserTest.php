<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../models/User.php';

final class UserTest extends TestCase
{
    public function testUserModelHasExpectedProperties(): void
    {
        $user = new User(null);
        $this->assertObjectHasProperty('id', $user);
        $this->assertObjectHasProperty('email', $user);
        $this->assertObjectHasProperty('password_hash', $user);
    }

    public function testVerifyPassword(): void
    {
        $user = new User(null);
        $plain = 'secret123';
        $user->password_hash = password_hash($plain, PASSWORD_DEFAULT);
        $this->assertTrue($user->verifyPassword($plain));
        $this->assertFalse($user->verifyPassword('wrong'));
    }
}


