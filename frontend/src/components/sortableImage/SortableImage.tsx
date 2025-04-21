import { useSortable } from "@dnd-kit/sortable";
import { FaTrash } from "react-icons/fa";
import { apiUrl } from "../../services/https";
import { CSS } from "@dnd-kit/utilities";


const SortableImage = ({ id, url, onDelete }: { id: string; url: string; onDelete: (id: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      };          
  
    return (
      <div ref={setNodeRef} style={style} className="image-card">
        <div className="image-container" {...attributes}>
          <img src={`${apiUrl}${url}`} alt="Popup" className="popup-image" {...listeners} />
          <div className="image-overlay">
            <button
              onClick={(e) => {
                e.stopPropagation(); //กันไม่ให้ event ทะลุไปยัง drag
                onDelete(id);
              }}
              className="delete-btn"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    );
  };

export default SortableImage;
  