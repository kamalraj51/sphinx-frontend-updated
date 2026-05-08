import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { toast } from "react-toastify";
import { ArrowLeft, ClipboardList, LayoutList } from "lucide-react";
import Layout from "../component/Layout";

/* ─────────────────────────────────────────────────────
   ANIMATIONS
───────────────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

/* ─────────────────────────────────────────────────────
   LAYOUT WRAPPERS
───────────────────────────────────────────────────── */
const PageWrap = styled.div`
  font-family: "Sora", "DM Sans", "Segoe UI", sans-serif;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* ─────────────────────────────────────────────────────
   HERO BAR
───────────────────────────────────────────────────── */
const HeroBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 32px;
  background: linear-gradient(135deg, #0f172a, #1e293b, #0f4c81);
  border-radius: 18px;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: -50px;
    right: -50px;
    width: 220px;
    height: 220px;
    background: radial-gradient(
      circle,
      rgba(59, 130, 246, 0.2) 0%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
  }
`;
const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
`;
const HeroIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(59, 130, 246, 0.2);
  border: 1.5px solid rgba(147, 197, 253, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #93c5fd;
`;
const HeroTitle = styled.h1`
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.4px;
  position: relative;
  z-index: 1;
`;
const HeroSub = styled.p`
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  margin: 2px 0 0;
  font-weight: 500;
  position: relative;
  z-index: 1;
`;
const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  font-family: "Sora", "DM Sans", sans-serif;
  cursor: pointer;
  transition: all 0.18s ease;
  position: relative;
  z-index: 1;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-2px);
  }
`;

/* ─────────────────────────────────────────────────────
   STATS BAR
───────────────────────────────────────────────────── */
const StatsBar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;
const StatBox = styled.div`
  flex: 1;
  min-width: 120px;
  background: ${({ $bg }) => $bg || "#f8fafc"};
  border: 1.5px solid ${({ $border }) => $border || "#e2e8f0"};
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $d }) => $d || "0s"};
`;
const StatNum = styled.span`
  font-size: 28px;
  font-weight: 800;
  color: ${({ $c }) => $c || "#1e293b"};
  font-family: "Sora", sans-serif;
  letter-spacing: -1px;
`;
const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* ─────────────────────────────────────────────────────
   MAIN CARD
───────────────────────────────────────────────────── */
const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow:
    0 4px 28px rgba(0, 0, 0, 0.09),
    0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: 0.05s;
`;
const CardHead = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 24px;
  border-bottom: 2px solid #dbeafe;
  background: #eff6ff;
`;
const CardTitle = styled.h2`
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #2563eb;
  margin: 0;
`;

/* ─────────────────────────────────────────────────────
   TABS
───────────────────────────────────────────────────── */
const TabRow = styled.div`
  display: flex;
  padding: 12px 24px 0;
  border-bottom: 2px solid #f1f5f9;
`;
const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 700;
  font-family: "Sora", "DM Sans", sans-serif;
  cursor: pointer;
  transition: all 0.18s ease;
  color: ${({ $active, $color }) =>
    $active ? $color || "#6366f1" : "#94a3b8"};
  border-bottom: 2.5px solid
    ${({ $active, $color }) => ($active ? $color || "#6366f1" : "transparent")};
  margin-bottom: -2px;
  &:hover {
    color: ${({ $color }) => $color || "#6366f1"};
  }
`;
const TabCount = styled.span`
  background: ${({ $bg }) => $bg || "#eef2ff"};
  color: ${({ $c }) => $c || "#6366f1"};
  border-radius: 20px;
  padding: 1px 9px;
  font-size: 11px;
  font-weight: 800;
`;

/* ─────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────── */
const SkeletonRow = styled.div`
  height: 88px;
  margin: 8px 16px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

/* ─────────────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────────────── */
const EmptyWrap = styled.div`
  text-align: center;
  padding: 60px 0;
  color: #94a3b8;
  font-size: 15px;
  font-weight: 500;
