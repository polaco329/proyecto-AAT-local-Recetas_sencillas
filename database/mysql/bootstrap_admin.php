<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require __DIR__ . '/../../includes/conexion.php';

$environment = parse_ini_file(__DIR__ . '/../../.env', false, INI_SCANNER_RAW) ?: [];
$email = strtolower(trim((string) (getenv('MYSQL_ADMIN_EMAIL') ?: ($environment['MYSQL_ADMIN_EMAIL'] ?? ''))));
$name = trim((string) (getenv('MYSQL_ADMIN_NAME') ?: ($environment['MYSQL_ADMIN_NAME'] ?? '')));
$password = (string) (getenv('MYSQL_ADMIN_PASSWORD') ?: ($environment['MYSQL_ADMIN_PASSWORD'] ?? ''));

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $name === ''
    || strlen($password) < 8 || strlen($password) > 72) {
    fwrite(STDERR, "Configura MYSQL_ADMIN_EMAIL, MYSQL_ADMIN_NAME y una MYSQL_ADMIN_PASSWORD de 8 a 72 bytes en .env o en el entorno del proceso.\n");
    exit(1);
}

try {
    $pdo = conectar_mysql();
    $statement = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $statement->execute([$email]);
    if ($statement->fetchColumn() !== false) {
        fwrite(STDERR, "Ese correo ya existe. No se modificó ni se elevó su rol.\n");
        exit(1);
    }

    $insert = $pdo->prepare('INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)');
    $insert->execute([$name, $email, password_hash($password, PASSWORD_BCRYPT), 'admin']);
    fwrite(STDOUT, "Cuenta administradora local creada. Elimina MYSQL_ADMIN_PASSWORD de .env ahora.\n");
} catch (PDOException $exception) {
    error_log('Local admin bootstrap failed: ' . $exception->getMessage());
    fwrite(STDERR, "No se pudo crear la cuenta administradora. Comprueba la conexión y la tabla users.\n");
    exit(1);
}
