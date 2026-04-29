import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Layout from "../component/Layout";
import { NavLink } from "react-router-dom";

/* ─── Inline styles (no external CSS file needed) ─── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #1a1a2e, #16213e)",
    fontFamily: "'Sora', 'Segoe UI', sans-serif",
    padding: "0 0 60px",
  },

  /* ── Hero Header ── */
  hero: {
    position: "relative",
    padding: "56px 48px 40px",
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    top: "-80px",
    left: "-80px",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroGlow2: {
    position: "absolute",
    top: "20px",
    right: "60px",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.35)",
    borderRadius: "100px",
    padding: "4px 14px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#a5b4fc",
    marginBottom: "16px",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#6366f1",
    boxShadow: "0 0 6px #6366f1",
    animation: "pulse 1.8s ease-in-out infinite",
  },
  heroTitle: {
    fontSize: "clamp(28px, 4vw, 44px)",
    fontWeight: 800,
    color: "#f1f5f9",
    margin: "0 0 8px",
    letterSpacing: "-1px",
    lineHeight: 1.15,
  },
  heroAccent: {
    background: "linear-gradient(90deg, #6366f1, #ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
    fontWeight: 400,
  },

  /* ── Grid ── */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
    padding: "0 48px",
  },

  /* ── Card ── */
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "0",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
    cursor: "default",
    backdropFilter: "blur(12px)",
  },
  cardStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: "linear-gradient(90deg, #6366f1, #ec4899, #06b6d4)",
  },
  cardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "18px",
  },
  examIdPill: {
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "#818cf8",
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: "100px",
    padding: "3px 10px",
  },
  attemptsChip: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#94a3b8",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "8px",
    padding: "4px 10px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  cardTitle: {
    fontSize: "17px",
    fontWeight: 700,
    color: "#e2e8f0",
    margin: "0 0 8px",
    lineHeight: 1.35,
    letterSpacing: "-0.3px",
  },
  cardDesc: {
    fontSize: "13px",
    color: "#64748b",
    margin: "0 0 20px",
    lineHeight: 1.65,
    flexGrow: 1,
  },

  /* ── Meta row ── */
  metaRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },
  metaChip: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    fontWeight: 500,
    color: "#94a3b8",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "8px",
    padding: "5px 10px",
  },

  /* ── CTA ── */
  ctaLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    borderRadius: "12px",
    padding: "11px 20px",
    fontWeight: 700,
    fontSize: "13px",
    letterSpacing: "0.4px",
    textDecoration: "none",
    transition: "filter 0.2s ease, transform 0.15s ease",
    boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
  },

  /* ── Empty state ── */
  empty: {
    gridColumn: "1/-1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
    color: "#334155",
    gap: "14px",
  },
  emptyIcon: { fontSize: "52px" },
  emptyText: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#475569",
    margin: 0,
  },
  emptySubtext: { fontSize: "13px", color: "#334155", margin: 0 },

  /* ── Loader ── */
  loaderWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
    gap: "16px",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid rgba(99,102,241,0.2)",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loaderText: { fontSize: "13px", color: "#475569", fontWeight: 500 },
};

/* ─── Keyframes injected once ─── */
const injectKeyframes = () => {
  if (document.getElementById("udash-kf")) return;
  const s = document.createElement("style");
  s.id = "udash-kf";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(18px); }
      to   { opacity:1; transform:translateY(0); }
    }
    .udash-card { animation: fadeUp 0.4s ease both; }
    .udash-card:hover {
      transform: translateY(-4px) !important;
      box-shadow: 0 20px 50px rgba(0,0,0,0.35) !important;
      border-color: rgba(99,102,241,0.35) !important;
    }
    .udash-cta:hover { filter: brightness(1.15); transform: scale(1.02); }
  `;
  document.head.appendChild(s);
};

/* ─── Color accents per card index ─── */
const ACCENTS = [
  "linear-gradient(90deg,#6366f1,#8b5cf6)",
  "linear-gradient(90deg,#ec4899,#f43f5e)",
  "linear-gradient(90deg,#06b6d4,#3b82f6)",
  "linear-gradient(90deg,#f59e0b,#ef4444)",
  "linear-gradient(90deg,#10b981,#06b6d4)",
  "linear-gradient(90deg,#a855f7,#6366f1)",
];

/* ─── Icons (inline SVG as tiny components) ─── */
const IconClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconRepeat = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);
const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ─── Main Component ─── */
const Userdashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.auth.user);

  useEffect(() => {
    injectKeyframes();
    getExamData();
  }, []);

  const getExamData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/getAssignUserExam",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userLoginId: userId }),
        }
      );
      const value = await response.json();
      if (response.ok) {
        setData(value.userExam || []);
      } else {
        toast.error(value.error);
      }
    } catch {
      toast.error("Failed to load exams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={styles.page}>
        {/* ── Hero ── */}
        <div style={styles.hero}>
          <div style={styles.heroGlow} />
          <div style={styles.heroGlow2} />
          <div style={styles.badge}>
            <span style={styles.dot} />
            Assessment Portal
          </div>
          <h1 style={styles.heroTitle}>
            Your <span style={styles.heroAccent}>Exams</span>
          </h1>
          <p style={styles.heroSub}>
            {loading
              ? "Fetching assigned exams…"
              : data.length > 0
              ? `${data.length} exam${data.length > 1 ? "s" : ""} assigned to you`
              : "No exams assigned yet"}
          </p>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div style={styles.loaderWrap}>
            <div style={styles.spinner} />
            <p style={styles.loaderText}>Loading your exams…</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {data.length === 0 ? (
              <div style={styles.empty}>
                <span style={styles.emptyIcon}>📭</span>
                <p style={styles.emptyText}>No exams assigned</p>
                <p style={styles.emptySubtext}>
                  Check back later or contact your instructor.
                </p>
              </div>
            ) : (
              data.map((exam, i) => (
                <div
                  key={exam.examId}
                  className="udash-card"
                  style={{
                    ...styles.card,
                    animationDelay: `${i * 0.07}s`,
                  }}
                >
                  {/* colour stripe */}
                  <div
                    style={{
                      ...styles.cardStripe,
                      background: ACCENTS[i % ACCENTS.length],
                    }}
                  />

                  {/* top row */}
                  <div style={styles.cardTopRow}>
                    <span style={styles.examIdPill}>#{exam.examId}</span>
                    <span style={styles.attemptsChip}>
                      <IconRepeat />
                      {exam.noOfAttempts ?? "—"} attempts
                    </span>
                  </div>

                  {/* title & description */}
                  <h3 style={styles.cardTitle}>{exam.examName}</h3>
                  <p style={styles.cardDesc}>
                    {exam.description || "No description provided for this exam."}
                  </p>

                  {/* meta chips */}
                  <div style={styles.metaRow}>
                    {exam.duration && (
                      <span style={styles.metaChip}>
                        <IconClock />
                        {exam.duration} min
                      </span>
                    )}
                    {exam.totalMarks && (
                      <span style={styles.metaChip}>
                        🎯 {exam.totalMarks} marks
                      </span>
                    )}
                    {exam.passingMarks && (
                      <span style={styles.metaChip}>
                        ✅ Pass: {exam.passingMarks}
                      </span>
                    )}
                    {exam.scheduledDate && (
                      <span style={styles.metaChip}>
                        📅{" "}
                        {new Date(exam.scheduledDate).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <NavLink
                    to={`/exam-attend/${exam.examId}`}
                    className="udash-cta"
                    style={styles.ctaLink}
                  >
                    Start Exam <IconArrow />
                  </NavLink>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Userdashboard;
