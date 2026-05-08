import Layout from "../component/Layout";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";
import { H2 } from "../styles/ExamTDetails.style";
import { useSelector } from "react-redux";
import { BackBtn } from "./ExamUpdate";

export const PremiumWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors?.surface || "#ffffff"};
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid ${({ theme }) => theme.colors?.border || "#f3f4f6"};
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors?.textPrimary || "#111827"};
    margin-bottom: 8px;
  }

  p {
    color: ${({ theme }) => theme.colors?.textSecondary || "#6b7280"};
    font-size: 15px;
  }
`;

export const TypePillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 35px;
`;

export const TypePill = styled.button`
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid
    ${({ active, theme }) =>
    active
      ? theme.colors?.primary || "#4f46e5"
      : theme.colors?.border || "#e5e7eb"};
  background: ${({ active, theme }) =>
    active ? theme.colors?.primary || "#4f46e5" : "transparent"};
  color: ${({ active, theme }) =>
    active ? "#ffffff" : theme.colors?.textPrimary || "#374151"};
  cursor: pointer;
`;

export const FormGroup = styled.div`
  margin-bottom: 25px;

  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: ${({ theme }) => theme.colors?.background || "#f9fafb"};
`;



export const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
  min-height: 120px;
  background: ${({ theme }) => theme.colors?.background || "#f9fafb"};
   padding-top: 45px; 
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

export const OptionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
 
export const SubmitBtn = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 40px;
  display:flex;
  justify-content:center;
  align-items:center;
`;

const CreateQuestion = () => {
  const [questionType, setQuestionType] = useState("SINGLE_CHOICE");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [singleAnswer, setSingleAnswer] = useState("A");
  const [textAnswer, setTextAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.auth.user);


  const { topicID, tname } = useParams();
  const navigate = useNavigate();

  let optionA = "";
  let optionB = "";
  let tag = false;

  const [formData, setFormData] = useState({
    topicId: topicID,
    questionDetail: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answer: "",
    numAnswers: 1,
    questionTypeId: "SINGLE_CHOICE",
    userLoginId:userId
  });

  useEffect(() => {
    fetch("https://localhost:8443/sphinx/api/topic/gettopics")
      .then((res) => res.json())
      .catch(() => toast.error("Failed to load topics"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCheckboxChange = (value) => {
    setSelectedAnswers((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleSubmit = async () => {
    if (!formData.questionDetail.trim()) {
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
      const response = await fetch(
        "https://localhost:8443/sphinx/api/question/create-question",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        },
      );

      if (!response.ok) throw new Error("Failed");

      toast.success("Question Created Successfully!");
      navigate(`/show-question/${topicID}/${tname}`);
    } catch (err) {
      toast.error("Failed to create question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PremiumWrapper>
        <H2 style={{ fontWeight: 600, fontSize: "16px" }}>Topic Name: {tname}</H2>
        <HeaderSection>
          <h1>Create Question</h1>
        </HeaderSection>

        <TypePillContainer>
          {[
            "SINGLE_CHOICE",
            "MULTI_CHOICE",
            "TRUE_FALSE",
            "FILL_BLANKS",
            "DETAILED_ANSWER",
          ].map((type) => (
            <TypePill
              key={type}
              active={questionType === type}
              onClick={() => {
                setQuestionType(type);

                if (type === "TRUE_FALSE") {
                  tag = true;
                  optionA = formData.optionA;
                  optionB = formData.optionB;
                  setSingleAnswer("A");
                  setFormData((prev) => ({
                    ...prev,
                    optionA: "True",
                    optionB: "False",
                    optionC: "",
                    optionD: "",
                  }));
                } if (tag) {
                  tag = false;
                  setFormData((prev) => ({
                    ...prev,
                    optionA: optionA,
                    optionB: optionB,
                  }));
                }
              }}
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
          />
        </FormGroup>

        {questionType !== "FILL_BLANKS" &&
          questionType !== "DETAILED_ANSWER" && (
            <FormGroup>
              <label>Options</label>
              <OptionsGrid>
                {[
                  "A",
                  "B",
                  ...(questionType !== "TRUE_FALSE" ? ["C", "D"] : []),
                ].map((opt) => {
                  const isActive =
                    questionType === "MULTI_CHOICE"
                      ? selectedAnswers.includes(opt)
                      : singleAnswer === opt;

                  return (
                    <OptionCard key={opt}>
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

                      {questionType === "TRUE_FALSE" ? (
  <Input
    id={`option${opt}`}
    value={opt === "A" ? "True" : "False"}
    disabled
    readOnly
    className="your-input-styles"
  />
) : (
  <Textarea
    id={`option${opt}`}
    value={formData[`option${opt}`]}
    onChange={handleChange}
    placeholder={`Option ${opt}`}
    rows={1}
    className="your-input-styles"
  />
)}
                    </OptionCard>
                  );
                })}
              </OptionsGrid>
            </FormGroup>
          )}

        {(questionType === "FILL_BLANKS" ||
          questionType === "DETAILED_ANSWER") && (
            <FormGroup>
              <label>Answer</label>
              <Textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
              />
            </FormGroup>
          )}
<div style={{display:"flex", justifyContent:"space-between", columnGap:"30px"}}>
        <BackBtn style={{backgroundColor:"green", width: "12%",

  padding: "16px",
  borderRadius: "12px",
 background: "linear-gradient(135deg, #10b981, #059669)",
  color: "white",
  border: "none",
  cursor: "pointer",
  marginTop: "40px"}}
                      onClick={() => {
                        navigate(-1);
                      }}
                    >
                     <ArrowLeft size={14} />Cancel
                    </BackBtn>
        <SubmitBtn onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Save Question"}<ChevronRight size={16}/>
        </SubmitBtn>
        </div>
      </PremiumWrapper>
    </Layout>
  );
};

export default CreateQuestion;
