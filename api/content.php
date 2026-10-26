<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$user = api_require_user();
$pdo = auth_db();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$resource = $_GET['resource'] ?? '';
$id = $_GET['id'] ?? '';
$parentId = $_GET['parent_id'] ?? '';

if (!is_string($resource)) {
    api_json(['error' => 'Recurso inválido.'], 400);
}

if ($method === 'GET') {
    if ($resource === 'community_recipes' || $resource === 'admin_recipes') {
        if ($resource === 'admin_recipes') {
            api_require_admin($user);
        }
        $statement = $pdo->prepare('SELECT * FROM community_recipes ORDER BY created_at DESC');
        $statement->execute();
        $rows = $statement->fetchAll();
        foreach ($rows as &$row) {
            $row['ingredients'] = json_decode((string) $row['ingredients'], true) ?: [];
            $row['steps'] = json_decode((string) $row['steps'], true) ?: [];
            $row['price'] = (int) $row['price'];
            $row['servings'] = (int) $row['servings'];
        }
        unset($row);
        api_json(['data' => $rows]);
    }

    if ($resource === 'blog_posts') {
        $statement = $pdo->prepare('SELECT id, title, subtitle, category, author_name, content, tip, created_at FROM blog_posts ORDER BY created_at DESC');
        $statement->execute();
        $rows = $statement->fetchAll();
        foreach ($rows as &$row) {
            $row['content'] = json_decode((string) $row['content'], true) ?: [];
        }
        unset($row);
        api_json(['data' => $rows]);
    }

    if ($resource === 'recipe_comments' || $resource === 'blog_comments') {
        if (!is_string($parentId) || $parentId === '') {
            api_json(['error' => 'Falta el identificador del contenido.'], 400);
        }
        if ($resource === 'recipe_comments') {
            $statement = $pdo->prepare(
                'SELECT id, user_id, body, author_name, created_at FROM recipe_comments WHERE recipe_id = ? ORDER BY created_at DESC'
            );
        } else {
            $statement = $pdo->prepare(
                'SELECT id, user_id, author_name, body, created_at FROM blog_comments WHERE post_id = ? ORDER BY created_at DESC'
            );
        }
        $statement->execute([$parentId]);
        api_json(['data' => $statement->fetchAll()]);
    }
    api_json(['error' => 'Recurso no encontrado.'], 404);
}

if ($method !== 'POST' && $method !== 'PATCH' && $method !== 'DELETE') {
    api_json(['error' => 'Método no permitido.'], 405);
}
api_csrf_guard();
$data = api_request_body();

