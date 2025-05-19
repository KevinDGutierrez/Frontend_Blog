import { useState } from "react";
import { getPublications, addComment } from "../../services/index";

export const usePublications = () => {
  const [allPublications, setAllPublications] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchPublicationsFromAPI = async () => {
    setIsFetching(true);
    const res = await getPublications();
    if (res && res.data && res.data.publications) {
      setAllPublications(res.data.publications);
    }
    setIsFetching(false);
  };

  const addCommentToPublication = async ({ publicationId, username, content }) => {
    const res = await addComment({ publicationId, username, content });
    if (!res.error && res.data && res.data.comment) {
      const newComment = res.data.comment;

      setAllPublications((prevPubs) =>
        prevPubs.map((pub) =>
          pub._id === publicationId
            ? { ...pub, comments: [...pub.comments, newComment] }
            : pub
        )
      );

      return newComment; // ✅ devolvemos el comentario
    }
    return null; // Si falla, devolvemos null
  };

  return {
    allPublications,
    isFetching,
    getPublications: fetchPublicationsFromAPI,
    addComment: addCommentToPublication,
  };
};
