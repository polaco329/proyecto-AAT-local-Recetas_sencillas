import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Pencil, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { PageFooter } from '../components/PageFooter';
import { PageHeader } from '../components/PageHeader';
import { PageSEO } from '../components/PageSEO';
import { localApi } from '../lib/localApi';

const categories = ['Postres', 'Carnes', 'Vegano', 'Rápido', 'Desayuno', 'Merienda'];

interface CommunityRecipe {
  id: string;
  name: string;
  category: string;
  description: string;
  ingredients: string[];
  steps: string[];
  price: number;
  prep_time: string;
  servings: number;
  image_url: string | null;
  author_name: string;
  created_at: string;
}

interface RecipeForm {
  name: string;
  category: string;
  description: string;
  ingredients: string;
  steps: string;
  price: string;
  prepTime: string;
  servings: string;
  imageUrl: string;
}

const emptyForm: RecipeForm = {
  name: '',
  category: categories[0],
  description: '',
  ingredients: '',
  steps: '',
  price: '0',
  prepTime: '',
  servings: '4',
  imageUrl: '',
};

function splitLines(value: string) {
  return value.split('\n').map((line) => line.trim()).filter(Boolean);
}

function formFromRecipe(recipe: CommunityRecipe): RecipeForm {
  return {
    name: recipe.name,
    category: recipe.category,
    description: recipe.description,
    ingredients: recipe.ingredients.join('\n'),
    steps: recipe.steps.join('\n'),
    price: String(recipe.price),
    prepTime: recipe.prep_time,
    servings: String(recipe.servings),
    imageUrl: recipe.image_url ?? '',
  };
}

function validateForm(form: RecipeForm) {
  const ingredients = splitLines(form.ingredients);
  const steps = splitLines(form.steps);
  const price = Number(form.price);
  const servings = Number(form.servings);
  const imageUrl = form.imageUrl.trim();

  if (form.name.trim().length < 3 || form.name.trim().length > 100) {
    return 'El nombre debe tener entre 3 y 100 caracteres.';
  }
  if (!categories.includes(form.category)) {
    return 'Selecciona una categoría válida.';
  }
  if (form.description.trim().length < 10 || form.description.trim().length > 300) {
    return 'La descripción debe tener entre 10 y 300 caracteres.';
  }
  if (ingredients.length < 2 || ingredients.length > 30) {
    return 'Indica entre 2 y 30 ingredientes, uno por línea.';
  }
  if (steps.length < 2 || steps.length > 20) {
    return 'Indica entre 2 y 20 pasos, uno por línea.';
  }
  if (!Number.isInteger(price) || price < 0) {
    return 'El costo debe ser un número entero igual o mayor a cero.';
  }
  if (!Number.isInteger(servings) || servings < 1 || servings > 100) {
    return 'Las porciones deben ser un número entero entre 1 y 100.';
  }
  if (!form.prepTime.trim() || form.prepTime.trim().length > 50) {
    return 'Indica un tiempo de preparación de hasta 50 caracteres.';
  }
  if (imageUrl) {
    try {
      const url = new URL(imageUrl);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        return 'La imagen debe tener una dirección HTTP o HTTPS válida.';
      }
    } catch {
      return 'Ingresa una dirección de imagen válida.';
    }
  }
  return '';
}

