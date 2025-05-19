import { useState } from "react";
import { getPublications, addComment, deleteComment } from "../../services/index";

export const usePublications = () => {
  const [allPublications, setAllPublications] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchPublicationsFromAPI = async () => {
    setIsFetching(true);
    try {
      const res = await getPublications();
      if (res && res.data && Array.isArray(res.data.publications)) {
        setAllPublications(res.data.publications);
      } else {
        setAllPublications([]);
      }
    } catch (error) {
      console.error("Error al obtener publicaciones:", error);
      setAllPublications([]);
    } finally {
      setIsFetching(false);
    }
  };

  // Agregar comentario: actualiza el estado local en allPublications para la publicación específica
  const addCommentToPublication = async ({ publicationId, username, content }) => {
    try {
      const res = await addComment({ publicationId, username, content });
      if (!res.error && res.data && res.data.comment) {
        const newComment = res.data.comment;

        setAllPublications((prevPubs) =>
          prevPubs.map((pub) =>
            pub._id === publicationId
              ? { ...pub, comments: [...(pub.comments || []), newComment] }
              : pub
          )
        );

        return newComment;
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
    return null;
  };

  // Eliminar comentario: recibe publicación e id de comentario; actualiza estado y llama servicio
  const deleteCommentFromPublication = async ({ publicationId, commentId }) => {
    try {
      // Aquí llamas al servicio con solo commentId, que es correcto según tu servicio
      const res = await deleteComment(commentId);
      if (!res.error) {
        // Actualiza estado local quitando el comentario de la publicación
        setAllPublications((prevPubs) =>
          prevPubs.map((pub) =>
            pub._id === publicationId
              ? {
                  ...pub,
                  comments: (pub.comments || []).filter((c) => c._id !== commentId),
                }
              : pub
          )
        );
      }
      return res;
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      return { error: true };
    }
  };

  return {
    allPublications,
    isFetching,
    getPublications: fetchPublicationsFromAPI,
    addComment: addCommentToPublication,
    deleteComment: deleteCommentFromPublication,
  };
};