`;

/* ─────────────────────────────────────────────────────
   EXAM ROW
───────────────────────────────────────────────────── */
const ExamRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.15s ease;
  animation: ${fadeUp} 0.35s ease both;
  animation-delay: ${({ $i }) => $i * 0.05}s;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f8fafc;
  }
`;
const ExamIconBox = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: ${({ $bg }) => $bg};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
`;
const ExamInfo = styled.div`
  flex: 1;
  min-width: 0;
`;
const ExamName = styled.p`
  margin: 0;
  color: #1e293b;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const ExamMeta = styled.p`
  margin: 3px 0 0;
  color: #94a3b8;
  font-size: 12px;
`;
const ExamRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
`;
const Badge = styled.span`
  border-radius: 20px;
  padding: 4px 14px;
  font-size: 12px;
  font-weight: 800;
  background: ${({ $pass }) => ($pass ? "#f0fdf4" : "#fef2f2")};
  color: ${({ $pass }) => ($pass ? "#10b981" : "#ef4444")};
  border: 1.5px solid ${({ $pass }) => ($pass ? "#bbf7d0" : "#fecaca")};
`;
const ViewLink = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
`;

/* ─────────────────────────────────────────────────────
   MINI SCORE BAR
───────────────────────────────────────────────────── */
const MiniBarWrap = styled.div`
  width: 90px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: flex-end;
`;
const MiniBarBg = styled.div`
  width: 100%;
  height: 5px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
`;
const MiniBarFill = styled.div`
  height: 100%;
  border-radius: 3px;
  background: ${({ $c }) => $c};
  width: ${({ $w }) => $w};
`;
const MiniPct = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $c }) => $c};
`;