if ($resource === 'community_recipes' || $resource === 'admin_recipes') {
    $isAdmin = ($user['role'] ?? '') === 'admin';
    if ($resource === 'admin_recipes') {
        api_require_admin($user);
    }
    if ($method === 'POST') {
        $name = api_text($data, 'name', 100);
        $category = api_text($data, 'category', 30);
        if (!in_array($category, ['Postres', 'Carnes', 'Vegano', 'Rápido', 'Desayuno', 'Merienda'], true)) {
            api_json(['error' => 'Selecciona una categoría válida.'], 422);
        }
        $description = api_text($data, 'description', 300);
        $ingredients = $data['ingredients'] ?? null;
        $steps = $data['steps'] ?? null;
        $price = filter_var($data['price'] ?? null, FILTER_VALIDATE_INT);
        $servings = filter_var($data['servings'] ?? null, FILTER_VALIDATE_INT);
        $prepTime = api_text($data, 'prep_time', 50);
        $imageUrl = $data['image_url'] ?? null;
        if (!is_array($ingredients) || count($ingredients) < 2 || count($ingredients) > 30
            || !is_array($steps) || count($steps) < 2 || count($steps) > 20
            || $price === false || $price < 0 || $servings === false || $servings < 1 || $servings > 100
            || ($imageUrl !== null && (!is_string($imageUrl) || ($imageUrl !== '' && (
                !filter_var($imageUrl, FILTER_VALIDATE_URL)
                || !in_array(strtolower((string) parse_url($imageUrl, PHP_URL_SCHEME)), ['http', 'https'], true)
            ))))) {
            api_json(['error' => 'Revisa los ingredientes, pasos, costo, porciones y URL de imagen.'], 422);
        }
        $id = api_uuid();
        $statement = $pdo->prepare(
            'INSERT INTO community_recipes (id, user_id, author_name, name, category, description, ingredients, steps, price, prep_time, servings, image_url) '
            . 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $statement->execute([
            $id,
            $user['id'],
            $user['user_metadata']['display_name'],
            $name,
            $category,
            $description,
            json_encode($ingredients, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
            json_encode($steps, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
            $price,
            $prepTime,
            $servings,
            $imageUrl === '' ? null : $imageUrl,
        ]);
        $_GET['id'] = $id;
        api_json(['data' => api_recipe_by_id($pdo, $id)], 201);
    }
    if ($method === 'PATCH' && $resource === 'admin_recipes') {
        $recipeId = api_required_id($id);
        $category = api_text($data, 'category', 30);
        $ingredients = $data['ingredients'] ?? null;
        $steps = $data['steps'] ?? null;
        $price = filter_var($data['price'] ?? null, FILTER_VALIDATE_INT);
        $servings = filter_var($data['servings'] ?? null, FILTER_VALIDATE_INT);
        $imageUrl = $data['image_url'] ?? null;
        if (!in_array($category, ['Postres', 'Carnes', 'Vegano', 'Rápido', 'Desayuno', 'Merienda'], true)
            || !is_array($ingredients) || count($ingredients) < 2 || count($ingredients) > 30
            || !is_array($steps) || count($steps) < 2 || count($steps) > 20
            || $price === false || $price < 0 || $servings === false || $servings < 1 || $servings > 100
            || ($imageUrl !== null && (!is_string($imageUrl) || ($imageUrl !== '' && (
                !filter_var($imageUrl, FILTER_VALIDATE_URL)
                || !in_array(strtolower((string) parse_url($imageUrl, PHP_URL_SCHEME)), ['http', 'https'], true)
            ))))) {
            api_json(['error' => 'Revisa la categoría, ingredientes, pasos, costo, porciones y URL de imagen.'], 422);
        }
        $fields = [
            api_text($data, 'name', 100),
            $category,
            api_text($data, 'description', 300),
            json_encode($ingredients, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
            json_encode($steps, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
            $price,
            api_text($data, 'prep_time', 50),
            $servings,
            is_string($imageUrl) && $imageUrl !== '' ? $imageUrl : null,
        ];
        $statement = $pdo->prepare(
            'UPDATE community_recipes SET name = ?, category = ?, description = ?, ingredients = ?, steps = ?, price = ?, prep_time = ?, servings = ?, image_url = ? WHERE id = ?'
        );
        $statement->execute([...$fields, $recipeId]);
        api_json(['data' => api_recipe_by_id($pdo, $recipeId)]);
    }
    if ($method === 'DELETE') {
        $recipeId = api_required_id($id);
        $pdo->beginTransaction();
        $comments = $pdo->prepare('DELETE FROM recipe_comments WHERE recipe_id = ?');
        $comments->execute([$recipeId]);
        if (!$isAdmin) {
            $statement = $pdo->prepare('DELETE FROM community_recipes WHERE id = ? AND user_id = ?');
            $statement->execute([$recipeId, $user['id']]);
        } else {
            $statement = $pdo->prepare('DELETE FROM community_recipes WHERE id = ?');
            $statement->execute([$recipeId]);
        }
        if ($statement->rowCount() !== 1) {
            $pdo->rollBack();
            api_json(['error' => 'No se encontró una receta con permiso para borrar.'], 404);
        }
        $pdo->commit();
        api_json(['ok' => true]);
    }
    api_json(['error' => 'Método no permitido para recetas.'], 405);
}

if ($resource === 'blog_posts') {
    if ($method === 'POST') {
        $title = api_text($data, 'title', 150);
        $subtitle = api_text($data, 'subtitle', 200);
        $category = api_text($data, 'category', 50);
        $content = $data['content'] ?? null;
        $tip = api_text($data, 'tip', 1000);
        if (mb_strlen($title, 'UTF-8') < 5 || mb_strlen($subtitle, 'UTF-8') < 5
            || mb_strlen($category, 'UTF-8') < 2 || !is_array($content)
            || count($content) < 1 || count($content) > 30) {
            api_json(['error' => 'Revisa el título, resumen, categoría y contenido del artículo.'], 422);
        }
        foreach ($content as $paragraph) {
            if (!is_string($paragraph) || mb_strlen($paragraph, 'UTF-8') > 5000) {
                api_json(['error' => 'Cada párrafo admite hasta 5000 caracteres.'], 422);
            }
        }
        $contentJson = json_encode($content, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
        if ($method === 'POST') {
            $postId = api_uuid();
            $statement = $pdo->prepare(
                'INSERT INTO blog_posts (id, title, subtitle, category, author_name, content, tip) VALUES (?, ?, ?, ?, ?, ?, ?)'
            );
            $statement->execute([$postId, $title, $subtitle, $category, $user['user_metadata']['display_name'], $contentJson, $tip]);
        } else {
            api_require_admin($user);
            $postId = api_required_id($id);
            $statement = $pdo->prepare(
                'UPDATE blog_posts SET title = ?, subtitle = ?, category = ?, content = ?, tip = ? WHERE id = ?'
            );
            $statement->execute([$title, $subtitle, $category, $contentJson, $tip, $postId]);
        }
        $statement = $pdo->prepare('SELECT id, title, subtitle, category, author_name, content, tip, created_at FROM blog_posts WHERE id = ?');
        $statement->execute([$postId]);
        $post = $statement->fetch();
        if (!is_array($post)) {
            api_json(['error' => 'No se encontró el artículo guardado.'], 404);
        }
        $post['content'] = json_decode((string) $post['content'], true) ?: [];
        api_json(['data' => $post], $method === 'POST' ? 201 : 200);
    }
    if ($method === 'DELETE') {
        api_require_admin($user);
        $postId = api_required_id($id);
        $statement = $pdo->prepare('DELETE FROM blog_posts WHERE id = ?');
        $statement->execute([$postId]);
        if ($statement->rowCount() !== 1) {
            api_json(['error' => 'No se encontró el artículo para borrar.'], 404);
        }
        api_json(['ok' => true]);
    }
}

if ($resource === 'recipe_comments' || $resource === 'blog_comments') {
    $isRecipeComment = $resource === 'recipe_comments';
    $table = $isRecipeComment ? 'recipe_comments' : 'blog_comments';
    $parentColumn = $isRecipeComment ? 'recipe_id' : 'post_id';
    if ($method === 'POST') {
        $parent = api_text($data, $parentColumn, 100);
        $body = api_text($data, 'body', 1000);
        $commentId = api_uuid();
        $statement = $pdo->prepare(
            "INSERT INTO {$table} (id, {$parentColumn}, user_id, author_name, body) VALUES (?, ?, ?, ?, ?)"
        );
        $statement->execute([$commentId, $parent, $user['id'], $user['user_metadata']['display_name'], $body]);
        $statement = $pdo->prepare(
            "SELECT id, user_id, author_name, body, created_at FROM {$table} WHERE id = ?"
        );
        $statement->execute([$commentId]);
        api_json(['data' => $statement->fetch()], 201);
    }
    $commentId = api_required_id($id);
    $isAdmin = ($user['role'] ?? '') === 'admin';
    if ($method === 'PATCH') {
        $body = api_text($data, 'body', 1000);
        if ($isAdmin && !$isRecipeComment) {
            $statement = $pdo->prepare("UPDATE {$table} SET body = ? WHERE id = ?");
            $statement->execute([$body, $commentId]);
        } else {
            $statement = $pdo->prepare("UPDATE {$table} SET body = ? WHERE id = ? AND user_id = ?");
            $statement->execute([$body, $commentId, $user['id']]);
        }
    } else {
        if ($method !== 'DELETE') {
            api_json(['error' => 'Método no permitido para comentarios.'], 405);
        }
        if ($isAdmin) {
            $statement = $pdo->prepare("DELETE FROM {$table} WHERE id = ?");
            $statement->execute([$commentId]);
        } else {
            $statement = $pdo->prepare("DELETE FROM {$table} WHERE id = ? AND user_id = ?");
            $statement->execute([$commentId, $user['id']]);
        }
    }
    if ($statement->rowCount() !== 1) {
        api_json(['error' => 'No se encontró un comentario con permiso para modificar.'], 404);
    }
    api_json(['ok' => true]);
}

api_json(['error' => 'Recurso no encontrado.'], 404);

function api_required_id(mixed $id): string
{
    if (!is_string($id) || !preg_match('/^[0-9a-f-]{36}$/i', $id)) {
        api_json(['error' => 'Identificador inválido.'], 400);
    }
    return $id;
}

function api_recipe_by_id(PDO $pdo, string $id): array
{
    $statement = $pdo->prepare('SELECT * FROM community_recipes WHERE id = ?');
    $statement->execute([$id]);
    $recipe = $statement->fetch();
    if (!is_array($recipe)) {
        api_json(['error' => 'No se encontró la receta guardada.'], 404);
    }
    $recipe['ingredients'] = json_decode((string) $recipe['ingredients'], true) ?: [];
    $recipe['steps'] = json_decode((string) $recipe['steps'], true) ?: [];
    $recipe['price'] = (int) $recipe['price'];
    $recipe['servings'] = (int) $recipe['servings'];
    return $recipe;
}
