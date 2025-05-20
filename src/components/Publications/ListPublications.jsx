import { useNavigate } from "react-router-dom";
import { PublicationCard } from "./PublicationCard";

export const ListPublications = ({
  publications = [],
  addComment,
  deleteComment,
  updateComment, // si usas edición de comentarios
  // refreshPublications, // <-- eliminado
}) => {
  const navigate = useNavigate();

  const handleNavigateToPublication = (id) => {
    navigate(`/publication/${id}`);
  };

  // Agrupar publicaciones por nombre del curso
  const groupedByCourse = publications.reduce((acc, pub) => {
    const courseName = pub.course?.name?.trim() || "Sin curso";
    if (!acc[courseName]) acc[courseName] = [];
    acc[courseName].push(pub);
    return acc;
  }, {});

  return (
    <div className="publications-container">
      {Object.entries(groupedByCourse).map(([courseName, pubs]) => (
        <section key={courseName} className="course-group">
          <h2 className="course-title">{courseName}</h2>
          <div className="course-publications">
            {pubs.map((pub) => (
              <PublicationCard
                key={pub._id}
                id={pub._id}
                title={pub.titulo?.trim() || "Sin título"}
                username={pub.user?.username?.trim() || ""}
                courseName={courseName}
                content={pub.content?.trim() || "Sin descripción"}
                comments={Array.isArray(pub.comments) ? pub.comments : []}
                createdAt={pub.createdAt}
                navigateToPublicationHandler={handleNavigateToPublication}
                addComment={addComment}
                deleteComment={deleteComment}
                updateComment={updateComment}
                // Ya no pasamos refreshPublications
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
