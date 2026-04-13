import Layout from "../component/Layout";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

// Redefining some specialized premium styles directly here or using from theme
const PremiumWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors?.surface || '#ffffff'};
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  border: 1px solid ${({ theme }) => theme.colors?.border || '#f3f4f6'};
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.textPrimary || '#111827'};
    margin-bottom: 8px;
  }
  
  p {
    color: ${({ theme }) => theme.colors?.textSecondary || '#6b7280'};
    font-size: 15px;
  }
`;

const TypePillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 35px;
`;

const TypePill = styled.button`
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${({ active, theme }) => active ? (theme.colors?.primary || '#4f46e5') : (theme.colors?.border || '#e5e7eb')};
  background: ${({ active, theme }) => active ? (theme.colors?.primary || '#4f46e5') : 'transparent'};
  color: ${({ active, theme }) => active ? '#ffffff' : (theme.colors?.textPrimary || '#374151')};
  box-shadow: ${({ active }) => active ? '0 4px 14px rgba(79, 70, 229, 0.3)' : 'none'};
  cursor: pointer;

  &:hover {
    background: ${({ active, theme }) => active ? (theme.colors?.primary || '#4f46e5') : (theme.colors?.background || '#f9fafb')};
    transform: translateY(-1px);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  
  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.textPrimary || '#374151'};
    margin-bottom: 8px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: ${({ theme }) => theme.colors?.background || '#f9fafb'};
  color: ${({ theme }) => theme.colors?.textPrimary || '#111827'};
  font-size: 15px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary || '#4f46e5'};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    background: ${({ theme }) => theme.colors?.surface || '#ffffff'};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#d1d5db'};
  background: ${({ theme }) => theme.colors?.background || '#f9fafb'};
  color: ${({ theme }) => theme.colors?.textPrimary || '#111827'};
  font-size: 15px;
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary || '#4f46e5'};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: ${({ theme }) => theme.colors?.background || '#f9fafb'};
  color: ${({ theme }) => theme.colors?.textPrimary || '#111827'};
  font-size: 15px;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary || '#4f46e5'};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;

  @media(max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const OptionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${({ active, theme }) => active ? 'rgba(79, 70, 229, 0.05)' : (theme.colors?.surface || '#ffffff')};
  transition: all 0.2s;

  input[type="radio"], input[type="checkbox"] {
    cursor: pointer;
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  background: green;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
  margin-top: 40px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const MarksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const UpdateQuestion = () => {
  const { quesId } = useParams();
  const [questionType, setQuestionType] = useState("SINGLE_CHOICE");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [singleAnswer, setSingleAnswer] = useState("A");
  const [textAnswer, setTextAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    questionId: quesId,
    questionDetail: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answer: "",
    numAnswers: 1,
    questionTypeId: "SINGLE_CHOICE",
    difficultyLevel: 1,
    answerValue: 1,
    negativeMarkValue: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch("https://localhost:8443/sphinx/api/question/getquesbyid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId: quesId }),
        });
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        
        if (data && data.question && data.question.question) {
          const fetchedQuestion = data.question.question;
          setFormData(fetchedQuestion);
          setQuestionType(fetchedQuestion.questionTypeId);
          
          const ans = fetchedQuestion.answer || "";
          if (fetchedQuestion.questionTypeId === "MULTI_CHOICE") {
             setSelectedAnswers(ans.split(","));
          } else if (fetchedQuestion.questionTypeId === "SINGLE_CHOICE" || fetchedQuestion.questionTypeId === "TRUE_FALSE") {
             setSingleAnswer(ans);
          } else {
             setTextAnswer(ans);
          }
        }
      } catch (err) {
        toast.error("Failed to fetch this question's data.");
      }
    };

    fetchQuestion();
  }, [quesId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCheckboxChange = (value) => {
    setSelectedAnswers((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    if (!formData.questionDetail || !formData.questionDetail.trim()) {
      toast.error("Question detail is required");
      return;
    }

    setLoading(true);

    const finalData = {
      ...formData,
      questionTypeId: questionType,
      answer:
        questionType === "MULTI_CHOICE"
          ? selectedAnswers.join(",")
          : questionType === "FILL_BLANKS" || questionType === "DETAILED_ANSWER"
            ? textAnswer
            : singleAnswer,
    };

    try {
      const response = await fetch("https://localhost:8443/sphinx/api/question/updatequestion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) throw new Error("Failed to update question");

      toast.success("Question Updated Successfully!");
      navigate("/showalltopic");
    } catch (err) {
      toast.error(err.message || "Failed to update question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PremiumWrapper>
        <HeaderSection>
          <h1>Update Question</h1>
          <p>Modify existing questions with ease using our advanced editor</p>
        </HeaderSection>

        <TypePillContainer>
          {["SINGLE_CHOICE", "MULTI_CHOICE", "TRUE_FALSE", "FILL_BLANKS", "DETAILED_ANSWER"].map((type) => (
            <TypePill
              key={type}
              active={questionType === type}
              onClick={() => setQuestionType(type)}
            >
              {type.replace("_", " ")}
            </TypePill>
          ))}
        </TypePillContainer>

        <FormGroup>
          <label>Question Detail</label>
          <Textarea
            id="questionDetail"
            value={formData.questionDetail}
            onChange={handleChange}
            placeholder="Type your question here..."
          />
        </FormGroup>

        {questionType !== "FILL_BLANKS" && questionType !== "DETAILED_ANSWER" && (
          <FormGroup>
            <label>Options</label>
            <OptionsGrid>
              {["A", "B", ...(questionType !== "TRUE_FALSE" ? ["C", "D"] : [])].map((opt) => {
                const isActive = questionType === "MULTI_CHOICE" ? selectedAnswers.includes(opt) : singleAnswer === opt;
                return (
                  <OptionCard key={opt} active={isActive}>
                    {questionType === "MULTI_CHOICE" ? (
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => handleCheckboxChange(opt)}
                      />
                    ) : (
                      <input
                        type="radio"
                        checked={isActive}
                        onChange={() => setSingleAnswer(opt)}
                      />
                    )}
                    <Input
                      style={{ background: 'transparent', padding: '8px', boxShadow: 'none' }}
                      id={`option${opt}`}
                      value={formData[`option${opt}`] || ''}
                      onChange={handleChange}
                      placeholder={`Option ${opt}`}
                    />
                  </OptionCard>
                )
              })}
            </OptionsGrid>
          </FormGroup>
        )}

        {(questionType === "FILL_BLANKS" || questionType === "DETAILED_ANSWER") && (
          <FormGroup>
            <label>Answer</label>
            <Textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="Enter correct answer..."
              style={{ minHeight: '80px' }}
            />
          </FormGroup>
        )}

        <SubmitBtn onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Update Question"}
        </SubmitBtn>
      </PremiumWrapper>
    </Layout >
  );
};

export default UpdateQuestion;
