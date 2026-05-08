import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../component/Layout";

const injectStyles = () => {
  if (document.getElementById("uaa-v3-styles")) return;
  const el = document.createElement("style");
  el.id = "uaa-v3-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }

    @keyframes spin       { to { transform: rotate(360deg); } }
    @keyframes spinRev    { to { transform: rotate(-360deg); } }
    @keyframes fadeUp     { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideRight { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
    @keyframes pop        { 0%{opacity:0;transform:scale(.7)} 70%{transform:scale(1.05)} 100%{opacity:1;transform:scale(1)} }
    @keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
    @keyframes glow       { 0%,100%{opacity:.15} 50%{opacity:.45} }
    @keyframes warnPulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }
    @keyframes shimmer    { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes dotPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(251,191,36,.8)} 70%{box-shadow:0 0 0 10px rgba(251,191,36,0)} }
    @keyframes gradShift  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

    .v3-root { font-family:'Outfit','Segoe UI',sans-serif; }

    .v3-opt {
      display:flex; align-items:center; gap:14px;
      padding:15px 20px; border-radius:16px;
      border:2px solid rgba(255,255,255,0.07);
      background:rgba(255,255,255,0.03);
      cursor:pointer; color:#7d8fa8;
      font-size:14px; font-weight:500;
      transition:all .22s cubic-bezier(.22,.68,0,1.2);
      animation: fadeUp .35s ease both;
      position:relative; overflow:hidden;
    }
    .v3-opt::before {
      content:''; position:absolute; inset:0;
      background:linear-gradient(135deg,rgba(255,255,255,0.03),transparent);
      opacity:0; transition:opacity .2s;
    }
    .v3-opt:hover { border-color:rgba(251,191,36,0.5); color:#f5e9c0; background:rgba(251,191,36,0.06); transform:translateX(5px); }
    .v3-opt:hover::before { opacity:1; }

    .v3-opt.sel-single {
      border-color:#fbbf24;
      background:linear-gradient(135deg,rgba(251,191,36,0.12),rgba(245,158,11,0.06));
      color:#fef9e7;
      box-shadow:0 0 0 1px rgba(251,191,36,0.25), 0 8px 28px rgba(251,191,36,0.15);
    }
    .v3-opt.sel-multi {
      border-color:#a78bfa;
      background:linear-gradient(135deg,rgba(167,139,250,0.12),rgba(124,58,237,0.06));
      color:#ede9fe;
      box-shadow:0 0 0 1px rgba(167,139,250,0.25), 0 8px 28px rgba(167,139,250,0.1);
    }
    .v3-opt.sel-true {
      border-color:#34d399;
      background:linear-gradient(135deg,rgba(52,211,153,0.12),rgba(16,185,129,0.06));
      color:#d1fae5;
      box-shadow:0 0 0 1px rgba(52,211,153,0.25), 0 8px 28px rgba(52,211,153,0.1);
    }
    .v3-opt.sel-false {
      border-color:#f87171;
      background:linear-gradient(135deg,rgba(248,113,113,0.12),rgba(239,68,68,0.06));
      color:#fee2e2;
      box-shadow:0 0 0 1px rgba(248,113,113,0.25), 0 8px 28px rgba(248,113,113,0.1);
    }

    .v3-marker {
      width:22px; height:22px; border-radius:50%;
      border:2px solid rgba(255,255,255,0.12);
      display:flex; align-items:center; justify-content:center;
      flex-shrink:0; transition:all .2s; font-size:11px;
    }
    .v3-opt.sel-single .v3-marker { background:#fbbf24; border-color:#fbbf24; }
    .v3-opt.sel-multi  .v3-marker { background:#a78bfa; border-color:#a78bfa; border-radius:7px !important; }
    .v3-opt.sel-true   .v3-marker { background:#34d399; border-color:#34d399; }
    .v3-opt.sel-false  .v3-marker { background:#f87171; border-color:#f87171; }

    .v3-opt-letter {
      width:28px; height:28px; border-radius:9px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-size:11px; font-weight:800; letter-spacing:.5px;
      background:rgba(255,255,255,0.05); color:#4a5568;
      border:1px solid rgba(255,255,255,0.07);
      transition:all .2s; font-family:'JetBrains Mono',monospace;
    }

    .v3-input, .v3-textarea {
      width:100%; padding:15px 18px;
      background:rgba(255,255,255,0.04);
      border:2px solid rgba(255,255,255,0.07);
      border-radius:14px; color:#e8eaf6;
      font-size:14px; font-family:'Outfit',sans-serif;
      outline:none; transition:border-color .2s, background .2s;
    }
    .v3-textarea { resize:vertical; min-height:160px; }
    .v3-input:focus, .v3-textarea:focus {
      border-color:#fbbf24; background:rgba(251,191,36,0.04);
      box-shadow:0 0 0 3px rgba(251,191,36,0.08);
    }

    .v3-qdot {
      width:34px; height:34px; border-radius:10px;
      display:flex; align-items:center; justify-content:center;
      font-size:11px; font-weight:700;
      border:2px solid rgba(255,255,255,0.07);
      background:rgba(255,255,255,0.03);
      color:#2d3748; cursor:default;
      transition:all .2s;
      font-family:'JetBrains Mono',monospace;
    }
    .v3-qdot.done   { background:rgba(52,211,153,0.18); border-color:rgba(52,211,153,0.4); color:#34d399; }
    .v3-qdot.active { background:rgba(251,191,36,0.25); border-color:#fbbf24; color:#fff8e1; box-shadow:0 0 14px rgba(251,191,36,0.4); transform:scale(1.12); }

    .v3-btn-next {
      display:inline-flex; align-items:center; gap:9px;
      padding:13px 32px; border-radius:14px; border:none; cursor:pointer;
      font-size:14px; font-weight:700; font-family:'Outfit',sans-serif;
      background:linear-gradient(135deg, #fbbf24, #f97316);
      color:#1c0a00;
      box-shadow:0 8px 28px rgba(251,191,36,0.4);
      transition:transform .2s, box-shadow .2s;
    }

    .v3-btn-submit {
      display:inline-flex; align-items:center; gap:9px;
      padding:13px 32px; border-radius:14px; border:none; cursor:pointer;
      font-size:14px; font-weight:700;
      background:linear-gradient(135deg, #ec4899, #8b5cf6);
      color:#fff;
      box-shadow:0 8px 28px rgba(236,72,153,0.45);
    }

    .v3-btn-skip {
      display:inline-flex; align-items:center; gap:6px;
      padding:13px 22px; border-radius:14px;
      background:rgba(255,255,255,0.04);
      border:1.5px solid rgba(255,255,255,0.09);
      color:#3d4f6e;
    }

    .v3-timer-critical { animation: warnPulse .5s ease infinite; }

    .v3-qcard-enter { animation: slideRight .38s cubic-bezier(.22,.68,0,1.2) both; }

    .v3-complete { animation: pop .5s cubic-bezier(.22,.68,0,1.2) both; }
  `;
  document.head.appendChild(el);
};

const useCountdownTimer = (durationSeconds, onExpire) => {
  const [remaining, setRemaining] = useState(0);
  const onExpireRef = useRef(onExpire);
  const intervalRef = useRef(null);

  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (!durationSeconds || durationSeconds <= 0) return;

    setRemaining(durationSeconds);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [durationSeconds]);

  if (!durationSeconds || durationSeconds <= 0) {
    return { display: null, remaining: 0, percent: 100, isWarning: false, isCritical: false };
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return {
    display: `${mm}:${ss}`,
    remaining,
    percent: (remaining / durationSeconds) * 100,
    isWarning: remaining <= 60 && remaining > 30,
    isCritical: remaining <= 30,
  };
};

const LETTERS = ["A", "B", "C", "D", "E", "F"];

const SingleChoice = ({ question, selected, setSelected }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {question.options?.map((opt, i) => (
      <div key={i}
        className={`v3-opt${selected === opt ? " sel-single" : ""}`}
        style={{ animationDelay: `${i * 0.07}s` }}
        onClick={() => setSelected(opt)}>
        <span className="v3-opt-letter">{LETTERS[i]}</span>
        <span style={{ flex: 1 }}>{opt}</span>
        <span className="v3-marker">{selected === opt && <CheckSVG dark />}</span>
      </div>
    ))}
  </div>
);

const MultiChoice = ({ question, selected, setSelected }) => {
  const arr = Array.isArray(selected) ? selected : [];
  const toggle = opt =>
    setSelected(arr.includes(opt) ? arr.filter(x => x !== opt) : [...arr, opt]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={HintStyle}>Select all that apply</p>
      {question.options?.map((opt, i) => (
        <div key={i}
          className={`v3-opt${arr.includes(opt) ? " sel-multi" : ""}`}
          style={{ animationDelay: `${i * 0.07}s` }}
          onClick={() => toggle(opt)}>
          <span className="v3-opt-letter">{LETTERS[i]}</span>
          <span style={{ flex: 1 }}>{opt}</span>
          <span className="v3-marker">{arr.includes(opt) && <CheckSVG />}</span>
        </div>
      ))}
    </div>
  );
};

const TrueOrFalse = ({ selected, setSelected }) => (
  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
    {[
      { val: "True", cls: "sel-true", icon: "✅" },
      { val: "False", cls: "sel-false", icon: "❌" },
    ].map(({ val, cls, icon }, i) => (
      <div key={val}
        className={`v3-opt${selected === val ? ` ${cls}` : ""}`}
        style={{ flex: 1, minWidth: 140, justifyContent: "center" }}
        onClick={() => setSelected(val)}>
        <span className="v3-marker">{selected === val && <CheckSVG dark />}</span>
        <span>{icon} {val}</span>
      </div>
    ))}
  </div>
);

const FillBlanks = ({ selected, setSelected }) => (
  <div>
    <p style={HintStyle}>Type your answer below</p>
    <input className="v3-input"
      value={selected || ""}
      onChange={e => setSelected(e.target.value)} />
  </div>
);

const DetailedAnswer = ({ selected, setSelected }) => (
  <div>
    <p style={HintStyle}>Write your detailed response</p>
    <textarea className="v3-textarea"
      value={selected || ""}
      onChange={e => setSelected(e.target.value)} />
  </div>
);

const HintStyle = {
  fontSize: 11, color: "#2d3748", marginBottom: 10,
  fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase",
};

const CheckSVG = ({ dark }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke={dark ? "#1c0a00" : "#fff"} strokeWidth="3.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowSVG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const SendSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const Q_MAP = {
  SINGLE_CHOICE: SingleChoice,
  MULTI_CHOICE: MultiChoice,
  TRUE_FALSE: TrueOrFalse,
  FILL_BLANKS: FillBlanks,
  DETAILED_ANSWER: DetailedAnswer,
};

const Q_LABEL = {
  SINGLE_CHOICE: "Single Choice",
  MULTI_CHOICE: "Multiple Choice",
  TRUE_FALSE: "True / False",
  FILL_BLANKS: "Fill in the Blank",
  DETAILED_ANSWER: "Detailed Answer",
};

const UserAttendAssessment = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const routeDuration = location.state?.duration;
  const routeExamName = location.state?.examName ?? examId;
  const durationSeconds = routeDuration ? Number(routeDuration) * 60 : 0;

  const [question, setQuestion] = useState(null);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [answered, setAnswered] = useState(new Set());
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => { injectStyles(); }, []);

  const fetchQuestion = useCallback(async (idx) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${idx}`);
      const data = await res.json();
      if (data.questions?.length > 0) {
        setQuestion(data.questions[0]);
        setTotal(data.totalQuestions);
      } else {
        setCompleted(true);
      }
    } catch {
      setError("Failed to load question. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => { fetchQuestion(offset); }, [offset]);

  const timer = useCountdownTimer(durationSeconds, () => setCompleted(true));

  const submitAnswerToAPI = async () => {
    const val = selected;
    if (!val || (Array.isArray(val) && val.length === 0)) return;
    if (typeof val === "string" && val.trim() === "") return;

    try {
      await fetch("https://localhost:8443/sphinx/api/user/submited-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId,
          questionId: question.qId,
          submittedAnswer: Array.isArray(val) ? val.join(",") : val,
        }),
      });
      setAnswered(prev => new Set([...prev, offset]));
    } catch (e) {
      console.error(e);
    }
  };

  const hasAnswer = Array.isArray(selected)
    ? selected.length > 0
    : (selected ?? "").toString().trim() !== "";

  const isLast = total > 0 && (offset + 1) >= total;

  const handleSaveNext = async () => {
    if (hasAnswer) {
      setSubmitting(true);
      await submitAnswerToAPI();
      setSubmitting(false);
    }
    setSelected("");
    setOffset(prev => prev + 1);
  };

  const handleSkip = () => {
    setSelected("");
    setOffset(prev => prev + 1);
  };

  const handleSubmitExam = async () => {
    if (hasAnswer) {
      setSubmitting(true);
      await submitAnswerToAPI();
      setSubmitting(false);
    }
    setCompleted(true);
  };

  const progress = total > 0 ? Math.round(((offset + 1) / total) * 100) : 0;
  const QuestionComponent = question && Q_MAP[question.questionTypeId];

  if (loading) return (
    <Layout>
      <div className="v3-root">
        <p>Loading question…</p>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="v3-root">
        <p>{error}</p>
      </div>
    </Layout>
  );

  if (completed) return (
    <Layout>
      <div className="v3-root">
        <h2>Exam Submitted!</h2>
        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="v3-root">
        <aside>
          <p>{routeExamName}</p>
          <p>{examId}</p>
          <p>{timer.display}</p>
          <p>{offset + 1} / {total}</p>
          <p>{progress}%</p>
        </aside>

        <main>
          <h2>{question?.questionDetail}</h2>

          {QuestionComponent &&
            <QuestionComponent
              question={question}
              selected={selected}
              setSelected={setSelected}
            />
          }

          {!isLast ? (
            <>
              <button onClick={handleSkip}>Skip</button>
              <button onClick={handleSaveNext}>
                {hasAnswer ? "Save & Next" : "Next"}
              </button>
            </>
          ) : (
            <button onClick={handleSubmitExam}>
              Submit Exam
            </button>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default UserAttendAssessment;