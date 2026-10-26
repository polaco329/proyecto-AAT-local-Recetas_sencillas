import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Calendar, Pencil, Plus, RefreshCw, Save, Tag, Trash2, User, X } from 'lucide-react';
import { PageFooter } from '../components/PageFooter';
import { PageHeader } from '../components/PageHeader';
import { PageSEO } from '../components/PageSEO';
import { BlogComments } from '../components/BlogComments';
import { useAuth } from '../context/AuthContext';
import { localApi } from '../lib/localApi';

interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  author_name: string;
  content: string[];
  tip: string;
  created_at: string;
}

interface PostForm {
  title: string;
  subtitle: string;
  category: string;
  content: string;
  tip: string;
}

const emptyForm: PostForm = {
  title: '',
  subtitle: '',
  category: '',
  content: '',
  tip: '',
};

function formFromPost(post: BlogPost): PostForm {
  return {
    title: post.title,
    subtitle: post.subtitle,
    category: post.category,
    content: post.content.join('\n\n'),
    tip: post.tip,
  };
}

function validatePost(form: PostForm) {
  const paragraphs = form.content.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  if (form.title.trim().length < 5 || form.title.trim().length > 150) {
    return 'El título debe tener entre 5 y 150 caracteres.';
  }
  if (form.subtitle.trim().length < 5 || form.subtitle.trim().length > 200) {
    return 'El resumen debe tener entre 5 y 200 caracteres.';
  }
  if (form.category.trim().length < 2 || form.category.trim().length > 50) {
    return 'La categoría debe tener entre 2 y 50 caracteres.';
  }
  if (paragraphs.length < 1 || paragraphs.length > 30 || paragraphs.some((paragraph) => paragraph.length > 5000)) {
    return 'Escribe entre 1 y 30 párrafos, con un máximo de 5000 caracteres por párrafo.';
  }
  if (form.tip.trim().length < 3 || form.tip.trim().length > 1000) {
    return 'El consejo debe tener entre 3 y 1000 caracteres.';
  }
  return '';
}

function formattedDate(date: string) {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'long' }).format(new Date(date));
}

