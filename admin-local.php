<?php

declare(strict_types=1);

require __DIR__ . '/includes/config.php';
require __DIR__ . '/includes/auth_guard.php';
auth_require_role('admin');

const RECIPE_CATEGORIES_LOCAL = ['Postres', 'Carnes', 'Vegano', 'Rápido', 'Desayuno', 'Merienda'];

function h(mixed $value): string
{
    return auth_h($value);
}

function redirect_local_admin(string $query = ''): never
{
    global $authBasePath;
    header('Location: ' . $authBasePath . '/admin-local.php' . $query, true, 303);
    exit;
}

function post_string(string $key): string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        throw new InvalidArgumentException('El formulario contiene un valor inválido.');
    }
    return trim($value);
}

function validate_text(string $value, string $label, int $minimum, int $maximum): string
{
    $length = mb_strlen($value, 'UTF-8');
    if ($length < $minimum || $length > $maximum) {
        throw new InvalidArgumentException("{$label}: debe tener entre {$minimum} y {$maximum} caracteres.");
    }
    return $value;
}

function textarea_lines(string $value, int $minimum, int $maximum, string $label): array
{
    $items = array_values(array_filter(
        array_map('trim', preg_split('/\R/u', $value) ?: []),
        static fn (string $item): bool => $item !== ''
    ));
    if (count($items) < $minimum || count($items) > $maximum) {
        throw new InvalidArgumentException("{$label}: indica entre {$minimum} y {$maximum} líneas.");
    }
    return $items;
}

