import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useParams } from 'react-router';
import { RecipesProvider } from './context/RecipesContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { SavedRecipesPage } from './pages/SavedRecipesPage';
import { EconomicRecipesPage } from './pages/EconomicRecipesPage';
import { AdvancedSearchPage } from './pages/AdvancedSearchPage';
import { CookingTipsPage } from './pages/CookingTipsPage';
import { KidsRecipesPage } from './pages/KidsRecipesPage';
import { SupplierContactPage } from './pages/SupplierContactPage';
import { CoursePage } from './pages/CoursePage';
import { BlogPage } from './pages/BlogPage';
import { CVPage } from './pages/CVPage';
import { FAQPage } from './pages/FAQPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { LoginPage } from './pages/LoginPage';
import { AccountPage } from './pages/AccountPage';
import { CommunityRecipesPage } from './pages/CommunityRecipesPage';
import { AdminRecipesPage } from './pages/AdminRecipesPage';

declare global {
  interface Window {
    APP_BASE_PATH?: string;
    APP_FORM_STATE?: {
      search?: { term: string; category: string };
    };
  }
}

function CategoryPageWrapper() {
  const { category } = useParams<{ category: string }>();
  return <CategoryPage category={category || ''} />;
}

function RequireAuth() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-green-50 px-4 text-green-800">
        <p role="status">Verificando tu sesión...</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function RequireAdmin() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-green-50 px-4 text-green-800">
        <p role="status">Verificando tus permisos...</p>
      </main>
    );
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function AppShell() {
  useEffect(() => {
    document.documentElement.lang = 'es';
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-green-800"
      >
        Saltar al contenido principal
      </a>
      <div id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<RequireAdmin />}>
              <Route path="/admin/recetas" element={<AdminRecipesPage />} />
            </Route>
            <Route path="/" element={<HomePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/publish-recipe" element={<CommunityRecipesPage />} />
            <Route path="/category/:category" element={<CategoryPageWrapper />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/saved-recipes" element={<SavedRecipesPage />} />
            <Route path="/economic-recipes" element={<EconomicRecipesPage />} />
            <Route path="/advanced-search" element={<AdvancedSearchPage />} />
            <Route path="/cooking-tips" element={<CookingTipsPage />} />
            <Route path="/kids-recipes" element={<KidsRecipesPage />} />
            <Route path="/supplier-contact" element={<SupplierContactPage />} />
            <Route path="/curso" element={<CoursePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/cv" element={<CVPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/quienes-somos" element={<AboutUsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RecipesProvider>
        <BrowserRouter basename={window.APP_BASE_PATH || '/'}>
          <AppShell />
        </BrowserRouter>
      </RecipesProvider>
    </AuthProvider>
  );
}
