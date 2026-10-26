<?php

function conectar_mysql(): PDO
{
    $environment = parse_ini_file(__DIR__ . '/../.env', false, INI_SCANNER_RAW) ?: [];
    $host = trim((string) ($environment['MYSQL_HOST'] ?? '127.0.0.1'));
    $port = trim((string) ($environment['MYSQL_PORT'] ?? '3306'));
    $database = trim((string) ($environment['MYSQL_DATABASE'] ?? 'recetas_sencillas'));
    $username = (string) ($environment['MYSQL_USER'] ?? 'root');
    $password = (string) ($environment['MYSQL_PASSWORD'] ?? '');

    try {
        return new PDO(
            "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4",
            $username,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    } catch (PDOException $exception) {
        error_log('MySQL connection failed: ' . $exception->getMessage());
        throw new RuntimeException(
            'No se pudo conectar con MySQL. Comprueba XAMPP y la configuración MYSQL_* del archivo .env.',
            0,
            $exception
        );
    }
}
