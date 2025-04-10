import { Button, ButtonProps } from "antd";
import styled from "styled-components";
import { ReactNode } from "react";

type CustomButtonProps = {
  children: ReactNode;
} & ButtonProps;

const StyledButton = styled(Button)`
  position: relative;
  display: inline-block;
  padding: 0 50px;
  font-size: 17px;
  font-weight: bold;
  color: ghostwhite;
  background: linear-gradient(135deg, #00c6ff, #0072ff);
  border: none;
  border-radius: 50px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(135deg, #ff416c, #ff4b2b);
    transform: translateY(-2px);
    box-shadow: 0px 6px 12px rgba(255, 75, 43, 0.4);
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: rgba(255, 255, 255, 0.15);
    transition: all 0.5s ease-in-out;
    transform: translate(-50%, -50%) rotate(-30deg);
    border-radius: 50%;
    opacity: 0;
  }

  &:hover::before {
    width: 120%;
    height: 120%;
    opacity: 1;
  }

  span {
    position: relative;
    z-index: 10;
    transition: color 0.3s;
  }

  &:hover span {
    color: #0b1354;
  }
`;

export default function CustomButton(props: CustomButtonProps) {
  return <StyledButton {...props}>{props.children}</StyledButton>;
}
