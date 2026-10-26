import { Recipe } from '../context/RecipesContext';

const CATEGORY_IMAGES: Record<string, { src: string; keyword: string }> = {
  Postres: {
    src: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=640&q=80',
    keyword: 'postre casero',
  },
  Carnes: {
    src: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=640&q=80',
    keyword: 'plato de carne',
  },
  Vegano: {
    src: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640&q=80',
    keyword: 'comida vegana',
  },
  Rápido: {
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=640&q=80',
    keyword: 'receta rápida',
  },
  Desayuno: {
    src: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=640&q=80',
    keyword: 'desayuno saludable',
  },
  Merienda: {
    src: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=640&q=80',
    keyword: 'merienda casera',
  },
};

export function getRecipeImageMeta(recipe: Recipe): { src: string; alt: string } {
  const categoryMeta = CATEGORY_IMAGES[recipe.category] ?? CATEGORY_IMAGES.Rápido;
  return {
    src: recipe.image ?? categoryMeta.src,
    alt: `${recipe.name} - ${categoryMeta.keyword} fácil y económica | Recetas Sencillas`,
  };
}

export function getCategoryImageMeta(category: string): { src: string; alt: string } {
  const categoryMeta = CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.Rápido;
  return {
    src: categoryMeta.src,
    alt: `Recetas de ${category.toLowerCase()} caseras y económicas - Recetas Sencillas`,
  };
}
