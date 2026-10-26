import { useNavigate } from 'react-router';
import { RecipeCard } from '../components/RecipeCard';
import { PageHeader } from '../components/PageHeader';
import { PageFooter } from '../components/PageFooter';
import { getRecipesByCategory } from '../data/recipes';
import { PageSEO } from '../components/PageSEO';
import { getCategoryImageMeta } from '../data/recipeImages';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useRecipes } from '../context/RecipesContext';

interface CategoryPageProps {
  category: string;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const navigate = useNavigate();
  const { communityRecipes, communityRecipesError } = useRecipes();
  const recipes = [
    ...communityRecipes.filter((recipe) => recipe.category === category),
    ...getRecipesByCategory(category),
  ];
  const categoryImage = getCategoryImageMeta(category);

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title={`Recetas de ${category} | Cocina casera fácil`}
        description={`Explora recetas de ${category.toLowerCase()} sencillas, económicas y deliciosas. Ingredientes accesibles y paso a paso para cocinar en casa.`}
        path={`/category/${category}`}
      />
      <PageHeader
        title={`Recetas de ${category}`}
        subtitle={`Cocina casera de ${category.toLowerCase()} fácil y económica`}
      />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <ImageWithFallback
            src={categoryImage.src}
            alt={categoryImage.alt}
            loading="lazy"
            width={960}
            height={320}
            className="w-full max-h-56 sm:max-h-64 object-cover rounded-xl shadow-md mb-6"
          />
          <h2 className="text-xl sm:text-2xl text-green-800 mb-4 border-b-2 border-green-300 pb-2">
            Recetas de {category.toLowerCase()} disponibles
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Explora las recetas de {category.toLowerCase()} disponibles en el sitio.
            <br />
            Haz clic en cualquier receta para ver ingredientes y preparación.
          </p>
          {communityRecipesError && (
            <p role="status" className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              No se pudieron cargar las recetas de la comunidad. {communityRecipesError}
            </p>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <p className="text-gray-600 text-lg">No hay recetas disponibles en esta categoría</p>
          </div>
        )}
      </main>

      <PageFooter currentPage={`/category/${category}`} />
    </div>
  );
}
