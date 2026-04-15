import styled from "styled-components";

export const AvailableContainer = styled.div`
  margin: 10px 0px;
  padding: 0px 10px;
`;

export const HeadingTable = styled.div`
  background: ${({ theme }) => theme.colors.gradientAction || theme.colors.primary};
  border: none;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.2);
  text-align: center;
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background-color: ${({ theme }) => theme.colors.surface || theme.colors.background};
  backdrop-filter: ${({ theme }) => theme.colors.blur || "none"};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.blur || "none"};
  border-radius: 16px;
  border: ${({ theme }) => theme.colors.glassBorder || `1px solid ${theme.colors.border}`};
  box-shadow: ${({ theme }) => theme.colors.shadowMain || "0 4px 10px rgba(0,0,0,0.05)"};
  padding: 20px;
  
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    box-shadow: ${({ theme }) => theme.colors.shadowHover || "0 10px 25px rgba(0,0,0,0.1)"};
  }
`;

export const H2 = styled.h2`
  color: ${({ theme }) => theme.colors.surface};
  font-size: 24px;
  font-weight: 600;
`;

export const AvailableTable = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ExamRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors?.surface || '#ffffff'};
  color: ${({ theme }) => theme.colors?.textPrimary || '#333'};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.05);
  }
`;

export const ExamHeaderRow = styled(ExamRow)`
  background-color: ${({ theme }) => theme.colors?.primary || '#4f46e5'};
  color: white;
  border: none;
  font-weight: 600;
  
  &:hover {
    transform: none;
    box-shadow: none;
  }
`;

export const ExamCol = styled.div`
  flex: 1;
  text-align: left;
  padding: 0 8px;
  display: flex;
  align-items: center;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:nth-child(1) { flex: 0.5; } /* Sl.No */
  &:nth-child(2) { flex: 1.5; font-weight: 500; } /* Name */
  &:nth-child(3) { flex: 2; } /* Desc */
  &:nth-child(7), &:nth-child(8), &:nth-child(9) { flex: 1.2; justify-content: center; } /* Actions */
`;
export const ButtonDiv = styled.div`
display:flex;
gap:5px;
`

export const Add = styled.button`
  background-color: ${({ theme }) => theme.colors.success};  /* was empty before */
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 10px;

  &:hover {
    opacity: 0.85;
  }
`;

export const Edit = styled.button`
    background: ${({ theme }) => theme.colors.secondary};
  padding: 10px 10px;
  border: none;
  border-radius: 6px;
  color:black;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 10px;

  &:hover {
    background: ${({ theme }) => theme.colors.textPrimary};
    
    color:white;
  }

    &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

export const Upload = styled.button`
  background-color: ${({ theme }) => theme.colors.warning};
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 5px 10px;

  &:hover {
    opacity: 0.85;
  }
`;

export const Delete = styled.button`
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.surface};
 padding: 10px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.85;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 450px;
  max-width: 100%;
  margin: 30px auto;
  padding: 30px;
  border: ${({ theme }) => theme.colors.glassBorder || `1px solid ${theme.colors.border}`};
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.surface || theme.colors.background};
  backdrop-filter: ${({ theme }) => theme.colors.blur || "none"};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.blur || "none"};
  box-shadow: ${({ theme }) => theme.colors.shadowMain || "0 6px 20px rgba(0, 0, 0, 0.08)"};
`;

export const Select = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Option = styled.option`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Input = styled.input`
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const Button = styled.button`
background-color: ${({ theme }) => theme.colors.primary};
color: ${({ theme }) => theme.colors.surface};
padding: 10px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.85;
  }
`;

export const ButtonSecondary = styled(Button)`
  background-color: ${({ theme }) => theme.colors.success};

  &:hover {
    opacity: 0.85;
  }
`;
export const ExamUpdate = styled.a`

`