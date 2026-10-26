
  # Recetas sencillas

  Aplicación web de recetas construida con React y Vite. La pantalla que se sirve
  en producción local es `index.php`; Vite mantiene `index.html` como plantilla
  interna de compilación.

  ## Servidor local con XAMPP o Laragon

  1. Instala Node.js y las dependencias del proyecto:

    ```bash
    npm install
    ```

  2. Crea tu configuración local a partir de la plantilla si aún no tienes
     `.env`:

    ```powershell
    Copy-Item .env.example .env
    ```

  3. Genera los archivos JavaScript y CSS que utiliza PHP:

    ```bash
    npm run build
    ```

  4. Copia o clona esta carpeta dentro de la carpeta pública del servidor:

    - XAMPP: `C:\xampp\htdocs\cocina`
    - Laragon: `C:\laragon\www\cocina`

  5. Inicia Apache desde XAMPP o Laragon y abre:
    `http://localhost/cocina/`

  El archivo `.htaccess` redirige las rutas de React, como
  `/recipe/...` o `/category/...`, a `index.php` sin producir errores 404.
  El shell común de PHP está en `includes/`; `header.php` obtiene el título
  desde `$titulo_pagina`, definido para la ruta actual en `index.php`. Los datos
  locales se leen de `.env`, que Git ignora; `.env.example` es la plantilla
  que se conserva en el repositorio.

  ## Autenticación y contenido local

  El inicio de sesión de toda la aplicación usa las cuentas locales de
  `recetas_sencillas.users`; el cliente React ya no autentica ni consulta
  contenido mediante Supabase. `/login` y `/register` son las rutas públicas
  y el resto de la aplicación requiere una sesión PHP activa. El registro
  asigna siempre el rol `usuario`; las operaciones administrativas consultan
  el rol actual directamente en MySQL.

  `includes/auth_guard.php` configura cookies `HttpOnly`, `SameSite=Lax` y
  `Secure` bajo HTTPS. PHP regenera el ID de sesión al autenticar. Las
  solicitudes de escritura desde React usan token CSRF; los endpoints de
  `api/` validan sesión, rol, entradas y permisos de propietario en el
  servidor. Todas las consultas de datos usan PDO y parámetros preparados.

  Las páginas `/publish-recipe`, `/blog` y `/admin/recetas` leen y modifican
  las tablas locales `community_recipes`, `recipe_comments`, `blog_posts` y
  `blog_comments`. Las personas autenticadas pueden publicar recetas,
  artículos y comentarios; cada persona administra sus propios comentarios y
  recetas. Solo `admin` puede editar o borrar recetas, editar o borrar
  artículos y moderar comentarios.
  El contenido ya almacenado en MySQL se conserva.

  ## Autenticación local en PHP y MySQL

  El módulo de autenticación para XAMPP/Laragon incluye:
  `/registro.php`, `/login.php`, `/dashboard.php` y `/admin_panel.php`. El
  inicio y la aplicación React comparten esta sesión y tabla; las cuentas y
  contraseñas locales se guardan únicamente en `recetas_sencillas.users`.

  La tabla `users` también se incluye en `database/mysql/schema.sql`. Si ya
  creaste la base local, aplica la migración idempotente desde la carpeta
  `cocina`:

  ```powershell
  cmd /c "C:\xampp\mysql\bin\mysql.exe -u root recetas_sencillas < database\mysql\20261026_create_local_users.sql"
  ```

  Los registros públicos reciben siempre el rol `usuario`; nunca se acepta el
  rol desde el formulario. Para provisionar la primera cuenta administradora,
  configura `MYSQL_ADMIN_EMAIL`, `MYSQL_ADMIN_NAME` y
  `MYSQL_ADMIN_PASSWORD` en `.env` o como variables de entorno del proceso
  (usa preferentemente una contraseña nueva, única y de al menos 12
  caracteres), y ejecuta una sola vez:

  ```powershell
  & 'C:\xampp\php\php.exe' database\mysql\bootstrap_admin.php
  ```

  El script es solo para CLI, crea un administrador únicamente si ese correo
  todavía no existe y guarda la contraseña con `password_hash()` y bcrypt.
  Ejecútalo antes de registrar públicamente el mismo correo: no promueve una
  cuenta ya existente. Acepta contraseñas de 8 a 72 bytes solo para permitir
  provisionar una clave indicada por el docente; las contraseñas de registro
  siguen exigiendo al menos 12 caracteres.
  Después de usarlo, elimina `MYSQL_ADMIN_PASSWORD` de `.env`. En
  `.env.example` la contraseña queda vacía: configúrala solo en el archivo local
  y nunca publiques tu contraseña.

  Las contraseñas de registro tienen un mínimo de 12 caracteres y se verifican
  con `password_verify()`. Las sesiones PHP regeneran su ID al autenticar,
  usan cookies `HttpOnly` y `SameSite=Lax` (y `Secure` bajo HTTPS); los
  formularios POST incluyen token CSRF. `auth_guard.php` protege el dashboard
  para usuarios autenticados y vuelve a consultar el rol actual en MySQL;
  `/admin_panel.php` requiere rol `admin`. La opción de cerrar sesión invalida
  la sesión y su cookie. Las páginas PHP y la aplicación React utilizan la
  misma autenticación local; Supabase ya no forma parte del inicio de sesión
  ni de las operaciones del sitio.

  ## CRUD local en MySQL (XAMPP)

  El panel `/admin-local.php` ofrece administración local de recetas de la
  comunidad y artículos del blog, además de lectura/moderación de comentarios
  y perfiles. El acceso se protege con el rol `admin` de la autenticación
  local PHP/MySQL. Inicia sesión en `/login.php`, abre **Administrar usuarios**
  desde `/dashboard.php` y luego elige **Administrar recetas y blog**.

  1. Inicia Apache y MySQL desde el panel de XAMPP. En Laragon, inicia Apache y
     MySQL/MariaDB.
  2. Crea la base y sus tablas ejecutando `database/mysql/schema.sql` desde
     phpMyAdmin o desde la terminal:

     ```powershell
     cmd /c "C:\xampp\mysql\bin\mysql.exe -u root < database\mysql\schema.sql"
     ```

     Si MySQL tiene contraseña, añade `-p` al comando y escríbela cuando se
     solicite.
  3. Completa en `.env` las variables `MYSQL_HOST`, `MYSQL_PORT`,
     `MYSQL_DATABASE`, `MYSQL_USER` y `MYSQL_PASSWORD`.
  4. Coloca la carpeta `cocina` dentro de `C:\xampp\htdocs\cocina` (o
     `C:\laragon\www\cocina`) y abre `http://localhost/cocina/`.

  El CRUD usa PDO, sentencias preparadas, protección CSRF y escape de salida
  HTML. Sus operaciones son exclusivamente locales; las tablas de recetas y
  blog se pueden revisar en phpMyAdmin, junto con las cuentas en `users`.

  ## Desarrollo

  Para trabajar con recarga automática:

  ```bash
  npm run dev
  ```
  
