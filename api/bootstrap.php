<?php

declare(strict_types=1);

require_once __DIR__ . '/../includes/auth_guard.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');

function api_json(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function api_request_body(): array
{
    $body = file_get_contents('php://input');
    if (!is_string($body) || $body === '') {
        return [];
    }
    $data = json_decode($body, true);
    if (!is_array($data)) {
        api_json(['error' => 'El contenido de la solicitud no es válido.'], 400);
    }
    return $data;
}

function api_csrf_guard(): void
{
    $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $expected = $_SESSION['csrf_token'] ?? '';
    if (!is_string($provided) || !is_string($expected)
        || $provided === '' || !hash_equals($expected, $provided)) {
        api_json(['error' => 'La sesión del formulario venció. Recarga la página e inténtalo nuevamente.'], 419);
    }
}

function api_current_user(): ?array
{
    if (!isset($_SESSION['usuario_id'])) {
        return null;
    }
    $statement = auth_db()->prepare('SELECT id, nombre, email, rol FROM users WHERE id = ? LIMIT 1');
    $statement->execute([(int) $_SESSION['usuario_id']]);
    $user = $statement->fetch();
    if (!is_array($user) || !in_array($user['rol'], ['admin', 'usuario'], true)) {
        $_SESSION = [];
        session_regenerate_id(true);
        return null;
    }
    $_SESSION['usuario_nombre'] = (string) $user['nombre'];
    $_SESSION['rol'] = (string) $user['rol'];
    return [
        'id' => (string) $user['id'],
        'email' => (string) $user['email'],
        'role' => (string) $user['rol'],
        'user_metadata' => ['display_name' => (string) $user['nombre']],
    ];
}

function api_require_user(): array
{
    $user = api_current_user();
    if ($user === null) {
        api_json(['error' => 'Inicia sesión para continuar.'], 401);
    }
    return $user;
}

function api_require_admin(array $user): void
{
    if (($user['role'] ?? '') !== 'admin') {
        api_json(['error' => 'No tienes permisos para realizar esta acción.'], 403);
    }
}

function api_text(array $data, string $key, int $maxLength, bool $required = true): string
{
    $value = $data[$key] ?? '';
    if (!is_string($value)) {
        api_json(['error' => 'El formulario contiene un valor inválido.'], 400);
    }
    $value = trim($value);
    $length = mb_strlen($value, 'UTF-8');
    if (($required && $length === 0) || $length > $maxLength) {
        api_json(['error' => "El campo {$key} es obligatorio y admite hasta {$maxLength} caracteres."], 422);
    }
    return $value;
}

function api_uuid(): string
{
    $bytes = random_bytes(16);
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    $hex = bin2hex($bytes);
    return substr($hex, 0, 8) . '-' . substr($hex, 8, 4) . '-' . substr($hex, 12, 4)
        . '-' . substr($hex, 16, 4) . '-' . substr($hex, 20);
}

set_exception_handler(static function (Throwable $exception): void {
    error_log('Local API request failed: ' . $exception->getMessage());
    api_json(['error' => 'No se pudo completar la solicitud local. Inténtalo nuevamente.'], 500);
});
