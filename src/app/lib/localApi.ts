let csrfToken = '';

export interface LocalApiUser {
  id: string;
  email: string;
  role: 'admin' | 'usuario';
  user_metadata: { display_name: string };
}

interface LocalSession {
  user: LocalApiUser | null;
  csrfToken: string;
}

let sessionRequest: Promise<LocalSession> | null = null;

function apiUrl(path: string) {
  const basePath = (window.APP_BASE_PATH || '').replace(/\/$/, '');
  return `${basePath}/api/${path}`;
}

export function setCsrfToken(token: string) {
  csrfToken = token;
}

export function loadLocalSession() {
  if (!sessionRequest) {
    sessionRequest = fetch(apiUrl('auth.php?action=session'), {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    })
      .then(async (response) => {
        const session = await response.json() as Partial<LocalSession> & { error?: string };
        if (!response.ok) {
          throw new Error(session.error || 'No se pudo comprobar la sesión local.');
        }
        if (typeof session.csrfToken !== 'string' || session.csrfToken.length === 0) {
          throw new Error('El servidor local no devolvió un token de sesión válido.');
        }
        setCsrfToken(session.csrfToken);
        return { user: session.user ?? null, csrfToken: session.csrfToken };
      })
      .finally(() => {
        sessionRequest = null;
      });
  }
  return sessionRequest;
}

export async function localApi<T>(
  path: string,
  options: { method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'; body?: unknown } = {},
): Promise<T> {
  const method = options.method ?? 'GET';
  if (method !== 'GET' && csrfToken === '') {
    await loadLocalSession();
  }
  const send = (token: string) => fetch(apiUrl(path), {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(method === 'GET' ? {} : { 'X-CSRF-Token': token }),
    },
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
  });

  let response = await send(csrfToken);
  if (response.status === 419 && method !== 'GET') {
    const session = await loadLocalSession();
    response = await send(session.csrfToken);
  }

  const result = await response.json() as T & { error?: string };
  if (!response.ok) {
    throw new Error(result.error || `La solicitud falló (${response.status}).`);
  }
  return result;
}
