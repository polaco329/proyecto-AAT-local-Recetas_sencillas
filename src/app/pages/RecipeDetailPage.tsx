import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Clock, Users, DollarSign, Bookmark, Trash2 } from 'lucide-react';
import { allRecipes } from '../data/recipes';
import { useRecipes } from '../context/RecipesContext';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { PageFooter } from '../components/PageFooter';
import { PageSEO } from '../components/PageSEO';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getRecipeImageMeta } from '../data/recipeImages';
import { RecipeComments } from '../components/RecipeComments';

export function RecipeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    isRecipeSaved,
    saveRecipe,
    unsaveRecipe,
    communityRecipes,
    isLoadingCommunityRecipes,
    deleteCommunityRecipe,
  } = useRecipes();
  const { user } = useAuth();
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const recipe = allRecipes.find((r) => r.id === id) ?? communityRecipes.find((r) => r.id === id);

  if (!recipe) {
    if (isLoadingCommunityRecipes) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-green-50 px-4 text-green-800">
          <p role="status">Cargando receta...</p>
        </main>
      );
    }
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
        <PageSEO
          title="Receta no encontrada"
          description="La receta que buscas no existe. Explora nuestras recetas sencillas y económicas."
          path={`/recipe/${id}`}
          noIndex
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Receta no encontrada</h1>
          <button
            onClick={() => navigate('/')}
            className="text-green-600 hover:text-green-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const saved = isRecipeSaved(recipe.id);
  const { src, alt } = getRecipeImageMeta(recipe);

  const handleSave = () => {
    if (saved) {
      unsaveRecipe(recipe.id);
    } else {
      saveRecipe(recipe);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Seguro que quieres borrar "${recipe.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeleteError('');
    setIsDeleting(true);
    try {
      await deleteCommunityRecipe(recipe.id);
      navigate('/publish-recipe', { replace: true });
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'No se pudo borrar la receta.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title={`${recipe.name} | Receta de ${recipe.category}`}
        description={`Aprende a preparar ${recipe.name}: ${recipe.description}. Tiempo ${recipe.prepTime}, ${recipe.servings} porciones. Receta sencilla y económica.`}
        path={`/recipe/${recipe.id}`}
      />
      <PageHeader
        title={recipe.name}
        subtitle={`Receta sencilla de ${recipe.category.toLowerCase()} · ${recipe.prepTime}`}
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          <ImageWithFallback
            src={src}
            alt={alt}
            loading="eager"
            width={960}
            height={480}
            className="w-full h-48 sm:h-64 md:h-80 object-cover"
          />
          <div className="p-4 sm:p-8">
            <div className="mb-6 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3">
                  {recipe.category}
                </span>
                <p className="text-base sm:text-lg text-gray-600">{recipe.description}</p>
                {recipe.authorName && (
                  <p className="mt-2 text-sm text-gray-500">Compartida por {recipe.authorName}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2 self-end sm:self-start">
                {recipe.userId === user?.id && (
                  <button
                    type="button"
                    onClick={() => void handleDelete()}
                    disabled={isDeleting}
                    aria-label={`Borrar receta ${recipe.name}`}
                    className="rounded-full bg-red-100 p-3 text-red-700 transition-colors hover:bg-red-200 disabled:opacity-60"
                  >
                    <Trash2 className="h-6 w-6" aria-hidden="true" />
                  </button>
                )}
                <button
                  onClick={handleSave}
                  aria-label={saved ? 'Quitar de guardadas' : 'Guardar receta'}
                  className={`rounded-full p-3 transition-all ${
                    saved ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                  }`}
                >
                  <Bookmark className={`h-6 w-6 ${saved ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
            {deleteError && <p role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{deleteError}</p>}

            <div className="flex flex-wrap gap-4 sm:gap-6 mb-8 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" aria-hidden="true" />
                <span className="text-gray-700">
                  <strong>Tiempo:</strong> {recipe.prepTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" aria-hidden="true" />
                <span className="text-gray-700">
                  <strong>Porciones:</strong> {recipe.servings}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" aria-hidden="true" />
                <span className="text-gray-700">
                  <strong>Costo aprox:</strong> ${recipe.price}
                </span>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Ingredientes de {recipe.name}</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-600 mt-1" aria-hidden="true">•</span>
                    <p className="text-gray-700">{ingredient}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Preparación paso a paso</h2>
              <ol className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </article>
        <RecipeComments recipeId={recipe.id} />
      </main>

      <PageFooter currentPage={`/recipe/${recipe.id}`} />
    </div>
  );
}
