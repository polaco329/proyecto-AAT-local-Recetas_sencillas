import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import { RecipeCard } from '../components/RecipeCard';
import { allRecipes } from '../data/recipes';
import { PageFooter } from '../components/PageFooter';
import { PageHeader } from '../components/PageHeader';
import { PageSEO } from '../components/PageSEO';
import { useRecipes } from '../context/RecipesContext';

export function AdvancedSearchPage() {
  const navigate = useNavigate();
  const { communityRecipes, communityRecipesError } = useRecipes();
  const [searchTerm, setSearchTerm] = useState(() => window.APP_FORM_STATE?.search?.term ?? '');
  const [selectedCategory, setSelectedCategory] = useState(() => window.APP_FORM_STATE?.search?.category ?? 'Todas');

  const categories = ['Todas', 'Postres', 'Carnes', 'Vegano', 'Rápido', 'Desayuno', 'Merienda'];

  const filteredRecipes = [...communityRecipes, ...allRecipes].filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some((ing) => ing.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'Todas' || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title="Búsqueda Avanzada de Recetas"
        description="Encuentra recetas sencillas por nombre, ingrediente o categoría. Busca postres, carnes, vegano, desayunos y más en segundos."
        path="/advanced-search"
      />
      <PageHeader
        title="Búsqueda Avanzada"
        subtitle="Encuentra recetas por nombre, ingrediente o categoría"
      />

      <div className="container mx-auto px-4 py-8">
        <main>
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl text-green-800 mb-4 border-b-2 border-green-300 pb-2">
              Filtrar recetas sencillas
            </h2>
          </section>

          <form
            method="get"
            action={`${window.APP_BASE_PATH || ''}/advanced-search`}
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8"
          >
            <div className="mb-4">
              <label htmlFor="search-recipes" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por nombre, ingrediente o descripción
              </label>
              <div className="relative">
                <input
                  id="search-recipes"
                  type="search"
                  name="q"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ej: chocolate, pollo, vegano..."
                  maxLength={120}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              {communityRecipesError && (
                <p role="status" className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  No se pudieron cargar las recetas de la comunidad. {communityRecipesError}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="search-category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  id="search-category"
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg bg-green-700 text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Buscar recetas
                </button>
              </div>
            </div>
          </form>

          <div className="mb-4">
            <p className="text-gray-600">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? 'receta encontrada' : 'recetas encontradas'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              />
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-md px-4">
              <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
              <h2 className="text-gray-800 mb-2">No se encontraron recetas</h2>
              <p className="text-gray-600">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </main>
      </div>
      <PageFooter currentPage="/advanced-search" />
    </div>
  );
}
