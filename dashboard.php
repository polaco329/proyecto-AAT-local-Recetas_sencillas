<?php

declare(strict_types=1);

require __DIR__ . '/includes/auth_guard.php';
auth_require_login();

$pageTitle = 'Mi panel | Recetas Sencillas';
require __DIR__ . '/includes/auth_page_start.php';
?>
<main class="auth-card">
  <p class="auth-message">Sesión iniciada correctamente.</p>
  <h1>Hola, <?= auth_h($_SESSION['usuario_nombre']) ?></h1>
  <p>Tu cuenta local tiene el rol <strong><?= auth_h($_SESSION['rol']) ?></strong>.</p>
  <?php if ($_SESSION['rol'] === 'admin'): ?>
    <p><a class="auth-button" href="<?= auth_h($authBasePath . '/admin_panel.php') ?>">Administrar usuarios</a></p>
    <p><a class="auth-button" href="<?= auth_h($authBasePath . '/admin-local.php') ?>">Administrar recetas y blog</a></p>
  <?php endif; ?>
  <form method="post" action="<?= auth_h($authBasePath . '/logout.php') ?>">
    <input type="hidden" name="csrf_token" value="<?= auth_h(auth_csrf_token()) ?>">
    <button class="auth-button" type="submit">Cerrar sesión</button>
  </form>
</main>
<?php require __DIR__ . '/includes/auth_page_end.php'; ?>
