import styled from "styled-components";
import { Button, Card } from "antd";

/** ✅ สไตล์ของการ์ด */
export const StyledCard = styled(Card)`
  border-radius: 12px;
  background: linear-gradient(to left, #e0e7ff, #f8fafc);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  padding: 0px;
  text-align: start;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

/** ✅ ปุ่ม Action */
export const ActionButton = styled(Button)`
  border: none;
  background:rgb(4, 39, 87);
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  transition: background 0.3s ease-in-out, transform 0.2s ease-in-out;

  &:hover {
    background: #334155;
    transform: translateY(-2px);
  }
`;

export const StyledButtons = styled(Button)<{ isHovered: boolean }>`
  background: #fff;
  background-image: linear-gradient(90deg, rgb(1, 19, 72), #072275, rgb(9, 48, 164));
  font-weight: bold;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  max-width: 100%;
  min-width: 150px;
  padding: 8px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  border-left: 4px solid ${({ isHovered }) => (isHovered ? "#1e40af" : "#3b82f6")}; // เปลี่ยนสี border เมื่อ hover
  color: ${({ isHovered }) => (isHovered ? "#fff" : "#1e40af")}; // เปลี่ยนสีตัวอักษร
  transition: all 0.3s ease-in-out;
  transform: ${({ isHovered }) => (isHovered ? "scale(1.05)" : "scale(1)")}; // ขยายปุ่มเมื่อ hover

  &:hover {
    background-color: #172554;
    color: #fff;
  }

  &:active {
    transform: scale(0.98);
  }
`;