/* ════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════ */
const CompletedExamList = () => {
  const { userId, userName } = useParams();

  const decodedUserId = decodeURIComponent(userId || "");
  const decodedUserName = decodeURIComponent(userName || "");

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [tab, setTab] = useState("all"); // all | pass | fail

  useEffect(() => {
    if (!decodedUserId) {
      console.error("decodedUserId missing");
      return;
    }

    const controller = new AbortController();

    const fetchReports = async () => {
      try {
        setLoading(true);
        console.log("Fetching reports for:", decodedUserId);

        const response = await fetch(
          "https://localhost:8443/sphinx/api/user/getUserReport",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userLoginId: decodedUserId }),
            signal: controller.signal,
          },
        );

        console.log("Response status:", response.status);

        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

        const data = await response.json();
        console.log("API Response:", data);

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.userExam)
              ? data.userExam
              : [];

        setExams(list);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch Error:", error);
          toast.error("Failed to load completed exams");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    return () => controller.abort();
  }, [decodedUserId]);

  /* ── Helpers ── */
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const scorePercent = (exam) =>
    exam.noOfQuestions > 0
      ? Math.round((exam.totalCorrect / exam.noOfQuestions) * 100)
      : null;

  /* ── Derived lists ── */
  const passed = exams.filter((e) => e.userPassed === 1);
  const failed = exams.filter((e) => e.userPassed === 0);
  const displayed = tab === "pass" ? passed : tab === "fail" ? failed : exams;

  return (
    <Layout>
      <PageWrap>
        {/* ── Hero Bar ── */}
        <HeroBar>
          <HeroLeft>
            <HeroIcon>
              <ClipboardList size={24} strokeWidth={1.8} />
            </HeroIcon>
            <div>
              <HeroTitle>Completed Assessments</HeroTitle>
              <HeroSub>
                {decodedUserName} · {exams.length} total
              </HeroSub>
            </div>
          </HeroLeft>
          <BackBtn onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </BackBtn>
        </HeroBar>

        {/* ── Summary Stats ── */}
        {!loading && exams.length > 0 && (
          <StatsBar>
            <StatBox $bg="#f0f9ff" $border="#bae6fd" $d="0.05s">
              <StatNum $c="#0369a1">{exams.length}</StatNum>
              <StatLabel>Total Exams</StatLabel>
            </StatBox>
            <StatBox $bg="#f0fdf4" $border="#bbf7d0" $d="0.1s">
              <StatNum $c="#10b981">{passed.length}</StatNum>
              <StatLabel>✓ Passed</StatLabel>
            </StatBox>
            <StatBox $bg="#fef2f2" $border="#fecaca" $d="0.15s">
              <StatNum $c="#ef4444">{failed.length}</StatNum>
              <StatLabel>✗ Failed</StatLabel>
            </StatBox>
          </StatsBar>
        )}

        {/* ── Main Card ── */}
        <Card>
          <CardHead>
            <LayoutList size={15} color="#3b82f6" />
            <CardTitle>Assessment Results</CardTitle>
          </CardHead>

          {/* Tabs */}
          <TabRow>
            <Tab
              $active={tab === "all"}
              $color="#6366f1"
              onClick={() => setTab("all")}
            >
              All
              <TabCount $bg="#eef2ff" $c="#6366f1">
                {exams.length}
              </TabCount>
            </Tab>
            <Tab
              $active={tab === "pass"}
              $color="#10b981"
              onClick={() => setTab("pass")}
            >
              ✓ Pass
              <TabCount $bg="#f0fdf4" $c="#10b981">
                {passed.length}
              </TabCount>
            </Tab>
            <Tab
              $active={tab === "fail"}
              $color="#ef4444"
              onClick={() => setTab("fail")}
            >
              ✗ Fail
              <TabCount $bg="#fef2f2" $c="#ef4444">
                {failed.length}
              </TabCount>
            </Tab>
          </TabRow>

          {/* List */}
          <div>
            {loading ? (
              [1, 2, 3].map((i) => <SkeletonRow key={i} />)
            ) : displayed.length === 0 ? (
              <EmptyWrap>
                <div style={{ fontSize: 44, marginBottom: 10 }}>🗂️</div>
                No exams in this category
              </EmptyWrap>
            ) : (
              displayed.map((exam, idx) => {
                const isPassed = exam.userPassed === 1;
                const pct = scorePercent(exam);
                const barColor = isPassed ? "#10b981" : "#ef4444";

                return (
                  <ExamRow
                    key={exam.performanceId || idx}
                    $i={idx}
                    onClick={() =>
                      navigate(
                        `/exam-result-admin/${encodeURIComponent(exam.examId)}/${encodeURIComponent(decodedUserId)}/${encodeURIComponent(decodedUserName)}`,
                        { state: { exam } },
                      )
                    }
                  >
                    <ExamIconBox $bg={isPassed ? "#f0fdf4" : "#fef2f2"}>
                      {isPassed ? "🏆" : "📄"}
                    </ExamIconBox>

                    <ExamInfo>
                      <ExamName>{exam.examId}</ExamName>
                      <ExamMeta>
                        📅 {formatDate(exam.date)} &nbsp;·&nbsp; Attempt #
                        {exam.attemptNo ?? 1} &nbsp;·&nbsp; {exam.noOfQuestions}{" "}
                        Qs
                      </ExamMeta>
                      <ExamMeta>
                        ✅ {exam.totalCorrect} correct &nbsp;·&nbsp; ❌{" "}
                        {exam.totalWrong} wrong
                      </ExamMeta>
                    </ExamInfo>

                    <ExamRight>
                      <Badge $pass={isPassed}>
                        {isPassed ? "✓ Passed" : "✗ Failed"}
                      </Badge>
                      {pct !== null && (
                        <MiniBarWrap>
                          <MiniPct $c={barColor}>{pct}%</MiniPct>
                          <MiniBarBg>
                            <MiniBarFill $c={barColor} $w={`${pct}%`} />
                          </MiniBarBg>
                        </MiniBarWrap>
                      )}
                      <ViewLink>View Details →</ViewLink>
                    </ExamRight>
                  </ExamRow>
                );
              })
            )}
          </div>
        </Card>
      </PageWrap>
    </Layout>
  );
};

export default CompletedExamList;
