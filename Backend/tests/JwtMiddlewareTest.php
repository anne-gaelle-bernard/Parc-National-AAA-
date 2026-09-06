<?php

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../src/middlewares/JwtMiddleware.php';

class JwtMiddlewareTest extends TestCase {
    public function testGeneratedTokenValidatesAndCarriesThePayload(): void {
        $token = JwtMiddleware::generateToken(["sub" => 42, "role" => "visitor"]);

        $payload = JwtMiddleware::validateToken($token);

        $this->assertNotNull($payload);
        $this->assertSame(42, $payload["sub"]);
        $this->assertSame("visitor", $payload["role"]);
    }

    public function testTamperedTokenIsRejected(): void {
        $token = JwtMiddleware::generateToken(["sub" => 1]);
        [$header, $body, $signature] = explode('.', $token);

        // Flip the payload without re-signing it.
        $tamperedBody = strtr(base64_encode(json_encode(["sub" => 999, "exp" => time() + 3600])), '+/', '-_');
        $tamperedToken = "$header.$tamperedBody.$signature";

        $this->assertNull(JwtMiddleware::validateToken($tamperedToken));
    }

    public function testExpiredTokenIsRejected(): void {
        $token = JwtMiddleware::generateToken(["sub" => 1], -10);

        $this->assertNull(JwtMiddleware::validateToken($token));
    }

    public function testMalformedTokenIsRejected(): void {
        $this->assertNull(JwtMiddleware::validateToken("not-a-jwt"));
        $this->assertNull(JwtMiddleware::validateToken(null));
        $this->assertNull(JwtMiddleware::validateToken(""));
    }
}
