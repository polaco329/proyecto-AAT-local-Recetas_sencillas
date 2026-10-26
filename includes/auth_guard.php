<?php

declare(strict_types=1);

require_once __DIR__ . '/conexion.php';

$authBasePath = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');
if (str_ends_with($authBasePath, '/api')) {
    $authBasePath = substr($authBasePath, 0, -4);
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'samesite' => 'Lax',
        'path' => $authBasePath === '' ? '/' : $authBasePath . '/',
    ]);
    session_start();
}

function auth_h(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function auth_db(): PDO
{
    static $pdo = null;
    if (!$pdo instanceof PDO) {
        $pdo = conectar_mysql();
    }
    return $pdo;
}

function auth_csrf_token(): string
{
    if (!isset($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function auth_require_csrf(): void
{
    $submitted = $_POST['csrf_token'] ?? '';
    $expected = $_SESSION['csrf_token'] ?? '';
    if (!is_string($submitted) || !is_string($expected) || !hash_equals($expected, $submitted)) {
        http_response_code(400);
        exit('El formulario venció. Vuelve a cargar la página e inténtalo nuevamente.');
    }
}

function auth_require_login(): void
{
    global $authBasePath;
    if (!isset($_SESSION['usuario_id'])
        || !is_numeric($_SESSION['usuario_id'])
        || !isset($_SESSION['usuario_nombre'], $_SESSION['rol'])) {
        header('Location: ' . $authBasePath . '/login.php?error=acceso_denegado', true, 303);
        exit;
    }

    $statement = auth_db()->prepare('SELECT nombre, rol FROM users WHERE id = ? LIMIT 1');
    $statement->execute([(int) $_SESSION['usuario_id']]);
    $user = $statement->fetch();
    if (!is_array($user) || !in_array($user['rol'], ['admin', 'usuario'], true)) {
        $_SESSION = [];
        session_regenerate_id(true);
        header('Location: ' . $authBasePath . '/login.php?error=acceso_denegado', true, 303);
        exit;
    }

    if ($_SESSION['rol'] !== $user['rol']) {
        session_regenerate_id(true);
    }
    $_SESSION['usuario_nombre'] = (string) $user['nombre'];
    $_SESSION['rol'] = (string) $user['rol'];
}

function auth_require_role(string $role): void
{
    global $authBasePath;
    auth_require_login();
    if (!hash_equals($role, (string) $_SESSION['rol'])) {
        http_response_code(403);
        $pageTitle = 'Acceso denegado | Recetas Sencillas';
        require __DIR__ . '/auth_page_start.php';
        ?>
        <main class="auth-card">
          <h1>Acceso denegado</h1>
          <p>No tienes permisos para ver esta página.</p>
          <a class="auth-button" href="<?= auth_h($authBasePath . '/dashboard.php') ?>">Volver al panel</a>
        </main>
        <?php
        require __DIR__ . '/auth_page_end.php';
        exit;
    }
}
