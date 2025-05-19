import { useState } from "react";
import { CommentForm } from "./CommentForm";

export const PublicationCard = ({
  id,
  title,
  username,
  courseName,
  comments,
  createdAt,
  navigateToPublicationHandler,
  addComment,
  deleteComment,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [localComments, setLocalComments] = useState(comments || []);

  // Estado para manejar confirmación de borrado
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleNavigate = () => navigateToPublicationHandler(id);
  const toggleForm = () => setShowForm(!showForm);

  const sortedComments = [...localComments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Función que ejecuta la eliminación luego de confirmación
  const confirmDelete = async () => {
    if (!commentToDelete) return;

    try {
      const response = await deleteComment(commentToDelete);

      if (response?.error) {
        throw new Error("Falló la eliminación en el servidor");
      }

      setLocalComments((prev) => prev.filter((c) => c._id !== commentToDelete));
      setCommentToDelete(null);
    } catch (error) {
      console.error("Error eliminando comentario:", error);
      alert("No se pudo eliminar el comentario");
      setCommentToDelete(null);
    }
  };

  // Cancela la confirmación
  const cancelDelete = () => {
    setCommentToDelete(null);
  };

  return (
    <div className="publication-card">
      <div onClick={handleNavigate} className="card-content">
        <h3>{title}</h3>
        <p><strong>Autor:</strong> {username}</p>
        <p><strong>Curso:</strong> {courseName}</p>
        <p><strong>Fecha de publicación:</strong>{" "}
          {createdAt
            ? new Date(createdAt).toLocaleString("es-ES")
            : "Sin fecha"}
        </p>
      </div>

      <div className="comments-section">
        <strong>Comentarios:</strong>
        <ul className="comments-list">
          {sortedComments.map((c, index) => (
            <li key={c._id ?? `temp-${index}`} className="comment-item">
              <strong>{c.username}</strong> {c.content}<br />
              <small>
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleString("es-ES")
                  : "Sin fecha"}
              </small>
              {c._id && (
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommentToDelete(c._id); // En vez de borrar directo, mostramos confirmación
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
            onCommentAdded={(newComment) => {
              setLocalComments([newComment, ...localComments]);
              setShowForm(false);
            }}
            addComment={addComment}
          />
        )}

        {/* Confirmación de eliminación */}
        {commentToDelete && (
          <div className="confirm-delete-overlay" aria-modal="true" role="dialog" tabIndex={-1}>
            <div className="confirm-delete-dialog">
              <p>¿Estás seguro de que quieres eliminar el comentario?</p>
              <button onClick={confirmDelete} className="btn-accept">Aceptar</button>
              <button onClick={cancelDelete} className="btn-cancel">Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
