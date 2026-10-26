<?php

$environment = parse_ini_file(__DIR__ . '/../.env', false, INI_SCANNER_RAW) ?: [];
$app_name = $environment['APP_NAME'] ?? 'Recetas Sencillas';
$support_email = $environment['SUPPORT_EMAIL'] ?? 'contacto@ejemplo.com';
$app_env = $environment['APP_ENV'] ?? 'local';
$app_base = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');
$escape = static fn ($value): string => htmlspecialchars(
    (string) $value,
    ENT_QUOTES | ENT_SUBSTITUTE,
    'UTF-8'
);