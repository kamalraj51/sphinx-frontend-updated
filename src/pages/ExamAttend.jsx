import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import UserHeader from "../user/UserHeader";

/* ===================== GLOBAL STYLES ===================== */
export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --blue-50:   #E6F1FB;
    --blue-100:  #B5D4F4;
    --blue-200:  #85B7EB;
    --blue-400:  #378ADD;
    --blue-600:  #185FA5;
    --blue-800:  #0C447C;
    --green-50:  #EAF3DE;
    --green-100: #C0DD97;
    --green-600: #3B6D11;
    --green-800: #27500A;
    --amber-50:  #FAEEDA;
    --amber-100: #FAC775;
    --amber-600: #854F0B;
    --red-50:    #FCEBEB;
    --red-100:   #F7C1C1;
    --red-200:   #F09595;
    --red-600:   #A32D2D;
    --gray-50:   #F7F6F2;
    --gray-100:  #EEEDE8;
    --gray-200:  #D3D1C7;
    --gray-400:  #888780;
    --gray-600:  #5F5E5A;
    --gray-800:  #2C2C2A;
    --font:      'Sora', sans-serif;
    --mono:      'DM Mono', monospace;
    --radius-sm: 10px;
    --radius-md: 14px;
    --radius-lg: 18px;
    --radius-xl: 22px;
  }

  body {
    font-family: var(--font);
    background: #F5F4EF;
    margin: 0;
    padding: 0;
  }
