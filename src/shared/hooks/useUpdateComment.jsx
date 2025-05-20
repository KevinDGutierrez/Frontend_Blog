import { useState } from "react";
import { updateComment } from "../../services";

export const useUpdateComment = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateCommentById = async ({ id, content }) => {
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const res = await updateComment({ id, content });

      if (!res.error && res.data && res.data.comment) {
        return res.data.comment;
      }

      setUpdateError("Error desconocido al actualizar el comentario");
      return null;
    } catch (e) {
      console.error("Error en updateCommentById:", e);
      setUpdateError("Fallo al actualizar el comentario");
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    updateError,
    updateComment: updateCommentById,
  };
};
