<?php

declare(strict_types=1);

require __DIR__ . '/includes/auth_guard.php';
auth_require_role('admin');

$statement = auth_db()->prepare(
    'SELECT id, nombre, email, rol, created_at FROM users ORDER BY created_at DESC, id DESC'
);
$statement->execute();
$users = $statement->fetchAll();
$pageTitle = 'Administración de usuarios | Recetas Sencillas';
require __DIR__ . '/includes/auth_page_start.php';
?>
<main class="auth-card">
  <h1>Administración de usuarios</h1>
  <p>Este panel está restringido al rol <strong>admin</strong>.</p>
  <p><a class="auth-button" href="<?= auth_h($authBasePath . '/admin-local.php') ?>">Administrar recetas y blog</a></p>
  <div class="auth-table-wrap">
    <table class="auth-table">
      <thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Creado</th></tr></thead>
      <tbody>
        <?php foreach ($users as $user): ?>
          <tr>
            <td><?= auth_h($user['id']) ?></td>
            <td><?= auth_h($user['nombre']) ?></td>
            <td><?= auth_h($user['email']) ?></td>
            <td><?= auth_h($user['rol']) ?></td>
            <td><?= auth_h($user['created_at']) ?></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</main>
<?php require __DIR__ . '/includes/auth_page_end.php'; ?>
