<?php

require __DIR__ . '/includes/config.php';

$builtPage = __DIR__ . '/dist/index.html';

if (!is_file($builtPage)) {
    http_response_code(503);
    ?>
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Recetas Sencillas</title>
      </head>
      <body>
        <h1>La aplicación todavía no está compilada</h1>
        <p>Ejecuta <code>npm run build</code> y vuelve a cargar esta página.</p>
      </body>
    </html>
    <?php
    exit;
}

$builtMarkup = file_get_contents($builtPage);
if ($builtMarkup === false
    || !preg_match('~<script[^>]+src="/assets/([^"]+\.js)"~', $builtMarkup, $scriptMatch)
    || !preg_match('~<link[^>]+href="/assets/([^"]+\.css)"~', $builtMarkup, $styleMatch)) {
    http_response_code(503);
    exit('No se encontraron los archivos compilados. Ejecuta npm run build.');
}

$requestedPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$routePath = $app_base !== '' && str_starts_with($requestedPath, $app_base)
    ? substr($requestedPath, strlen($app_base))
    : $requestedPath;
$routePath = '/' . trim($routePath, '/');
$allowedCategories = ['Todas', 'Postres', 'Carnes', 'Vegano', 'Rápido', 'Desayuno', 'Merienda'];
$rawSearchTerm = $_GET['q'] ?? '';
$searchTerm = is_string($rawSearchTerm) ? trim($rawSearchTerm) : '';
if (preg_match('/^.{0,120}/us', $searchTerm, $searchMatch) === 1) {
    $searchTerm = $searchMatch[0];
} else {
    $searchTerm = '';
}
$rawCategory = $_GET['category'] ?? '';
$searchCategory = is_string($rawCategory) && in_array($rawCategory, $allowedCategories, true)
    ? $rawCategory
    : 'Todas';
$app_form_state = [
    'search' => ['term' => $searchTerm, 'category' => $searchCategory],
];

$routeTitles = [
    '/' => 'Cocina fácil y económica',
    '/advanced-search' => 'Búsqueda avanzada',
    '/economic-recipes' => 'Recetas económicas',
    '/cooking-tips' => 'Consejos de cocina',
    '/kids-recipes' => 'Recetas para niños',
    '/saved-recipes' => 'Recetas guardadas',
    '/login' => 'Iniciar sesión',
    '/register' => 'Crear cuenta',
    '/account' => 'Mi cuenta',
    '/supplier-contact' => 'Contacto',
    '/curso' => 'Curso de cocina',
    '/blog' => 'Blog',
    '/cv' => 'Currículum del chef',
    '/faq' => 'Preguntas frecuentes',
    '/quienes-somos' => 'Quiénes somos',
];

if (preg_match('~^/category/([^/]+)$~', $routePath, $categoryMatch)) {
    $pageTitle = 'Recetas de ' . rawurldecode($categoryMatch[1]);
} elseif (preg_match('~^/recipe/[^/]+$~', $routePath)) {
    $pageTitle = 'Detalle de receta';
} else {
    $pageTitle = $routeTitles[$routePath] ?? 'Recetas';
}

$titulo_pagina = $routePath === '/' ? $app_name . ' | ' . $pageTitle : $pageTitle . ' | ' . $app_name;
$assetPath = ($app_base === '' ? '' : $app_base) . '/dist/assets/';
$js_asset = $assetPath . basename($scriptMatch[1]);
$css_asset = $assetPath . basename($styleMatch[1]);

require __DIR__ . '/includes/header.php';
require __DIR__ . '/includes/nav.php';
?>
<div id="root"></div>
<?php require __DIR__ . '/includes/footer.php'; ?>