import { useState, useEffect } from "react";

export const CommentForm = ({
  publicationId,
  onCommentAdded,
  onCommentUpdated,
  addComment,
  updateComment,
  mode = "add",
  commentId = null,
  initialContent = "",
}) => {
  const [formData, setFormData] = useState({
    username: "",
    content: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    content: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialContent) {
      setFormData((prev) => ({
        ...prev,
        content: initialContent,
      }));
    }
  }, [mode, initialContent]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const trimmedContent = formData.content.trim();
    const newErrors = {
      username: "", // no obligatorio
      content: trimmedContent ? "" : "El contenido del comentario es obligatorio.",
    };

    setErrors(newErrors);
    return trimmedContent;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const trimmedData = {
      username: formData.username.trim(),
      content: formData.content.trim(),
    };

    try {
      if (mode === "edit") {
        const result = await updateComment({
          id: commentId,
          content: trimmedData.content,
        });

        if (result && onCommentUpdated) {
          onCommentUpdated(result);
        }
      } else {
        const result = await addComment({
          publicationId,
          ...trimmedData,
        });

        if (result) {
          const commentWithUser = {
            ...result,
            username: result.username || trimmedData.username,
          };

          if (onCommentAdded) onCommentAdded(commentWithUser);
          setFormData({ username: "", content: "" });
        } else {
          alert("No se pudo agregar el comentario. Intenta de nuevo.");
        }
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      alert("Ocurrió un error al enviar el comentario.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {mode === "add" && (
        <>
          <label htmlFor="username">Nombre de usuario</label>
          <input
            id="username"
            name="username"
            placeholder="Nombre de usuario"
            value={formData.username}
            onChange={handleChange}
            autoComplete="username"
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && (
            <p id="username-error" className="error-message" role="alert">
              {errors.username}
            </p>
          )}
        </>
      )}

      <label htmlFor="content">Comentario</label>
      <textarea
        id="content"
        name="content"
        placeholder="Escribe tu comentario aquí"
        value={formData.content}
        onChange={handleChange}
        required
        rows={4}
        aria-required="true"
        aria-describedby={errors.content ? "content-error" : undefined}
      />
      {errors.content && (
        <p id="content-error" className="error-message" role="alert">
          {errors.content}
        </p>
      )}

      <button type="submit">
        {mode === "edit" ? "Actualizar comentario" : "Enviar comentario"}
      </button>

      {showSuccess && (
        <p role="alert" className="success-message">
          {mode === "edit"
            ? "Comentario actualizado con éxito."
            : "Comentario enviado con éxito."}
        </p>
      )}
    </form>
  );
};
