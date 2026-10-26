import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { loadLocalSession, localApi, setCsrfToken, type LocalApiUser } from '../lib/localApi';

export type LocalUser = LocalApiUser;

interface AuthContextValue {
  user: LocalUser | null;
  isLoading: boolean;
  sessionError: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const authChangeVersion = useRef(0);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('local-auth-state', {
      detail: { authenticated: user !== null },
    }));
  }, [user]);

  useEffect(() => {
    let mounted = true;
    const versionAtRequest = authChangeVersion.current;
    loadLocalSession()
      .then((session) => {
        if (mounted && authChangeVersion.current === versionAtRequest) {
          setUser(session.user);
        }
      })
      .catch(() => {
        if (mounted && authChangeVersion.current === versionAtRequest) {
          setUser(null);
          setSessionError('No se pudo verificar la sesión local. Comprueba que PHP y MySQL estén disponibles.');
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    authChangeVersion.current += 1;
    const result = await localApi<{ user: LocalUser; csrfToken: string }>('auth.php?action=login', {
      method: 'POST',
      body: { email, password },
    });
    setCsrfToken(result.csrfToken);
    setUser(result.user);
    setSessionError('');
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    authChangeVersion.current += 1;
    const result = await localApi<{ user: LocalUser; csrfToken: string }>('auth.php?action=register', {
      method: 'POST',
      body: { name, email, password },
    });
    setCsrfToken(result.csrfToken);
    setUser(result.user);
    setSessionError('');
  }, []);

  const signOut = useCallback(async () => {
    authChangeVersion.current += 1;
    await localApi<{ ok: true }>('auth.php?action=logout', { method: 'POST', body: {} });
    setUser(null);
    setCsrfToken('');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, sessionError, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
