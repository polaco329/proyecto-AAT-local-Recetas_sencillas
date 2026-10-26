<?php
$navigation_authenticated = false;
require_once __DIR__ . '/auth_guard.php';
if (isset($_SESSION['usuario_id']) && is_numeric($_SESSION['usuario_id'])) {
    $navigation_check = auth_db()->prepare('SELECT id FROM users WHERE id = ? LIMIT 1');
    $navigation_check->execute([(int) $_SESSION['usuario_id']]);
    $navigation_authenticated = $navigation_check->fetchColumn() !== false;
}

$navigation_links = [
    ['Inicio', '/'],
    ['Búsqueda', '/advanced-search'],
    ['Recetas económicas', '/economic-recipes'],
    ['Consejos', '/cooking-tips'],
    ['Curso', '/curso'],
    ['Blog', '/blog'],
    ['Preguntas frecuentes', '/faq'],
];
if ($navigation_authenticated) {
    $navigation_links[] = ['Publicar receta', '/publish-recipe'];
    $navigation_links[] = ['Mi cuenta', '/account'];
    if (($_SESSION['rol'] ?? '') === 'admin') {
        $navigation_links[] = ['Administrar recetas', '/admin/recetas'];
        $navigation_links[] = ['Administrar blogs', '/blog#blog-admin-form'];
    }
}
?>
<nav class="site-navigation" aria-label="Navegación principal">
  <a class="site-navigation__brand" href="<?= $escape($app_base . '/') ?>"><?= $escape($app_name) ?></a>
  <ul id="site-navigation-links" class="site-navigation__links"<?= $navigation_authenticated ? '' : ' hidden' ?>>
    <?php foreach ($navigation_links as [$label, $path]): ?>
      <li><a href="<?= $escape($app_base . $path) ?>"><?= $escape($label) ?></a></li>
    <?php endforeach; ?>
  </ul>
</nav>