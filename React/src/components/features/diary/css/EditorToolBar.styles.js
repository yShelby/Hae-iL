import styled from 'styled-components';

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap; /* 화면이 좁아지면 줄바꿈 */
  align-items: center;
  gap: 4px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 8px;
  border-radius: 8px 8px 0 0;
`;

export const ToolbarButton = styled.button`
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  color: #495057;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;
  font-size: 1.1rem;

  &:hover {
    background-color: #e9ecef;
  }

  &.is-active {
    background-color: #007bff;
    color: white;
  }
`;

export const ColorInput = styled.input`
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  border-radius: 4px;
  vertical-align: middle;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: 1px solid #ced4da;
    border-radius: 4px;
  }
`;

export const FontSelect = styled.select`
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #ced4da;
  font-size: 14px;
  cursor: pointer;
  background-color: white;
  margin-left: 4px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;