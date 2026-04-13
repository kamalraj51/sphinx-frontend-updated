import styled from "styled-components";

/* CONTAINER */
export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background: ${({ theme }) => theme.colors.background};
  background-image: 
    radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(6, 182, 212, 0.15) 0px, transparent 50%);
  background-attachment: fixed;
`;

/* WRAPPER */
export const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* TITLE */
export const LoginTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 6px;

  color: ${({ theme }) => theme.colors.primary};
`;

/* SUBTITLE */
export const LoginSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 20px;
`;

/* FORM */
export const LoginForm = styled.form`
  background: ${({ theme }) => theme.colors.surface || theme.colors.background};
  backdrop-filter: ${({ theme }) => theme.colors.blur || "none"};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.blur || "none"};
  padding: 40px;
  width: 400px;
  border-radius: 20px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  border: ${({ theme }) => theme.colors.glassBorder || `1px solid ${theme.colors.border}`};
  box-shadow: ${({ theme }) => theme.colors.shadowMain || "0 6px 20px rgba(0, 0, 0, 0.06)"};

  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.colors.shadowHover || "0 10px 25px rgba(0, 0, 0, 0.1)"};
  }

  h2 {
    text-align: center;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 8px;
    font-weight: 700;
    font-size: 1.5rem;
  }
`;

/* FIELD */
export const LoginField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

/* LABEL */
export const LoginLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/* INPUT */
export const LoginInput = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  background: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.textPrimary};

  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

/* ERROR */
export const LoginError = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: 12px;
`;

/* BUTTON */
export const LoginButton = styled.button`
  margin-top: 16px;
  padding: 12px;
  border: none;
  border-radius: 10px;

  background: ${({ theme }) => theme.colors.gradientAction || theme.colors.primary};
  color: white;

  font-weight: 600;
  font-size: 15px;
  cursor: pointer;

  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.4);
    filter: brightness(1.1);
  }
  
  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }
`;

/* FOOTER */
export const LoginFooter = styled.p`
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;

  /* Make the wrapper look like the input box */
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 0 14px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    background: rgba(255, 255, 255, 0.1);
  }

  i {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 16px;
    cursor: pointer;
    flex-shrink: 0;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const LoginInputPass = styled.input`
  flex: 1;
  padding: 10px 8px;
  font-size: 14px;
  border: none;         /* Remove border from input */
  outline: none;        /* Remove focus ring from input */  
  background: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;