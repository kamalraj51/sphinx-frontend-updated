import styled from "styled-components";



export const Outer = styled.div`

        background: #ffffff;
        border-radius: 14px;
        padding: 24px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        border: 1px solid #f1f5f9;
    
`;




export const Button = styled.button`
  padding: 5px 10px;
  cursor: pointer;
`;
export const Rows=styled.li`
   display: flex,
            justify-ontent: space-between;
            align-items: center;
            padding: 12px 16px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 10px;
            background: #fff;
`
export const List=styled.ul`
`
export const Title=styled.h3`
 margin-bottom: 18px;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
`

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  align-items: center;
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 10px;
  background: #f9fafb;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    transform: translateY(-2px);
  }
`;
export const CellPrimary = styled.p`
  font-weight: 500;
  color: #111827;
`;

export const Cell = styled.p`
  color: #374151;
`;

export const Attempt = styled.p`
  font-weight: 500;
  color: ${({ danger }) => (danger ? "#dc2626" : "#059669")};
`;

export const ActionWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
`;

export const Section = styled.div`
  margin-top: 30px;
`;