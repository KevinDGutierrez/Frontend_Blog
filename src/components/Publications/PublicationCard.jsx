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
  updateComment,
  deleteComment,
  // refreshPublications, // <-- Quitado
}) => {
  const [showForm, setShowForm] = useState(false);
  const [localComments, setLocalComments] = useState(comments || []);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [commentToEdit, setCommentToEdit] = useState(null);

  useEffect(() => {
    setLocalComments(comments || []);
  }, [comments]);

  const handleNavigate = () => navigateToPublicationHandler(id);

  const toggleForm = () => {
    if (showForm) {
      setShowForm(false);
      setCommentToEdit(null);
    } else {
      setShowForm(true);
    }
  };

  const sortedComments = [...localComments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const confirmDelete = async () => {
    if (!commentToDelete) return;

    try {
      const response = await deleteComment({
        publicationId: id,
        commentId: commentToDelete,
      });

      if (response?.error) throw new Error("Falló la eliminación en el servidor");

      setLocalComments((prev) => prev.filter((c) => c._id !== commentToDelete));
      
      // No más refreshPublications
    } catch (error) {
      console.error("Error eliminando comentario:", error);
      alert("No se pudo eliminar el comentario");
    } finally {
      setCommentToDelete(null);
    }
  };

  const cancelDelete = () => setCommentToDelete(null);

  const handleCommentAdded = (newComment) => {
    setLocalComments((prev) => [newComment, ...prev]);
    setShowForm(false);

    // No más refreshPublications
  };

  const handleCommentUpdated = (updatedComment) => {
    setLocalComments((prev) =>
      prev.map((c) =>
        c._id === updatedComment._id ? { ...c, content: updatedComment.content } : c
      )
    );
    setCommentToEdit(null);
    setShowForm(false);

    // No más refreshPublications
  };

  return (
    <div className="publication-card">
      <div
        onClick={handleNavigate}
        className="card-content"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNavigate();
          }
        }}
        aria-label={`Abrir publicación: ${title}`}
      >
        <h3>{title}</h3>
        <p><strong>Autor:</strong> {username}</p>
        <p><strong>Curso:</strong> {courseName}</p>
        <p>
          <strong>Fecha de publicación:</strong>{" "}
          {createdAt ? new Date(createdAt).toLocaleString("es-ES") : "Sin fecha"}
        </p>
        <p><strong>Descripción:</strong> {content || "Sin descripción"}</p>
      </div>

      <div className="comments-section">
        <strong>Comentarios:</strong>
        <ul className="comments-list">
          {sortedComments.length === 0 && <li>No hay comentarios aún.</li>}
          {sortedComments.map((c, index) => (
            <li key={c._id ?? `temp-${index}`} className="comment-item">
              <strong>{c.username}:</strong> {c.content || "(Sin contenido)"}
              <br />
              <small>
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleString("es-ES")
                  : "Sin fecha"}
              </small>
              {c._id && (
                <>
                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCommentToDelete(c._id);
                    }}
                    aria-label={`Eliminar comentario de ${c.username}`}
                    type="button"
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCommentToEdit(c);
                      setShowForm(true);
                    }}
                    aria-label={`Editar comentario de ${c.username}`}
                    type="button"
                  >
                    Editar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        <button
          className="btn-custom"
          onClick={toggleForm}
          aria-expanded={showForm}
          aria-controls="comment-form"
          type="button"
        >
          {showForm ? (commentToEdit ? "Cancelar edición" : "Cerrar formulario") : "Agregar comentario"}
        </button>

        {showForm && (
          <CommentForm
            publicationId={id}
            mode={commentToEdit ? "edit" : "add"}
            commentId={commentToEdit?._id}
            initialContent={commentToEdit?.content || ""}
            addComment={addComment}
            updateComment={updateComment}
            onCommentAdded={handleCommentAdded}
            onCommentUpdated={handleCommentUpdated}
          />
        )}

        {commentToDelete && (
          <div
            className="confirm-delete-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-title"
          >
            <div className="confirm-delete-dialog">
              <p id="confirm-delete-title">¿Estás seguro de que quieres eliminar el comentario?</p>
              <button onClick={confirmDelete} className="btn-accept" type="button">
                Aceptar
              </button>
              <button onClick={cancelDelete} className="btn-cancel" type="button">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
