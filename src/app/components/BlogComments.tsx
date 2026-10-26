import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { MessageCircle, Pencil, Send, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { localApi } from '../lib/localApi';

interface BlogComment {
  id: string;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
}

export function BlogComments({ postId }: { postId: string }) {
  const { user } = useAuth();
  const canModerate = user?.role === 'admin';
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await localApi<{ data: BlogComment[] }>(
        `content.php?resource=blog_comments&parent_id=${encodeURIComponent(postId)}`,
      );
      setComments(result.data);
    } catch (error) {
      setErrorMessage(`No se pudieron cargar los comentarios: ${error instanceof Error ? error.message : 'error inesperado.'}`);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || body.length > 1000) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await localApi('content.php?resource=blog_comments', {
        method: 'POST',
        body: { post_id: postId, body },
      });
      setDraft('');
      await loadComments();
    } catch (error) {
      setErrorMessage(`No se pudo publicar el comentario: ${error instanceof Error ? error.message : 'error inesperado.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    const body = editingBody.trim();
    if (!body || body.length > 1000) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await localApi(`content.php?resource=blog_comments&id=${encodeURIComponent(commentId)}`, {
        method: 'PATCH',
        body: { body },
      });
      setEditingId(null);
      setEditingBody('');
      await loadComments();
    } catch (error) {
      setErrorMessage(`No se pudo editar el comentario: ${error instanceof Error ? error.message : 'error inesperado.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('¿Quieres eliminar este comentario?')) return;
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await localApi(`content.php?resource=blog_comments&id=${encodeURIComponent(commentId)}`, {
        method: 'DELETE',
        body: {},
      });
      await loadComments();
    } catch (error) {
      setErrorMessage(`No se pudo eliminar el comentario: ${error instanceof Error ? error.message : 'error inesperado.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby={`blog-comments-title-${postId}`} className="mt-8 border-t border-gray-200 pt-6">
      <div className="mb-5 flex items-center gap-3">
        <MessageCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
        <h3 id={`blog-comments-title-${postId}`} className="font-semibold text-gray-800">
          Comentarios ({comments.length})
        </h3>
      </div>

      <form onSubmit={(event) => void handleSubmit(event)} className="mb-7">
        <label htmlFor={`blog-comment-${postId}`} className="mb-2 block text-sm font-semibold text-gray-700">
          Deja tu comentario
        </label>
        <textarea
          id={`blog-comment-${postId}`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          maxLength={1000}
          required
          placeholder="Comparte tu opinión sobre el artículo..."
          className="w-full resize-y rounded-xl border border-green-200 bg-green-50/40 p-3 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-gray-500">{draft.length}/1000</span>
          <button type="submit" disabled={isSubmitting || !draft.trim()} className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50">
            <Send className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? 'Publicando...' : 'Publicar comentario'}
          </button>
        </div>
      </form>

      {errorMessage && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{errorMessage}</p>}
      {isLoading ? (
        <p role="status" className="py-4 text-sm text-gray-500">Cargando comentarios...</p>
      ) : comments.length === 0 ? (
        <p className="rounded-xl bg-green-50 px-4 py-6 text-center text-sm text-gray-600">Todavía no hay comentarios. ¡Sé la primera persona en compartir tu opinión!</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => {
            const isOwner = comment.user_id === user?.id;
            const isEditing = editingId === comment.id;
            return (
              <li key={comment.id} className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-800">{comment.author_name}</p>
                    <time dateTime={comment.created_at} className="text-xs text-gray-500">
                      {new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(comment.created_at))}
                    </time>
                  </div>
                  {(isOwner || canModerate) && !isEditing && (
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => { setEditingId(comment.id); setEditingBody(comment.body); setErrorMessage(''); }} aria-label="Editar comentario" className="rounded-lg p-2 text-gray-500 hover:bg-green-100 hover:text-green-800">
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button type="button" disabled={isSubmitting} onClick={() => void handleDelete(comment.id)} aria-label="Eliminar comentario" className="rounded-lg p-2 text-gray-500 hover:bg-red-100 hover:text-red-700 disabled:opacity-50">
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </div>
                {isEditing ? (
                  <div>
                    <label htmlFor={`edit-blog-comment-${comment.id}`} className="sr-only">Editar comentario</label>
                    <textarea id={`edit-blog-comment-${comment.id}`} value={editingBody} onChange={(event) => setEditingBody(event.target.value)} maxLength={1000} rows={3} className="w-full resize-y rounded-lg border border-green-200 bg-white p-3 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                    <div className="mt-2 flex justify-end gap-2">
                      <button type="button" onClick={() => { setEditingId(null); setEditingBody(''); }} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-200">
                        <X className="h-4 w-4" aria-hidden="true" />
                        Cancelar
                      </button>
                      <button type="button" onClick={() => void handleEdit(comment.id)} disabled={isSubmitting || !editingBody.trim()} className="rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50">
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700">{comment.body}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
