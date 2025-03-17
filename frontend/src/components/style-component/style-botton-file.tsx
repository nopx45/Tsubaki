import { FC } from "react";
import styled from "styled-components";

interface AlertProps {
  message: string;
}

const AlertContainer = styled.div`
  padding: 16px;
`;

const AlertBox = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-left: 4px solid #28a745;
  background-color: #d4edda;
  color: #155724;
  border-radius: 8px;
  transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
  &:hover {
    background-color: #c3e6cb;
    transform: scale(1.05);
  }
`;

const AlertIcon = styled.svg`
  width: 20px;
  height: 20px;
  margin-right: 8px;
  color: #28a745;
`;

const AlertText = styled.p`
  font-size: 12px;
  font-weight: bold;
`;

const SuccessAlert: FC<AlertProps> = ({ message }) => {
  return (
    <AlertContainer>
      <AlertBox role="alert">
        <AlertIcon
          stroke="currentColor"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
        </AlertIcon>
        <AlertText>{message}</AlertText>
      </AlertBox>
    </AlertContainer>
  );
};

export default SuccessAlert;
