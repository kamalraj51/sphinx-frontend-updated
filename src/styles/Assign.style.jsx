import styled from "styled-components";

export const Outer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  backdrop-filter: ${({ theme }) => theme.colors.blur};
  border-radius: 14px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadowMain};
  border: ${({ theme }) => theme.colors.glassBorder};
`;

export const Button = styled.button`
  padding: 8px 14px;
  cursor: pointer;
  border-radius: 8px;
  border: none;
  color: white;
  background: ${({ theme }) => theme.colors.gradientAction};
  transition: 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.colors.shadowHover};
    transform: translateY(-1px);
  }
`;

export const Rows = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.colors.surface};
`;

export const List = styled.ul`
  padding: 0;
  margin: 0;
`;

export const Title = styled.h3`
  margin-bottom: 18px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  align-items: center;
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.colors.surface};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.shadowHover};
  }
`;

export const CellPrimary = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Cell = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Attempt = styled.p`
  font-weight: 500;
  color: ${({ danger, theme }) =>
    danger ? theme.colors.error : theme.colors.success};
`;

export const ActionWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
`;

export const Section = styled.div`
  margin-top: 30px;
`;