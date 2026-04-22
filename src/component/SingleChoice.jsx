// import React from "react";

// const SingleChoice = ({ question, selectedAnswer, setSelectedAnswer }) => {
//   const options = ["A", "B", "C", "D"];

//   return (
//     <div className="space-y-3">
//       {options.map((opt) => {
//         const isSelected = selectedAnswer === opt;
//         const optionText = question?.[`option${opt}`];

//         if (!optionText) return null;

//         return (
//           <label
//             key={opt}
//             className={`
//               flex items-center gap-4 px-5 py-4 rounded-xl border-2 cursor-pointer
//               transition-all duration-200 select-none
//               ${
//                 isSelected
//                   ? "border-blue-600 bg-blue-50 shadow-md"
//                   : "border-gray-100 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40"
//               }
//             `}
//           >
//             {/* Custom Radio Circle */}
//             <div
//               className={`
//                 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
//                 transition-all duration-200
//                 ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"}
//               `}
//             >
//               {isSelected && (
//                 <div className="w-2 h-2 rounded-full bg-white" />
//               )}
//             </div>

//             {/* Option Badge */}
//             <span
//               className={`
//                 flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center
//                 text-xs font-bold transition-all duration-200
//                 ${isSelected ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}
//               `}
//             >
//               {opt}
//             </span>

//             {/* Option Text */}
//             <p
//               className={`
//                 text-sm md:text-base leading-relaxed flex-1
//                 ${isSelected ? "text-blue-900 font-medium" : "text-gray-700"}
//               `}
//             >
//               {optionText}
//             </p>

//             {/* Hidden native input for accessibility */}
//             <input
//               type="radio"
//               name="single-choice-answer"
//               value={opt}
//               checked={isSelected}
//               onChange={(e) => setSelectedAnswer(e.target.value)}
//               className="sr-only"
//             />
//           </label>
//         );
//       })}
//     </div>
//   );
// };

// export default SingleChoice;
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