export function BlogPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin && window.location.hash === '#blog-admin-form') {
      document.getElementById('blog-admin-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isAdmin]);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await localApi<{ data: BlogPost[] }>('content.php?resource=blog_posts');
      const articles = result.data;
      setPosts(articles);
      setExpandedPost((current) => current && articles.some((post) => post.id === current)
        ? current
        : articles[0]?.id ?? null);
    } catch (error) {
      setErrorMessage(`No se pudieron cargar los artículos: ${error instanceof Error ? error.message : 'error inesperado.'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setStatusMessage('');
    const validationError = validatePost(form);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    const values = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      category: form.category.trim(),
      content: form.content.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
      tip: form.tip.trim(),
    };
    setIsSaving(true);
    try {
      const result = await localApi<{ data: BlogPost }>(
        `content.php?resource=blog_posts${editingId ? `&id=${encodeURIComponent(editingId)}` : ''}`,
        {
          method: editingId ? 'PATCH' : 'POST',
          body: values,
        },
      );
      const savedPost = result.data;
      setPosts((current) => editingId
        ? current.map((post) => post.id === savedPost.id ? savedPost : post)
        : [savedPost, ...current]);
      setExpandedPost(savedPost.id);
      setStatusMessage(editingId ? 'El artículo se actualizó correctamente.' : 'El artículo se publicó correctamente.');
      resetForm();
    } catch (error) {
      setErrorMessage(`No se pudo guardar el artículo: ${error instanceof Error ? error.message : 'error inesperado.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (!window.confirm(`¿Borrar "${post.title}" y todos sus comentarios?`)) {
      return;
    }
    setErrorMessage('');
    setStatusMessage('');
    setDeletingId(post.id);
    try {
      await localApi(`content.php?resource=blog_posts&id=${encodeURIComponent(post.id)}`, {
        method: 'DELETE',
        body: {},
      });
      setPosts((current) => current.filter((item) => item.id !== post.id));
      if (editingId === post.id) {
        resetForm();
      }
      setStatusMessage('El artículo y sus comentarios se borraron correctamente.');
    } catch (error) {
      setErrorMessage(`No se pudo borrar el artículo: ${error instanceof Error ? error.message : 'error inesperado.'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const updateField = (field: keyof PostForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-green-50">
      <PageSEO
        title="Blog de Cocina | Consejos y técnicas culinarias"
        description="Artículos sobre cocina casera, técnicas, planificación de comidas y consejos prácticos."
        path="/blog"
      />
      <PageHeader title="Blog de Cocina" subtitle="Artículos, consejos y trucos culinarios" />

      <main className="container mx-auto max-w-4xl px-4 py-8 sm:py-10">
        {user && (
          <section id="blog-admin-form" className="mb-10 rounded-2xl bg-white p-5 shadow-md sm:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-green-800">{editingId ? 'Editar artículo' : 'Crear artículo'}</h2>
                <p className="mt-1 text-sm text-gray-600">
                  {isAdmin
                    ? 'Publica artículos y administra las publicaciones del blog.'
                    : 'Comparte tus conocimientos y consejos de cocina con la comunidad.'}
                </p>
              </div>
              {editingId && (
                <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <X className="h-4 w-4" aria-hidden="true" />
                  Cancelar
                </button>
              )}
            </div>
            <form onSubmit={(event) => void handleSubmit(event)} className="grid gap-4">
              <div>
                <label htmlFor="blog-title" className="mb-1 block text-sm font-medium text-gray-700">Título</label>
                <input id="blog-title" required minLength={5} maxLength={150} value={form.title} onChange={(event) => updateField('title', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" />
              </div>
              <div>
                <label htmlFor="blog-subtitle" className="mb-1 block text-sm font-medium text-gray-700">Resumen</label>
                <input id="blog-subtitle" required minLength={5} maxLength={200} value={form.subtitle} onChange={(event) => updateField('subtitle', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" />
              </div>
              <div>
                <label htmlFor="blog-category" className="mb-1 block text-sm font-medium text-gray-700">Categoría</label>
                <input id="blog-category" required minLength={2} maxLength={50} value={form.category} onChange={(event) => updateField('category', event.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" placeholder="Ej.: Técnicas" />
              </div>
              <div>
                <label htmlFor="blog-content" className="mb-1 block text-sm font-medium text-gray-700">Artículo (separa los párrafos con una línea vacía)</label>
                <textarea id="blog-content" required rows={9} value={form.content} onChange={(event) => updateField('content', event.target.value)} className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" />
              </div>
              <div>
                <label htmlFor="blog-tip" className="mb-1 block text-sm font-medium text-gray-700">Consejo destacado</label>
                <textarea id="blog-tip" required maxLength={1000} rows={3} value={form.tip} onChange={(event) => updateField('tip', event.target.value)} className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100" />
              </div>
              <div>
                <button type="submit" disabled={isSaving || deletingId !== null} className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-wait disabled:opacity-60">
                  {editingId ? <Save className="h-5 w-5" aria-hidden="true" /> : <Plus className="h-5 w-5" aria-hidden="true" />}
                  {isSaving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Publicar artículo'}
                </button>
              </div>
            </form>
            {errorMessage && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{errorMessage}</p>}
            {statusMessage && <p role="status" className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">{statusMessage}</p>}
          </section>
        )}

        <section className="mb-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-green-300 pb-2">
            <h2 className="text-2xl text-green-800">Artículos recientes</h2>
            <div className="flex flex-wrap items-center gap-2">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => document.getElementById('blog-admin-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Administrar blogs
                </button>
              )}
              <button type="button" onClick={() => void loadPosts()} disabled={isLoading} className="inline-flex items-center gap-2 rounded-lg border border-green-700 px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-100 disabled:opacity-60">
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                Actualizar
              </button>
            </div>
          </div>
          <p className="text-gray-600">Lee artículos y comparte tus comentarios con la comunidad.</p>
        </section>

        {isLoading ? (
          <p role="status" className="rounded-xl bg-white p-8 text-center text-gray-600 shadow-sm">Cargando artículos...</p>
        ) : posts.length === 0 ? (
          <p className="rounded-xl bg-white p-8 text-center text-gray-600 shadow-sm">Todavía no hay artículos publicados.</p>
        ) : posts.map((post) => (
          <article key={post.id} className="mb-8 overflow-hidden rounded-xl bg-white shadow-md">
            <header className="border-b border-gray-100 p-6">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" aria-hidden="true" />
                  <time dateTime={post.created_at}>{formattedDate(post.created_at)}</time>
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <User className="h-3 w-3" aria-hidden="true" />
                  {post.author_name}
                </span>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <button
                    type="button"
                    className="text-left text-lg font-semibold text-green-800 transition-colors hover:text-green-600 sm:text-xl"
                    aria-expanded={expandedPost === post.id}
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  >
                    {post.title}
                  </button>
                  <p className="mt-2 text-sm text-gray-500 sm:text-base">{post.subtitle}</p>
                </div>
                {isAdmin && (
                  <div className="flex shrink-0 items-center gap-1">
                    <button type="button" disabled={isSaving || deletingId !== null} onClick={() => { setForm(formFromPost(post)); setEditingId(post.id); setErrorMessage(''); setStatusMessage(''); }} aria-label={`Editar ${post.title}`} className="rounded-lg p-2 text-gray-500 hover:bg-green-100 hover:text-green-800 disabled:opacity-50">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" disabled={isSaving || deletingId !== null} onClick={() => void handleDelete(post)} aria-label={`Borrar ${post.title}`} className="rounded-lg p-2 text-gray-500 hover:bg-red-100 hover:text-red-700 disabled:opacity-50">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </header>

            {expandedPost === post.id ? (
              <div className="p-6">
                <div className="mb-6 space-y-4">
                  {post.content.map((paragraph, index) => (
                    <p key={`${post.id}-${index}`} className="leading-relaxed text-gray-700">{paragraph}</p>
                  ))}
                </div>
                <aside className="mb-4 rounded-r-lg border-l-4 border-green-500 bg-green-50 p-4">
                  <h3 className="mb-2 font-semibold text-green-800">Consejo del editor</h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-green-700">{post.tip}</p>
                </aside>
                <BlogComments postId={post.id} />
              </div>
            ) : (
              <div className="px-6 pb-5">
                <button type="button" onClick={() => setExpandedPost(post.id)} className="mt-3 text-sm text-green-700 underline hover:text-green-800">
                  Leer artículo completo →
                </button>
              </div>
            )}
          </article>
        ))}
      </main>
      <PageFooter currentPage="/blog" />
    </div>
  );
}
