<?php

require_once __DIR__ . '/auth_guard.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= auth_h($pageTitle ?? 'Acceso local | Recetas Sencillas') ?></title>
  <link rel="stylesheet" href="<?= auth_h($authBasePath . '/css/php-shell.css') ?>">
  <link rel="stylesheet" href="<?= auth_h($authBasePath . '/css/auth-local.css') ?>">
</head>
<body class="auth-local">
<nav class="site-navigation" aria-label="Navegación principal">
  <a class="site-navigation__brand" href="<?= auth_h($authBasePath . '/') ?>">Recetas Sencillas</a>
  <ul class="site-navigation__links">
    <li><a href="<?= auth_h($authBasePath . '/') ?>">Volver al sitio</a></li>
    <?php if (isset($_SESSION['usuario_id'])): ?>
      <li><a href="<?= auth_h($authBasePath . '/dashboard.php') ?>">Mi panel</a></li>
    <?php endif; ?>
  </ul>
</nav>
