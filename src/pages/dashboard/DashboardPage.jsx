import React, { useEffect, useState } from 'react';
import Content from "../../components/Content/Content.jsx";
import { usePublications, useUpdateComment } from "../../shared/hooks/index.js";
import { ListPublications } from "../../components/Publications/ListPublications";

export const DashboardPage = () => {
  const { getPublications, allPublications, isFetching, addComment: addCommentAPI, deleteComment: deleteCommentAPI } = usePublications();
  const { updateComment: updateCommentAPI } = useUpdateComment();

  const [selectedCourse, setSelectedCourse] = useState('todos');
  const [filteredPublications, setFilteredPublications] = useState([]);

  // Estado local para las publicaciones (con comentarios actualizados)
  const [localPublications, setLocalPublications] = useState([]);

  // Obtener publicaciones iniciales
  useEffect(() => {
    getPublications();
  }, []);

  // Cuando cambian las publicaciones globales o el filtro, actualizar localPublications filtradas y ordenadas
  useEffect(() => {
    if (!allPublications) return;

    const sortedByDate = [...allPublications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const filtered = selectedCourse === 'todos'
      ? sortedByDate
      : sortedByDate.filter(pub => pub.course.name === selectedCourse);

    setFilteredPublications(filtered);
    setLocalPublications(filtered);
  }, [selectedCourse, allPublications]);

  // Función para actualizar comentarios en el estado local
  const handleAddComment = async (commentData) => {
    const result = await addCommentAPI(commentData);
    if (result) {
      // Actualizar localPublications agregando el nuevo comentario en la publicación correspondiente
      setLocalPublications((prevPubs) =>
        prevPubs.map(pub =>
          pub._id === commentData.publicationId
            ? { 
                ...pub, 
                comments: [...(pub.comments || []), result]
              }
            : pub
        )
      );
    }
    return result;
  };

  const handleDeleteComment = async (publicationId, commentId) => {
    const success = await deleteCommentAPI(publicationId, commentId);
    if (success) {
      setLocalPublications((prevPubs) =>
        prevPubs.map(pub =>
          pub._id === publicationId
            ? {
                ...pub,
                comments: pub.comments.filter(c => c._id !== commentId)
              }
            : pub
        )
      );
    }
    return success;
  };

  const handleUpdateComment = async ({ id, content }) => {
    const updatedComment = await updateCommentAPI({ id, content });
    if (updatedComment) {
      setLocalPublications((prevPubs) =>
        prevPubs.map(pub => ({
          ...pub,
          comments: pub.comments.map(c =>
            c._id === id ? updatedComment : c
          )
        }))
      );
    }
    return updatedComment;
  };

  if (isFetching) return <p className="loading-text">Cargando publicaciones...</p>;

  const courseOptions = [...new Set(allPublications?.map(pub => pub.course.name))];

  return (
    <Content>
      <div className="filter-container">
        <label htmlFor="course-filter" className="filter-label mt-5"><strong>Filtrar por curso:</strong></label>
        <select
          id="course-filter"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="filter-select mt-5"
        >
          <option value="todos">Todos los cursos</option>
          {courseOptions.map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
      </div>

      <ListPublications 
        publications={localPublications} 
        addComment={handleAddComment} 
        deleteComment={handleDeleteComment}
        updateComment={handleUpdateComment} 
        // No se pasa refreshPublications porque no queremos recargar todo
      />
    </Content>
  );
};
