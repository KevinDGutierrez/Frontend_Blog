import { useEffect, useState } from "react";
import { CommentForm } from "./CommentForm";

export const PublicationCard = ({
  id,
  title,
  username,
  courseName,
  comments,
  content,
  createdAt,
  navigateToPublicationHandler,
  addComment,
  deleteComment,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [localComments, setLocalComments] = useState(comments || []);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Sincronizar localComments con props.comments
  useEffect(() => {
    setLocalComments(comments || []);
  }, [comments]);

  const handleNavigate = () => navigateToPublicationHandler(id);
  const toggleForm = () => setShowForm((prev) => !prev);

  const sortedComments = [...localComments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const confirmDelete = async () => {
    if (!commentToDelete) return;

    try {
      // Pasamos ambos id de publicación y comentario para actualizar bien el estado global
      const response = await deleteComment({ publicationId: id, commentId: commentToDelete });
      if (response?.error) throw new Error("Falló la eliminación en el servidor");

      // Ya que el estado global se actualizó desde el hook, aquí podemos simplemente sincronizar localComments
      setLocalComments((prev) => prev.filter((c) => c._id !== commentToDelete));
    } catch (error) {
      console.error("Error eliminando comentario:", error);
      alert("No se pudo eliminar el comentario");
    } finally {
      setCommentToDelete(null);
    }
  };

  const cancelDelete = () => setCommentToDelete(null);

  const handleCommentAdded = (newComment) => {
    const commentWithFallback = {
      ...newComment,
      username: newComment.username || "Anónimo",
      content: newComment.content || "(Sin contenido)",
      createdAt: newComment.createdAt || new Date().toISOString(),
    };

    setLocalComments((prev) => [commentWithFallback, ...prev]);
    setShowForm(false);
  };

  return (
    <div className="publication-card">
      <div
        onClick={handleNavigate}
        className="card-content"
        role="button"
        tabIndex={0}
      >
        <h3>{title}</h3>
        <p>
          <strong>Autor:</strong> {username}
        </p>
        <p>
          <strong>Curso:</strong> {courseName}
        </p>
        <p>
          <strong>Fecha de publicación:</strong>{" "}
          {createdAt ? new Date(createdAt).toLocaleString("es-ES") : "Sin fecha"}
        </p>
        <p>
          <strong>Descripción:</strong> {content || "Sin descripción"}
        </p>
      </div>

      <div className="comments-section">
        <strong>Comentarios:</strong>
        <ul className="comments-list">
          {sortedComments.map((c, index) => (
            <li key={c._id ?? `temp-${index}`} className="comment-item">
              <strong>{c.username || "Anónimo"}:</strong> {c.content || "(Sin contenido)"}
              <br />
              <small>
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleString("es-ES")
                  : "Sin fecha"}
              </small>
              {c._id && (
                <button
                  className="btn-delete"
                  aria-label="Eliminar comentario"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommentToDelete(c._id);
                  }}
                >
                  Eliminar
                </button>
              )}
            </li>
          ))}
        </ul>

        <button className="btn-custom" onClick={toggleForm}>
          {showForm ? "Cerrar formulario" : "Agregar comentario"}
        </button>

        {showForm && (
          <CommentForm
            publicationId={id}
            onCommentAdded={handleCommentAdded}
            addComment={addComment}
          />
        )}

        {commentToDelete && (
          <div
            className="confirm-delete-overlay"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            <div className="confirm-delete-dialog">
              <p>¿Estás seguro de que quieres eliminar el comentario?</p>
              <button onClick={confirmDelete} className="btn-accept">
                Aceptar
              </button>
              <button onClick={cancelDelete} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
