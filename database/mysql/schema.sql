CREATE DATABASE IF NOT EXISTS recetas_sencillas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE recetas_sencillas;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'usuario',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY users_email_unique (email),
  INDEX users_rol_idx (rol)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS profiles (
  id CHAR(36) NOT NULL PRIMARY KEY,
  display_name VARCHAR(120) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS community_recipes (
  id CHAR(36) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  author_name VARCHAR(120) NOT NULL,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(30) NOT NULL,
  description VARCHAR(300) NOT NULL,
  ingredients JSON NOT NULL,
  steps JSON NOT NULL,
  price INT UNSIGNED NOT NULL,
  prep_time VARCHAR(50) NOT NULL,
  servings SMALLINT UNSIGNED NOT NULL,
  image_url VARCHAR(2048) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX community_recipes_created_at_idx (created_at DESC),
  INDEX community_recipes_user_id_idx (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recipe_comments (
  id CHAR(36) NOT NULL PRIMARY KEY,
  recipe_id VARCHAR(100) NOT NULL,
  user_id CHAR(36) NOT NULL,
  author_name VARCHAR(120) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX recipe_comments_recipe_created_at_idx (recipe_id, created_at DESC),
  INDEX recipe_comments_user_id_idx (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blog_posts (
  id CHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  subtitle VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  author_name VARCHAR(120) NOT NULL,
  content JSON NOT NULL,
  tip VARCHAR(1000) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX blog_posts_created_at_idx (created_at DESC)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blog_comments (
  id CHAR(36) NOT NULL PRIMARY KEY,
  post_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  author_name VARCHAR(120) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX blog_comments_post_created_at_idx (post_id, created_at DESC),
  INDEX blog_comments_user_id_idx (user_id),
  CONSTRAINT blog_comments_post_id_fk
    FOREIGN KEY (post_id) REFERENCES blog_posts (id) ON DELETE CASCADE
) ENGINE=InnoDB;
