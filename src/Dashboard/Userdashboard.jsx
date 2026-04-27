// Userdashboard.jsx — Rewritten with massive UI upgrade
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Layout from "../component/Layout";
import { NavLink } from "react-router-dom";

/* ─── Keyframe & font injection ─── */
const injectStyles = () => {
  if (document.getElementById("udash-v2-styles")) return;
  const s = document.createElement("style");
  s.id = "udash-v2-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; }

    @keyframes spin       { to { transform: rotate(360deg); } }
    @keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer    { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes floatBob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes orbitGlow  { 0%{opacity:.3;transform:scale(1)} 50%{opacity:.7;transform:scale(1.08)} 100%{opacity:.3;transform:scale(1)} }
    @keyframes pulseDot   { 0%,100%{box-shadow:0 0 0 0 rgba(99,243,176,0.7)} 70%{box-shadow:0 0 0 8px rgba(99,243,176,0)} }
    @keyframes borderRun  { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
    @keyframes countUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

    .udv2-card {
      animation: fadeSlideUp .45s cubic-bezier(.22,.68,0,1.2) both;
      position: relative;
      transition: transform .3s cubic-bezier(.22,.68,0,1.2), box-shadow .3s ease;
    }
    .udv2-card::after {
      content:'';
      position:absolute;
      inset:-1px;
      border-radius:22px;
      background: linear-gradient(135deg, rgba(99,243,176,0.0), rgba(99,243,176,0.0));
      transition: background .3s ease;
      pointer-events:none;
      z-index:0;
    }
    .udv2-card:hover {
      transform: translateY(-6px) scale(1.01);
      box-shadow: 0 28px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,243,176,0.2) !important;
    }
    .udv2-card:hover::after {
      background: linear-gradient(135deg, rgba(99,243,176,0.06), rgba(99,102,241,0.06));
    }

    .udv2-cta {
      position: relative;
      overflow: hidden;
      transition: transform .2s ease, box-shadow .2s ease;
    }
    .udv2-cta::before {
      content:'';
      position:absolute;
      inset:0;
      background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
      opacity:0;
      transition:opacity .2s;
    }
    .udv2-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,243,176,0.35) !important; }
    .udv2-cta:hover::before { opacity:1; }

    .udv2-card-inner { position:relative; z-index:1; }

    .udv2-skeleton {
      background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
      background-size: 400px 100%;
      animation: shimmer 1.4s ease infinite;
      border-radius: 10px;
    }
  `;
  document.head.appendChild(s);
};

/* ─── Accent palette ─── */
const PALETTE = [
  { from: "#63f3b0", to: "#3b82f6", glow: "rgba(99,243,176,0.25)" },
  { from: "#f472b6", to: "#a78bfa", glow: "rgba(244,114,182,0.25)" },
  { from: "#fbbf24", to: "#f97316", glow: "rgba(251,191,36,0.25)" },
  { from: "#38bdf8", to: "#818cf8", glow: "rgba(56,189,248,0.25)" },
  { from: "#fb7185", to: "#e879f9", glow: "rgba(251,113,133,0.25)" },
  { from: "#34d399", to: "#059669", glow: "rgba(52,211,153,0.25)" },
];

/* ─── Icons ─── */
const IconClock = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconTarget = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const IconRepeat = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);
const IconArrow = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconCalendar = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/* ─── Skeleton loader card ─── */
const SkeletonCard = ({ delay }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 22,
      padding: 28,
      animationDelay: `${delay}s`,
      animation: "fadeSlideUp .4s ease both",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 20,
      }}
    >
      <div className="udv2-skeleton" style={{ width: 80, height: 22 }} />
      <div className="udv2-skeleton" style={{ width: 90, height: 22 }} />
    </div>
    <div
      className="udv2-skeleton"
      style={{ width: "70%", height: 22, marginBottom: 12 }}
    />
    <div
      className="udv2-skeleton"
      style={{ width: "90%", height: 14, marginBottom: 6 }}
    />
    <div
      className="udv2-skeleton"
      style={{ width: "60%", height: 14, marginBottom: 24 }}
    />
    <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
      {[60, 80, 70].map((w, i) => (
        <div
          key={i}
          className="udv2-skeleton"
          style={{ width: w, height: 28 }}
        />
      ))}
    </div>
    <div className="udv2-skeleton" style={{ width: "100%", height: 44 }} />
  </div>
);

/* ─── Main Component ─── */
const Userdashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.auth.user);

  useEffect(() => {
    injectStyles();
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
        },
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
      <div style={St.page}>
        {/* ── Ambient background blobs ── */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-15%",
              left: "-10%",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,243,176,0.06) 0%, transparent 65%)",
              animation: "orbitGlow 7s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20%",
              right: "-5%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)",
              animation: "orbitGlow 9s ease-in-out infinite reverse",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "40%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(244,114,182,0.04) 0%, transparent 65%)",
              animation: "orbitGlow 11s ease-in-out infinite",
            }}
          />
        </div>

        {/* ── Header ── */}
        <header style={St.header}>
          <div style={St.headerContent}>
            <div style={St.statusPill}>
              <span style={St.statusDot} />
              Assessment Portal
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <h1 style={St.heroTitle}>
                  Your <span style={St.heroGradient}>Assigned</span>
                  <br />
                  Examinations
                </h1>
                <p style={St.heroSub}>
                  {loading
                    ? "Fetching your assignments…"
                    : data.length > 0
                      ? `${data.length} exam${data.length > 1 ? "s" : ""} ready for you`
                      : "No exams assigned yet"}
                </p>
              </div>
              {!loading && data.length > 0 && (
                <div style={St.statBadge} key="count">
                  <span
                    style={{
                      fontSize: 36,
                      fontWeight: 900,
                      color: "#63f3b0",
                      fontFamily: "'Cabinet Grotesk', sans-serif",
                      animation: "countUp .5s ease .2s both",
                      display: "block",
                    }}
                  >
                    {data.length}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#475569",
                      fontWeight: 600,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Exams
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Decorative line */}
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(99,243,176,0.3), transparent)",
              margin: "0 48px",
            }}
          />
        </header>

        {/* ── Content ── */}
        <div
          style={{ position: "relative", zIndex: 1, padding: "40px 48px 80px" }}
        >
          {loading ? (
            <div style={St.grid}>
              {[0, 0.1, 0.2, 0.3].map((d, i) => (
                <SkeletonCard key={i} delay={d} />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div style={St.empty}>
              <div
                style={{
                  fontSize: 72,
                  animation: "floatBob 3s ease-in-out infinite",
                }}
              >
                📭
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#e2e8f0",
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  margin: 0,
                }}
              >
                Nothing here yet
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#475569",
                  margin: 0,
                  maxWidth: 300,
                  textAlign: "center",
                  lineHeight: 1.7,
                }}
              >
                Your assigned exams will appear here. Contact your instructor if
                you think this is a mistake.
              </p>
            </div>
          ) : (
            <div style={St.grid}>
              {data.map((exam, i) => {
                const pal = PALETTE[i % PALETTE.length];
                return (
                  <div
                    key={exam.examId}
                    className="udv2-card"
                    style={{ ...St.card, animationDelay: `${i * 0.08}s` }}
                  >
                    {/* Glow behind card */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 22,
                        background: `radial-gradient(ellipse at 20% 20%, ${pal.glow}, transparent 60%)`,
                        pointerEvents: "none",
                      }}
                    />

                    <div className="udv2-card-inner">
                      {/* Top accent bar */}
                      <div
                        style={{
                          height: 3,
                          borderRadius: "22px 22px 0 0",
                          background: `linear-gradient(90deg, ${pal.from}, ${pal.to})`,
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                        }}
                      />

                      {/* Header row */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 20,
                          paddingTop: 8,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 10,
                            fontWeight: 500,
                            color: pal.from,
                            background: `rgba(99,243,176,0.08)`,
                            border: `1px solid rgba(99,243,176,0.15)`,
                            borderRadius: 8,
                            padding: "3px 10px",
                            letterSpacing: "1px",
                          }}
                        >
                          {exam.examId}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 11,
                            fontWeight: 600,
                            color:
                              exam.noOfAttempts === 0 ? "#63f3b0" : "#94a3b8",
                            background:
                              exam.noOfAttempts === 0
                                ? "rgba(99,243,176,0.08)"
                                : "rgba(255,255,255,0.05)",
                            border:
                              exam.noOfAttempts === 0
                                ? "1px solid rgba(99,243,176,0.2)"
                                : "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 8,
                            padding: "4px 10px",
                          }}
                        >
                          <IconRepeat />
                          {exam.noOfAttempts ?? 0} /{" "}
                          {exam.allowedAttempts ?? "∞"} used
                        </span>
                      </div>

                      {/* Title */}
                      <h3 style={St.cardTitle}>{exam.examName}</h3>
                      <p style={St.cardDesc}>
                        {exam.description ||
                          "No description provided for this exam."}
                      </p>

                      {/* Divider */}
                      <div
                        style={{
                          height: 1,
                          background: "rgba(255,255,255,0.06)",
                          margin: "16px 0",
                        }}
                      />

                      {/* Meta grid */}
                      <div style={St.metaGrid}>
                        {exam.duration && (
                          <div style={St.metaTile}>
                            <span style={{ ...St.metaIcon, color: pal.from }}>
                              <IconClock />
                            </span>
                            <span style={St.metaVal}>
                              {exam.duration}
                              <span
                                style={{
                                  fontSize: 10,
                                  color: "#475569",
                                  marginLeft: 2,
                                }}
                              >
                                min
                              </span>
                            </span>
                            <span style={St.metaKey}>Duration</span>
                          </div>
                        )}
                        {exam.totalMarks && (
                          <div style={St.metaTile}>
                            <span style={{ ...St.metaIcon, color: "#fbbf24" }}>
                              <IconTarget />
                            </span>
                            <span style={St.metaVal}>{exam.totalMarks}</span>
                            <span style={St.metaKey}>Total Marks</span>
                          </div>
                        )}
                        {exam.passingMarks && (
                          <div style={St.metaTile}>
                            <span style={{ ...St.metaIcon, color: "#34d399" }}>
                              ✓
                            </span>
                            <span style={St.metaVal}>{exam.passingMarks}</span>
                            <span style={St.metaKey}>Pass Marks</span>
                          </div>
                        )}
                        {exam.scheduledDate && (
                          <div style={St.metaTile}>
                            <span style={{ ...St.metaIcon, color: "#818cf8" }}>
                              <IconCalendar />
                            </span>
                            <span style={{ ...St.metaVal, fontSize: 12 }}>
                              {new Date(exam.scheduledDate).toLocaleDateString(
                                "en-IN",
                                { day: "numeric", month: "short" },
                              )}
                            </span>
                            <span style={St.metaKey}>Scheduled</span>
                          </div>
                        )}
                      </div>

                      {/* CTA — passes duration (minutes) via route state so the exam timer works */}
                      <NavLink
                        to={`/exam-attend/${exam.examId}`}
                        state={{
                          duration: exam.duration,
                          examName: exam.examName,
                        }}
                        className="udv2-cta"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          background: `linear-gradient(135deg, ${pal.from}, ${pal.to})`,
                          color: "#0f1117",
                          borderRadius: 14,
                          padding: "14px 24px",
                          fontWeight: 800,
                          fontSize: 13,
                          letterSpacing: ".3px",
                          textDecoration: "none",
                          marginTop: 20,
                          boxShadow: `0 8px 24px ${pal.glow}`,
                          fontFamily: "'Cabinet Grotesk', sans-serif",
                        }}
                      >
                        Start Examination <IconArrow />
                      </NavLink>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

/* ─── Styles ─── */
const St = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(160deg, #070b14 0%, #0d1220 50%, #0a1019 100%)",
    fontFamily: "'Cabinet Grotesk', 'Segoe UI', sans-serif",
    position: "relative",
  },
  header: {
    position: "relative",
    zIndex: 1,
    paddingTop: 56,
    paddingBottom: 36,
  },
  headerContent: {
    padding: "0 48px 36px",
  },
  statusPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(99,243,176,0.07)",
    border: "1px solid rgba(99,243,176,0.2)",
    borderRadius: 100,
    padding: "5px 14px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#63f3b0",
    marginBottom: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#63f3b0",
    animation: "pulseDot 2s ease infinite",
  },
  heroTitle: {
    fontSize: "clamp(32px, 4.5vw, 54px)",
    fontWeight: 900,
    color: "#f1f5f9",
    margin: "0 0 12px",
    letterSpacing: "-2px",
    lineHeight: 1.05,
    fontFamily: "'Cabinet Grotesk', sans-serif",
  },
  heroGradient: {
    background: "linear-gradient(90deg, #63f3b0, #38bdf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: { fontSize: 14, color: "#475569", margin: 0, fontWeight: 500 },
  statBadge: {
    background: "rgba(99,243,176,0.06)",
    border: "1px solid rgba(99,243,176,0.15)",
    borderRadius: 16,
    padding: "16px 28px",
    textAlign: "center",
    animation: "fadeSlideUp .5s ease .3s both",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: 24,
  },
  card: {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 22,
    padding: 28,
    backdropFilter: "blur(20px)",
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 800,
    color: "#f1f5f9",
    margin: "0 0 8px",
    lineHeight: 1.3,
    letterSpacing: "-0.5px",
    fontFamily: "'Cabinet Grotesk', sans-serif",
    textTransform: "capitalize",
  },
  cardDesc: { fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.7 },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    gap: 10,
    marginTop: 4,
  },
  metaTile: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  metaIcon: { display: "flex", marginBottom: 2 },
  metaVal: {
    fontSize: 15,
    fontWeight: 800,
    color: "#e2e8f0",
    lineHeight: 1,
    fontFamily: "'Cabinet Grotesk', sans-serif",
  },
  metaKey: {
    fontSize: 10,
    color: "#334155",
    fontWeight: 600,
    letterSpacing: ".8px",
    textTransform: "uppercase",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "100px 20px",
    gap: 16,
  },
};

export default Userdashboard;
