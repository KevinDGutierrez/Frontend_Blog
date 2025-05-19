import { useNavigate } from "react-router-dom";
import { PublicationCard } from "./PublicationCard";
import { deleteComment } from "../../services/index";

export const ListPublications = ({ publications, addComment }) => {
  const navigate = useNavigate();

  const handleNavigateToPublication = (id) => {
    navigate(`/publication/${id}`);
  };

  const groupedByCourse = publications.reduce((acc, pub) => {
    const courseName = pub.course?.name || "Sin curso";
    if (!acc[courseName]) acc[courseName] = [];
    acc[courseName].push(pub);
    return acc;
  }, {});

  return (
    <div className="publications-container">
      {Object.entries(groupedByCourse).map(([courseName, pubs]) => (
        <div key={courseName} className="course-group">
          <h2 className="course-title">{courseName}</h2>
          <div className="course-publications">
            {pubs.map((p) => (
              <PublicationCard
                key={p._id}
                id={p._id}
                title={p.titulo}
                username={p.user?.username || "Anónimo"}
                courseName={p.course?.name || "Sin curso"}
                comments={Array.isArray(p.comments) ? p.comments : []}
                createdAt={p.createdAt}
                navigateToPublicationHandler={handleNavigateToPublication}
                addComment={addComment}
                deleteComment={deleteComment}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
