import React, { useState } from "react";
import styled from "styled-components";

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  border: 2px solid ${({ $selected }) => ($selected ? "#2563eb" : "#e8eaf0")};
  background: ${({ $selected }) => ($selected ? "#eff6ff" : "#fafafa")};
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;

  &:hover {
    border-color: ${({ $selected }) => ($selected ? "#2563eb" : "#a5b4fc")};
    background: ${({ $selected }) => ($selected ? "#eff6ff" : "#f5f7ff")};
  }
`;

const Checkbox = styled.div`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 2px solid ${({ $selected }) => ($selected ? "#2563eb" : "#d1d5db")};
  background: ${({ $selected }) => ($selected ? "#2563eb" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
`;

const CheckMark = styled.svg`
  width: 11px;
  height: 11px;
  stroke: #ffffff;
  stroke-width: 2.5;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
`;

const Badge = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ $selected }) => ($selected ? "#2563eb" : "#e8eaf0")};
  color: ${({ $selected }) => ($selected ? "#ffffff" : "#6b7280")};
  transition: all 0.2s;
`;

const OptionText = styled.p`
  font-size: 0.95rem;
  color: ${({ $selected }) => ($selected ? "#1e40af" : "#374151")};
  font-weight: ${({ $selected }) => ($selected ? "500" : "400")};
  margin: 0;
  flex: 1;
  line-height: 1.5;
`;

const Hint = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0 0 1rem 0;
`;

const MultiChoice = ({ item, setAnswerValue }) => {
  const [selected, setSelected] = useState([]);
  const options = ["A", "B", "C", "D"];

  const toggle = (opt) => {
    const updated = selected.includes(opt)
      ? selected.filter((o) => o !== opt)
      : [...selected, opt];
    setSelected(updated);
    setAnswerValue(updated.join(","));
  };

  return (
    <>
      <Hint>Select all that apply</Hint>
      <OptionList>
        {options.map((opt) => {
          const optionText = item?.[`option${opt}`];
          if (!optionText) return null;
          const isSelected = selected.includes(opt);
          return (
            <OptionLabel
              key={opt}
              $selected={isSelected}
              onClick={() => toggle(opt)}
            >
              <Checkbox $selected={isSelected}>
                <CheckMark $visible={isSelected} viewBox="0 0 12 12">
                  <polyline points="1.5,6 4.5,9 10.5,3" />
                </CheckMark>
              </Checkbox>
              <Badge $selected={isSelected}>{opt}</Badge>
              <OptionText $selected={isSelected}>{optionText}</OptionText>
            </OptionLabel>
          );
        })}
      </OptionList>
    </>
  );
};

export default MultiChoice;
