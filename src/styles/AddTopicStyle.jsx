import styled from "styled-components";

// Breakpoints
const breakpoints = {
  mobile: "480px",
  tablet: "768px",
};

// Main container
export const TopicContainer = styled.div`
  background: ${({ theme }) => theme.colors.background};
  

  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  @media (max-width: ${breakpoints.mobile}) {
    align-items: flex-start;
    padding-top: 2rem;
  }
`;

// Form card
export const FormContainer = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1.5rem;
    border-radius: 10px;
  }
`;


export const H2 = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1.5rem;
  font-size: 1.5rem;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 1.3rem;
  }
`;


export const TopicField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
`;


export const TopicLabel = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.85rem;
  }
`;


export const TopicInput = styled.input`
  padding: 0.65rem 0.7rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  outline: none;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(94, 129, 172, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.9rem;
    padding: 0.6rem;
  }
`;


export const TopicButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: green;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.95rem;
    padding: 0.65rem;
  }
`;


export const TopicError = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.8rem;
  margin-top: 0.3rem;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.75rem;
  }
`;


export const ApiError = styled.p`
  color: ${({ theme }) => theme.colors.error};
  background: rgba(191, 97, 106, 0.1);
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.8rem;
    padding: 0.5rem;
  }
`;