// import styled from "styled-components";


// export const RegisterContainer = styled.div`
// padding:50px 0px;
//   min-height: 100vh;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   background: ${({ theme }) => theme.colors.background};
// `;


// export const RegisterWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;


// export const RegisterTitle = styled.h1`
//   font-size: 28px;
//   font-weight: 700;
//   letter-spacing: 2px;
//   margin-bottom: 6px;

//   color: ${({ theme }) => theme.colors.primary};
// `;


// export const RegisterSubtitle = styled.p`
//   font-size: 13px;
//   color: ${({ theme }) => theme.colors.textSecondary};
//   margin-bottom: 20px;
// `;


// export const RegisterForm = styled.form`
//   background: ${({ theme }) => theme.colors.surface};
//   padding: 30px;
//   width: 380px;
//   border-radius: 12px;

//   display: flex;
//   flex-direction: column;
//   gap: 14px;

//   border: 1px solid ${({ theme }) => theme.colors.border};
//   box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);

//   h2 {
//     text-align: center;
//     color: ${({ theme }) => theme.colors.textPrimary};
//   }
// `;


// export const RegisterField = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 4px;
// `;


// export const RegisterLabel = styled.label`
//   font-size: 12px;
//   font-weight: 600;
//   color: ${({ theme }) => theme.colors.textSecondary};
// `;


// export const RegisterInput = styled.input`
//   padding: 10px;
//   border-radius: 6px;
//   border: 1px solid ${({ theme }) => theme.colors.border};
//   font-size: 14px;

//   outline: none;
//   transition: border 0.2s ease;

//   &:focus {
//     border-color: ${({ theme }) => theme.colors.primary};
//   }
// `;

// /* ERROR */
// export const RegisterError = styled.p`
//   color: ${({ theme }) => theme.colors.error};
//   font-size: 12px;
// `;

// /* API ERROR */
// export const ApiError = styled.p`
//   color: ${({ theme }) => theme.colors.error};
//   text-align: center;
//   font-size: 13px;
// `;


// export const RegisterButton = styled.button`
//   margin-top: 10px;
//   padding: 10px;
//   border: none;
//   border-radius: 6px;

//   background: ${({ theme }) => theme.colors.primary};
//   color: white;

//   font-weight: 600;
//   cursor: pointer;

//   transition: background 0.2s ease;

//   &:hover {
//     background: ${({ theme }) => theme.colors.secondary};
//   }

//   &:disabled {
//     background: ${({ theme }) => theme.colors.border};
//     cursor: not-allowed;
//   }
// `;

// /* FOOTER */
// export const RegisterFooter = styled.p`
//   text-align: center;
//   font-size: 13px;
//   color: ${({ theme }) => theme.colors.textSecondary};

//   a {
//     color: ${({ theme }) => theme.colors.primary};
//     text-decoration: none;
//   }

//   a:hover {
//     text-decoration: underline;
//   }
// `;
import styled from "styled-components";

/* ================= CONTAINER ================= */
export const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 16px;

  
`;

/* ================= WRAPPER ================= */
export const RegisterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* ================= TITLE ================= */
export const RegisterTitle = styled.h1`
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 3px;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.primary};
`;

/* ================= SUBTITLE ================= */
export const RegisterSubtitle = styled.p`
  font-size: 14px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/* ================= FORM CARD ================= */
export const RegisterForm = styled.form`
  width: 480px;
  max-width: 100%;

  background: ${({ theme }) => theme.colors.surface || theme.colors.background};
  border: ${({ theme }) => theme.colors.glassBorder || `1px solid ${theme.colors.border}`};
  border-radius: 20px;

  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;

  box-shadow: ${({ theme }) => theme.colors.shadowMain || "0 18px 50px rgba(0, 0, 0, 0.25)"};
  backdrop-filter: ${({ theme }) => theme.colors.blur || "blur(12px)"};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.blur || "blur(12px)"};


  h2 {
    text-align: center;
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (max-width: 500px) {
    padding: 24px;
    border-radius: 14px;
  }
`;

/* ================= FLOATING FIELD WRAPPER ================= */
export const FieldWrapper = styled.div`
  position: relative;
`;

/* ================= INPUT ================= */
export const FloatingInput = styled.input`
  width: 100%;
  padding: 14px 12px;
  font-size: 14px;

  border-radius: 10px;
  border: 1px solid #ddd;

  background: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};

  outline: none;
  transition: all 0.25s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}22;
  }

  /* FLOAT LABEL TRIGGER */
  &:focus + label,
  &:not(:placeholder-shown) + label {
  top: -3px;
  left: 10px;
  font-size: 11px;
  color: #4F46E5;
  background: #f2f4f6;
  padding: 0 3px;
  }
`;

/* ================= FLOATING LABEL ================= */
export const FloatingLabel = styled.label`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);

  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};

  pointer-events: none;
  transition: 0.2s ease;
`;

/* ================= PASSWORD WRAPPER ================= */
export const PasswordWrapper = styled.div`
margin-top:5px;
  position: relative;
`;

/* ================= SHOW/HIDE PASSWORD ================= */
export const TogglePassword = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);

  cursor: pointer;
  font-size: 14px;

  color: ${({ theme }) => theme.colors.textSecondary};

  user-select: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

/* ================= ERROR TEXT ================= */
export const RegisterError = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: 4px;
`;

/* ================= API ERROR ================= */
export const ApiError = styled.p`
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.error};
`;

/* ================= BUTTON ================= */
export const RegisterButton = styled.button`
  margin-top: 10px;
  padding: 14px;
  border: none;
  border-radius: 12px;

  font-size: 15px;
  font-weight: 600;
  color: white;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  background: ${({ theme }) => theme.colors.gradientAction || theme.colors.primary};
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);

  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.95;
  }

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

/* ================= SPINNER ================= */
export const Spinner = styled.div`
  width: 16px;
  height: 16px;

  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;

  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/* ================= FOOTER ================= */
export const RegisterFooter = styled.p`
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
  }

  a:hover {
    text-decoration: underline;
  }
`;