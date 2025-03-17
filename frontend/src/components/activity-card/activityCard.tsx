import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "react-feather";
import { StyledCard, ActionButton } from "../style-component/StyleComponent";
import newIcon from "../../assets/new_icon.png"

const { Title, Paragraph } = Typography;

type ActivityProps = {
  activity: {
    ID?: number;
    title?: string;
    content?: string;
    Image?: string;
    created_at?: string;
  };
  isLatest?: boolean;
};

export default function ActivityCard({ activity, isLatest }: ActivityProps) {
  const navigate = useNavigate();

  const formatThaiDateTime = (date: string | 0) => {
    if (typeof date === "number") return "N/A";
  
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";
  
    const thaiYear = d.getFullYear() + 543;
  
    // ✅ แปลงวันที่เป็น DD/MM/พ.ศ.
    const thaiDate = d.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\d{4}/, thaiYear.toString());
  
    // ✅ แปลงเวลาเป็น HH:mm:ss
    const thaiTime = d.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  
    return `${thaiDate} ${thaiTime}`; // ✅ แสดงผล "25/02/2568 10:20:36"
  };

  const truncateText = (text?: string, maxLength: number = 40) => {
    if (!text) return "ไม่มีข้อมูล";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <StyledCard onClick={() => navigate(`/activity/${activity.ID}`)}>
      <Title
        level={4}
        style={{
          color: "#1e40af",
          marginBottom: "12px",
          fontWeight: "bold",
        }}
      >
        {isLatest && (
          <img
            src={newIcon}
            alt="New"
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
        )}
        {activity.title}
      </Title>
      <Paragraph style={{ fontSize: "12px", color: "#475569", marginBottom: "8px" }}>
        {formatThaiDateTime(activity.created_at ?? 0) ?? "ไม่ระบุวันที่"}
      </Paragraph>
      <Paragraph style={{ fontSize: "14px", color: "#1e293b", marginBottom: "12px" }}>
        {truncateText(activity.content)}
      </Paragraph>
      <ActionButton onClick={(e) => { e.stopPropagation(); navigate(`/activity/${activity.ID}`); }}>
        <ExternalLink size={18} />
        อ่านเพิ่มเติม
      </ActionButton>
    </StyledCard>
  );
}
