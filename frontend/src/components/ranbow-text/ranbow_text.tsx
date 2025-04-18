import React from "react";
import styled, { keyframes } from "styled-components";

const rainbowAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const RainbowText = styled.div`
  font-size: 2.6rem;
  font-weight: bold;
  text-align: left;
  margin: 20px 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  
  background: linear-gradient(90deg, red, orange, green, blue, violet);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: ${rainbowAnimation} 8s linear infinite;
`;

interface RegulationProps {
  text: string;
}

const Regulations: React.FC<RegulationProps> = ({ text }) => {
  return <RainbowText>{text}</RainbowText>;
};

export default Regulations;
