import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, ChefHat, LogOut, Mail, UserRound } from 'lucide-react';
import { PageSEO } from '../components/PageSEO';
import { useAuth } from '../context/AuthContext';

export function AccountPage() {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const displayName = typeof user?.user_metadata?.display_name === 'string'
    ? user.user_metadata.display_name
    : '';

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setErrorMessage('');
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(`No se pudo cerrar la sesión: ${error instanceof Error ? error.message : 'error inesperado.'}`);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4faf5] px-4 py-10">
      <PageSEO
        title="Mi cuenta"
        description="Información de tu cuenta de Recetas Sencillas."
        path="/account"
        noIndex
      />
      <section className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-[0_24px_80px_rgba(22,101,52,0.12)] sm:p-10">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-green-800 hover:text-green-600">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-800">
          <ChefHat className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Mi cuenta</h1>

        {isLoading ? (
          <p role="status" className="mt-4 text-slate-600">Cargando tu sesión...</p>
        ) : user ? (
          <>
            <p className="mt-2 text-slate-600">Has iniciado sesión en Recetas Sencillas.</p>
            <dl className="my-7 space-y-4 rounded-2xl bg-green-50 p-5">
              {displayName && (
                <div className="flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-green-700" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Nombre</dt>
                    <dd className="font-medium text-slate-800">{displayName}</dd>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-700" aria-hidden="true" />
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Correo electrónico</dt>
                  <dd className="break-all font-medium text-slate-800">{user.email}</dd>
                </div>
              </div>
            </dl>
            {errorMessage && (
              <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {errorMessage}
              </p>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-wait disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {isSigningOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </button>
          </>
        ) : (
          <>
            <p className="mt-2 text-slate-600">Inicia sesión o crea una cuenta para acceder a tu perfil.</p>
            <Link
              to="/login"
              className="mt-7 inline-flex w-full justify-center rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              Iniciar sesión
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
