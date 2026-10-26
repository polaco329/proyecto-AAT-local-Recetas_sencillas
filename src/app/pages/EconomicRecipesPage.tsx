import { useNavigate } from 'react-router';
import { DollarSign } from 'lucide-react';
import { RecipeCard } from '../components/RecipeCard';
import { getEconomicRecipes } from '../data/recipes';
import { PageFooter } from '../components/PageFooter';
import { PageHeader } from '../components/PageHeader';
import { PageSEO } from '../components/PageSEO';
import { useRecipes } from '../context/RecipesContext';

export function EconomicRecipesPage() {
  const navigate = useNavigate();
  const { communityRecipes, communityRecipesError } = useRecipes();
  const recipes = [
    ...communityRecipes.filter((recipe) => recipe.price < 5000),
    ...getEconomicRecipes(),
  ];

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title="Recetas Económicas | Comer bien gastando poco"
        description="Recetas económicas por menos de $5.000 pesos. Platos deliciosos, nutritivos y accesibles para toda la familia en Salta, Argentina."
        path="/economic-recipes"
      />
      <PageHeader
        title="Recetas Económicas"
        subtitle="Recetas deliciosas por menos de $5.000 pesos"
      />

      <div className="container mx-auto px-4 py-8">
        <main>
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl text-green-800 mb-4 border-b-2 border-green-300 pb-2 flex items-center gap-2">
              <DollarSign className="w-6 h-6" aria-hidden="true" />
              Come bien sin gastar de más
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Todas las recetas en esta sección cuestan menos de <strong>$5.000 pesos argentinos</strong> por porción.
              Seleccionadas para garantizar sabor, nutrición y economía al mismo tiempo.
            </p>
            {communityRecipesError && (
              <p role="status" className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                No se pudieron cargar las recetas de la comunidad. {communityRecipesError}
              </p>
            )}
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              />
            ))}
          </div>

          {recipes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-600 text-lg">No hay recetas económicas disponibles</p>
            </div>
          )}
        </main>
      </div>

      <PageFooter currentPage="/economic-recipes" />
    </div>
  );
}
