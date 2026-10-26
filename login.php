<?php

declare(strict_types=1);

require __DIR__ . '/includes/auth_guard.php';

$errorMessage = '';
$errorCode = $_GET['error'] ?? '';
if ($errorCode === 'acceso_denegado') {
    $errorMessage = 'Inicia sesión para acceder a esa página.';
} elseif ($errorCode === 'credenciales_invalidas') {
    $errorMessage = 'El correo o la contraseña no son correctos.';
}

$email = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    auth_require_csrf();
    $emailInput = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $email = is_string($emailInput) ? strtolower(trim($emailInput)) : '';

    if (!is_string($emailInput) || !filter_var($email, FILTER_VALIDATE_EMAIL)
        || strlen($email) > 254 || !is_string($password) || strlen($password) > 72) {
        $errorMessage = 'El correo o la contraseña no son correctos.';
    } else {
        try {
            $statement = auth_db()->prepare(
                'SELECT id, nombre, email, password, rol FROM users WHERE email = ? LIMIT 1'
            );
            $statement->execute([$email]);
            $user = $statement->fetch();
            if (!is_array($user) || !password_verify($password, (string) $user['password'])) {
                header('Location: ' . $authBasePath . '/login.php?error=credenciales_invalidas', true, 303);
                exit;
            }

            session_regenerate_id(true);
            $_SESSION['usuario_id'] = (int) $user['id'];
            $_SESSION['usuario_nombre'] = (string) $user['nombre'];
            $_SESSION['rol'] = (string) $user['rol'];
            unset($_SESSION['csrf_token']);
            header('Location: ' . $authBasePath . '/dashboard.php', true, 303);
            exit;
        } catch (PDOException $exception) {
            error_log('Local user login failed: ' . $exception->getMessage());
            $errorMessage = 'No se pudo iniciar sesión. Inténtalo nuevamente.';
        }
    }
}

$pageTitle = 'Inicio de sesión local | Recetas Sencillas';
require __DIR__ . '/includes/auth_page_start.php';
?>
<main class="auth-card">
  <h1>Iniciar sesión local</h1>
  <p>Accede con la cuenta de MySQL local.</p>
  <?php if ($errorMessage !== ''): ?><p class="auth-message auth-message--error" role="alert"><?= auth_h($errorMessage) ?></p><?php endif; ?>
  <form class="auth-form" method="post" action="<?= auth_h($authBasePath . '/login.php') ?>">
    <input type="hidden" name="csrf_token" value="<?= auth_h(auth_csrf_token()) ?>">
    <label for="email">Correo electrónico</label>
    <input id="email" name="email" type="email" maxlength="254" autocomplete="username" value="<?= auth_h($email) ?>" required>
    <label for="password">Contraseña</label>
    <input id="password" name="password" type="password" maxlength="72" autocomplete="current-password" required>
    <button class="auth-button" type="submit">Iniciar sesión</button>
  </form>
  <p>¿Todavía no tienes cuenta? <a href="<?= auth_h($authBasePath . '/registro.php') ?>">Regístrate</a>.</p>
</main>
<?php require __DIR__ . '/includes/auth_page_end.php'; ?>
