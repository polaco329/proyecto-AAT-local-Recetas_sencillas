import { useNavigate } from 'react-router';
import { Bookmark } from 'lucide-react';
import { RecipeCard } from '../components/RecipeCard';
import { useRecipes } from '../context/RecipesContext';
import { PageFooter } from '../components/PageFooter';
import { PageHeader } from '../components/PageHeader';
import { PageSEO } from '../components/PageSEO';

export function SavedRecipesPage() {
  const navigate = useNavigate();
  const { savedRecipes } = useRecipes();

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title="Recetas Guardadas | Tus favoritas"
        description="Accede a tus recetas sencillas guardadas. Organiza tus platos favoritos y cocínalos cuando quieras con ingredientes económicos."
        path="/saved-recipes"
      />
      <PageHeader
        title="Recetas Guardadas"
        subtitle="Tus recetas favoritas en un solo lugar"
      />

      <div className="container mx-auto px-4 py-8">
        <main>
          <section className="mb-6">
            <h2 className="text-xl text-green-800 mb-2 flex items-center gap-2 border-b border-green-200 pb-2">
              <Bookmark className="w-5 h-5" aria-hidden="true" />
              Mis recetas guardadas ({savedRecipes.length})
            </h2>
            <p className="text-gray-600 text-sm">
              Las recetas que guardas se sincronizan automáticamente durante tu sesión.
              Haz clic en cualquier receta para ver los detalles completos.
            </p>
          </section>

          {savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-md px-4">
              <div className="text-6xl mb-4" aria-hidden="true">📖</div>
              <h2 className="text-gray-800 mb-2">No tienes recetas guardadas</h2>
              <p className="text-gray-600">
                Explora las categorías y guarda tus recetas favoritas haciendo clic en el ícono de marcador.
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Explorar Recetas
              </button>
            </div>
          )}
        </main>
      </div>

      <PageFooter currentPage="/saved-recipes" />
    </div>
  );
}