`;

/* ===================== KEYFRAMES ===================== */
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;
const slideIn = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`;
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.35}`;
const popIn = keyframes`from{opacity:0;transform:scale(.75)}to{opacity:1;transform:scale(1)}`;
const timerWarn = keyframes`0%,100%{color:var(--red-600)}50%{color:#c94040}`;

/* ===================== SUBMIT MODAL ===================== */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(44, 44, 42, 0.38);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease;
  padding: 16px;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 40px 36px 32px;
  width: 100%;
  max-width: 440px;
  animation: ${slideUp} 0.3s cubic-bezier(0.22, 0.68, 0, 1.2) both;
  box-shadow:
    0 32px 80px rgba(44, 44, 42, 0.18),
    0 2px 8px rgba(44, 44, 42, 0.06);
  border: 1px solid var(--gray-200);
  font-family: var(--font);
`;

const ModalIconRing = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: var(--blue-50);
  border: 1.5px solid var(--blue-100);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 26px;
`;

const ModalTitle = styled.h2`
  font-size: 21px;
  font-weight: 800;
  color: var(--gray-800);
  text-align: center;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
`;

const ModalSub = styled.p`
  font-size: 13px;
  color: var(--gray-400);
  text-align: center;
  margin: 0 0 26px;
  line-height: 1.7;
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 26px;
`;

const StatTile = styled.div`
  background: ${(p) => p.bg || "var(--gray-50)"};
  border: 1.5px solid ${(p) => p.border || "var(--gray-200)"};
  border-radius: var(--radius-md);
  padding: 16px 8px;
  text-align: center;
  transition: transform 0.15s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatVal = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${(p) => p.color || "var(--gray-800)"};
  line-height: 1;
  font-family: var(--mono);
`;
const StatLabel = styled.div`
  font-size: 10px;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 5px;
  font-weight: 600;
`;

const ModalDivider = styled.div`
  height: 1px;
  background: var(--gray-100);
  margin-bottom: 22px;
`;

const ModalBtnRow = styled.div`
  display: flex;
  gap: 10px;
`;

const ModalBtn = styled.button`
  flex: 1;
  padding: 13px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: 1.5px solid ${(p) => (p.primary ? "transparent" : "var(--gray-200)")};
  background: ${(p) =>
    p.primary
      ? "linear-gradient(135deg, var(--green-600), var(--green-800))"
      : "var(--gray-50)"};
  color: ${(p) => (p.primary ? "#fff" : "var(--gray-600)")};
  font-family: var(--font);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s;
  box-shadow: ${(p) =>
    p.primary ? "0 4px 16px rgba(59,109,17,0.22)" : "none"};
  &:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Spinner = styled.svg`
  animation: ${spin} 0.8s linear infinite;
`;

const SubmitConfirmModal = ({ stats, onConfirm, onCancel, submitting }) => (
  <Overlay
    onClick={(e) => e.target === e.currentTarget && !submitting && onCancel()}
  >
    <ModalBox>
      <ModalIconRing>📋</ModalIconRing>
      <ModalTitle>Ready to Submit?</ModalTitle>
      <ModalSub>
        Once submitted, your answers are final.
        <br />
        Here's a snapshot of your progress.
      </ModalSub>

      <StatRow>
        <StatTile bg="var(--green-50)" border="var(--green-100)">
          <StatVal color="var(--green-600)">{stats.attempted}</StatVal>
          <StatLabel>Answered</StatLabel>
        </StatTile>
        <StatTile bg="var(--red-50)" border="var(--red-100)">
          <StatVal color="var(--red-600)">{stats.notAnswered}</StatVal>
          <StatLabel>Skipped</StatLabel>
        </StatTile>
        <StatTile bg="var(--amber-50)" border="var(--amber-100)">
          <StatVal color="var(--amber-600)">{stats.markedReview}</StatVal>
          <StatLabel>Review</StatLabel>
        </StatTile>
      </StatRow>

      <ModalDivider />

      <ModalBtnRow>
        <ModalBtn onClick={onCancel} disabled={submitting}>
          ← Go Back
        </ModalBtn>
        <ModalBtn primary onClick={onConfirm} disabled={submitting}>
          {submitting ? (
            <>
              <Spinner
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </Spinner>
              Submitting…
            </>
          ) : (
            <>✓ Confirm Submit</>
          )}
        </ModalBtn>
      </ModalBtnRow>
    </ModalBox>
  </Overlay>
);

/* ===================== LAYOUT ===================== */
const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f4ef;
  font-family: var(--font);
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 58px;
  background: #fff;
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const ExamLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: var(--gray-800);
  letter-spacing: -0.2px;
  white-space: nowrap;
  span {
    color: var(--blue-600);
  }
`;

const ProgressWrap = styled.div`
  flex: 1;
  height: 4px;
  background: var(--gray-100);
  border-radius: 99px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--blue-400), var(--blue-600));
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const QCounter = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-400);
  white-space: nowrap;
  font-family: var(--mono);
`;

const TimerChip = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  background: ${(p) => (p.warn ? "var(--red-50)" : "var(--green-50)")};
  border: 1px solid ${(p) => (p.warn ? "var(--red-100)" : "var(--green-100)")};
  border-radius: 99px;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${(p) => (p.warn ? "var(--red-600)" : "var(--green-600)")};
  font-family: var(--mono);
  white-space: nowrap;
  transition: all 0.3s;
  animation: ${(p) => (p.warn ? `${timerWarn} 1.2s ease infinite` : "none")};
`;

const TimerDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${(p) => (p.warn ? "var(--red-200)" : "var(--green-100)")};
  animation: ${pulse} 1.8s ease infinite;
`;

const SubmitTopBtn = styled.button`
  background: var(--blue-600);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 18px;
  font-size: 12.5px;
  font-weight: 700;
  font-family: var(--font);
  cursor: pointer;
  letter-spacing: 0.1px;
  white-space: nowrap;
  transition:
    background 0.15s,
    transform 0.1s;
  &:hover {
    background: var(--blue-800);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

/* ===================== QUESTION PANE ===================== */
const QuestionPane = styled.div`
  flex: 1;
  padding: 28px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${slideIn} 0.3s ease both;
`;

const QuestionCard = styled.div`
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 28px;
`;

const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const QNumBadge = styled.div`
  background: var(--blue-50);
  color: var(--blue-600);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 99px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: 1px solid var(--blue-100);
`;

const QTypeBadge = styled.div`
  background: var(--gray-100);
  color: var(--gray-600);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 11px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const QMarksBadge = styled.div`
  margin-left: auto;
  background: var(--amber-50);
  color: var(--amber-600);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: 99px;
  border: 1px solid var(--amber-100);
`;

const QuestionText = styled.h2`
  font-size: 16.5px;
  font-weight: 500;
  color: var(--gray-800);
  line-height: 1.7;
  margin: 0;
  letter-spacing: -0.1px;
`;

/* ===================== OPTIONS ===================== */
const OptionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  margin: 0;
  border: 1.5px solid
    ${(p) => (p.selected ? "var(--blue-400)" : "var(--gray-200)")};
  border-radius: var(--radius-md);
  cursor: pointer;
  background: ${(p) => (p.selected ? "var(--blue-50)" : "#fff")};
  transition: all 0.18s;
  &:hover {
    border-color: ${(p) =>
      p.selected ? "var(--blue-400)" : "var(--blue-200)"};
    background: ${(p) => (p.selected ? "var(--blue-50)" : "var(--blue-50)")};
  }
`;

const OptionRadio = styled.div`
  width: 20px;
  height: 20px;
  border-radius: ${(p) => (p.multi ? "6px" : "50%")};
  border: 2px solid
    ${(p) => (p.selected ? "var(--blue-400)" : "var(--gray-200)")};
  background: ${(p) => (p.selected ? "var(--blue-400)" : "#fff")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
`;

const OptionDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: ${(p) => (p.multi ? "3px" : "50%")};
  background: #fff;
  animation: ${popIn} 0.15s ease;
`;

const OptionKey = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${(p) => (p.selected ? "var(--blue-100)" : "var(--gray-100)")};
  color: ${(p) => (p.selected ? "var(--blue-800)" : "var(--gray-600)")};
  font-size: 12px;
  font-weight: 700;
  font-family: var(--mono);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
`;

const OptionText = styled.span`
  font-size: 14px;
  color: ${(p) => (p.selected ? "var(--gray-800)" : "var(--gray-600)")};
  font-weight: ${(p) => (p.selected ? "500" : "400")};
  line-height: 1.55;
  transition: all 0.15s;
  flex: 1;
`;

const OptionsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FillInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  background: #fff;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
  color: var(--gray-800);
  font-size: 15px;
  font-family: var(--font);
  outline: none;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  &:focus {
    border-color: var(--blue-400);
    box-shadow: 0 0 0 3px var(--blue-50);
  }
  &::placeholder {
    color: var(--gray-200);
  }
`;

/* ===================== ACTION BAR ===================== */
const ActionBar = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font);
  transition: all 0.15s;
  background: ${(p) => p.bg || "#fff"};
  color: ${(p) => p.color || "var(--gray-600)"};
  border: 1.5px solid ${(p) => p.border || "var(--gray-200)"};
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(44, 44, 42, 0.1);
    filter: brightness(0.97);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

/* ===================== PALETTE PANE ===================== */
const PalettePane = styled.div`
  width: 260px;
  flex-shrink: 0;
  background: #fff;
  border-left: 1px solid var(--gray-200);
  padding: 22px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PaletteHeader = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 1.4px;
  margin-bottom: 12px;
`;

const PaletteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
`;

const PaletteBtn = styled.button`
  aspect-ratio: 1;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
  font-family: var(--mono);
  cursor: pointer;
  transition: all 0.15s;
  border: 2px solid ${(p) => (p.active ? "var(--blue-400)" : "transparent")};
  box-shadow: ${(p) => (p.active ? "0 0 0 3px var(--blue-50)" : "none")};
  transform: ${(p) => (p.active ? "scale(1.12)" : "scale(1)")};
  background: ${(p) => {
    switch (p.status) {
      case "attempted":
        return "var(--green-50)";
      case "marked_review":
        return "var(--amber-50)";
      case "not_answered":
        return "var(--red-50)";
      default:
        return "var(--gray-100)";
    }
  }};
  color: ${(p) => {
    switch (p.status) {
      case "attempted":
        return "var(--green-600)";
      case "marked_review":
        return "var(--amber-600)";
      case "not_answered":
        return "var(--red-600)";
      default:
        return "var(--gray-400)";
    }
  }};
  outline: 1.5px solid
    ${(p) => {
      switch (p.status) {
        case "attempted":
          return "var(--green-100)";
        case "marked_review":
          return "var(--amber-100)";
        case "not_answered":
          return "var(--red-100)";
        default:
          return "var(--gray-200)";
      }
    }};
  &:hover {
    transform: scale(1.12);
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  color: var(--gray-600);
  font-weight: 500;
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 4px;
  flex-shrink: 0;
  background: ${(p) => p.bg};
  border: 1.5px solid ${(p) => p.border};
`;

const PaletteDivider = styled.div`
  height: 1px;
  background: var(--gray-100);
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 10px;
  background: var(--gray-50);
  border: 1px solid var(--gray-100);
`;

const StatItemLabel = styled.span`
  font-size: 12px;
  color: var(--gray-600);
  font-weight: 500;
`;
const StatItemVal = styled.span`
  font-size: 15px;
  font-weight: 700;
  font-family: var(--mono);
  color: ${(p) => p.color};
`;

/* ===================== COMPONENT ===================== */
const ExamAttend = () => {
  const navigate = useNavigate();
  const { examId, duration } = useParams();
  const userId = useSelector((s) => s.auth.user);

  const [question, setQuestion] = useState({});
  const [offSet, setOffSet] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [visitedSet, setVisitedSet] = useState(new Set([0]));
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [time, setTime] = useState(Number(duration) * 60);
  const timerRef = useRef(null);

  const currentAnswer = answersMap[offSet]?.answer || [];
  const timeWarn = time <= 300;

  /* ── Timer ── */
  useEffect(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          autoSubmitExam("Time up! Exam auto-submitted.");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  /* ── Fetch question ── */
  const getQuestion = async (idx) => {
    try {
      const res = await fetch(
        `https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${idx}`,
      );
      const data = await res.json();
      if (res.ok) {
        setQuestion(data.questions?.[0] || {});
        setTotalQuestions(data.totalQuestions || 0);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getQuestion(offSet);
  }, [offSet]);

  /* ── Status helper ── */
  const getStatus = (i) => {
    if (answersMap[i]?.status) return answersMap[i].status;
    if (visitedSet.has(i)) return "not_answered";
    return undefined;
  };

  /* ── Navigation ── */
  const markVisited = (i) =>
    setVisitedSet((prev) => {
      if (prev.has(i)) return prev;
      const n = new Set(prev);
      n.add(i);
      return n;
    });

  const goTo = async (i) => {
    await saveAnswer();
    setOffSet(i);
    markVisited(i);
  };

  /* ── Handlers ── */
  const handleAnswer = (val) => {
    const type = question.questionTypeId;
    const updated =
      type === "SINGLE_CHOICE" || type === "TRUE_FALSE"
        ? [val]
        : currentAnswer.includes(val)
          ? currentAnswer.filter((x) => x !== val)
          : [...currentAnswer, val];
    setAnswersMap((p) => ({
      ...p,
      [offSet]: { answer: updated, status: "attempted" },
    }));
  };

  const handleFill = (val) => {
    const ok = val.trim() !== "";
    setAnswersMap((p) => ({
      ...p,
      [offSet]: {
        answer: ok ? [val] : [],
        status: ok ? "attempted" : "not_answered",
      },
    }));
  };

  const saveAnswer = async () => {
    const d = answersMap[offSet] || { answer: [] };
    if (!d.answer.length) return;
    await fetch("https://localhost:8443/sphinx/api/user/submited-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: question.qId,
        examId,
        submittedAnswer: d.answer.join(","),
        sNo: offSet + 1,
        isFlagged: 1,
        userLoginId: userId,
      }),
    });
  };

  const handleNext = async () => {
    await saveAnswer();
    if (offSet < totalQuestions - 1) {
      const n = offSet + 1;
      setOffSet(n);
      markVisited(n);
    }
  };
  const handlePrev = async () => {
    await saveAnswer();
    if (offSet > 0) {
      const p = offSet - 1;
      setOffSet(p);
      markVisited(p);
    }
  };
  const markReview = () =>
    setAnswersMap((p) => ({
      ...p,
      [offSet]: { answer: currentAnswer, status: "marked_review" },
    }));

  const clearAnswer = () =>
    setAnswersMap((p) => ({
      ...p,
      [offSet]: { answer: [], status: "not_answered" },
    }));

  /* ── Submit ── */
  const autoSubmitExam = async (msg) => {
    try {
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
        toast.success(msg);
        navigate(`/examresult/${examId}/${userId}/${data.skipped}`);
      }
    } catch {
      toast.error("Auto submit failed");
    }
  };

  const handleSubmitExam = async () => {
    await saveAnswer();
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(
        "https://localhost:8443/sphinx/api/user/submit-final",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId, userLoginId: userId }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        setSubmitting(false);
        setShowConfirm(false);
      } else {
        toast.success(data.success || "Exam submitted successfully!");
        navigate(`/examresult/${examId}/${userId}/${data.skipped}`);
      }
    } catch {
      toast.error("Submission failed. Please try again.");
      setSubmitting(false);
    }
  };

  const getSubmitStats = () => {
    let attempted = 0,
      notAnswered = 0,
      markedReview = 0;
    for (let i = 0; i < totalQuestions; i++) {
      const s = answersMap[i]?.status;
      if (s === "attempted") attempted++;
      else if (s === "marked_review") markedReview++;
      else if (visitedSet.has(i)) notAnswered++;
    }
    return { attempted, notAnswered, markedReview };
  };

  const formatTime = () => {
    const m = Math.floor(time / 60),
      s = time % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const renderOptions = () => {
    const type = question.questionTypeId;
    const isMulti = type === "MULTI_CHOICE";

    if (type === "FILL_BLANK") {
      return (
        <FillInput
          placeholder="Type your answer here…"
          value={currentAnswer[0] || ""}
          onChange={(e) => handleFill(e.target.value)}
        />
      );
    }

    const opts =
      type === "TRUE_FALSE"
        ? [
            { key: "T", label: "True", val: "True" },
            { key: "F", label: "False", val: "False" },
          ]
        : ["A", "B", "C", "D"].map((k) => ({
            key: k,
            label: question[`option${k}`] || k,
            val: k,
          }));

    return (
      <OptionsWrap>
        {opts.map(({ key, label, val }) => {
          const selected = currentAnswer.includes(val);
          return (
            <OptionLabel
              key={key}
              selected={selected}
              onClick={() => handleAnswer(val)}
            >
              <OptionRadio selected={selected} multi={isMulti}>
                {selected && <OptionDot multi={isMulti} />}
              </OptionRadio>
              <OptionKey selected={selected}>{key}</OptionKey>
              <OptionText selected={selected}>{label}</OptionText>
            </OptionLabel>
          );
        })}
      </OptionsWrap>
    );
  };

  const progress = totalQuestions ? ((offSet + 1) / totalQuestions) * 100 : 0;
  const attempted = Object.values(answersMap).filter(
    (v) => v.status === "attempted",
  ).length;
  const skipped = [...visitedSet].filter(
    (i) => !answersMap[i] || answersMap[i].answer.length === 0,
  ).length;
  const review = Object.values(answersMap).filter(
    (v) => v.status === "marked_review",
  ).length;

  return (
    <>
      <GlobalStyle />
      <PageWrap>
        <UserHeader />

        {showConfirm && (
          <SubmitConfirmModal
            stats={getSubmitStats()}
            onConfirm={confirmSubmit}
            onCancel={() => setShowConfirm(false)}
            submitting={submitting}
          />
        )}

        {/* ── Top Bar ── */}
        <TopBar>
          <ExamLabel>
            Exam <span>#{examId}</span>
          </ExamLabel>
          <ProgressWrap>
            <ProgressFill style={{ width: `${progress}%` }} />
          </ProgressWrap>
          <QCounter>
            {offSet + 1}&nbsp;/&nbsp;{totalQuestions || "—"}
          </QCounter>
          <TimerChip warn={timeWarn}>
            <TimerDot warn={timeWarn} />
            {formatTime()}
          </TimerChip>
          <SubmitTopBtn onClick={handleSubmitExam}>Submit Exam</SubmitTopBtn>
        </TopBar>

        {/* ── Main Content ── */}
        <Content>
          {/* ── Question Pane ── */}
          <QuestionPane>
            <QuestionCard>
              <QuestionMeta>
                <QNumBadge>Question {offSet + 1}</QNumBadge>
                {question.questionTypeId && (
                  <QTypeBadge>
                    {question.questionTypeId.replace(/_/g, " ")}
                  </QTypeBadge>
                )}
              
              </QuestionMeta>
              <QuestionText>
                {question.questionDetail || "Loading question…"}
              </QuestionText>
            </QuestionCard>

            {renderOptions()}

            <ActionBar>
              <ActionBtn onClick={handlePrev} disabled={offSet === 0}>
                ← Prev
              </ActionBtn>

              <ActionBtn
                onClick={handleNext}
                disabled={offSet >= totalQuestions - 1}
                bg="var(--blue-50)"
                color="var(--blue-600)"
                border="var(--blue-100)"
              >
                Save &amp; Next →
              </ActionBtn>

              <ActionBtn
                onClick={markReview}
                bg="var(--amber-50)"
                color="var(--amber-600)"
                border="var(--amber-100)"
              >
                🚩 Mark Review
              </ActionBtn>

              <ActionBtn
                onClick={clearAnswer}
                bg="var(--red-50)"
                color="var(--red-600)"
                border="var(--red-100)"
              >
                ✕ Clear
              </ActionBtn>

              <ActionBtn
                onClick={handleSubmitExam}
                bg="var(--green-50)"
                color="var(--green-600)"
                border="var(--green-100)"
                style={{ marginLeft: "auto" }}
              >
                ✓ Submit
              </ActionBtn>
            </ActionBar>
          </QuestionPane>

          {/* ── Palette Pane ── */}
          <PalettePane>
            <div>
              <PaletteHeader>Question Map</PaletteHeader>
              <PaletteGrid>
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <PaletteBtn
                    key={i}
                    status={getStatus(i)}
                    active={i === offSet}
                    onClick={() => goTo(i)}
                    title={`Question ${i + 1}`}
                  >
                    {i + 1}
                  </PaletteBtn>
                ))}
              </PaletteGrid>
            </div>

            <PaletteDivider />

            <div>
              <PaletteHeader>Legend</PaletteHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <LegendItem>
                  <LegendDot bg="var(--green-50)" border="var(--green-100)" />
                  Answered
                </LegendItem>
                <LegendItem>
                  <LegendDot bg="var(--red-50)" border="var(--red-100)" />
                  Not Answered
                </LegendItem>
                <LegendItem>
                  <LegendDot bg="var(--amber-50)" border="var(--amber-100)" />
                  Marked Review
                </LegendItem>
                <LegendItem>
                  <LegendDot bg="var(--gray-100)" border="var(--gray-200)" />
                  Not Visited
                </LegendItem>
              </div>
            </div>

            <PaletteDivider />

            <div>
              <PaletteHeader>Progress</PaletteHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <StatItem>
                  <StatItemLabel>Answered</StatItemLabel>
                  <StatItemVal color="var(--green-600)">
                    {attempted}
                  </StatItemVal>
                </StatItem>
                <StatItem>
                  <StatItemLabel>Skipped</StatItemLabel>
                  <StatItemVal color="var(--red-600)">{skipped}</StatItemVal>
                </StatItem>
                <StatItem>
                  <StatItemLabel>Review</StatItemLabel>
                  <StatItemVal color="var(--amber-600)">{review}</StatItemVal>
                </StatItem>
                <StatItem>
                  <StatItemLabel>Not Visited</StatItemLabel>
                  <StatItemVal color="var(--gray-400)">
                    {totalQuestions - visitedSet.size}
                  </StatItemVal>
                </StatItem>
              </div>
            </div>
          </PalettePane>
        </Content>
      </PageWrap>
    </>
  );
};

export default ExamAttend;
