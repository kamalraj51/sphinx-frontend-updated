import Layout from "../component/Layout";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { FormGroup, HeaderSection, Input, OptionCard, OptionsGrid, PremiumWrapper, SubmitBtn, Textarea, TypePill, TypePillContainer } from "./CreateQuestion";
import { H2 } from "../styles/ExamTDetails.style";

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
        const res = await fetch("https://localhost:8443/sphinx/api/question/get-ques-by-id", {
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
      const response = await fetch("https://localhost:8443/sphinx/api/question/update-question", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) throw new Error("Failed to update question");

      toast.success("Question Updated Successfully!");
      navigate(-1);
    } catch (err) {
      toast.error(err.message || "Failed to update question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PremiumWrapper>
        {/* <H2 style={{ fontWeight: 600, fontSize: "16px" }}>Topic Name: {}</H2> */}
        <HeaderSection>
          <h1>Update Question</h1>
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
