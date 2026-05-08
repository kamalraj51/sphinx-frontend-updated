import React from "react";
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

const RadioCircle = styled.div`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ $selected }) => ($selected ? "#2563eb" : "#d1d5db")};
  background: ${({ $selected }) => ($selected ? "#2563eb" : "#ffffff")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
`;

const RadioDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
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

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const SingleChoice = ({ item, setAnswerValue }) => {
  const [selected, setSelected] = React.useState("");
  const options = ["A", "B", "C", "D"];

  const handleChange = (opt) => {
    setSelected(opt);
    setAnswerValue(opt);
  };

  return (
    <OptionList>
      {options.map((opt) => {
        const optionText = item?.[`option${opt}`];
        if (!optionText) return null;
        const isSelected = selected === opt;
        return (
          <OptionLabel
            key={opt}
            $selected={isSelected}
            onClick={() => handleChange(opt)}
          >
            <RadioCircle $selected={isSelected}>
              {isSelected && <RadioDot />}
            </RadioCircle>
            <Badge $selected={isSelected}>{opt}</Badge>
            <OptionText $selected={isSelected}>{opt.optio}</OptionText>
            <HiddenInput
              type="radio"
              name="single-choice"
              value={opt}
              checked={isSelected}
              onChange={() => handleChange(opt)}
            />
          </OptionLabel>
        );
      })}
    </OptionList>
  );
};

export default SingleChoice;