$errorMessage = '';
$successMessage = '';
$counts = [];
$pdo = auth_db();
$section = $_GET['section'] ?? 'recipes';
$allowedSections = ['recipes', 'blogs', 'recipe_comments', 'blog_comments', 'profiles'];
if (!is_string($section) || !in_array($section, $allowedSections, true)) {
    $section = 'recipes';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $action = post_string('action');
        auth_require_csrf();

        if ($action === 'save_recipe') {
            $id = post_string('id');
            $name = validate_text(post_string('name'), 'Nombre', 3, 100);
            $category = post_string('category');
            if (!in_array($category, RECIPE_CATEGORIES_LOCAL, true)) {
                throw new InvalidArgumentException('Selecciona una categoría válida.');
            }
            $description = validate_text(post_string('description'), 'Descripción', 10, 300);
            $ingredients = textarea_lines(post_string('ingredients'), 2, 30, 'Ingredientes');
            $steps = textarea_lines(post_string('steps'), 2, 20, 'Preparación');
            $priceText = post_string('price');
            $servingsText = post_string('servings');
            if (!ctype_digit($priceText) || (float) $priceText > 4294967295) {
                throw new InvalidArgumentException('El costo debe ser un entero no negativo.');
            }
            if (!ctype_digit($servingsText) || (int) $servingsText < 1 || (int) $servingsText > 100) {
                throw new InvalidArgumentException('Las porciones deben estar entre 1 y 100.');
            }
            $prepTime = validate_text(post_string('prep_time'), 'Tiempo de preparación', 1, 50);
            $imageUrl = post_string('image_url');
            if ($imageUrl !== '' && (!filter_var($imageUrl, FILTER_VALIDATE_URL)
                || !in_array(strtolower((string) parse_url($imageUrl, PHP_URL_SCHEME)), ['http', 'https'], true))) {
                throw new InvalidArgumentException('La imagen debe tener una dirección HTTP o HTTPS válida.');
            }

            $values = [
                $name,
                $category,
                $description,
                json_encode($ingredients, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
                json_encode($steps, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
                (int) $priceText,
                $prepTime,
                (int) $servingsText,
                $imageUrl === '' ? null : $imageUrl,
            ];

            if ($id === '') {
                $id = sprintf(
                    '%s-%s-%s-%s-%s',
                    bin2hex(random_bytes(4)),
                    bin2hex(random_bytes(2)),
                    bin2hex(random_bytes(2)),
                    bin2hex(random_bytes(2)),
                    bin2hex(random_bytes(6))
                );
                $statement = $pdo->prepare(
                    'INSERT INTO community_recipes '
                    . '(id, user_id, author_name, name, category, description, ingredients, steps, price, prep_time, servings, image_url) '
                    . 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                );
                $statement->execute([
                    $id,
                    (string) $_SESSION['usuario_id'],
                    $_SESSION['usuario_nombre'],
                    ...$values,
                ]);
                $successMessage = 'Receta creada y guardada en MySQL local.';
            } else {
                $statement = $pdo->prepare(
                    'UPDATE community_recipes SET name = ?, category = ?, description = ?, ingredients = ?, steps = ?, '
                    . 'price = ?, prep_time = ?, servings = ?, image_url = ? WHERE id = ?'
                );
                $statement->execute([...$values, $id]);
                $successMessage = 'Receta actualizada en MySQL local.';
            }
            $section = 'recipes';
        } elseif ($action === 'save_blog') {
            $id = post_string('id');
            $title = validate_text(post_string('title'), 'Título', 5, 150);
            $subtitle = validate_text(post_string('subtitle'), 'Resumen', 5, 200);
            $category = validate_text(post_string('category'), 'Categoría', 2, 50);
            $paragraphs = array_values(array_filter(
                array_map('trim', preg_split('/\R\s*\R/u', post_string('content')) ?: []),
                static fn (string $paragraph): bool => $paragraph !== ''
            ));
            if (count($paragraphs) < 1 || count($paragraphs) > 30) {
                throw new InvalidArgumentException('El artículo debe incluir entre 1 y 30 párrafos.');
            }
            foreach ($paragraphs as $paragraph) {
                validate_text($paragraph, 'Cada párrafo', 1, 5000);
            }
            $tip = validate_text(post_string('tip'), 'Consejo', 3, 1000);
            $values = [
                $title,
                $subtitle,
                $category,
                $_SESSION['usuario_nombre'],
                json_encode($paragraphs, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
                $tip,
            ];

            if ($id === '') {
                $id = sprintf(
                    '%s-%s-%s-%s-%s',
                    bin2hex(random_bytes(4)),
                    bin2hex(random_bytes(2)),
                    bin2hex(random_bytes(2)),
                    bin2hex(random_bytes(2)),
                    bin2hex(random_bytes(6))
                );
                $statement = $pdo->prepare(
                    'INSERT INTO blog_posts (id, title, subtitle, category, author_name, content, tip) '
                    . 'VALUES (?, ?, ?, ?, ?, ?, ?)'
                );
                $statement->execute([$id, ...$values]);
                $successMessage = 'Artículo creado y guardado en MySQL local.';
            } else {
                $statement = $pdo->prepare(
                    'UPDATE blog_posts SET title = ?, subtitle = ?, category = ?, author_name = ?, content = ?, tip = ? WHERE id = ?'
                );
                $statement->execute([...$values, $id]);
                $successMessage = 'Artículo actualizado en MySQL local.';
            }
            $section = 'blogs';
        } elseif ($action === 'delete') {
            $entity = post_string('entity');
            $tableByEntity = [
                'recipe' => 'community_recipes',
                'blog' => 'blog_posts',
                'recipe_comment' => 'recipe_comments',
                'blog_comment' => 'blog_comments',
            ];
            if (!isset($tableByEntity[$entity])) {
                throw new InvalidArgumentException('No se reconoce el elemento que quieres borrar.');
            }
            $id = post_string('id');
            $statement = $pdo->prepare('DELETE FROM ' . $tableByEntity[$entity] . ' WHERE id = ?');
            $statement->execute([$id]);
            $section = match ($entity) {
                'recipe' => 'recipes',
                'blog' => 'blogs',
                'recipe_comment' => 'recipe_comments',
                default => 'blog_comments',
            };
            $successMessage = $statement->rowCount() === 1
                ? 'Registro eliminado de MySQL local.'
                : 'No se encontró el registro para eliminar.';
        } else {
            throw new InvalidArgumentException('La acción solicitada no es válida.');
        }
    } catch (Throwable $exception) {
        if ($exception instanceof PDOException) {
            error_log('Local MySQL operation failed: ' . $exception->getMessage());
            $errorMessage = 'MySQL no pudo completar la operación. Revisa la conexión y los datos ingresados.';
        } else {
            $errorMessage = $exception->getMessage();
        }
    }

    if ($successMessage !== '') {
        $_SESSION['local_flash'] = ['success' => $successMessage];
        redirect_local_admin('?section=' . rawurlencode($section));
    }
}

if (isset($_SESSION['local_flash']['success'])) {
    $successMessage = (string) $_SESSION['local_flash']['success'];
    unset($_SESSION['local_flash']);
}

$pageTitle = 'Administración local | ' . $app_name;
$basePath = $app_base;

foreach ([
    'recipes' => 'community_recipes',
    'blogs' => 'blog_posts',
    'recipe_comments' => 'recipe_comments',
    'blog_comments' => 'blog_comments',
    'profiles' => 'profiles',
] as $key => $table) {
    $statement = $pdo->prepare('SELECT COUNT(*) FROM ' . $table);
    $statement->execute();
    $counts[$key] = (int) $statement->fetchColumn();
}

$editingRecipe = null;
$editingBlog = null;
$recipes = [];
$blogs = [];
$recipeComments = [];
$blogComments = [];
$profiles = [];
if ($errorMessage === '') {
    if ($section === 'recipes') {
        if (isset($_GET['edit_recipe']) && is_string($_GET['edit_recipe'])) {
            $statement = $pdo->prepare('SELECT * FROM community_recipes WHERE id = ?');
            $statement->execute([$_GET['edit_recipe']]);
            $editingRecipe = $statement->fetch() ?: null;
        }
        $statement = $pdo->prepare('SELECT * FROM community_recipes ORDER BY created_at DESC');
        $statement->execute();
        $recipes = $statement->fetchAll();
    } elseif ($section === 'blogs') {
        if (isset($_GET['edit_blog']) && is_string($_GET['edit_blog'])) {
            $statement = $pdo->prepare('SELECT * FROM blog_posts WHERE id = ?');
            $statement->execute([$_GET['edit_blog']]);
            $editingBlog = $statement->fetch() ?: null;
        }
        $statement = $pdo->prepare('SELECT * FROM blog_posts ORDER BY created_at DESC');
        $statement->execute();
        $blogs = $statement->fetchAll();
    } elseif ($section === 'recipe_comments') {
        $statement = $pdo->prepare('SELECT * FROM recipe_comments ORDER BY created_at DESC');
        $statement->execute();
        $recipeComments = $statement->fetchAll();
    } elseif ($section === 'blog_comments') {
        $statement = $pdo->prepare(
            'SELECT blog_comments.*, blog_posts.title AS post_title '
            . 'FROM blog_comments LEFT JOIN blog_posts ON blog_posts.id = blog_comments.post_id '
            . 'ORDER BY blog_comments.created_at DESC'
        );
        $statement->execute();
        $blogComments = $statement->fetchAll();
    } elseif ($section === 'profiles') {
        $statement = $pdo->prepare('SELECT * FROM profiles ORDER BY created_at DESC');
        $statement->execute();
        $profiles = $statement->fetchAll();
    }
}

?><!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= h($pageTitle) ?></title>
  <link rel="stylesheet" href="<?= h($basePath . '/css/php-shell.css') ?>">
  <link rel="stylesheet" href="<?= h($basePath . '/css/local-admin.css') ?>">
</head>
<body class="local-admin">
<nav class="site-navigation" aria-label="Navegación principal">
  <a class="site-navigation__brand" href="<?= h($basePath . '/') ?>"><?= h($app_name) ?></a>
  <ul class="site-navigation__links">
    <li><a href="<?= h($basePath . '/') ?>">Volver al sitio</a></li>
    <li><a href="<?= h($basePath . '/dashboard.php') ?>">Mi panel</a></li>
    <li><span><?= h($_SESSION['usuario_nombre']) ?></span></li>
    <li>
      <form method="post" action="<?= h($basePath . '/logout.php') ?>">
        <input type="hidden" name="csrf_token" value="<?= h(auth_csrf_token()) ?>">
        <button class="link-button" type="submit">Cerrar sesión</button>
      </form>
    </li>
  </ul>
</nav>

<main class="local-admin__container">
    <header class="local-page-heading">
      <div>
        <h1>Administración MySQL</h1>
      </div>
    </header>

    <?php if ($successMessage !== ''): ?><p class="local-alert local-alert--success" role="status"><?= h($successMessage) ?></p><?php endif; ?>
    <?php if ($errorMessage !== ''): ?><p class="local-alert local-alert--error" role="alert"><?= h($errorMessage) ?></p><?php endif; ?>

    <section class="local-stats" aria-label="Registros locales">
      <?php foreach ([
          'recipes' => 'Recetas',
          'blogs' => 'Artículos',
          'recipe_comments' => 'Comentarios de recetas',
          'blog_comments' => 'Comentarios del blog',
          'profiles' => 'Perfiles',
      ] as $key => $label): ?>
        <div class="local-stat"><strong><?= h($counts[$key] ?? 0) ?></strong><span><?= h($label) ?></span></div>
      <?php endforeach; ?>
    </section>

    <nav class="local-tabs" aria-label="Tablas locales">
      <?php foreach ([
          'recipes' => 'Recetas',
          'blogs' => 'Blog',
          'recipe_comments' => 'Comentarios de recetas',
          'blog_comments' => 'Comentarios del blog',
          'profiles' => 'Perfiles',
      ] as $key => $label): ?>
        <a class="<?= $section === $key ? 'is-active' : '' ?>" href="<?= h($basePath . '/admin-local.php?section=' . rawurlencode($key)) ?>"><?= h($label) ?></a>
      <?php endforeach; ?>
    </nav>

    <?php if ($section === 'recipes'): ?>
      <?php
      $recipeIngredients = $editingRecipe ? json_decode((string) $editingRecipe['ingredients'], true) : [];
      $recipeSteps = $editingRecipe ? json_decode((string) $editingRecipe['steps'], true) : [];
      ?>
      <section class="local-card">
        <h2><?= $editingRecipe ? 'Editar receta local' : 'Crear receta local' ?></h2>
        <form method="post" action="<?= h($basePath . '/admin-local.php?section=recipes') ?>" class="local-form local-form--grid">
          <input type="hidden" name="csrf_token" value="<?= h($_SESSION['csrf_token']) ?>">
          <input type="hidden" name="action" value="save_recipe">
          <input type="hidden" name="id" value="<?= h($editingRecipe['id'] ?? '') ?>">
          <label>Nombre<input name="name" required minlength="3" maxlength="100" value="<?= h($editingRecipe['name'] ?? '') ?>"></label>
          <label>Categoría<select name="category" required>
            <?php foreach (RECIPE_CATEGORIES_LOCAL as $category): ?>
              <option value="<?= h($category) ?>" <?= ($editingRecipe['category'] ?? RECIPE_CATEGORIES_LOCAL[0]) === $category ? 'selected' : '' ?>><?= h($category) ?></option>
            <?php endforeach; ?>
          </select></label>
          <label class="local-span-2">Descripción<textarea name="description" required minlength="10" maxlength="300" rows="3"><?= h($editingRecipe['description'] ?? '') ?></textarea></label>
          <label>Ingredientes (uno por línea)<textarea name="ingredients" required rows="7"><?= h(implode("\n", is_array($recipeIngredients) ? $recipeIngredients : [])) ?></textarea></label>
          <label>Preparación (un paso por línea)<textarea name="steps" required rows="7"><?= h(implode("\n", is_array($recipeSteps) ? $recipeSteps : [])) ?></textarea></label>
          <label>Tiempo<input name="prep_time" required maxlength="50" value="<?= h($editingRecipe['prep_time'] ?? '') ?>"></label>
          <label>Porciones<input name="servings" type="number" min="1" max="100" value="<?= h($editingRecipe['servings'] ?? 4) ?>" required></label>
          <label>Costo<input name="price" type="number" min="0" step="1" value="<?= h($editingRecipe['price'] ?? 0) ?>" required></label>
          <label>URL de imagen (opcional)<input name="image_url" type="url" value="<?= h($editingRecipe['image_url'] ?? '') ?>"></label>
          <div class="local-form__actions local-span-2">
            <button class="local-button" type="submit"><?= $editingRecipe ? 'Guardar cambios en MySQL' : 'Crear receta en MySQL' ?></button>
            <?php if ($editingRecipe): ?><a class="local-button local-button--secondary" href="<?= h($basePath . '/admin-local.php?section=recipes') ?>">Cancelar</a><?php endif; ?>
          </div>
        </form>
      </section>
      <section class="local-card">
        <h2>Recetas en MySQL (<?= h(count($recipes)) ?>)</h2>
        <?php if ($recipes === []): ?><p class="local-empty">No hay recetas locales. Crea una receta para comenzar.</p><?php else: ?>
          <div class="local-table-wrap"><table><thead><tr><th>Receta</th><th>Categoría</th><th>Autor</th><th>Acciones</th></tr></thead><tbody>
          <?php foreach ($recipes as $recipe): ?>
            <tr><td><strong><?= h($recipe['name']) ?></strong><small><?= h($recipe['description']) ?></small></td><td><?= h($recipe['category']) ?></td><td><?= h($recipe['author_name']) ?></td><td class="local-actions">
              <a class="local-button local-button--small local-button--secondary" href="<?= h($basePath . '/admin-local.php?section=recipes&edit_recipe=' . rawurlencode($recipe['id'])) ?>">Editar</a>
              <form method="post" action="<?= h($basePath . '/admin-local.php?section=recipes') ?>" onsubmit="return confirm('¿Borrar esta receta local?')">
                <input type="hidden" name="csrf_token" value="<?= h($_SESSION['csrf_token']) ?>"><input type="hidden" name="action" value="delete"><input type="hidden" name="entity" value="recipe"><input type="hidden" name="id" value="<?= h($recipe['id']) ?>">
                <button class="local-button local-button--small local-button--danger" type="submit">Borrar</button>
              </form>
            </td></tr>
          <?php endforeach; ?>
          </tbody></table></div>
        <?php endif; ?>
      </section>
    <?php elseif ($section === 'blogs'): ?>
      <?php $blogContent = $editingBlog ? json_decode((string) $editingBlog['content'], true) : []; ?>
      <section class="local-card">
        <h2><?= $editingBlog ? 'Editar artículo local' : 'Crear artículo local' ?></h2>
        <form method="post" action="<?= h($basePath . '/admin-local.php?section=blogs') ?>" class="local-form">
          <input type="hidden" name="csrf_token" value="<?= h($_SESSION['csrf_token']) ?>"><input type="hidden" name="action" value="save_blog"><input type="hidden" name="id" value="<?= h($editingBlog['id'] ?? '') ?>">
          <label>Título<input name="title" required minlength="5" maxlength="150" value="<?= h($editingBlog['title'] ?? '') ?>"></label>
          <label>Resumen<input name="subtitle" required minlength="5" maxlength="200" value="<?= h($editingBlog['subtitle'] ?? '') ?>"></label>
          <label>Categoría<input name="category" required minlength="2" maxlength="50" value="<?= h($editingBlog['category'] ?? '') ?>"></label>
          <label>Artículo (separa párrafos con una línea vacía)<textarea name="content" required rows="10"><?= h(implode("\n\n", is_array($blogContent) ? $blogContent : [])) ?></textarea></label>
          <label>Consejo destacado<textarea name="tip" required minlength="3" maxlength="1000" rows="3"><?= h($editingBlog['tip'] ?? '') ?></textarea></label>
          <div class="local-form__actions"><button class="local-button" type="submit"><?= $editingBlog ? 'Guardar cambios en MySQL' : 'Crear artículo en MySQL' ?></button>
            <?php if ($editingBlog): ?><a class="local-button local-button--secondary" href="<?= h($basePath . '/admin-local.php?section=blogs') ?>">Cancelar</a><?php endif; ?>
          </div>
        </form>
      </section>
      <section class="local-card">
        <h2>Artículos en MySQL (<?= h(count($blogs)) ?>)</h2>
        <?php if ($blogs === []): ?><p class="local-empty">No hay artículos locales. Crea un artículo para comenzar.</p><?php else: ?>
          <div class="local-table-wrap"><table><thead><tr><th>Artículo</th><th>Categoría</th><th>Autor</th><th>Acciones</th></tr></thead><tbody>
          <?php foreach ($blogs as $blog): ?>
            <tr><td><strong><?= h($blog['title']) ?></strong><small><?= h($blog['subtitle']) ?></small></td><td><?= h($blog['category']) ?></td><td><?= h($blog['author_name']) ?></td><td class="local-actions">
              <a class="local-button local-button--small local-button--secondary" href="<?= h($basePath . '/admin-local.php?section=blogs&edit_blog=' . rawurlencode($blog['id'])) ?>">Editar</a>
              <form method="post" action="<?= h($basePath . '/admin-local.php?section=blogs') ?>" onsubmit="return confirm('¿Borrar este artículo local y sus comentarios?')">
                <input type="hidden" name="csrf_token" value="<?= h($_SESSION['csrf_token']) ?>"><input type="hidden" name="action" value="delete"><input type="hidden" name="entity" value="blog"><input type="hidden" name="id" value="<?= h($blog['id']) ?>">
                <button class="local-button local-button--small local-button--danger" type="submit">Borrar</button>
              </form>
            </td></tr>
          <?php endforeach; ?>
          </tbody></table></div>
        <?php endif; ?>
      </section>
    <?php elseif ($section === 'recipe_comments' || $section === 'blog_comments'): ?>
      <?php $items = $section === 'recipe_comments' ? $recipeComments : $blogComments; $entity = $section === 'recipe_comments' ? 'recipe_comment' : 'blog_comment'; ?>
      <section class="local-card">
        <h2><?= $section === 'recipe_comments' ? 'Comentarios de recetas' : 'Comentarios del blog' ?> (<?= h(count($items)) ?>)</h2>
        <?php if ($items === []): ?><p class="local-empty">No hay comentarios locales.</p><?php else: ?>
          <div class="local-table-wrap"><table><thead><tr><th>Comentario</th><th>Autor</th><th>Fecha</th><th>Acciones</th></tr></thead><tbody>
          <?php foreach ($items as $comment): ?>
            <tr><td><strong><?= h($comment['post_title'] ?? ('Receta ' . $comment['recipe_id'])) ?></strong><small><?= h($comment['body']) ?></small></td><td><?= h($comment['author_name']) ?></td><td><?= h($comment['created_at']) ?></td><td>
              <form method="post" action="<?= h($basePath . '/admin-local.php?section=' . rawurlencode($section)) ?>" onsubmit="return confirm('¿Borrar este comentario local?')">
                <input type="hidden" name="csrf_token" value="<?= h($_SESSION['csrf_token']) ?>"><input type="hidden" name="action" value="delete"><input type="hidden" name="entity" value="<?= h($entity) ?>"><input type="hidden" name="id" value="<?= h($comment['id']) ?>">
                <button class="local-button local-button--small local-button--danger" type="submit">Borrar</button>
              </form>
            </td></tr>
          <?php endforeach; ?>
          </tbody></table></div>
        <?php endif; ?>
      </section>
    <?php else: ?>
      <section class="local-card">
        <h2>Perfiles en MySQL (<?= h(count($profiles)) ?>)</h2>
        <p class="local-help">Las cuentas del inicio de sesión local se guardan en la tabla users.</p>
        <?php if ($profiles === []): ?><p class="local-empty">No hay perfiles locales.</p><?php else: ?>
          <div class="local-table-wrap"><table><thead><tr><th>Identificador</th><th>Nombre</th><th>Creado</th><th>Actualizado</th></tr></thead><tbody>
          <?php foreach ($profiles as $profile): ?>
            <tr><td><?= h($profile['id']) ?></td><td><?= h($profile['display_name'] ?? '') ?></td><td><?= h($profile['created_at']) ?></td><td><?= h($profile['updated_at']) ?></td></tr>
          <?php endforeach; ?>
          </tbody></table></div>
        <?php endif; ?>
      </section>
    <?php endif; ?>
</main>
</body>
</html>
