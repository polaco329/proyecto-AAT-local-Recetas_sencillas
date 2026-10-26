<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';

if ($method === 'GET' && $action === 'session') {
    api_json([
        'user' => api_current_user(),
        'csrfToken' => auth_csrf_token(),
    ]);
}

if ($method !== 'POST') {
    api_json(['error' => 'Método no permitido.'], 405);
}

$data = api_request_body();
api_csrf_guard();

if ($action === 'login') {
    $email = strtolower(api_text($data, 'email', 254));
    $password = $data['password'] ?? null;
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !is_string($password) || strlen($password) > 72) {
        api_json(['error' => 'El correo o la contraseña no son correctos.'], 401);
    }

    $statement = auth_db()->prepare('SELECT id, nombre, email, password, rol FROM users WHERE email = ? LIMIT 1');
    $statement->execute([$email]);
    $account = $statement->fetch();
    if (!is_array($account) || !password_verify($password, (string) $account['password'])) {
        api_json(['error' => 'El correo o la contraseña no son correctos.'], 401);
    }
    if (password_needs_rehash((string) $account['password'], PASSWORD_BCRYPT)) {
        $newHash = password_hash($password, PASSWORD_BCRYPT);
        $update = auth_db()->prepare('UPDATE users SET password = ? WHERE id = ?');
        $update->execute([$newHash, (int) $account['id']]);
    }

    session_regenerate_id(true);
    $_SESSION['usuario_id'] = (int) $account['id'];
    $_SESSION['usuario_nombre'] = (string) $account['nombre'];
    $_SESSION['rol'] = (string) $account['rol'];
    unset($_SESSION['csrf_token']);
    api_json(['user' => api_current_user(), 'csrfToken' => auth_csrf_token()]);
}

if ($action === 'register') {
    $name = api_text($data, 'name', 120);
    $email = strtolower(api_text($data, 'email', 254));
    $password = $data['password'] ?? null;
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        api_json(['error' => 'Ingresa un correo electrónico válido.'], 422);
    }
    if (!is_string($password) || strlen($password) < 12 || strlen($password) > 72) {
        api_json(['error' => 'La contraseña debe tener entre 12 y 72 bytes.'], 422);
    }

    $check = auth_db()->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $check->execute([$email]);
    if ($check->fetchColumn() !== false) {
        api_json(['error' => 'Ya existe una cuenta con ese correo electrónico.'], 409);
    }

    try {
        $insert = auth_db()->prepare('INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)');
        $insert->execute([$name, $email, password_hash($password, PASSWORD_BCRYPT), 'usuario']);
    } catch (PDOException $exception) {
        if ($exception->getCode() === '23000') {
            api_json(['error' => 'Ya existe una cuenta con ese correo electrónico.'], 409);
        }
        throw $exception;
    }

    session_regenerate_id(true);
    $_SESSION['usuario_id'] = (int) auth_db()->lastInsertId();
    $_SESSION['usuario_nombre'] = $name;
    $_SESSION['rol'] = 'usuario';
    unset($_SESSION['csrf_token']);
    api_json(['user' => api_current_user(), 'csrfToken' => auth_csrf_token()], 201);
}

if ($action === 'logout') {
    api_require_user();
    $_SESSION = [];
    $cookie = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires' => time() - 42000,
        'path' => $cookie['path'],
        'domain' => $cookie['domain'],
        'secure' => $cookie['secure'],
        'httponly' => $cookie['httponly'],
        'samesite' => $cookie['samesite'] ?? 'Lax',
    ]);
    session_destroy();
    api_json(['ok' => true]);
}

api_json(['error' => 'Acción no válida.'], 404);
