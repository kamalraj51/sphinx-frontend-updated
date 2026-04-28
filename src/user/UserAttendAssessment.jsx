import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../component/Layout";

/* ─── Keyframe injection ─── */
const injectStyles = () => {
  if (document.getElementById("uaa-styles")) return;
  const s = document.createElement("style");
  s.id = "uaa-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes spin   { to { transform: rotate(360deg); } }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes tick   { 0%{transform:scale(1)} 50%{transform:scale(1.18)} 100%{transform:scale(1)} }

    .uaa-root { font-family:'Sora','Segoe UI',sans-serif; }

    /* ── Choice option ── */
    .uaa-option {
      display:flex; align-items:center; gap:14px;
      background:rgba(255,255,255,0.04);
      border:1.5px solid rgba(255,255,255,0.08);
      border-radius:14px; padding:14px 18px;
      cursor:pointer; transition:all .18s ease;
      animation: fadeUp .3s ease both;
      color:#cbd5e1; font-size:14px; font-weight:500;
    }
    .uaa-option:hover { background:rgba(99,102,241,0.1); border-color:rgba(99,102,241,0.4); color:#e2e8f0; }
    .uaa-option.selected {
      background:rgba(99,102,241,0.18);
      border-color:#6366f1;
      color:#e0e7ff;
      box-shadow:0 0 0 1px rgba(99,102,241,0.3), 0 4px 20px rgba(99,102,241,0.15);
    }
    .uaa-option.tf-selected {
      background:rgba(16,185,129,0.15);
      border-color:#10b981;
      color:#6ee7b7;
      box-shadow:0 0 0 1px rgba(16,185,129,0.25);
    }

    /* ── Radio/checkbox marker ── */
    .uaa-marker {
      width:20px; height:20px; border-radius:50%;
      border:2px solid rgba(255,255,255,0.2);
      display:flex; align-items:center; justify-content:center;
      flex-shrink:0; transition:all .18s;
    }
    .uaa-option.selected .uaa-marker {
      background:#6366f1; border-color:#6366f1;
    }
    .uaa-option.tf-selected .uaa-marker {
      background:#10b981; border-color:#10b981;
    }
    .uaa-marker-sq { border-radius:6px !important; }

    /* ── Textarea ── */
    .uaa-textarea {
      width:100%; background:rgba(255,255,255,0.04);
      border:1.5px solid rgba(255,255,255,0.1);
      border-radius:14px; padding:16px 18px;
      color:#e2e8f0; font-size:14px; font-family:'Sora',sans-serif;
      resize:vertical; min-height:140px; outline:none;
      transition:border-color .18s;
    }
    .uaa-textarea:focus { border-color:#6366f1; background:rgba(99,102,241,0.06); }
    .uaa-textarea::placeholder { color:#475569; }

    /* ── Fill blanks input ── */
    .uaa-input {
      width:100%; background:rgba(255,255,255,0.04);
      border:1.5px solid rgba(255,255,255,0.1);
      border-radius:12px; padding:13px 16px;
      color:#e2e8f0; font-size:14px; font-family:'Sora',sans-serif;
      outline:none; transition:border-color .18s;
    }
    .uaa-input:focus { border-color:#6366f1; background:rgba(99,102,241,0.06); }
    .uaa-input::placeholder { color:#475569; }

    /* ── Timer warning ── */
    .uaa-timer-warn { color:#ef4444 !important; animation: tick .6s ease infinite; }

    /* ── Next button ── */
    .uaa-next {
      display:inline-flex; align-items:center; gap:8px;
      background:linear-gradient(135deg,#6366f1,#8b5cf6);
      color:#fff; border:none; border-radius:13px;
      padding:13px 28px; font-size:14px; font-weight:700;
      font-family:'Sora',sans-serif; cursor:pointer;
      transition:filter .2s, transform .15s;
      box-shadow:0 4px 20px rgba(99,102,241,0.35);
      letter-spacing:.3px;
    }
    .uaa-next:hover { filter:brightness(1.12); transform:translateY(-1px); }
    .uaa-next:disabled { opacity:.45; cursor:not-allowed; filter:none; transform:none; }

    /* ── Skip button ── */
    .uaa-skip {
      display:inline-flex; align-items:center; gap:6px;
      background:rgba(255,255,255,0.05);
      border:1px solid rgba(255,255,255,0.1);
      color:#64748b; border-radius:13px;
      padding:13px 22px; font-size:13px; font-weight:600;
      font-family:'Sora',sans-serif; cursor:pointer;
      transition:background .18s, color .18s;
    }
    .uaa-skip:hover { background:rgba(255,255,255,0.09); color:#94a3b8; }

    /* ── Progress dots ── */
    .uaa-dots { display:flex; gap:5px; flex-wrap:wrap; }
    .uaa-dot {
      width:8px; height:8px; border-radius:50%;
      background:rgba(255,255,255,0.1);
      transition:background .25s, transform .25s;
    }
    .uaa-dot.answered { background:#6366f1; }
    .uaa-dot.current  { background:#a5b4fc; transform:scale(1.5); box-shadow:0 0 6px rgba(99,102,241,0.6); }

    /* ── Completed screen ── */
    .uaa-complete-icon {
      width:90px; height:90px; border-radius:50%;
      background:linear-gradient(135deg,#6366f1,#8b5cf6);
      display:flex; align-items:center; justify-content:center;
      font-size:38px;
      box-shadow:0 8px 40px rgba(99,102,241,0.5);
      animation:fadeUp .5s ease both;
    }
  `;
  document.head.appendChild(s);
};

/* ─── Question type components ─── */

const SingleChoice = ({ question, selected, setSelected }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {question.options?.map((opt, i) => (
      <div
        key={i}
        className={`uaa-option${selected === opt ? " selected" : ""}`}
        style={{ animationDelay: `${i * 0.06}s` }}
        onClick={() => setSelected(opt)}
      >
        <span className="uaa-marker">
          {selected === opt && <CheckIcon />}
        </span>
        {opt}
      </div>
    ))}
  </div>
);

const MultiChoice = ({ question, selected, setSelected }) => {
  const arr = Array.isArray(selected) ? selected : [];
  const toggle = (opt) => {
    setSelected(arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <p style={{ fontSize: 11, color: "#475569", marginBottom: 4, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
        Select all that apply
      </p>
      {question.options?.map((opt, i) => (
        <div
          key={i}
          className={`uaa-option${arr.includes(opt) ? " selected" : ""}`}
          style={{ animationDelay: `${i * 0.06}s` }}
          onClick={() => toggle(opt)}
        >
          <span className="uaa-marker uaa-marker-sq">
            {arr.includes(opt) && <CheckIcon />}
          </span>
          {opt}
        </div>
      ))}
    </div>
  );
};

const TrueOrFalse = ({ selected, setSelected }) => (
  <div style={{ display: "flex", gap: 14 }}>
    {["True", "False"].map((val) => (
      <div
        key={val}
        className={`uaa-option${selected === val ? " tf-selected" : ""}`}
        style={{ flex: 1, justifyContent: "center", fontSize: 15, fontWeight: 700, animationDelay: val === "True" ? "0s" : "0.08s" }}
        onClick={() => setSelected(val)}
      >
        <span className="uaa-marker">
          {selected === val && <CheckIcon color={selected === val ? "#fff" : undefined} />}
        </span>
        {val === "True" ? "✅ True" : "❌ False"}
      </div>
    ))}
  </div>
);

const FillBlanks = ({ selected, setSelected }) => (
  <div>
    <p style={{ fontSize: 11, color: "#475569", marginBottom: 10, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
      Type your answer below
    </p>
    <input
      className="uaa-input"
      placeholder="Enter your answer…"
      value={selected || ""}
      onChange={(e) => setSelected(e.target.value)}
    />
  </div>
);

const DetailedAnswer = ({ selected, setSelected }) => (
  <div>
    <p style={{ fontSize: 11, color: "#475569", marginBottom: 10, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
      Write your detailed response
    </p>
    <textarea
      className="uaa-textarea"
      placeholder="Explain your answer in detail…"
      value={selected || ""}
      onChange={(e) => setSelected(e.target.value)}
    />
    <p style={{ fontSize: 11, color: "#334155", marginTop: 6, textAlign: "right" }}>
      {(selected || "").length} characters
    </p>
  </div>
);

/* ─── Tiny icons ─── */
const CheckIcon = ({ color = "#fff" }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ─── Question type map ─── */
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

/* ─── Timer hook ─── */
const useTimer = (durationSeconds, onExpire) => {
  const [remaining, setRemaining] = useState(durationSeconds);
  const ref = useRef(null);

  useEffect(() => {
    if (durationSeconds == null) return;
    setRemaining(durationSeconds);
    ref.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) { clearInterval(ref.current); onExpire(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [durationSeconds]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return { display: `${mm}:${ss}`, remaining, isWarning: remaining <= 60 };
};

/* ─── Main Component ─── */
const UserAttendAssessment = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [answered, setAnswered] = useState(new Set());
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const [examDuration, setExamDuration] = useState(null); // seconds

  useEffect(() => { injectStyles(); }, []);

  const fetchQuestion = useCallback(async (idx) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${idx}`
      );
      const data = await res.json();
      if (data.questions?.length > 0) {
        setQuestion(data.questions[0]);
        setTotal(data.totalQuestions);
        // pick up duration (minutes → seconds) if API returns it
        if (data.examDuration && !examDuration) {
          setExamDuration(data.examDuration * 60);
        }
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

  const { display: timerDisplay, remaining: timerRemaining, isWarning } =
    useTimer(examDuration, () => setCompleted(true));

  const submitAnswer = async (answer) => {
    if (!answer || (Array.isArray(answer) && answer.length === 0)) return;
    try {
      await fetch("https://localhost:8443/sphinx/api/user/submited-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId,
          questionId: question.qId,
          submittedAnswer: Array.isArray(answer) ? answer.join(",") : answer,
        }),
      });
      setAnswered((prev) => new Set([...prev, offset]));
    } catch (e) {
      console.error("Submit failed:", e);
    }
  };

  const handleNext = async () => {
    setSubmitting(true);
    await submitAnswer(selected);
    setSubmitting(false);
    const next = offset + 1;
    if (next >= total) { setCompleted(true); return; }
    setSelected("");
    setOffset(next);
  };

  const handleSkip = () => {
    const next = offset + 1;
    if (next >= total) { setCompleted(true); return; }
    setSelected("");
    setOffset(next);
  };

  const progress = total > 0 ? Math.round(((offset + 1) / total) * 100) : 0;
  const QuestionComponent = question && Q_MAP[question.questionTypeId];
  const hasAnswer = Array.isArray(selected) ? selected.length > 0 : selected !== "";

  /* ── Loading ── */
  if (loading) return (
    <Layout>
      <div className="uaa-root" style={S.fullCenter}>
        <div style={S.spinner} />
        <p style={S.loadText}>Loading question…</p>
      </div>
    </Layout>
  );

  /* ── Error ── */
  if (error) return (
    <Layout>
      <div className="uaa-root" style={S.fullCenter}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 44 }}>⚠️</span>
          <p style={{ color: "#ef4444", fontWeight: 600, fontSize: 15 }}>{error}</p>
          <button className="uaa-next" onClick={() => fetchQuestion(offset)}>Retry</button>
        </div>
      </div>
    </Layout>
  );

  /* ── Completed ── */
  if (completed) return (
    <Layout>
      <div className="uaa-root" style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={S.completeCard}>
          <div style={S.completeGlow} />
          <div className="uaa-complete-icon">🎉</div>
          <h2 style={{ color: "#f1f5f9", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>
            Exam Submitted!
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7, maxWidth: 320, textAlign: "center" }}>
            You've answered <span style={{ color: "#a5b4fc", fontWeight: 700 }}>{answered.size}</span> out of{" "}
            <span style={{ color: "#a5b4fc", fontWeight: 700 }}>{total}</span> questions. Great effort!
          </p>
          <div style={S.statRow}>
            <div style={S.stat}>
              <span style={S.statVal}>{answered.size}</span>
              <span style={S.statLabel}>Answered</span>
            </div>
            <div style={S.statDivider} />
            <div style={S.stat}>
              <span style={S.statVal}>{total - answered.size}</span>
              <span style={S.statLabel}>Skipped</span>
            </div>
            <div style={S.statDivider} />
            <div style={S.stat}>
              <span style={S.statVal}>{total}</span>
              <span style={S.statLabel}>Total</span>
            </div>
          </div>
          <button className="uaa-next" onClick={() => navigate("/dashboard")} style={{ marginTop: 8 }}>
            Back to Dashboard <ArrowIcon />
          </button>
        </div>
      </div>
    </Layout>
  );

  /* ── Main Exam UI ── */
  return (
    <Layout>
      <div className="uaa-root" style={S.page}>

        {/* ── Sidebar ── */}
        <aside style={S.sidebar}>
          <div style={S.sideSection}>
            <p style={S.sideLabel}>Exam ID</p>
            <p style={S.sideValue}>{examId}</p>
          </div>

          {examDuration && (
            <div style={S.sideSection}>
              <p style={S.sideLabel}>Time Remaining</p>
              <p className={isWarning ? "uaa-timer-warn" : ""} style={{ ...S.timerDisplay }}>
                {timerDisplay}
              </p>
              <div style={S.timerBar}>
                <div style={{
                  ...S.timerFill,
                  width: `${(timerRemaining / examDuration) * 100}%`,
                  background: isWarning
                    ? "linear-gradient(90deg,#ef4444,#f97316)"
                    : "linear-gradient(90deg,#6366f1,#8b5cf6)",
                }} />
              </div>
            </div>
          )}

          <div style={S.sideSection}>
            <p style={S.sideLabel}>Progress</p>
            <p style={S.sideValue}>{offset + 1} / {total}</p>
            <div style={S.progressBar}>
              <div style={{ ...S.progressFill, width: `${progress}%` }} />
            </div>
            <p style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>{progress}% complete</p>
          </div>

          <div style={S.sideSection}>
            <p style={{ ...S.sideLabel, marginBottom: 10 }}>Questions</p>
            <div className="uaa-dots">
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} className={`uaa-dot${answered.has(i) ? " answered" : ""}${i === offset ? " current" : ""}`} />
              ))}
            </div>
          </div>

          <div style={S.sideSection}>
            <div style={S.legend}>
              <span style={{ ...S.legendDot, background: "#a5b4fc" }} /> Current
            </div>
            <div style={S.legend}>
              <span style={{ ...S.legendDot, background: "#6366f1" }} /> Answered
            </div>
            <div style={S.legend}>
              <span style={{ ...S.legendDot, background: "rgba(255,255,255,0.1)" }} /> Pending
            </div>
          </div>
        </aside>

        {/* ── Question Panel ── */}
        <main style={S.main}>
          <div style={S.card} key={offset}>

            {/* Top stripe */}
            <div style={S.cardStripe} />

            {/* Q meta */}
            <div style={S.qMeta}>
              <span style={S.qBadge}>Question {offset + 1}</span>
              {question?.questionTypeId && (
                <span style={S.typeBadge}>{Q_LABEL[question.questionTypeId] || question.questionTypeId}</span>
              )}
              {question?.marks && (
                <span style={S.marksBadge}>🎯 {question.marks} mark{question.marks > 1 ? "s" : ""}</span>
              )}
            </div>

            {/* Question text */}
            <h2 style={S.qText}>{question?.questionDetail}</h2>

            {/* Answer area */}
            <div style={{ marginBottom: 32 }}>
              {QuestionComponent ? (
                <QuestionComponent
                  question={question}
                  selected={selected}
                  setSelected={setSelected}
                />
              ) : (
                <p style={{ color: "#ef4444", fontSize: 13 }}>Unsupported question type.</p>
              )}
            </div>

            {/* Actions */}
            <div style={S.actions}>
              <button className="uaa-skip" onClick={handleSkip}>
                Skip →
              </button>
              <button
                className="uaa-next"
                onClick={handleNext}
                disabled={!hasAnswer || submitting}
              >
                {submitting ? "Saving…" : offset + 1 >= total ? "Submit Exam" : "Next Question"}
                {!submitting && <ArrowIcon />}
              </button>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

/* ─── Static style objects ─── */
const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f0c29,#1a1a2e,#16213e)",
    display: "flex",
    gap: 0,
  },

  /* sidebar */
  sidebar: {
    width: 240,
    flexShrink: 0,
    borderRight: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(0,0,0,0.25)",
    backdropFilter: "blur(16px)",
    padding: "36px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 28,
  },
  sideSection: { display: "flex", flexDirection: "column", gap: 6 },
  sideLabel: { fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#475569" },
  sideValue: { fontSize: 18, fontWeight: 700, color: "#e2e8f0" },

  timerDisplay: { fontSize: 28, fontWeight: 800, color: "#a5b4fc", letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" },
  timerBar: { height: 4, borderRadius: 4, background: "rgba(255,255,255,0.07)", overflow: "hidden", marginTop: 6 },
  timerFill: { height: "100%", borderRadius: 4, transition: "width 1s linear" },

  progressBar: { height: 4, borderRadius: 4, background: "rgba(255,255,255,0.07)", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", transition: "width .4s ease" },

  legend: { display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#475569" },
  legendDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },

  /* main */
  main: { flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 40px" },

  card: {
    width: "100%",
    maxWidth: 680,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 22,
    padding: "36px",
    position: "relative",
    overflow: "hidden",
    animation: "fadeUp .4s ease both",
    backdropFilter: "blur(12px)",
  },
  cardStripe: {
    position: "absolute", top: 0, left: 0, right: 0, height: 3,
    background: "linear-gradient(90deg,#6366f1,#ec4899,#06b6d4)",
  },

  qMeta: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" },
  qBadge: {
    fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
    color: "#818cf8", background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.25)", borderRadius: 100, padding: "3px 12px",
  },
  typeBadge: {
    fontSize: 11, fontWeight: 600, color: "#94a3b8",
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 100, padding: "3px 10px",
  },
  marksBadge: {
    fontSize: 11, fontWeight: 600, color: "#fbbf24",
    background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)",
    borderRadius: 100, padding: "3px 10px",
  },

  qText: {
    fontSize: "clamp(16px,2.2vw,20px)", fontWeight: 700, color: "#e2e8f0",
    lineHeight: 1.55, letterSpacing: "-0.3px", marginBottom: 28,
  },

  actions: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 },

  /* loading / error */
  fullCenter: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f0c29,#1a1a2e,#16213e)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
  },
  spinner: {
    width: 40, height: 40,
    border: "3px solid rgba(99,102,241,0.2)", borderTop: "3px solid #6366f1",
    borderRadius: "50%", animation: "spin .8s linear infinite",
  },
  loadText: { fontSize: 13, color: "#475569", fontWeight: 500 },

  /* completed */
  completeCard: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24, padding: "52px 48px", display: "flex", flexDirection: "column",
    alignItems: "center", gap: 20, position: "relative", overflow: "hidden",
    backdropFilter: "blur(16px)", maxWidth: 480, width: "90%",
    animation: "fadeUp .5s ease both",
  },
  completeGlow: {
    position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
    width: 300, height: 300, borderRadius: "50%",
    background: "radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)",
    pointerEvents: "none",
  },
  statRow: { display: "flex", gap: 0, background: "rgba(255,255,255,0.04)", borderRadius: 14, overflow: "hidden", width: "100%", border: "1px solid rgba(255,255,255,0.07)" },
  stat: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 10px", gap: 4 },
  statVal: { fontSize: 22, fontWeight: 800, color: "#a5b4fc" },
  statLabel: { fontSize: 10, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "1px" },
  statDivider: { width: 1, background: "rgba(255,255,255,0.07)" },
};

export default UserAttendAssessment;
