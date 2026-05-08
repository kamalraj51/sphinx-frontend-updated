import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CompletedExam from "./CompletedExam";

const statusColor = {
  assigned: { bg: "rgba(59,130,246,0.15)", text: "#93c5fd" },
  pending: { bg: "rgba(245,158,11,0.15)", text: "#fcd34d" },
  completed: { bg: "rgba(16,185,129,0.15)", text: "#6ee7b7" },
  inprogress: { bg: "rgba(139,92,246,0.15)", text: "#c4b5fd" },
};

const UserExamDetails = ({ userId, userName, onBack }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

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

  useEffect(() => {
    getExamData();
  }, [userId]);

  // Navigate to CompletedExam for a specific exam
  if (selectedExam) {
    return (
      <CompletedExam
        examId={selectedExam.examId}
        userId={userId}
        examName={selectedExam.examName || selectedExam.examId}
        onBack={() => setSelectedExam(null)}
      />
    );
  }

  // Show completed exams list
  if (showCompleted) {
    const completedExams = data.filter(
      (e) => (e.status || "").toLowerCase() === "completed",
    );
    return (
      <CompletedExamList
        exams={completedExams}
        userId={userId}
        userName={userName}
        onBack={() => setShowCompleted(false)}
        onSelectExam={(exam) => setSelectedExam(exam)}
      />
    );
  }

  const completedCount = data.filter(
    (e) => (e.status || "").toLowerCase() === "completed",
  ).length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backBtn}>
            ← Back
          </button>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {(userName || "U").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 style={styles.title}>{userName}</h1>
              <p style={styles.subtitle}>{userId}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCompleted(true)}
            style={styles.completedBtn}
          >
            <span style={styles.completedBtnIcon}>✓</span>
            Completed Assessments
            {completedCount > 0 && (
              <span style={styles.completedCount}>{completedCount}</span>
            )}
          </button>
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          {[
            { label: "Total", value: data.length, color: "#6366f1" },
            { label: "Completed", value: completedCount, color: "#10b981" },
            {
              label: "Pending",
              value: data.filter((e) =>
                ["pending", "assigned"].includes(
                  (e.status || "").toLowerCase(),
                ),
              ).length,
              color: "#f59e0b",
            },
          ].map((s) => (
            <div key={s.label} style={styles.statCard}>
              <span style={{ ...styles.statValue, color: s.color }}>
                {s.value}
              </span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Exam List */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>All Assigned Exams</h2>
          {loading ? (
            <div style={styles.loadingWrap}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={styles.skeleton} />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div style={styles.empty}>
              <span style={{ fontSize: 42 }}>📋</span>
              <p style={{ color: "#6b7280", marginTop: 12 }}>
                No exams assigned
              </p>
            </div>
          ) : (
            <div style={styles.examList}>
              {data.map((exam, idx) => (
                <ExamRow
                  key={exam.examId || idx}
                  exam={exam}
                  onClick={
                    (exam.status || "").toLowerCase() === "completed"
                      ? () => setSelectedExam(exam)
                      : null
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .exam-row-clickable:hover {
          border-color: #6366f1 !important;
          background: rgba(99,102,241,0.08) !important;
        }
        .completed-btn:hover {
          background: linear-gradient(135deg, #10b981, #06b6d4) !important;
          transform: translateY(-1px);
        }
        .back-btn:hover {
          background: rgba(255,255,255,0.08) !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

const ExamRow = ({ exam, onClick }) => {
  const status = (exam.status || "assigned").toLowerCase();
  const sc = statusColor[status] || statusColor.assigned;
  const isClickable = status === "completed" && onClick;

  return (
    <div
      className={isClickable ? "exam-row-clickable" : ""}
      onClick={isClickable ? onClick : undefined}
      style={{
        ...styles.examRow,
        cursor: isClickable ? "pointer" : "default",
      }}
    >
      <div style={styles.examIcon}>📝</div>
      <div style={styles.examInfo}>
        <p style={styles.examName}>{exam.examName || exam.examId}</p>
        {exam.assignedDate && (
          <p style={styles.examDate}>Assigned: {exam.assignedDate}</p>
        )}
        {exam.dueDate && <p style={styles.examDate}>Due: {exam.dueDate}</p>}
      </div>
      <div style={styles.examRight}>
        <span
          style={{ ...styles.statusBadge, background: sc.bg, color: sc.text }}
        >
          {exam.status || "Assigned"}
        </span>
        {isClickable && <span style={styles.viewBtn}>View Result →</span>}
      </div>
    </div>
  );
};

// Inline completed exam list with Pass/Fail tabs
const CompletedExamList = ({
  exams,
  userId,
  userName,
  onBack,
  onSelectExam,
}) => {
  const passed = exams.filter(
    (e) => (e.result || e.passStatus || "").toLowerCase() === "pass",
  );
  const failed = exams.filter(
    (e) => (e.result || e.passStatus || "").toLowerCase() === "fail",
  );
  const [tab, setTab] = useState("all");

  const displayed = tab === "pass" ? passed : tab === "fail" ? failed : exams;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backBtn} className="back-btn">
            ← Back to {userName}
          </button>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h1 style={styles.title}>Completed Assessments</h1>
          <p style={styles.subtitle}>
            {userName} · {exams.length} completed
          </p>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { key: "all", label: `All (${exams.length})` },
            {
              key: "pass",
              label: `✓ Pass (${passed.length})`,
              color: "#10b981",
            },
            {
              key: "fail",
              label: `✗ Fail (${failed.length})`,
              color: "#ef4444",
            },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                ...styles.tab,
                ...(tab === t.key ? styles.tabActive : {}),
                ...(tab === t.key && t.color
                  ? {
                      borderColor: t.color,
                      color: t.color,
                      background: `${t.color}18`,
                    }
                  : {}),
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        {displayed.length === 0 ? (
          <div style={styles.empty}>
            <span style={{ fontSize: 42 }}>🗂️</span>
            <p style={{ color: "#6b7280", marginTop: 12 }}>
              No exams in this category
            </p>
          </div>
        ) : (
          <div style={styles.examList}>
            {displayed.map((exam, idx) => {
              const isPassed =
                (exam.result || exam.passStatus || "").toLowerCase() === "pass";
              return (
                <div
                  key={exam.examId || idx}
                  onClick={() => onSelectExam(exam)}
                  style={{
                    ...styles.examRow,
                    cursor: "pointer",
                    borderColor: isPassed
                      ? "rgba(16,185,129,0.3)"
                      : "rgba(239,68,68,0.3)",
                  }}
                  className="exam-row-clickable"
                >
                  <div style={styles.examIcon}>{isPassed ? "🏆" : "📄"}</div>
                  <div style={styles.examInfo}>
                    <p style={styles.examName}>
                      {exam.examName || exam.examId}
                    </p>
                    {exam.completedDate && (
                      <p style={styles.examDate}>
                        Completed: {exam.completedDate}
                      </p>
                    )}
                    {exam.score !== undefined && (
                      <p style={styles.examDate}>Score: {exam.score}</p>
                    )}
                  </div>
                  <div style={styles.examRight}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        background: isPassed
                          ? "rgba(16,185,129,0.15)"
                          : "rgba(239,68,68,0.15)",
                        color: isPassed ? "#6ee7b7" : "#fca5a5",
                      }}
                    >
                      {isPassed ? "✓ Pass" : "✗ Fail"}
                    </span>
                    <span style={styles.viewBtn}>Details →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@600;700&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .exam-row-clickable:hover { border-color: #6366f1 !important; background: rgba(99,102,241,0.08) !important; }
        .back-btn:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
    fontFamily: "'DM Sans', sans-serif",
    padding: "40px 20px",
    animation: "fadeUp 0.4s ease both",
  },
  container: { maxWidth: 820, margin: "0 auto" },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 12,
  },
  backBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#9ca3af",
    borderRadius: 10,
    padding: "8px 18px",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s ease",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flex: 1,
    justifyContent: "center",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 18,
    fontFamily: "'Syne', sans-serif",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 22,
    fontWeight: 700,
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  subtitle: { fontSize: 12, color: "#6b7280", margin: "3px 0 0" },
  completedBtn: {
    background: "linear-gradient(135deg, #059669, #10b981)",
    border: "none",
    color: "#fff",
    borderRadius: 10,
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "all 0.2s ease",
  },
  completedBtnIcon: { fontSize: 16 },
  completedCount: {
    background: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    padding: "1px 8px",
    fontSize: 12,
    fontWeight: 700,
  },
  statsRow: {
    display: "flex",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "18px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
  },
  statLabel: { fontSize: 12, color: "#6b7280" },
  section: {},
  sectionTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 16,
    color: "#9ca3af",
    margin: "0 0 16px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  examList: { display: "flex", flexDirection: "column", gap: 10 },
  examRow: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    transition: "all 0.2s ease",
  },
  examIcon: { fontSize: 24, flexShrink: 0 },
  examInfo: { flex: 1 },
  examName: { margin: 0, color: "#f1f5f9", fontWeight: 600, fontSize: 14 },
  examDate: { margin: "3px 0 0", color: "#6b7280", fontSize: 12 },
  examRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
  },
  statusBadge: {
    borderRadius: 20,
    padding: "3px 12px",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "capitalize",
  },
  viewBtn: { fontSize: 11, color: "#6366f1", fontWeight: 600 },
  tabs: { display: "flex", gap: 8, marginBottom: 20 },
  tab: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#9ca3af",
    borderRadius: 8,
    padding: "8px 18px",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    transition: "all 0.2s ease",
  },
  tabActive: {
    background: "rgba(99,102,241,0.15)",
    borderColor: "#6366f1",
    color: "#a5b4fc",
  },
  loadingWrap: { display: "flex", flexDirection: "column", gap: 10 },
  skeleton: {
    height: 66,
    borderRadius: 14,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
    backgroundSize: "400px 100%",
    animation: "shimmer 1.4s ease infinite",
  },
  empty: { textAlign: "center", padding: "60px 0" },
};

export default UserExamDetails;
