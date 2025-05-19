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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Limpiar error cuando usuario escribe
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validate = () => {
    let valid = true;
    let newErrors = { username: "", content: "" };

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio.";
      valid = false;
    }
    if (!formData.content.trim()) {
      newErrors.content = "El contenido del comentario es obligatorio.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const newComment = await addComment({
        publicationId,
        username: formData.username.trim(),
        content: formData.content.trim(),
      });

      if (newComment) {
        setShowSuccess(true);
        setFormData({ username: "", content: "" });

        if (onCommentAdded) onCommentAdded(newComment);

        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert("Error al agregar el comentario");
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      alert("Error en la solicitud para agregar comentario");
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
