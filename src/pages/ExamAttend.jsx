import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import SingleChoice from "../component/SingleChoice";
import MultiChoice from "../component/MultiChoice";
import { useParams } from "react-router-dom";
import TrueorFalse from "../component/TrueorFalse";
import DetailedAnswer from "../component/DetailedAnswer";
import FillBlanks from "../component/FillBlanks";
import { Question } from "../styles/QuestionStyle";

const ExamAttend = () => {
  const { examId } = useParams();

  const [question, setQuestion] = useState({});
  const [offSet, setOffset] = useState(0);
  const [sno, setSno] = useState(0);
  const [answerValue, setAnswerValue] = useState("");

  const getQuestion = async () => {
    try {
      const response = await fetch(
        `https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${offSet}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setQuestion(data.questions?.[0] || {});
      } else {
        toast.error(data.error || "Failed to load question");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    getQuestion();
  }, [offSet, examId]);


  const submitAnswer = async () => {
    const newSno = sno + 1;
    setSno(newSno);

    const updatedAnswer = {
      questionId: question.qId,
      examId: examId,
      submittedAnswer: answerValue,
      sNo: newSno,
      isFlagged: false,
    };

    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/submited-answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAnswer),
        }
      );

      if (response.ok) {
        setOffset((prev) => prev + 1);
        setAnswerValue(""); // reset answer for next question
      } else {
        const data = await response.json();
        toast.error(data.error || "Submit failed");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };
console.log(offSet)

  return (
    <>
      <Question>{question.questionDetail}</Question>

      {question.questionTypeId === "SINGLE_CHOICE" && (
        <SingleChoice item={question}  setAnswerValue={setAnswerValue}/>
      )}

      {question.questionTypeId === "MULTI_CHOICE" && (
        <MultiChoice item={question} setAnswerValue={setAnswerValue}/>
      )}

      {question.questionTypeId === "FILL_BLANKS" && (
        <FillBlanks
          answerValue={answerValue}
          setAnswerValue={setAnswerValue}
        />
      )}

      {question.questionTypeId === "TRUE_FALSE" && (
        <TrueorFalse
          item={question}
          answerValue={answerValue}
          setAnswerValue={setAnswerValue}
        />
      )}

      {question.questionTypeId === "DETAILED_ANSWER" && (
        <DetailedAnswer
          item={question}
          answerValue={answerValue}
          setAnswerValue={setAnswerValue}
        />
      )}

      <button onClick={submitAnswer}>Next</button>
    </>
  );
};

export default ExamAttend;