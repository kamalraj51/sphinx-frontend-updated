import styled from "styled-components";

export const PopupWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const PopupBox = styled.div`
  width: 350px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  position: relative;
`;

export const CloseIcon = styled.span`
  position: absolute;
  top: 10px;
  right: 12px;
  cursor: pointer;
  font-size: 18px;
`;

export const PopupTitle = styled.h3`
  margin-bottom: 15px;
`;

export const PopupInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;