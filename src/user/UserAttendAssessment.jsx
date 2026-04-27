// UserAttendAssessment.jsx
//
// ─── HOW THE TIMER WORKS ───────────────────────────────────────────────────
//  Userdashboard passes `duration` (minutes) + `examName` via React Router
//  route state when the student clicks "Start Examination":
//
//    <NavLink to={`/exam-attend/${exam.examId}`}
//             state={{ duration: exam.duration, examName: exam.examName }}>
//
//  This component reads it immediately with useLocation().state.duration,
//  converts to seconds, and starts the countdown right away — no API needed.
//  When the timer hits 0, the exam auto-submits.
//
// ─── OTHER LOGIC ──────────────────────────────────────────────────────────
//  • Save & Next  → calls submit API only if an answer is selected, then
//                   always moves to the next question
//  • Skip         → never calls submit API, just moves to next question
//  • Submit Exam  → appears ONLY on the last question
// ─────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../component/Layout";

/* ══════════════════════════════════════════════════════
   GLOBAL STYLE INJECTION
══════════════════════════════════════════════════════ */
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

    /* ── Answer options ── */
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

    /* Marker */
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

    /* Option label letter */
    .v3-opt-letter {
      width:28px; height:28px; border-radius:9px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-size:11px; font-weight:800; letter-spacing:.5px;
      background:rgba(255,255,255,0.05); color:#4a5568;
      border:1px solid rgba(255,255,255,0.07);
      transition:all .2s; font-family:'JetBrains Mono',monospace;
    }
    .v3-opt.sel-single .v3-opt-letter { background:rgba(251,191,36,0.2); color:#fbbf24; border-color:rgba(251,191,36,0.3); }
    .v3-opt.sel-multi  .v3-opt-letter { background:rgba(167,139,250,0.2); color:#a78bfa; border-color:rgba(167,139,250,0.3); }
    .v3-opt.sel-true   .v3-opt-letter { background:rgba(52,211,153,0.2);  color:#34d399; border-color:rgba(52,211,153,0.3); }
    .v3-opt.sel-false  .v3-opt-letter { background:rgba(248,113,113,0.2); color:#f87171; border-color:rgba(248,113,113,0.3); }

    /* Inputs */
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
    .v3-input::placeholder, .v3-textarea::placeholder { color:#2d3748; }

    /* Q-dot navigation */
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

    /* Buttons */
    .v3-btn-next {
      display:inline-flex; align-items:center; gap:9px;
      padding:13px 32px; border-radius:14px; border:none; cursor:pointer;
      font-size:14px; font-weight:700; font-family:'Outfit',sans-serif;
      background:linear-gradient(135deg, #fbbf24, #f97316);
      color:#1c0a00; letter-spacing:.3px;
      box-shadow:0 8px 28px rgba(251,191,36,0.4);
      transition:transform .2s, box-shadow .2s, filter .2s;
    }
    .v3-btn-next:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 14px 40px rgba(251,191,36,0.55); filter:brightness(1.06); }
    .v3-btn-next:disabled { opacity:.35; cursor:not-allowed; transform:none !important; box-shadow:none !important; }

    .v3-btn-submit {
      display:inline-flex; align-items:center; gap:9px;
      padding:13px 32px; border-radius:14px; border:none; cursor:pointer;
      font-size:14px; font-weight:700; font-family:'Outfit',sans-serif;
      background:linear-gradient(135deg, #ec4899, #8b5cf6);
      color:#fff; letter-spacing:.3px;
      box-shadow:0 8px 28px rgba(236,72,153,0.45);
      transition:transform .2s, box-shadow .2s;
    }
    .v3-btn-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 14px 40px rgba(236,72,153,0.6); }
    .v3-btn-submit:disabled { opacity:.35; cursor:not-allowed; transform:none !important; }

    .v3-btn-skip {
      display:inline-flex; align-items:center; gap:6px;
      padding:13px 22px; border-radius:14px; cursor:pointer;
      font-size:13px; font-weight:600; font-family:'Outfit',sans-serif;
      background:rgba(255,255,255,0.04);
      border:1.5px solid rgba(255,255,255,0.09);
      color:#3d4f6e; transition:all .18s;
    }
    .v3-btn-skip:hover { background:rgba(255,255,255,0.08); color:#64748b; border-color:rgba(255,255,255,0.15); }

    /* Timer critical flash */
    .v3-timer-critical { animation: warnPulse .5s ease infinite; }

    /* Question card animation */
    .v3-qcard-enter { animation: slideRight .38s cubic-bezier(.22,.68,0,1.2) both; }

    /* Complete card */
    .v3-complete { animation: pop .5s cubic-bezier(.22,.68,0,1.2) both; }
  `;
  document.head.appendChild(el);
};

/* ══════════════════════════════════════════════════════
   TIMER HOOK
   Uses a ref-based interval so the closure is always
   fresh. durationSeconds arrives from route state.
══════════════════════════════════════════════════════ */
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
    display:    `${mm}:${ss}`,
    remaining,
    percent:    (remaining / durationSeconds) * 100,
    isWarning:  remaining <= 60 && remaining > 30,
    isCritical: remaining <= 30,
  };
};

/* ══════════════════════════════════════════════════════
   QUESTION TYPE COMPONENTS
══════════════════════════════════════════════════════ */
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
  const toggle = opt => setSelected(arr.includes(opt) ? arr.filter(x => x !== opt) : [...arr, opt]);
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
          <span className="v3-marker" style={{ borderRadius: "7px" }}>{arr.includes(opt) && <CheckSVG />}</span>
        </div>
      ))}
    </div>
  );
};

const TrueOrFalse = ({ selected, setSelected }) => (
  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
    {[
      { val: "True",  cls: "sel-true",  icon: "✅" },
      { val: "False", cls: "sel-false", icon: "❌" },
    ].map(({ val, cls, icon }, i) => (
      <div key={val}
        className={`v3-opt${selected === val ? ` ${cls}` : ""}`}
        style={{ flex: 1, minWidth: 140, justifyContent: "center", fontSize: 16, fontWeight: 800, animationDelay: `${i * 0.08}s` }}
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
    <input className="v3-input" placeholder="Enter your answer…"
      value={selected || ""} onChange={e => setSelected(e.target.value)} />
  </div>
);

const DetailedAnswer = ({ selected, setSelected }) => (
  <div>
    <p style={HintStyle}>Write your detailed response</p>
    <textarea className="v3-textarea" placeholder="Explain in detail…"
      value={selected || ""} onChange={e => setSelected(e.target.value)} />
    <p style={{ fontSize: 11, color: "#2d3748", marginTop: 6, textAlign: "right", fontFamily: "'JetBrains Mono',monospace" }}>
      {(selected || "").length} characters
    </p>
  </div>
);

const HintStyle = {
  fontSize: 11, color: "#2d3748", marginBottom: 10,
  fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase",
};

/* ── Tiny icons ── */
const CheckSVG = ({ dark }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke={dark ? "#1c0a00" : "#fff"} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ArrowSVG = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const SendSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

/* ── Q type maps ── */
const Q_MAP   = { SINGLE_CHOICE: SingleChoice, MULTI_CHOICE: MultiChoice, TRUE_FALSE: TrueOrFalse, FILL_BLANKS: FillBlanks, DETAILED_ANSWER: DetailedAnswer };
const Q_LABEL = { SINGLE_CHOICE: "Single Choice", MULTI_CHOICE: "Multiple Choice", TRUE_FALSE: "True / False", FILL_BLANKS: "Fill in the Blank", DETAILED_ANSWER: "Detailed Answer" };

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const UserAttendAssessment = () => {
  const { examId }   = useParams();
  const navigate     = useNavigate();
  const location     = useLocation();

  // ── duration in minutes from Userdashboard route state ──────────────────
  // Userdashboard NavLink must be:
  //   <NavLink to={`/exam-attend/${exam.examId}`} state={{ duration: exam.duration, examName: exam.examName }}>
  const routeDuration  = location.state?.duration;          // e.g. 10
  
  const routeExamName  = location.state?.examName ?? examId;
  const durationSeconds = routeDuration ? Number(routeDuration) * 60 : 0;

  const [question,   setQuestion]   = useState(null);
  const [offset,     setOffset]     = useState(0);
  const [total,      setTotal]      = useState(0);
  const [answered,   setAnswered]   = useState(new Set());
  const [selected,   setSelected]   = useState("");
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const [completed,  setCompleted]  = useState(false);

  useEffect(() => { injectStyles(); }, []);

  /* ── Fetch question ── */
  const fetchQuestion = useCallback(async (idx) => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${idx}`);
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

  /* ── Timer — driven entirely by durationSeconds from route state ── */
  const timer = useCountdownTimer(durationSeconds, () => setCompleted(true));

  /* ── Submit answer to API ── */
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
      console.error("Answer submit failed:", e);
    }
  };

  const hasAnswer = Array.isArray(selected)
    ? selected.length > 0
    : (selected ?? "").toString().trim() !== "";

  const isLast = total > 0 && (offset + 1) >= total;

  /* ── Save & Next: submit API only if answer given, always advance ── */
  const handleSaveNext = async () => {
    if (hasAnswer) {
      setSubmitting(true);
      await submitAnswerToAPI();
      setSubmitting(false);
    }
    setSelected("");
    setOffset(prev => prev + 1);
  };

  /* ── Skip: no API call ── */
  const handleSkip = () => {
    setSelected("");
    setOffset(prev => prev + 1);
  };

  /* ── Final submit ── */
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

  /* ── Dynamic timer colour scheme ── */
  const timerColor  = timer.isCritical ? "#f87171" : timer.isWarning ? "#fbbf24" : "#34d399";
  const timerBg     = timer.isCritical ? "rgba(248,113,113,0.08)"  : timer.isWarning ? "rgba(251,191,36,0.07)"  : "rgba(52,211,153,0.07)";
  const timerBorder = timer.isCritical ? "rgba(248,113,113,0.3)"   : timer.isWarning ? "rgba(251,191,36,0.25)"  : "rgba(52,211,153,0.2)";
  const timerGrad   = timer.isCritical
    ? "linear-gradient(90deg,#f87171,#ef4444)"
    : timer.isWarning
    ? "linear-gradient(90deg,#fbbf24,#f97316)"
    : "linear-gradient(90deg,#34d399,#06b6d4)";

  /* ════════════════════════════════════════════
     LOADING
  ════════════════════════════════════════════ */
  if (loading) return (
    <Layout>
      <div className="v3-root" style={S.fullCenter}>
        <div style={{ position: "relative", width: 52, height: 52 }}>
          <div style={{ ...S.ring, borderTopColor: "#fbbf24", animation: "spin .9s linear infinite" }} />
          <div style={{ ...S.ring, width: 30, height: 30, top: 11, left: 11, borderTopColor: "#a78bfa", animation: "spinRev .6s linear infinite" }} />
        </div>
        <p style={{ fontSize: 13, color: "#3d4f6e", fontWeight: 600, letterSpacing: ".5px" }}>Loading question…</p>
      </div>
    </Layout>
  );

  /* ════════════════════════════════════════════
     ERROR
  ════════════════════════════════════════════ */
  if (error) return (
    <Layout>
      <div className="v3-root" style={S.fullCenter}>
        <span style={{ fontSize: 52, animation: "float 3s ease infinite" }}>⚠️</span>
        <p style={{ color: "#f87171", fontWeight: 700, fontSize: 16 }}>{error}</p>
        <button className="v3-btn-next" onClick={() => fetchQuestion(offset)}>Retry</button>
      </div>
    </Layout>
  );

  /* ════════════════════════════════════════════
     COMPLETED / AUTO-SUBMIT
  ════════════════════════════════════════════ */
  if (completed) return (
    <Layout>
      <div className="v3-root" style={{ ...S.page, alignItems: "center", justifyContent: "center" }}>
        {/* ambient blobs */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "15%", left: "25%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,72,153,0.1) 0%,transparent 65%)", animation: "glow 6s ease infinite" }} />
          <div style={{ position: "absolute", bottom: "15%", right: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 65%)", animation: "glow 8s ease infinite reverse" }} />
          <div style={{ position: "absolute", top: "50%", left: "45%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(251,191,36,0.07) 0%,transparent 65%)", animation: "glow 10s ease infinite" }} />
        </div>

        <div className="v3-complete" style={S.completeCard}>
          {/* Animated rainbow stripe */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#fbbf24,#ec4899,#8b5cf6,#06b6d4,#34d399)", backgroundSize: "300% 100%", animation: "gradShift 4s ease infinite", borderRadius: "22px 22px 0 0" }} />

          <div style={{ fontSize: 68, animation: "float 3s ease-in-out infinite", lineHeight: 1 }}>🎉</div>

          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: 34, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-1px", fontFamily: "'Outfit',sans-serif", margin: "0 0 8px" }}>
              Exam Submitted!
            </h2>
            <p style={{ fontSize: 14, color: "#3d4f6e", lineHeight: 1.8 }}>
              Your responses have been recorded. Well done!
            </p>
          </div>

          {/* Stat row */}
          <div style={S.statRow}>
            {[
              { val: answered.size,         label: "Answered", color: "#34d399" },
              { val: total - answered.size, label: "Skipped",  color: "#fbbf24" },
              { val: total,                 label: "Total",    color: "#a78bfa" },
            ].map(({ val, label, color }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <div style={{ width: 1, background: "rgba(255,255,255,0.06)", alignSelf: "stretch" }} />}
                <div style={S.statCell}>
                  <span style={{ fontSize: 30, fontWeight: 900, color, fontFamily: "'Outfit',sans-serif", lineHeight: 1 }}>{val}</span>
                  <span style={{ fontSize: 10, color: "#2d3748", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Completion bar */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 100, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${total > 0 ? (answered.size / total) * 100 : 0}%`, background: "linear-gradient(90deg,#34d399,#06b6d4)", borderRadius: 100, transition: "width 1.2s ease" }} />
            </div>
            <p style={{ fontSize: 12, color: "#2d3748", textAlign: "right", fontFamily: "'JetBrains Mono',monospace" }}>
              {total > 0 ? Math.round((answered.size / total) * 100) : 0}% answered
            </p>
          </div>

          <button className="v3-btn-next" onClick={() => navigate("/dashboard")} style={{ width: "100%", justifyContent: "center" }}>
            Back to Dashboard <ArrowSVG />
          </button>
        </div>
      </div>
    </Layout>
  );

  /* ════════════════════════════════════════════
     MAIN EXAM UI
  ════════════════════════════════════════════ */
  return (
    <Layout>
      <div className="v3-root" style={S.page}>

        {/* Ambient glows */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-5%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(251,191,36,0.05) 0%,transparent 60%)", animation: "glow 9s ease infinite" }} />
          <div style={{ position: "absolute", bottom: "5%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 60%)", animation: "glow 7s ease infinite reverse" }} />
        </div>

        {/* ════════ SIDEBAR ════════ */}
        <aside style={S.sidebar}>

          {/* Exam info */}
          <div style={S.sideBlock}>
            <p style={S.sideLabel}>Exam</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.4, marginTop: 4 }}>{routeExamName}</p>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#2d3748", marginTop: 2 }}>{examId}</p>
          </div>

          {/* ── TIMER BOX ─────────────────────────────────────────────────── */}
          {/* Always renders; shows "--:--" only if no duration was passed    */}
          <div style={{ ...S.sideBlock, background: timerBg, border: `1px solid ${timerBorder}`, borderRadius: 16, padding: 16, gap: 0 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={timerColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <p style={{ ...S.sideLabel, margin: 0, color: timerColor }}>Time Remaining</p>
            </div>

            {/* Big countdown */}
            <p
              className={timer.isCritical ? "v3-timer-critical" : ""}
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 38, fontWeight: 700,
                color: timerColor,
                letterSpacing: "-2px", lineHeight: 1,
                margin: "0 0 12px",
              }}>
              {timer.display ?? "--:--"}
            </p>

            {/* Bar */}
            <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${timer.display ? timer.percent : 100}%`,
                background: timerGrad,
                borderRadius: 6,
                transition: "width 1s linear",
              }} />
            </div>

            {/* Status text */}
            {timer.isCritical && (
              <p style={{ fontSize: 11, color: "#f87171", fontWeight: 700, marginTop: 8, textTransform: "uppercase", letterSpacing: ".5px" }}>⚠ Hurry up!</p>
            )}
            {timer.isWarning && !timer.isCritical && (
              <p style={{ fontSize: 11, color: "#fbbf24", fontWeight: 600, marginTop: 8 }}>Under 1 minute left!</p>
            )}
            {!durationSeconds && (
              <p style={{ fontSize: 11, color: "#2d3748", marginTop: 6 }}>Open from dashboard to start timer</p>
            )}
          </div>
          {/* ─────────────────────────────────────────────────────────────── */}

          {/* Progress */}
          <div style={S.sideBlock}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={S.sideLabel}>Progress</p>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#3d4f6e" }}>{offset + 1} / {total}</span>
            </div>
            <div style={{ height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 7, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#fbbf24,#f97316)", borderRadius: 7, transition: "width .4s ease" }} />
            </div>
            <p style={{ fontSize: 11, color: "#2d3748", marginTop: 6, fontFamily: "'JetBrains Mono',monospace" }}>{progress}% complete</p>
          </div>

          {/* Question dot grid */}
          <div style={S.sideBlock}>
            <p style={{ ...S.sideLabel, marginBottom: 10 }}>Questions</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} className={`v3-qdot${answered.has(i) ? " done" : ""}${i === offset ? " active" : ""}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[["#fbbf24", "Current"], ["#34d399", "Answered"], ["rgba(255,255,255,0.07)", "Pending"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#2d3748" }}>
                <span style={{ width: 8, height: 8, borderRadius: 3, background: c, flexShrink: 0 }} />{l}
              </div>
            ))}
          </div>
        </aside>

        {/* ════════ QUESTION PANEL ════════ */}
        <main style={S.main}>
          <div className="v3-qcard-enter" key={offset} style={S.qCard}>

            {/* Animated rainbow top stripe */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#fbbf24,#f97316,#ec4899,#8b5cf6,#06b6d4)", backgroundSize: "300% 100%", animation: "gradShift 5s ease infinite", borderRadius: "22px 22px 0 0" }} />

            {/* Corner glow */}
            <div style={{ position: "absolute", top: -60, right: -60, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle,rgba(251,191,36,0.07) 0%,transparent 65%)", pointerEvents: "none" }} />

            {/* Meta badges */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, flexWrap: "wrap", paddingTop: 12 }}>
              <span style={S.qNumBadge}>Q {offset + 1}</span>
              {question?.questionTypeId && (
                <span style={S.typeBadge}>{Q_LABEL[question.questionTypeId] || question.questionTypeId}</span>
              )}
              {question?.marks && (
                <span style={S.marksBadge}>🎯 {question.marks} mark{question.marks > 1 ? "s" : ""}</span>
              )}
              {isLast && (
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#ec4899", background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)", borderRadius: 8, padding: "3px 12px", letterSpacing: ".5px", textTransform: "uppercase" }}>
                  Final Question
                </span>
              )}
            </div>

            {/* Question text */}
            <h2 style={S.qText}>{question?.questionDetail}</h2>

            {/* Answer area */}
            <div style={{ marginBottom: 32 }}>
              {QuestionComponent
                ? <QuestionComponent question={question} selected={selected} setSelected={setSelected} />
                : <p style={{ color: "#f87171", fontSize: 13 }}>Unsupported question type.</p>
              }
            </div>

            {/* Action bar */}
            <div style={S.actionBar}>
              {!isLast && (
                <button className="v3-btn-skip" onClick={handleSkip}>Skip →</button>
              )}

              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                {isLast ? (
                  <button className="v3-btn-submit" onClick={handleSubmitExam} disabled={submitting}>
                    {submitting ? "Submitting…" : "Submit Exam"} <SendSVG />
                  </button>
                ) : (
                  <button className="v3-btn-next" onClick={handleSaveNext} disabled={submitting}>
                    {submitting ? "Saving…" : hasAnswer ? "Save & Next" : "Next"} <ArrowSVG />
                  </button>
                )}
              </div>
            </div>

            {!hasAnswer && !isLast && (
              <p style={{ fontSize: 11, color: "#2d3748", textAlign: "center", marginTop: 12 }}>
                No answer? Click <strong style={{ color: "#3d4f6e" }}>Next</strong> to skip without saving.
              </p>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

/* ══════════════════════════════════════════════════════
   STATIC STYLES
══════════════════════════════════════════════════════ */
const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg,#060a12 0%,#0b1120 55%,#08101c 100%)",
    display: "flex",
    position: "relative",
  },
  sidebar: {
    width: 270, flexShrink: 0,
    borderRight: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(0,0,0,0.28)",
    backdropFilter: "blur(24px)",
    padding: "40px 22px",
    display: "flex", flexDirection: "column", gap: 26,
    position: "relative", zIndex: 1,
  },
  sideBlock: { display: "flex", flexDirection: "column", gap: 4 },
  sideLabel: { fontSize: 10, fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase", color: "#1e2a3a", margin: 0 },
  main: {
    flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center",
    padding: "52px 44px", position: "relative", zIndex: 1,
  },
  qCard: {
    width: "100%", maxWidth: 700,
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 22, padding: "36px 40px",
    backdropFilter: "blur(20px)",
    position: "relative", overflow: "hidden",
  },
  qNumBadge: { fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, color: "#fbbf24", background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 8, padding: "3px 12px" },
  typeBadge: { fontSize: 11, fontWeight: 600, color: "#64748b", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "3px 10px" },
  marksBadge: { fontSize: 11, fontWeight: 700, color: "#a78bfa", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 8, padding: "3px 10px" },
  qText: { fontSize: "clamp(17px,2.3vw,22px)", fontWeight: 800, color: "#f0f4ff", lineHeight: 1.55, letterSpacing: "-0.4px", margin: "0 0 28px", fontFamily: "'Outfit',sans-serif" },
  actionBar: { display: "flex", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 22, gap: 10 },
  fullCenter: { minHeight: "100vh", background: "linear-gradient(160deg,#060a12,#0b1120)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, fontFamily: "'Outfit',sans-serif" },
  ring: { position: "absolute", top: 0, left: 0, width: 52, height: 52, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.07)" },
  completeCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: "52px 44px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24, backdropFilter: "blur(20px)", maxWidth: 480, width: "90%", position: "relative", overflow: "hidden", zIndex: 1 },
  statRow: { display: "flex", width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" },
  statCell: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 10px", gap: 5 },
};

export default UserAttendAssessment;
