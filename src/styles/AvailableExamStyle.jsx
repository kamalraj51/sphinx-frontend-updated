import styled, { css } from "styled-components";

/* ─── Design Tokens ────────────────────────────────────────────── */
const token = {
  primary: "#4f46e5",
  primaryLight: "#6366f1",
  primaryGlow: "rgba(79,70,229,0.18)",
  indigo50: "#eef2ff",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate600: "#475569",
  slate800: "#1e293b",
  emerald: "#10b981",
  emeraldLight: "#d1fae5",
  amber: "#f59e0b",
  amberLight: "#fef3c7",
  red: "#ef4444",
  redLight: "#fee2e2",
  surface: "#ffffff",
  radius: "14px",
  shadow: "0 4px 24px rgba(79,70,229,0.10)",
  shadowHover: "0 8px 32px rgba(79,70,229,0.16)",
};

/* ─── Page Container ───────────────────────────────────────────── */
export const AvailableContainer = styled.div`
  margin: 16px 0;
  padding: 0 12px;
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
`;

/* ─── Header Banner ────────────────────────────────────────────── */
export const HeadingTable = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: ${token.radius};
  padding: 28px 32px;
  margin-bottom: 20px;
  box-shadow: 0 8px 30px rgba(79, 70, 229, 0.35);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 70% 30%, rgba(255,255,255,0.12) 0%, transparent 60%);
    pointer-events: none;
  }
`;

export const H2 = styled.h2`
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.3px;
  margin: 0 0 4px;
`;

export const H2Sub = styled.p`
  color: rgba(255, 255, 255, 0.86);
  font-size: 16px;
  margin: 0;
  font-weight: 400;
`;

/* ─── Table Wrapper (Card) ─────────────────────────────────────── */
export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: ${token.surface};
  border-radius: ${token.radius};
  border: 1px solid ${token.slate200};
  box-shadow: ${token.shadow};
  padding: 8px 0;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: ${token.shadowHover};
  }
`;

/* ─── Table Elements ───────────────────────────────────────────── */
export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 820px;
`;

export const THead = styled.thead``;

export const TBody = styled.tbody``;

export const TR = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${token.slate200};
  }

  &:hover td {
    background: ${token.indigo50};
  }

  transition: background 0.15s ease;
`;

export const TH = styled.th`
  padding: 14px 16px;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: ${token.slate600};
  background: ${token.slate100};
  border-bottom: 2px solid ${token.slate200};
  white-space: nowrap;

  &:first-child {
    border-radius: 10px 0 0 0;
    padding-left: 20px;
  }
  &:last-child {
    border-radius: 0 10px 0 0;
    padding-right: 20px;
  }
`;

export const TD = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  color: ${token.slate800};
  vertical-align: top;
  line-height: 1.5;
  background: ${token.surface};
  transition: background 0.15s ease;

  &:first-child { padding-left: 20px; }
  &:last-child  { padding-right: 20px; }
`;

/* ─── Description cell: wraps fully, no truncation ────────────── */
export const DescriptionCell = styled(TD)`
  white-space: normal;
  word-break: break-word;
  min-width: 180px;
  max-width: 280px;
  color: ${token.slate600};
  font-size: 13px;
  line-height: 1.6;
`;

/* ─── Badge Pills ──────────────────────────────────────────────── */
const badgePalette = {
  indigo:  { bg: token.indigo50,      color: token.primary },
  slate:   { bg: token.slate100,      color: token.slate600 },
  emerald: { bg: token.emeraldLight,  color: "#065f46" },
};

export const BadgePill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.2px;

  ${({ $color = "slate" }) => css`
    background: ${badgePalette[$color]?.bg || token.slate100};
    color: ${badgePalette[$color]?.color || token.slate600};
  `}
`;

/* ─── Action Buttons ───────────────────────────────────────────── */
const actionVariants = {
  edit: {
    bg: token.indigo50,
    color: token.primary,
    hoverBg: token.primary,
    hoverColor: "#fff",
  },
  delete: {
    bg: token.redLight,
    color: token.red,
    hoverBg: token.red,
    hoverColor: "#fff",
  },
  assign: {
    bg: token.emeraldLight,
    color: "#065f46",
    hoverBg: token.emerald,
    hoverColor: "#fff",
  },
};

export const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, transform 0.15s ease,
    box-shadow 0.18s ease;

  ${({ $variant = "edit" }) => {
    const v = actionVariants[$variant];
    return css`
      background: ${v.bg};
      color: ${v.color};

      &:hover {
        background: ${v.hoverBg};
        color: ${v.hoverColor};
        transform: translateY(-1px);
        box-shadow: 0 4px 10px ${v.hoverBg}55;
      }
      &:active {
        transform: scale(0.95);
      }
    `;
  }}
`;

export const BtnGroup = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
`;

/* ─── Empty State ──────────────────────────────────────────────── */
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${token.slate600};
  font-size: 15px;
  opacity: 0.7;
`;

/* ─── Legacy exports kept for other files that import them ─────── */
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
  background-color: ${({ theme }) => theme?.colors?.surface || "#fff"};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme?.colors?.border || "#e5e7eb"};
`;

export const ExamHeaderRow = styled(ExamRow)`
  background-color: ${({ theme }) => theme?.colors?.primary || "#4f46e5"};
  color: white;
  font-weight: 600;
`;

export const ExamCol = styled.div`
  flex: 1;
  padding: 0 8px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ButtonDiv = styled.div`
  display: flex;
  gap: 5px;
`;

export const Add = styled.button`
  background-color: ${({ theme }) => theme?.colors?.success || "#10b981"};
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
`;

export const Edit = styled.button`
  background: ${({ theme }) => theme?.colors?.secondary || "#e2e8f0"};
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

export const Upload = styled.button`
  background-color: ${({ theme }) => theme?.colors?.warning || "#f59e0b"};
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
`;

export const Delete = styled.button`
  background-color: ${({ theme }) => theme?.colors?.error || "#ef4444"};
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 450px;
  max-width: 100%;
  margin: 30px auto;
  padding: 30px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme?.colors?.surface || "#fff"};
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
`;

export const Select = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme?.colors?.border || "#e5e7eb"};
`;

export const Option = styled.option``;

export const Input = styled.input`
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme?.colors?.border || "#e5e7eb"};
  background-color: transparent;
`;

export const Button = styled.button`
  background-color: ${({ theme }) => theme?.colors?.primary || "#4f46e5"};
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;

export const ButtonSecondary = styled(Button)`
  background-color: ${({ theme }) => theme?.colors?.success || "#10b981"};
`;

export const ExamUpdate = styled.a``;
