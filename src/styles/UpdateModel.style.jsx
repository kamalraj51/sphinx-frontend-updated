import styled from "styled-components";

/* Overlay */
export const ContainerModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 10px;

 
`;

/* Modal Box */
export const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  max-width: 95%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  position: relative;

  @media (max-width: 480px) {
    width: 100%;
    border-radius: 12px 12px 0 0;
    padding: 16px;
  }
`;

/* Header */
export const HeadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;

  p {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }
`;

/* Title (optional if you want separate heading) */
export const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors?.error || "#e3342f"};
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* Form Row (Input + Button) */
export const FormRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

/* Input */
export const Input = styled.input`
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors?.error || "#e3342f"};
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

/* Button */
export const Button = styled.button`
  background-color: ${({ theme }) => theme.colors?.error || "#e3342f"};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;