import Layout from "../component/Layout";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  FormGroup,
  HeaderSection,
  Input,
  OptionCard,
  OptionsGrid,
  PremiumWrapper,
  SubmitBtn,
  Textarea,
  TypePill,
  TypePillContainer,
} from "./CreateQuestion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { BackBtn } from "./ExamUpdate";

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
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(
          "https://localhost:8443/sphinx/api/question/get-ques-by-id",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId: quesId }),
          }
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        const fetched = data?.question?.question;

        if (!fetched) return;

        let updatedForm = { ...fetched };

        if (fetched.questionTypeId === "TRUE_FALSE") {
          updatedForm.optionA = "True";
          updatedForm.optionB = "False";
          updatedForm.optionC = "";
          updatedForm.optionD = "";
        }

        setFormData(updatedForm);
        setQuestionType(fetched.questionTypeId);

        const ans = fetched.answer || "";

        if (fetched.questionTypeId === "MULTI_CHOICE") {
          setSelectedAnswers(ans.split(","));
        } else if (
          fetched.questionTypeId === "SINGLE_CHOICE" ||
          fetched.questionTypeId === "TRUE_FALSE"
        ) {
          setSingleAnswer(ans || "A");
        } else {
          setTextAnswer(ans);
        }
      } catch (err) {
        toast.error("Failed to fetch question");
      }
    };

    fetchQuestion();
  }, [quesId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCheckboxChange = (value) => {
    setSelectedAnswers((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleTypeChange = (type) => {
    setQuestionType(type);

    if (type === "TRUE_FALSE") {
      setFormData((prev) => ({
        ...prev,
        optionA: "True",
        optionB: "False",
        optionC: "",
        optionD: "",
      }));

      setSingleAnswer((prev) => prev || "A");
    }
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
          : questionType === "FILL_BLANKS" ||
            questionType === "DETAILED_ANSWER"
          ? textAnswer
          : singleAnswer,
    };

    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/question/edit-question",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        }
      );

      if (!response.ok) throw new Error("Failed");

      toast.success("Question updated successfully!");
      navigate(-1);
    } catch (err) {
      toast.error("Failed to update question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PremiumWrapper>
        <HeaderSection>
          <h1>Edit Question</h1>
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
              onClick={() => handleTypeChange(type)}
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
                          value={opt === "A" ? "True" : "False"}
                          disabled
                          readOnly
                        />
                      ) : (
                        <Input
                          id={`option${opt}`}
                          value={formData[`option${opt}`] || ""}
                          onChange={handleChange}
                          placeholder={`Option ${opt}`}
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
                     <ArrowLeft size={14} /> Cancel
                    </BackBtn>
        <SubmitBtn onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Question"}<ChevronRight size={16}/>
        </SubmitBtn>
        </div>
      </PremiumWrapper>
    </Layout>
  );
};

export default UpdateQuestion;