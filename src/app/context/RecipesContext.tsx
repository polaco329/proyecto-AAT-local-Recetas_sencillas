import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { localApi } from '../lib/localApi';

export interface Recipe {
  id: string;
  name: string;
  category: string;
  description: string;
  ingredients: string[];
  steps: string[];
  price: number;
  prepTime: string;
  servings: number;
  image?: string;
  authorName?: string;
  createdAt?: string;
  userId?: string;
}

export type NewCommunityRecipe = Omit<Recipe, 'id' | 'image' | 'authorName' | 'createdAt'>;

interface CommunityRecipeRow {
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
  user_id: string;
}

interface RecipesContextType {
  savedRecipes: Recipe[];
  communityRecipes: Recipe[];
  isLoadingCommunityRecipes: boolean;
  communityRecipesError: string;
  saveRecipe: (recipe: Recipe) => void;
  unsaveRecipe: (recipeId: string) => void;
  isRecipeSaved: (recipeId: string) => boolean;
  publishRecipe: (recipe: NewCommunityRecipe) => Promise<Recipe>;
  deleteCommunityRecipe: (recipeId: string) => Promise<void>;
  refreshCommunityRecipes: () => Promise<void>;
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

function mapCommunityRecipe(row: CommunityRecipeRow): Recipe {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    ingredients: row.ingredients,
    steps: row.steps,
    price: Number(row.price),
    prepTime: row.prep_time,
    servings: row.servings,
    image: row.image_url ?? undefined,
    authorName: row.author_name,
    createdAt: row.created_at,
    userId: row.user_id,
  };
}

export function RecipesProvider({ children }: { children: ReactNode }) {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [communityRecipes, setCommunityRecipes] = useState<Recipe[]>([]);
  const [isLoadingCommunityRecipes, setIsLoadingCommunityRecipes] = useState(true);
  const [communityRecipesError, setCommunityRecipesError] = useState('');
  const { user, isLoading: isAuthLoading } = useAuth();

  const refreshCommunityRecipes = useCallback(async () => {
    if (!user) {
      setCommunityRecipes([]);
      setCommunityRecipesError('');
      setIsLoadingCommunityRecipes(false);
      return;
    }

    setIsLoadingCommunityRecipes(true);
    setCommunityRecipesError('');
    try {
      const result = await localApi<{ data: CommunityRecipeRow[] }>('content.php?resource=community_recipes');
      setCommunityRecipes(result.data.map(mapCommunityRecipe));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ocurrió un error inesperado.';
      setCommunityRecipesError(`No se pudieron cargar las recetas de la comunidad: ${message}`);
    } finally {
      setIsLoadingCommunityRecipes(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    void refreshCommunityRecipes();
  }, [isAuthLoading, refreshCommunityRecipes]);

  const publishRecipe = async (recipe: NewCommunityRecipe) => {
    const result = await localApi<{ data: CommunityRecipeRow }>('content.php?resource=community_recipes', {
      method: 'POST',
      body: {
        name: recipe.name,
        category: recipe.category,
        description: recipe.description,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        price: recipe.price,
        prep_time: recipe.prepTime,
        servings: recipe.servings,
      },
    });

    const publishedRecipe = mapCommunityRecipe(result.data);
    setCommunityRecipes((current) => [publishedRecipe, ...current]);
    setCommunityRecipesError('');
    return publishedRecipe;
  };

  const deleteCommunityRecipe = async (recipeId: string) => {
    if (!user) {
      throw new Error('Debes iniciar sesión para borrar una receta.');
    }

    await localApi(`content.php?resource=community_recipes&id=${encodeURIComponent(recipeId)}`, {
      method: 'DELETE',
      body: {},
    });

    setCommunityRecipes((current) => current.filter((recipe) => recipe.id !== recipeId));
    setSavedRecipes((current) => current.filter((recipe) => recipe.id !== recipeId));
  };

  const saveRecipe = (recipe: Recipe) => {
    setSavedRecipes((prev) => {
      if (prev.find((r) => r.id === recipe.id)) {
        return prev;
      }
      return [...prev, recipe];
    });
  };

  const unsaveRecipe = (recipeId: string) => {
    setSavedRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  };

  const isRecipeSaved = (recipeId: string) => {
    return savedRecipes.some((r) => r.id === recipeId);
  };

  return (
    <RecipesContext.Provider value={{
      savedRecipes,
      communityRecipes,
      isLoadingCommunityRecipes,
      communityRecipesError,
      saveRecipe,
      unsaveRecipe,
      isRecipeSaved,
      publishRecipe,
      deleteCommunityRecipe,
      refreshCommunityRecipes,
    }}>
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error('useRecipes must be used within RecipesProvider');
  }
  return context;
}