export function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<CommunityRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [form, setForm] = useState<RecipeForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadRecipes = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await localApi<{ data: CommunityRecipe[] }>('content.php?resource=admin_recipes');
      setRecipes(result.data);
    } catch (error) {
      setErrorMessage(`No se pudieron cargar las recetas: ${error instanceof Error ? error.message : 'error inesperado.'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRecipes();
  }, [loadRecipes]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrorMessage('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');
    const validationError = validateForm(form);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    const values = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      ingredients: splitLines(form.ingredients),
      steps: splitLines(form.steps),
      price: Number(form.price),
      prep_time: form.prepTime.trim(),
      servings: Number(form.servings),
      image_url: form.imageUrl.trim() || null,
    };

    setIsSaving(true);
    try {
      const result = await localApi<{ data: CommunityRecipe }>(
        `content.php?resource=admin_recipes${editingId ? `&id=${encodeURIComponent(editingId)}` : ''}`,
        {
          method: editingId ? 'PATCH' : 'POST',
          body: values,
        },
      );
      const savedRecipe = result.data;
      setRecipes((current) => editingId
        ? current.map((recipe) => recipe.id === savedRecipe.id ? savedRecipe : recipe)
        : [savedRecipe, ...current]);
      setStatusMessage(editingId ? 'La receta se actualizó correctamente.' : 'La receta se creó correctamente.');
      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      setErrorMessage(`No se pudo ${editingId ? 'actualizar' : 'crear'} la receta: ${error instanceof Error ? error.message : 'error inesperado.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (recipe: CommunityRecipe) => {
    if (!window.confirm(`¿Borrar "${recipe.name}"? También se eliminarán sus comentarios.`)) {
      return;
    }
    setErrorMessage('');
    setStatusMessage('');
    setDeletingId(recipe.id);
    try {
      await localApi(`content.php?resource=admin_recipes&id=${encodeURIComponent(recipe.id)}`, {
        method: 'DELETE',
        body: {},
      });

      setRecipes((current) => current.filter((item) => item.id !== recipe.id));
      if (editingId === recipe.id) {
        resetForm();
      }
      setStatusMessage('La receta se borró correctamente.');
    } catch (error) {
      setErrorMessage(`No se pudo borrar la receta: ${error instanceof Error ? error.message : 'error inesperado.'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const updateField = (field: keyof RecipeForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title="Administrar recetas"
        description="Panel privado para administrar las recetas de la comunidad."
        path="/admin/recetas"
        noIndex
      />
      <PageHeader
        title="Administrar recetas"
        subtitle="Panel privado de gestión de recetas de la comunidad"
      />

      <main className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:text-green-600">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al inicio
        </Link>

        <section className="rounded-2xl bg-white p-5 shadow-md sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-green-800">{editingId ? 'Editar receta' : 'Crear receta'}</h2>
              <p className="mt-1 text-sm text-gray-600">Gestiona las recetas compartidas en el sitio.</p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Cancelar
              </button>
            )}
          </div>

          <form onSubmit={(event) => void handleSubmit(event)} className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="admin-recipe-name" className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
              <input id="admin-recipe-name" required minLength={3} maxLength={100} value={form.name} onChange={(event) => updateField('name', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" />
            </div>
            <div>
              <label htmlFor="admin-recipe-category" className="mb-1 block text-sm font-medium text-gray-700">Categoría</label>
              <select id="admin-recipe-category" value={form.category} onChange={(event) => updateField('category', event.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100">
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="admin-recipe-description" className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
              <textarea id="admin-recipe-description" required minLength={10} maxLength={300} rows={3} value={form.description} onChange={(event) => updateField('description', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" />
            </div>
            <div>
              <label htmlFor="admin-recipe-ingredients" className="mb-1 block text-sm font-medium text-gray-700">Ingredientes (uno por línea)</label>
              <textarea id="admin-recipe-ingredients" required rows={6} value={form.ingredients} onChange={(event) => updateField('ingredients', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" />
            </div>
            <div>
              <label htmlFor="admin-recipe-steps" className="mb-1 block text-sm font-medium text-gray-700">Preparación (un paso por línea)</label>
              <textarea id="admin-recipe-steps" required rows={6} value={form.steps} onChange={(event) => updateField('steps', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" />
            </div>
            <div>
              <label htmlFor="admin-recipe-prep-time" className="mb-1 block text-sm font-medium text-gray-700">Tiempo de preparación</label>
              <input id="admin-recipe-prep-time" required maxLength={50} value={form.prepTime} onChange={(event) => updateField('prepTime', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" placeholder="Ej.: 45 min" />
            </div>
            <div>
              <label htmlFor="admin-recipe-servings" className="mb-1 block text-sm font-medium text-gray-700">Porciones</label>
              <input id="admin-recipe-servings" required type="number" min={1} max={100} step={1} value={form.servings} onChange={(event) => updateField('servings', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" />
            </div>
            <div>
              <label htmlFor="admin-recipe-price" className="mb-1 block text-sm font-medium text-gray-700">Costo aproximado ($)</label>
              <input id="admin-recipe-price" required type="number" min={0} step={1} value={form.price} onChange={(event) => updateField('price', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="admin-recipe-image" className="mb-1 block text-sm font-medium text-gray-700">URL de imagen (opcional)</label>
              <input id="admin-recipe-image" type="url" value={form.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" placeholder="https://..." />
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-wait disabled:opacity-60">
                {editingId ? <Save className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
                {isSaving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear receta'}
              </button>
            </div>
          </form>

          {errorMessage && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{errorMessage}</p>}
          {statusMessage && <p role="status" className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{statusMessage}</p>}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-md sm:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-green-800">Recetas existentes</h2>
              <p className="text-sm text-gray-600">{recipes.length} {recipes.length === 1 ? 'receta' : 'recetas'}</p>
            </div>
            <button type="button" onClick={() => void loadRecipes()} disabled={isLoading} className="inline-flex items-center gap-2 rounded-lg border border-green-700 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-100 disabled:opacity-60">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
              Actualizar
            </button>
          </div>

          {isLoading ? (
            <p role="status" className="py-8 text-center text-gray-600">Cargando recetas...</p>
          ) : recipes.length === 0 ? (
            <p className="py-8 text-center text-gray-600">Todavía no hay recetas para administrar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                    <th scope="col" className="px-3 py-3">Receta</th>
                    <th scope="col" className="px-3 py-3">Categoría</th>
                    <th scope="col" className="px-3 py-3">Autor</th>
                    <th scope="col" className="px-3 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.map((recipe) => (
                    <tr key={recipe.id} className="border-b border-gray-100 last:border-0">
                      <td className="max-w-sm px-3 py-4">
                        <p className="font-semibold text-gray-800">{recipe.name}</p>
                        <p className="mt-1 line-clamp-2 text-gray-600">{recipe.description}</p>
                      </td>
                      <td className="px-3 py-4 text-gray-700">{recipe.category}</td>
                      <td className="px-3 py-4 text-gray-700">{recipe.author_name}</td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-2">
                          <button type="button" disabled={isSaving || deletingId !== null} onClick={() => { setEditingId(recipe.id); setForm(formFromRecipe(recipe)); setErrorMessage(''); setStatusMessage(''); }} className="inline-flex items-center gap-1 rounded-lg border border-green-700 px-3 py-2 font-medium text-green-800 hover:bg-green-50 disabled:opacity-60" aria-label={`Editar ${recipe.name}`}>
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                            Editar
                          </button>
                          <button type="button" onClick={() => void handleDelete(recipe)} disabled={isSaving || deletingId !== null} className="inline-flex items-center gap-1 rounded-lg border border-red-300 px-3 py-2 font-medium text-red-700 hover:bg-red-50 disabled:opacity-60" aria-label={`Borrar ${recipe.name}`}>
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            {deletingId === recipe.id ? 'Borrando...' : 'Borrar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <PageFooter />
    </div>
  );
}
