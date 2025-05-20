import React, { useEffect, useState } from 'react';
import Content from "../../components/Content/Content.jsx";
import { usePublications, useUpdateComment } from "../../shared/hooks/index.js";
import { ListPublications } from "../../components/Publications/ListPublications";

export const DashboardPage = () => {
  const { getPublications, allPublications, isFetching, addComment: addCommentAPI, deleteComment: deleteCommentAPI } = usePublications();
  const { updateComment: updateCommentAPI } = useUpdateComment();

  const [selectedCourse, setSelectedCourse] = useState('todos');
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [localPublications, setLocalPublications] = useState([]);

  useEffect(() => {
    getPublications();
  }, []);

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

  const handleAddComment = async (commentData) => {
    const result = await addCommentAPI(commentData);
    if (result) {
      await getPublications();
    }
    return result;
  };

  const handleDeleteComment = async (publicationId, commentId) => {
    const success = await deleteCommentAPI(publicationId, commentId);
    if (success) {
      await getPublications(); 
    }
    return success;
  };

  const handleUpdateComment = async ({ id, content }) => {
    const updatedComment = await updateCommentAPI({ id, content });
    if (updatedComment) {
      await getPublications(); 
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
      />
    </Content>
  );
};
