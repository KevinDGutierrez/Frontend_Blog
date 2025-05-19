import { useState } from "react";

export const CommentForm = ({ publicationId, onCommentAdded, addComment }) => {
  const [formData, setFormData] = useState({
    username: "",
    content: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    content: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

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
    const trimmedUsername = formData.username.trim();
    const trimmedContent = formData.content.trim();
    const newErrors = {
      username: trimmedUsername ? "" : "El nombre de usuario es obligatorio.",
      content: trimmedContent ? "" : "El contenido del comentario es obligatorio.",
    };

    setErrors(newErrors);
    return trimmedUsername && trimmedContent;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const trimmedData = {
      username: formData.username.trim(),
      content: formData.content.trim(),
    };

    try {
      const result = await addComment({
        publicationId,
        ...trimmedData,
      });

      if (result) {
        const commentWithUser = {
          ...result,
          username: result.username || trimmedData.username, // ✅ asegura mostrar username
        };

        if (onCommentAdded) onCommentAdded(commentWithUser);

        setShowSuccess(true);
        setFormData({ username: "", content: "" });
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert("No se pudo agregar el comentario. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      alert("Ocurrió un error al enviar el comentario.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="comment-form"
      aria-label="Formulario para agregar comentario"
    >
      <label htmlFor="username">Nombre de usuario</label>
      <input
        id="username"
        name="username"
        placeholder="Nombre de usuario"
        value={formData.username}
        onChange={handleChange}
        required
        autoComplete="username"
        aria-required="true"
        aria-describedby="username-error"
      />
      {errors.username && (
        <p id="username-error" className="error-message" role="alert">
          {errors.username}
        </p>
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
        aria-describedby="content-error"
      />
      {errors.content && (
        <p id="content-error" className="error-message" role="alert">
          {errors.content}
        </p>
      )}

      <button type="submit">Enviar comentario</button>

      {showSuccess && (
        <p role="alert" className="success-message">
          Comentario enviado con éxito.
        </p>
      )}
    </form>
  );
};
