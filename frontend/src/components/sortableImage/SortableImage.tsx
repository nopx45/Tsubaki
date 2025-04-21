import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaTrash, FaGripVertical } from "react-icons/fa";
import { apiUrl } from "../../services/https";

const SortableImage = ({
  id,
  url,
  onDelete,
}: {
  id: string;
  url: string;
  onDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="image-card">
      <div className="image-container">
        {/* 🔧 ปุ่มลากเฉพาะจุด */}
        <div className="drag-handle" {...attributes} {...listeners}>
          <FaGripVertical />
        </div>

        <img src={`${apiUrl}${url}`} alt="Popup" className="popup-image" />

        <div className="image-overlay">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="delete-btn"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <style>{`
      .drag-handle {
      position: absolute;
      top: 8px;
      left: 8px;
      cursor: grab;
      z-index: 2;
      color: white;
      font-size: 1.2rem;
      background-color: rgba(0, 0, 0, 0.4);
      padding: 6px;
      border-radius: 6px;
    }
      `}</style>
    </div>
  );
};

export default SortableImage;
