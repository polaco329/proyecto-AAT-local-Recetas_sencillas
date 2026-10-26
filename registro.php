<?php

declare(strict_types=1);

require __DIR__ . '/includes/auth_guard.php';

$errorMessage = '';
$name = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    auth_require_csrf();
    $nameInput = $_POST['nombre'] ?? '';
    $emailInput = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $passwordConfirmation = $_POST['password_confirmation'] ?? '';
    $name = is_string($nameInput) ? trim($nameInput) : '';
    $email = is_string($emailInput) ? strtolower(trim($emailInput)) : '';

    if (!is_string($nameInput) || mb_strlen($name, 'UTF-8') < 2 || mb_strlen($name, 'UTF-8') > 120) {
        $errorMessage = 'El nombre debe tener entre 2 y 120 caracteres.';
    } elseif (!is_string($emailInput) || strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errorMessage = 'Ingresa un correo electrónico válido.';
    } elseif (!is_string($password) || strlen($password) < 12 || strlen($password) > 72) {
        $errorMessage = 'La contraseña debe tener al menos 12 caracteres y un máximo de 72 bytes.';
    } elseif (!is_string($passwordConfirmation) || !hash_equals($password, $passwordConfirmation)) {
        $errorMessage = 'Las contraseñas no coinciden.';
    } else {
        try {
            $check = auth_db()->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
            $check->execute([$email]);
            if ($check->fetchColumn() !== false) {
                $errorMessage = 'Ya existe una cuenta con ese correo electrónico.';
            } else {
                $passwordHash = password_hash($password, PASSWORD_BCRYPT);
                $insert = auth_db()->prepare(
                    'INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)'
                );
                $insert->execute([$name, $email, $passwordHash, 'usuario']);
                session_regenerate_id(true);
                $_SESSION['usuario_id'] = (int) auth_db()->lastInsertId();
                $_SESSION['usuario_nombre'] = $name;
                $_SESSION['rol'] = 'usuario';
                unset($_SESSION['csrf_token']);
                header('Location: ' . $authBasePath . '/dashboard.php', true, 303);
                exit;
            }
        } catch (PDOException $exception) {
            error_log('Local user registration failed: ' . $exception->getMessage());
            $errorMessage = 'No se pudo crear la cuenta. Comprueba los datos e inténtalo nuevamente.';
        }
    }
}

$pageTitle = 'Registro local | Recetas Sencillas';
require __DIR__ . '/includes/auth_page_start.php';
?>
<main class="auth-card">
  <h1>Crear cuenta local</h1>
  <p>Regístrate para acceder a tu panel de recetas.</p>
  <?php if ($errorMessage !== ''): ?><p class="auth-message auth-message--error" role="alert"><?= auth_h($errorMessage) ?></p><?php endif; ?>
  <form class="auth-form" method="post" action="<?= auth_h($authBasePath . '/registro.php') ?>">
    <input type="hidden" name="csrf_token" value="<?= auth_h(auth_csrf_token()) ?>">
    <label for="nombre">Nombre</label>
    <input id="nombre" name="nombre" type="text" minlength="2" maxlength="120" autocomplete="name" value="<?= auth_h($name) ?>" required>
    <label for="email">Correo electrónico</label>
    <input id="email" name="email" type="email" maxlength="254" autocomplete="email" value="<?= auth_h($email) ?>" required>
    <label for="password">Contraseña (12 a 72 caracteres)</label>
    <input id="password" name="password" type="password" minlength="12" maxlength="72" autocomplete="new-password" required>
    <label for="password_confirmation">Confirma la contraseña</label>
    <input id="password_confirmation" name="password_confirmation" type="password" minlength="12" maxlength="72" autocomplete="new-password" required>
    <button class="auth-button" type="submit">Crear cuenta</button>
  </form>
  <p>¿Ya tienes cuenta? <a href="<?= auth_h($authBasePath . '/login.php') ?>">Inicia sesión</a>.</p>
</main>
<?php require __DIR__ . '/includes/auth_page_end.php'; ?>
