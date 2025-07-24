import React from "react";
import styled from "styled-components";

const TooltipBox = styled.div`
  position: fixed;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  background: #222;
  color: #fff;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 0.95rem;
  pointer-events: none;
  z-index: 1000;
  white-space: pre-line;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  opacity: 0.95;
`;

function Tooltip({ visible, x, y, children }) {
    if (!visible) return null;
    return <TooltipBox x={x} y={y}>{children}</TooltipBox>;
}

export default Tooltip;
