import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ChefHat, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { PageSEO } from '../components/PageSEO';
import { useAuth } from '../context/AuthContext';

type AuthField = 'name' | 'email' | 'password' | 'confirmPassword' | 'acceptedTerms';
type AuthErrors = Partial<Record<AuthField, string>>;

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, signIn, signUp, sessionError } = useAuth();
  const redirectPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
  const postAuthPath = redirectPath?.startsWith('/') && !redirectPath.startsWith('//')
    ? redirectPath
    : '/account';
  const isRegistering = location.pathname.endsWith('/register');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });
  const [errors, setErrors] = useState<AuthErrors>({});
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (user) {
      navigate(postAuthPath, { replace: true });
    }
  }, [navigate, postAuthPath, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: AuthErrors = {};

    if (isRegistering && !formData.name.trim()) {
      nextErrors.name = 'Ingresa tu nombre.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Ingresa un correo electrónico válido.';
    }
    if (isRegistering && (formData.password.length < 12 || new TextEncoder().encode(formData.password).length > 72)) {
      nextErrors.password = 'La contraseña debe tener entre 12 y 72 bytes.';
    }
    if (!isRegistering && !formData.password) {
      nextErrors.password = 'Ingresa tu contraseña.';
    }
    if (isRegistering && formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }
    if (isRegistering && !formData.acceptedTerms) {
      nextErrors.acceptedTerms = 'Debes aceptar los términos para continuar.';
    }

    setErrors(nextErrors);
    setAuthError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (isRegistering) {
        await signUp(formData.name.trim(), formData.email.trim(), formData.password);
      } else {
        await signIn(formData.email.trim(), formData.password);
      }
      navigate(postAuthPath, { replace: true });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'No se pudo completar la solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeChange = (registering: boolean) => {
    setErrors({});
    setAuthError('');
    navigate(registering ? '/register' : '/login');
  };

  const handleFieldChange = (field: AuthField, value: string | boolean) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setAuthError('');
  };

  const inputClassName =
    'w-full rounded-xl border border-emerald-100 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100';

  return (
    <div className="min-h-screen bg-[#f4faf5] px-4 py-8 sm:px-6">
      <PageSEO
        title={isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
        description="Inicia sesión o crea una cuenta en Recetas Sencillas."
        path={isRegistering ? '/register' : '/login'}
        noIndex
      />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(22,101,52,0.12)] md:grid-cols-2">
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 p-10 text-white md:flex">
            <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[32px] border-white/10" />
            <div aria-hidden="true" className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-lime-300/10" />
            <div className="relative py-12">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <ChefHat className="h-9 w-9" />
              </div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-100">Recetas Sencillas</p>
              <h1 className="mb-4 text-4xl font-bold leading-tight">Un lugar para disfrutar la cocina.</h1>
              <p className="max-w-sm leading-relaxed text-green-50">
                Inicia sesión para volver a tus recetas favoritas y descubrir nuevas ideas para compartir.
              </p>
            </div>
            <p className="relative text-sm text-green-100">Cocina casera, nutritiva y deliciosa.</p>
          </aside>

          <main className="px-6 py-8 sm:px-10 sm:py-12">
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold text-green-700">
                {isRegistering ? 'Únete a nuestra comunidad' : 'Qué bueno verte de nuevo'}
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {isRegistering ? 'Crea tu cuenta' : 'Inicia sesión'}
              </h2>
              <p className="mt-2 text-slate-500">
                {isRegistering
                  ? 'Guarda tus recetas preferidas y encuentra inspiración.'
                  : 'Ingresa tus datos para continuar.'}
              </p>
            </div>

            {sessionError && (
              <p role="alert" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
                {sessionError}
              </p>
            )}

            <div className="mb-7 grid grid-cols-2 rounded-xl bg-green-50 p-1" aria-label="Tipo de acceso">
              <button
                type="button"
                onClick={() => handleModeChange(false)}
                aria-current={!isRegistering ? 'page' : undefined}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  !isRegistering ? 'bg-white text-green-800 shadow-sm' : 'text-slate-500 hover:text-green-800'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => handleModeChange(true)}
                aria-current={isRegistering ? 'page' : undefined}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isRegistering ? 'bg-white text-green-800 shadow-sm' : 'text-slate-500 hover:text-green-800'
                }`}
              >
                Registrarse
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {isRegistering && (
                <div className="mb-5">
                  <label htmlFor="auth-name" className="mb-2 block text-sm font-semibold text-slate-700">
                    Nombre
                  </label>
                  <div className="relative">
                    <UserRound aria-hidden="true" className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="auth-name"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={(event) => handleFieldChange('name', event.target.value)}
                      placeholder="Tu nombre"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'auth-name-error' : undefined}
                      className={inputClassName}
                    />
                  </div>
                  {errors.name && <p id="auth-name-error" className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                </div>
              )}

              <div className="mb-5">
                <label htmlFor="auth-email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail aria-hidden="true" className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="auth-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(event) => handleFieldChange('email', event.target.value)}
                    placeholder="nombre@ejemplo.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'auth-email-error' : undefined}
                    className={inputClassName}
                  />
                </div>
                {errors.email && <p id="auth-email-error" className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="auth-password" className="text-sm font-semibold text-slate-700">
                    Contraseña
                  </label>
                  {isRegistering && <span className="text-xs text-slate-400">Mínimo 12 caracteres</span>}
                </div>
                <div className="relative">
                  <LockKeyhole aria-hidden="true" className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="auth-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isRegistering ? 'new-password' : 'current-password'}
                    value={formData.password}
                    onChange={(event) => handleFieldChange('password', event.target.value)}
                    placeholder={isRegistering ? 'Al menos 12 caracteres' : 'Tu contraseña'}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'auth-password-error' : undefined}
                    className={`${inputClassName} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:text-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
                  >
                    {showPassword ? <EyeOff aria-hidden="true" className="h-5 w-5" /> : <Eye aria-hidden="true" className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p id="auth-password-error" className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
              </div>

              {isRegistering && (
                <>
                  <div className="mb-5">
                    <label htmlFor="auth-confirm-password" className="mb-2 block text-sm font-semibold text-slate-700">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <LockKeyhole aria-hidden="true" className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        id="auth-confirm-password"
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={(event) => handleFieldChange('confirmPassword', event.target.value)}
                        placeholder="Repite tu contraseña"
                        aria-invalid={Boolean(errors.confirmPassword)}
                        aria-describedby={errors.confirmPassword ? 'auth-confirm-password-error' : undefined}
                        className={inputClassName}
                      />
                    </div>
                    {errors.confirmPassword && <p id="auth-confirm-password-error" className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>

                  <div className="mb-6">
                    <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                      <input
                        type="checkbox"
                        name="acceptedTerms"
                        checked={formData.acceptedTerms}
                        onChange={(event) => handleFieldChange('acceptedTerms', event.target.checked)}
                        aria-invalid={Boolean(errors.acceptedTerms)}
                        aria-describedby={errors.acceptedTerms ? 'auth-terms-error' : undefined}
                        className="mt-1 h-4 w-4 accent-green-700"
                      />
                      <span>Acepto los términos de uso y la política de privacidad.</span>
                    </label>
                    {errors.acceptedTerms && <p id="auth-terms-error" className="mt-1.5 text-sm text-red-600">{errors.acceptedTerms}</p>}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full rounded-xl bg-green-700 px-5 py-3.5 font-semibold text-white shadow-md shadow-green-900/10 transition hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-wait disabled:opacity-60"
              >
                {isLoading ? 'Verificando sesión...' : isSubmitting ? 'Conectando...' : isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
              {authError && (
                <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-relaxed text-red-800">
                  {authError}
                </p>
              )}
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              {isRegistering ? '¿Ya tienes una cuenta?' : '¿Todavía no tienes una cuenta?'}{' '}
              <button
                type="button"
                onClick={() => handleModeChange(!isRegistering)}
                className="font-semibold text-green-800 underline-offset-4 hover:underline"
              >
                {isRegistering ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
