import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CompletedExam = ({ examId, userId, examName, onBack }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://localhost:8443/sphinx/api/user/exam-result",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ examId, userLoginId: userId }),
          },
        );
        const data = await res.json();
        if (res.ok) setResult({ ...data.result, name: data.name });
        else toast.error("Result not updated yet — please wait.");
      } catch {
        toast.error("Could not fetch result.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingScreen />;

  if (!result) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button onClick={onBack} style={styles.backBtn} className="back-btn">
            ← Back
          </button>
          <div style={styles.empty}>
            <span style={{ fontSize: 48 }}>⏳</span>
            <p style={{ color: "#9ca3af", marginTop: 12, fontSize: 16 }}>
              Result not available yet
            </p>
          </div>
        </div>
        <style>{baseStyle}</style>
      </div>
    );
  }

  const isPassed = (result.status || result.passStatus || result.result || "")
    .toLowerCase()
    .includes("pass");

  const score = result.score ?? result.totalScore ?? null;
  const maxScore = result.maxScore ?? result.totalMarks ?? null;
  const percentage =
    result.percentage ??
    (score !== null && maxScore ? Math.round((score / maxScore) * 100) : null);

  const passColor = "#10b981";
  const failColor = "#ef4444";
  const accentColor = isPassed ? passColor : failColor;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Back */}
        <button onClick={onBack} style={styles.backBtn} className="back-btn">
          ← Back
        </button>

        {/* Result Hero */}
        <div
          style={{
            ...styles.hero,
            borderColor: `${accentColor}40`,
            background: `radial-gradient(ellipse at top, ${accentColor}12 0%, transparent 70%)`,
          }}
        >
          <div
            style={{
              ...styles.resultBadge,
              background: `${accentColor}22`,
              borderColor: `${accentColor}55`,
              color: accentColor,
            }}
          >
            <span style={styles.resultIcon}>{isPassed ? "🏆" : "📄"}</span>
            {isPassed ? "PASSED" : "FAILED"}
          </div>

          <h1 style={styles.examTitle}>{result.name || examName}</h1>
          <p style={styles.examId}>Exam ID: {examId}</p>

          {/* Score Circle */}
          {percentage !== null && (
            <div style={styles.scoreWrap}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="10"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="58"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - percentage / 100)}`}
                  transform="rotate(-90 70 70)"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
                <text
                  x="70"
                  y="65"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="26"
                  fontWeight="700"
                  fontFamily="Syne, sans-serif"
                >
                  {percentage}%
                </text>
                <text
                  x="70"
                  y="84"
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="11"
                  fontFamily="DM Sans, sans-serif"
                >
                  Score
                </text>
              </svg>
            </div>
          )}

          {/* Score details */}
          <div style={styles.scoreDetails}>
            {score !== null && (
              <div style={styles.scoreItem}>
                <span style={{ ...styles.scoreValue, color: accentColor }}>
                  {score}
                </span>
                <span style={styles.scoreLabel}>Marks Obtained</span>
              </div>
            )}
            {maxScore !== null && (
              <div style={styles.scoreItem}>
                <span style={styles.scoreValue}>{maxScore}</span>
                <span style={styles.scoreLabel}>Total Marks</span>
              </div>
            )}
            {result.timeTaken && (
              <div style={styles.scoreItem}>
                <span style={styles.scoreValue}>{result.timeTaken}</span>
                <span style={styles.scoreLabel}>Time Taken</span>
              </div>
            )}
          </div>
        </div>

        {/* Details Cards */}
        <div style={styles.detailsGrid}>
          {[
            { label: "Candidate", value: result.name || userId },
            { label: "User ID", value: userId },
            { label: "Exam", value: examName || examId },
            result.completedDate && {
              label: "Completed On",
              value: result.completedDate,
            },
            result.attemptNumber && {
              label: "Attempt",
              value: `#${result.attemptNumber}`,
            },
            result.passMarks && {
              label: "Pass Marks",
              value: result.passMarks,
            },
          ]
            .filter(Boolean)
            .map((item, i) => (
              <div key={i} style={styles.detailCard}>
                <span style={styles.detailLabel}>{item.label}</span>
                <span style={styles.detailValue}>{item.value}</span>
              </div>
            ))}
        </div>

        {/* Section-wise breakdown */}
        {result.sections && result.sections.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Section Breakdown</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {result.sections.map((sec, i) => {
                const pct = sec.maxMarks
                  ? Math.round((sec.marks / sec.maxMarks) * 100)
                  : null;
                return (
                  <div key={i} style={styles.sectionRow}>
                    <div style={styles.secInfo}>
                      <span style={styles.secName}>
                        {sec.name || `Section ${i + 1}`}
                      </span>
                      {pct !== null && (
                        <span
                          style={{
                            ...styles.secPct,
                            color: pct >= 50 ? passColor : failColor,
                          }}
                        >
                          {pct}%
                        </span>
                      )}
                    </div>
                    {pct !== null && (
                      <div style={styles.progressBg}>
                        <div
                          style={{
                            ...styles.progressBar,
                            width: `${pct}%`,
                            background: pct >= 50 ? passColor : failColor,
                          }}
                        />
                      </div>
                    )}
                    <span style={styles.secScore}>
                      {sec.marks ?? "—"} / {sec.maxMarks ?? "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{baseStyle}</style>
    </div>
  );
};

const LoadingScreen = () => (
  <div
    style={{
      ...styles.page,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div style={styles.spinner} />
      <p
        style={{
          color: "#6b7280",
          marginTop: 16,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Loading result...
      </p>
    </div>
    <style>
      {baseStyle +
        `
      @keyframes spin { to { transform: rotate(360deg); } }
    `}
    </style>
  </div>
);

const baseStyle = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@600;700&display=swap');
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .back-btn:hover {
    background: rgba(255,255,255,0.08) !important;
    color: #fff !important;
  }
`;

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
    fontFamily: "'DM Sans', sans-serif",
    padding: "40px 20px",
    animation: "fadeUp 0.4s ease both",
  },
  container: { maxWidth: 720, margin: "0 auto" },
  backBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#9ca3af",
    borderRadius: 10,
    padding: "8px 18px",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 28,
    transition: "all 0.2s ease",
    display: "inline-block",
  },
  hero: {
    border: "1px solid",
    borderRadius: 24,
    padding: "36px 28px",
    textAlign: "center",
    marginBottom: 24,
  },
  resultBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid",
    borderRadius: 20,
    padding: "6px 20px",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "1.5px",
    fontFamily: "'Syne', sans-serif",
    marginBottom: 18,
  },
  resultIcon: { fontSize: 18 },
  examTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 6px",
  },
  examId: { color: "#6b7280", fontSize: 13, margin: "0 0 24px" },
  scoreWrap: { display: "flex", justifyContent: "center", marginBottom: 24 },
  scoreDetails: {
    display: "flex",
    justifyContent: "center",
    gap: 32,
    flexWrap: "wrap",
  },
  scoreItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    color: "#f1f5f9",
  },
  scoreLabel: { fontSize: 12, color: "#6b7280" },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },
  detailCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  detailLabel: {
    fontSize: 11,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  detailValue: { fontSize: 14, fontWeight: 600, color: "#f1f5f9" },
  section: { marginTop: 8 },
  sectionTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 14,
    color: "#9ca3af",
    margin: "0 0 14px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  sectionRow: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  secInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secName: { color: "#f1f5f9", fontSize: 13, fontWeight: 500 },
  secPct: { fontSize: 13, fontWeight: 700, fontFamily: "'Syne', sans-serif" },
  progressBg: {
    height: 6,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
    transition: "width 0.8s ease",
  },
  secScore: { fontSize: 12, color: "#6b7280", alignSelf: "flex-end" },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid rgba(99,102,241,0.2)",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    margin: "0 auto",
    animation: "spin 0.8s linear infinite",
  },
  empty: { textAlign: "center", padding: "80px 0" },
};

export default CompletedExam;
