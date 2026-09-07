<?php

/**
 * Minimal HS256 JWT encode/decode/verify, no external dependency.
 * Secret comes from the JWT_SECRET env var; falls back to a dev-only
 * default so local setups without a .env still work.
 */
class JwtMiddleware {
    private static function secret() {
        $secret = getenv('JWT_SECRET');
        return $secret !== false && $secret !== '' ? $secret : 'dev-insecure-secret-change-me';
    }

    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode($data) {
        $padded = str_pad($data, strlen($data) % 4 === 0 ? strlen($data) : strlen($data) + 4 - strlen($data) % 4, '=');
        return base64_decode(strtr($padded, '-_', '+/'));
    }

    public static function generateToken(array $payload, int $ttlSeconds = 3600) {
        $header = self::base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));

        $payload['iat'] = time();
        $payload['exp'] = time() + $ttlSeconds;
        $body = self::base64UrlEncode(json_encode($payload));

        $signature = self::base64UrlEncode(hash_hmac('sha256', "$header.$body", self::secret(), true));

        return "$header.$body.$signature";
    }

    /**
     * Returns the decoded payload array, or null if the token is missing,
     * malformed, expired, or has an invalid signature.
     */
    public static function validateToken(?string $token) {
        if (!$token) {
            return null;
        }

        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        [$header, $body, $signature] = $parts;

        $expectedSignature = self::base64UrlEncode(hash_hmac('sha256', "$header.$body", self::secret(), true));
        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $payload = json_decode(self::base64UrlDecode($body), true);
        if (!is_array($payload) || !isset($payload['exp']) || $payload['exp'] < time()) {
            return null;
        }

        return $payload;
    }

    private static function bearerToken() {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null);
        if (!$header || stripos($header, 'Bearer ') !== 0) {
            return null;
        }
        return trim(substr($header, 7));
    }

    /**
     * Authenticates the current request. Sends a 401 JSON response and
     * exits if there is no valid token. Returns the token payload otherwise.
     *
     * Pass $requiredRole to also enforce that the token's role claim
     * matches (sends 403 and exits if it doesn't).
     */
    public static function authenticate(?string $requiredRole = null) {
        $payload = self::validateToken(self::bearerToken());

        if (!$payload) {
            http_response_code(401);
            echo json_encode(["message" => "Non autorisé. Token invalide ou manquant."]);
            exit();
        }

        if ($requiredRole !== null && ($payload['role'] ?? null) !== $requiredRole) {
            http_response_code(403);
            echo json_encode(["message" => "Accès refusé. Droits insuffisants."]);
            exit();
        }

        return $payload;
    }
}
