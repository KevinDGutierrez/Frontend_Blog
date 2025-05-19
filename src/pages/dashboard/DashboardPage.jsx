import React, { useEffect, useState } from 'react';
import Content from "../../components/Content/Content.jsx";
import { usePublications } from "../../shared/hooks/index.js";
import { ListPublications } from "../../components/Publications/ListPublications";

export const DashboardPage = () => {
  const { getPublications, allPublications, isFetching, addComment, deleteComment } = usePublications();
  const [selectedCourse, setSelectedCourse] = useState('todos');
  const [filteredPublications, setFilteredPublications] = useState([]);

  useEffect(() => {
    getPublications();
  }, []);

  useEffect(() => {
    if (!allPublications) return;

    const sortedByDate = [...allPublications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    if (selectedCourse === 'todos') {
      setFilteredPublications(sortedByDate);
    } else {
      setFilteredPublications(
        sortedByDate.filter(pub => pub.course.name === selectedCourse)
      );
    }
  }, [selectedCourse, allPublications]);

  const courseOptions = [...new Set(allPublications?.map(pub => pub.course.name))];

  if (isFetching) return <p className="loading-text">Cargando publicaciones...</p>;

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
        publications={filteredPublications} 
        addComment={addComment} 
        deleteComment={deleteComment} // ✅ Propiedad añadida
      />
    </Content>
  );
};
