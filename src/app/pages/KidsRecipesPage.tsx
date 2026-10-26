import { useNavigate } from 'react-router';
import { Baby } from 'lucide-react';
import { RecipeCard } from '../components/RecipeCard';
import { allRecipes } from '../data/recipes';
import { PageFooter } from '../components/PageFooter';
import { PageHeader } from '../components/PageHeader';
import { PageSEO } from '../components/PageSEO';

export function KidsRecipesPage() {
  const navigate = useNavigate();

  const kidsRecipes = allRecipes.filter(recipe =>
    recipe.id.startsWith('kids-')
  );

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title="Recetas para Niños | Cocina en familia"
        description="Recetas seguras y divertidas para cocinar con niños. Platos nutritivos, fáciles y pensados para toda la familia con supervisión adulta."
        path="/kids-recipes"
      />
      <PageHeader
        title="Recetas para Niños"
        subtitle="Recetas seguras y divertidas para los más pequeños"
      />

      <div className="container mx-auto px-4 py-8">
        <main>
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl text-green-800 mb-4 border-b-2 border-green-300 pb-2 flex items-center gap-2">
              <Baby className="w-6 h-6" aria-hidden="true" />
              Cocinando recetas sencillas con los niños
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Estas recetas están diseñadas para que niños y adultos cocinen juntos. Son seguras,
              nutritivas y divertidas. Fomentan la creatividad, el aprendizaje y el amor por la cocina
              desde temprana edad.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Supervisión adulta requerida:</strong> Todas estas recetas requieren la
                presencia de un adulto. Hemos evitado el uso de cuchillos afilados, hornos a altas
                temperaturas y estufas sin supervisión.
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kidsRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              />
            ))}
          </div>
        </main>
      </div>

      <PageFooter currentPage="/kids-recipes" />
    </div>
  );
}
