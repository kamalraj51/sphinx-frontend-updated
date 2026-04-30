import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import UserHeader from "../user/UserHeader";

/* ===================== STYLES (UNCHANGED) ===================== */

const Layout = styled.div`
  display: flex;
  gap: 24px;
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
`;

const Left = styled.div`
  flex: 3;
`;

const Right = styled.div`
  flex: 1;
  background: #ffffff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
`;

const Box = styled.div`
  background: #ffffff;
  padding: 28px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h3`
  margin-bottom: 10px;
`;

const SubInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
  color: #555;
`;

const Option = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
  }

  input {
    accent-color: #2563eb;
  }
`;

const Button = styled.button`
  margin: 10px 8px 0 0;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  background: ${(p) => p.bg || "#2563eb"};
  color: white;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

const Palette = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
`;

const QBtn = styled.button`
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  border: ${(p) => (p.active ? "2px solid #111827" : "1px solid #e5e7eb")};

  background: ${(p) => {
    switch (p.status) {
      case "attempted":
        return "#22c55e";
      case "not_answered":
        return "#ef4444";
      case "marked_review":
        return "#facc15";
      default:
        return "#ffffff";
    }
  }};

  color: ${(p) => (p.status ? "#fff" : "#111")};
`;

/* ===================== COMPONENT ===================== */

const ExamAttend = () => {
  const navigate = useNavigate();
  const { examId, duration } = useParams();
  const userId = useSelector((state) => state.auth.user);
  const [skipped, setSkipped] = useState(0);
  const [question, setQuestion] = useState({});
  const [offSet, setOffSet] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answersMap, setAnswersMap] = useState({});

  // ✅ minutes → seconds
  const [time, setTime] = useState(duration * 60);

  const timerRef = useRef(null);

  const currentAnswer = answersMap[offSet]?.answer || [];

  /* ===================== TIMER ===================== */

  useEffect(() => {
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          autoSubmitExam("Time up! Exam submitted.");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  /* ===================== FETCH ===================== */

  const getQuestion = async (offsetValue) => {
    try {
      const res = await fetch(
        `https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${offsetValue}`,
      );
      const data = await res.json();

      if (res.ok) {
        setQuestion(data.questions?.[0] || {});
        setTotalQuestions(data.totalQuestions || 0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getQuestion(offSet);
  }, [offSet]);

  /* ===================== HANDLERS ===================== */

  const handleAnswer = (val) => {
    const type = question.questionTypeId;
    let updated = [];

    if (type === "SINGLE_CHOICE" || type === "TRUE_FALSE") {
      updated = [val];
    } else {
      updated = currentAnswer.includes(val)
        ? currentAnswer.filter((x) => x !== val)
        : [...currentAnswer, val];
    }

    setAnswersMap((prev) => ({
      ...prev,
      [offSet]: { answer: updated, status: "attempted" },
    }));
  };

  const handleFill = (val) => {
    const isAnswered = val.trim() !== "";

    setAnswersMap((prev) => ({
      ...prev,
      [offSet]: {
        answer: isAnswered ? [val] : [],
        status: isAnswered ? "attempted" : "not_answered",
      },
    }));
  };

  const saveAnswer = async () => {
    const data = answersMap[offSet] || { answer: [] };
    if (!data.answer.length) return;

    const payload = {
      questionId: question.qId,
      examId,
      submittedAnswer: data.answer.join(","),
      sNo: offSet + 1,
      isFlagged: 1,
      userLoginId: userId,
    };

    await fetch("https://localhost:8443/sphinx/api/user/submited-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const handleNext = async () => {
    await saveAnswer();
    if (offSet < totalQuestions - 1) setOffSet((p) => p + 1);
  };

  const handlePrev = async () => {
    await saveAnswer();
    if (offSet > 0) setOffSet((p) => p - 1);
  };

  const handleJump = async (i) => {
    await saveAnswer();
    setOffSet(i);
  };

  const markReview = () => {
    setAnswersMap((prev) => ({
      ...prev,
      [offSet]: { answer: currentAnswer, status: "marked_review" },
    }));
  };

  /* ===================== AUTO SUBMIT ===================== */

  const autoSubmitExam = async (msg) => {
    try {
      await saveAnswer();

      const res = await fetch(
        "https://localhost:8443/sphinx/api/user/submit-final",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId: examId, userLoginId: userId }),
        },
      );

      const data = await res.json();

      if (!res.ok) toast.error(data.error);
      else {
        toast.success(msg);
        console.log(data.skipped);
        // setSkipped(data.skipped);
        navigate(`/examresult/${examId}/${userId}/${data.skipped}`);
      }
    } catch {
      toast.error("Auto submit failed");
    }
  };

  /* ===================== MANUAL SUBMIT ===================== */

  const handleSubmitExam = async () => {
    if (!window.confirm("Submit exam?")) return;

    await saveAnswer();

    const res = await fetch(
      "https://localhost:8443/sphinx/api/user/submit-final",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId, userLoginId: userId }),
      },
    );

    const data = await res.json();

    if (!res.ok) toast.error(data.error);
    else {
      toast.success(data.success);
      setSkipped(data.skipped);

      navigate(`/examresult/${examId}/${userId}/${skipped}`);
    }
  };

  /* ===================== RENDER ===================== */

  const renderOptions = () => {
    const type = question.questionTypeId;

    if (type === "FILL_BLANK") {
      return (
        <input
          style={{ padding: "10px", width: "100%" }}
          value={currentAnswer[0] || ""}
          onChange={(e) => handleFill(e.target.value)}
        />
      );
    }

    const opts =
      type === "TRUE_FALSE" ? ["True", "False"] : ["A", "B", "C", "D"];

    return opts.map((opt) => (
      <Option key={opt}>
        <input
          type={type === "MULTI_CHOICE" ? "checkbox" : "radio"}
          checked={currentAnswer.includes(opt)}
          onChange={() => handleAnswer(opt)}
        />
        {question[`option${opt}`] || opt}
      </Option>
    ));
  };

  const formatTime = () => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <>
      <UserHeader />

      <Layout>
        <Left>
          <Box>
            <SubInfo>
              <span>
                Question {offSet + 1} / {totalQuestions}
              </span>
              <span>⏱ {formatTime()}</span>
            </SubInfo>

            <Title>
              Q{offSet + 1}. {question.questionDetail}
            </Title>

            {renderOptions()}

            <div>
              <Button onClick={handlePrev} disabled={offSet === 0} bg="#6c757d">
                Prev
              </Button>

              <Button
                onClick={handleNext}
                disabled={offSet >= totalQuestions - 1}
              >
                Save & Next
              </Button>

              <Button onClick={markReview} bg="#f59e0b">
                Mark Review
              </Button>

              <Button
                bg="#22c55e"
                onClick={() => autoSubmitExam("Exam submitted!")}
              >
                Submit Exam
              </Button>
            </div>
          </Box>
        </Left>

        <Right>
          <h4>Question Palette</h4>

          <Palette>
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <QBtn
                key={i}
                status={answersMap[i]?.status}
                active={i === offSet}
                onClick={() => handleJump(i)}
              >
                {i + 1}
              </QBtn>
            ))}
          </Palette>

          <hr />

          <p>🟢 Attempted</p>
          <p>🔴 Not Answered</p>
          <p>🟡 Marked Review</p>
          <p>⬜ Not Visited</p>
        </Right>
      </Layout>
    </>
  );
};

export default ExamAttend;
