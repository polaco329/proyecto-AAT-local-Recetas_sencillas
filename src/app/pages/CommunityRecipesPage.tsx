import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, ChefHat, RefreshCw, Search } from 'lucide-react';
import { PageFooter } from '../components/PageFooter';
import { PageHeader } from '../components/PageHeader';
import { PageSEO } from '../components/PageSEO';
import { RecipeCard } from '../components/RecipeCard';
import { useRecipes, type NewCommunityRecipe } from '../context/RecipesContext';
import { useAuth } from '../context/AuthContext';

const categories = ['Postres', 'Carnes', 'Vegano', 'Rápido', 'Desayuno', 'Merienda'];

const initialForm = {
  name: '',
  category: categories[0],
  description: '',
  ingredients: '',
  steps: '',
  prepTime: '',
  servings: '4',
  price: '0',
};

function parseList(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function CommunityRecipesPage() {
  const navigate = useNavigate();
  const {
    communityRecipes,
    isLoadingCommunityRecipes,
    communityRecipesError,
    publishRecipe,
    refreshCommunityRecipes,
    deleteCommunityRecipe,
  } = useRecipes();
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [successRecipeId, setSuccessRecipeId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deletingRecipeId, setDeletingRecipeId] = useState('');
  const [recipeSearch, setRecipeSearch] = useState('');

  const handleDeleteRecipe = async (recipeId: string, recipeName: string) => {
    if (!window.confirm(`¿Seguro que quieres borrar "${recipeName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeleteError('');
    setDeletingRecipeId(recipeId);
    try {
      await deleteCommunityRecipe(recipeId);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'No se pudo borrar la receta.');
    } finally {
      setDeletingRecipeId('');
    }
  };

  const searchTerm = recipeSearch.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
  const filteredRecipes = communityRecipes.filter((recipe) => {
    const searchableText = [
      recipe.name,
      recipe.category,
      recipe.description,
      ...recipe.ingredients,
    ].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();

    return searchableText.includes(searchTerm);
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSuccessRecipeId('');

    const ingredients = parseList(form.ingredients);
    const steps = parseList(form.steps);
    const servings = Number(form.servings);
    const price = Number(form.price);

    if (form.name.trim().length < 3 || form.name.trim().length > 100) {
      setFormError('El nombre debe tener entre 3 y 100 caracteres.');
      return;
    }
    if (form.description.trim().length < 10 || form.description.trim().length > 300) {
      setFormError('La descripción debe tener entre 10 y 300 caracteres.');
      return;
    }
    if (ingredients.length < 2 || ingredients.length > 30) {
      setFormError('Escribe entre 2 y 30 ingredientes, uno por línea.');
      return;
    }
    if (steps.length < 2 || steps.length > 20) {
      setFormError('Escribe entre 2 y 20 pasos, uno por línea.');
      return;
    }
    if (!Number.isInteger(servings) || servings < 1 || servings > 100) {
      setFormError('Las porciones deben ser un número entero entre 1 y 100.');
      return;
    }
    if (!Number.isInteger(price) || price < 0) {
      setFormError('El costo aproximado debe ser un número entero igual o mayor a cero.');
      return;
    }
    if (!form.prepTime.trim() || form.prepTime.trim().length > 50) {
      setFormError('Indica un tiempo de preparación de hasta 50 caracteres.');
      return;
    }

    const recipe: NewCommunityRecipe = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      ingredients,
      steps,
      price,
      prepTime: form.prepTime.trim(),
      servings,
    };

    setIsSubmitting(true);
    try {
      const publishedRecipe = await publishRecipe(recipe);
      setForm(initialForm);
      setSuccessRecipeId(publishedRecipe.id);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo publicar la receta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title="Comparte tu receta"
        description="Publica tus recetas favoritas para compartirlas con la comunidad de Recetas Sencillas."
        path="/publish-recipe"
        noIndex
      />
      <PageHeader
        title="Recetas de la comunidad"
        subtitle="Comparte tus ideas y descubre lo que cocinan otras personas"
      />

      <main className="container mx-auto max-w-6xl px-4 py-8">
        <section className="mb-10 rounded-2xl bg-white p-5 shadow-md sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-xl bg-green-100 p-3 text-green-700">
              <ChefHat className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold text-green-800">Publica tu propia receta</h2>
              <p className="text-sm text-gray-600">Completa los datos y compártela con quienes también disfrutan cocinar.</p>
            </div>
          </div>

          <form onSubmit={(event) => void handleSubmit(event)} className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="community-recipe-name" className="mb-1 block text-sm font-medium text-gray-700">Nombre de la receta</label>
              <input
                id="community-recipe-name"
                required
                minLength={3}
                maxLength={100}
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                placeholder="Ej.: Tarta de verduras"
              />
            </div>

            <div>
              <label htmlFor="community-recipe-category" className="mb-1 block text-sm font-medium text-gray-700">Categoría</label>
              <select
                id="community-recipe-category"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
              >
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="community-recipe-description" className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                id="community-recipe-description"
                required
                minLength={10}
                maxLength={300}
                rows={3}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                placeholder="Cuéntanos cómo queda y por qué te gusta."
              />
            </div>

            <div>
              <label htmlFor="community-recipe-ingredients" className="mb-1 block text-sm font-medium text-gray-700">Ingredientes (uno por línea)</label>
              <textarea
                id="community-recipe-ingredients"
                required
                rows={6}
                value={form.ingredients}
                onChange={(event) => setForm({ ...form, ingredients: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                placeholder={'2 tazas de harina\n1 huevo\n...'}
              />
            </div>

            <div>
              <label htmlFor="community-recipe-steps" className="mb-1 block text-sm font-medium text-gray-700">Preparación (un paso por línea)</label>
              <textarea
                id="community-recipe-steps"
                required
                rows={6}
                value={form.steps}
                onChange={(event) => setForm({ ...form, steps: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                placeholder={'Precalienta el horno.\nMezcla los ingredientes...\n...'}
              />
            </div>

            <div>
              <label htmlFor="community-recipe-time" className="mb-1 block text-sm font-medium text-gray-700">Tiempo de preparación</label>
              <input
                id="community-recipe-time"
                required
                maxLength={50}
                value={form.prepTime}
                onChange={(event) => setForm({ ...form, prepTime: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                placeholder="Ej.: 45 min"
              />
            </div>

            <div>
              <label htmlFor="community-recipe-servings" className="mb-1 block text-sm font-medium text-gray-700">Porciones</label>
              <input
                id="community-recipe-servings"
                required
                type="number"
                min={1}
                max={100}
                step={1}
                value={form.servings}
                onChange={(event) => setForm({ ...form, servings: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label htmlFor="community-recipe-price" className="mb-1 block text-sm font-medium text-gray-700">Costo aproximado ($)</label>
              <input
                id="community-recipe-price"
                required
                type="number"
                min={0}
                step={1}
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="flex items-center md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-wait disabled:opacity-60"
              >
                <BookOpen className="h-5 w-5" aria-hidden="true" />
                {isSubmitting ? 'Publicando...' : 'Publicar receta'}
              </button>
            </div>
          </form>

          {formError && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{formError}</p>}
          {successRecipeId && (
            <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
              ¡Tu receta ya está publicada!{' '}
              <button type="button" onClick={() => navigate(`/recipe/${successRecipeId}`)} className="font-semibold underline">
                Ver receta
              </button>
            </p>
          )}
        </section>

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-green-800">Recetas compartidas</h2>
              <p className="text-sm text-gray-600">Publicaciones disponibles para la comunidad con sesión iniciada.</p>
            </div>
            <button
              type="button"
              onClick={() => void refreshCommunityRecipes()}
              disabled={isLoadingCommunityRecipes}
              className="inline-flex items-center gap-2 rounded-lg border border-green-700 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-100 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingCommunityRecipes ? 'animate-spin' : ''}`} aria-hidden="true" />
              Actualizar
            </button>
          </div>

          <form className="mb-5" role="search" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="community-recipe-search" className="mb-1 block text-sm font-medium text-gray-700">
              Buscar entre las recetas compartidas
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                id="community-recipe-search"
                type="search"
                value={recipeSearch}
                onChange={(event) => setRecipeSearch(event.target.value)}
                placeholder="Nombre, categoría, descripción o ingrediente..."
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>
          </form>
          <p className="mb-4 text-sm text-gray-600">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'receta encontrada' : 'recetas encontradas'}
          </p>

          {communityRecipesError && (
            <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {communityRecipesError} Si la migración todavía no está aplicada, ejecútala siguiendo las instrucciones del README.
            </p>
          )}
          {deleteError && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{deleteError}</p>}
          {isLoadingCommunityRecipes && <p role="status" className="py-6 text-center text-gray-600">Cargando recetas...</p>}

          {!isLoadingCommunityRecipes && filteredRecipes.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  onDelete={recipe.userId === user?.id && deletingRecipeId !== recipe.id
                    ? () => void handleDeleteRecipe(recipe.id, recipe.name)
                    : undefined}
                />
              ))}
            </div>
          )}
          {!isLoadingCommunityRecipes && !communityRecipesError && communityRecipes.length === 0 && (
            <div className="rounded-xl bg-white px-4 py-10 text-center shadow-sm">
              <p className="text-lg font-medium text-gray-800">Todavía no hay recetas de la comunidad.</p>
              <p className="mt-1 text-gray-600">¡Puedes ser la primera persona en compartir una!</p>
            </div>
          )}
          {!isLoadingCommunityRecipes && !communityRecipesError && communityRecipes.length > 0 && filteredRecipes.length === 0 && (
            <div className="rounded-xl bg-white px-4 py-10 text-center shadow-sm">
              <p className="text-lg font-medium text-gray-800">No encontramos recetas con esa búsqueda.</p>
              <p className="mt-1 text-gray-600">Prueba con otro nombre, categoría o ingrediente.</p>
            </div>
          )}
        </section>
      </main>

      <PageFooter currentPage="/publish-recipe" />
    </div>
  );
}
