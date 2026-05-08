import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { toast } from "react-toastify";
import { ArrowLeft, Trophy, XCircle, LayoutList, ClipboardList } from "lucide-react";
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
const spin = keyframes`to { transform: rotate(360deg); }`;
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.04); }
`;

/* ─────────────────────────────────────────────────────
   SHARED STYLED COMPONENTS
   ───────────────────────────────────────────────────── */
const PageWrap = styled.div`
  font-family: "Sora", "DM Sans", "Segoe UI", sans-serif;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HeroBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 32px;
  background: ${({ $bg }) => $bg || "linear-gradient(135deg,#1e1b4b,#312e81)"};
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
      ${({ $glow }) => $glow || "rgba(99,102,241,0.2)"} 0%,
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
  background: ${({ $bg }) => $bg || "rgba(99,102,241,0.22)"};
  border: 1.5px solid ${({ $border }) => $border || "rgba(165,180,252,0.4)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color || "#a5b4fc"};
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
const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 28px rgba(0, 0, 0, 0.09), 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $d }) => $d || "0.05s"};
`;
const CardHead = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 24px;
  border-bottom: 2px solid ${({ $b }) => $b || "#e0e7ff"};
  background: ${({ $bg }) => $bg || "#eef2ff"};
`;
const CardTitle = styled.h2`
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${({ $c }) => $c || "#4338ca"};
  margin: 0;
`;

/* ── Skeleton ── */
const SkeletonRow = styled.div`
  height: 72px;
  margin: 6px 16px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;
const EmptyWrap = styled.div`
  text-align: center;
  padding: 60px 0;
  color: #94a3b8;
  font-size: 15px;
  font-weight: 500;
`;

/* ── Summary Stats Bar ── */
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

/* ── Tabs ── */
const TabRow = styled.div`
  display: flex;
  gap: 0;
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
  color: ${({ $active, $color }) => ($active ? $color || "#6366f1" : "#94a3b8")};
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

/* ── Exam Row ── */
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

/* ── Mini Score Bar ── */
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
   CompletedExamList — /completed-exams/:userId/:userName
   ════════════════════════════════════════════════════ */
const CompletedExamList = () => {
  const { userId, userName } = useParams();
  const decodedUserId = decodeURIComponent(userId);
  const decodedUserName = decodeURIComponent(userName);
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all"); // all | pass | fail

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://localhost:8443/sphinx/api/user/5",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userLoginId: decodedUserId }),
          }
        );
        const value = await res.json();
        if (res.ok) {
          // Support: plain array OR { data: [] } OR { userExam: [] }
          const list = Array.isArray(value)
            ? value
            : Array.isArray(value.data)
            ? value.data
            : value.userExam || [];
          setExams(list);
        } else {
          toast.error(value.error || "Failed to load exams.");
        }
      } catch {
        toast.error("Failed to load completed exams.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ userPassed === 1 → passed, userPassed === 0 → failed
  const passed = exams.filter((e) => e.userPassed === 1);
  const failed = exams.filter((e) => e.userPassed === 0);
  const displayed =
    tab === "pass" ? passed : tab === "fail" ? failed : exams;

  const formatDate = (ts) =>
    ts
      ? new Date(ts).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const scorePercent = (exam) =>
    exam.noOfQuestions > 0
      ? Math.round((exam.totalCorrect / exam.noOfQuestions) * 100)
      : null;

  const avgScore =
    exams.length > 0
      ? Math.round(
          exams.reduce((s, e) => s + (scorePercent(e) || 0), 0) / exams.length
        )
      : 0;

  return (
    <Layout>
      <PageWrap>
        {/* ── Hero ── */}
        <HeroBar
          $bg="linear-gradient(135deg,#0f172a,#1e293b,#0f4c81)"
          $glow="rgba(59,130,246,0.2)"
        >
          <HeroLeft>
            <HeroIcon
              $bg="rgba(59,130,246,0.2)"
              $border="rgba(147,197,253,0.4)"
              $color="#93c5fd"
            >
              <ClipboardList size={24} strokeWidth={1.8} />
            </HeroIcon>
            <div>
              <HeroTitle>Completed Assessments</HeroTitle>
              <HeroSub>
                {decodedUserName} · {exams.length} total
              </HeroSub>
            </div>
          </HeroLeft>
          <BackBtn
            onClick={() =>
              navigate(
                `/user-exam-details/${encodeURIComponent(
                  decodedUserId
                )}/${encodeURIComponent(decodedUserName)}`
              )
            }
          >
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
            <StatBox $bg="#faf5ff" $border="#e9d5ff" $d="0.2s">
              <StatNum $c="#7c3aed">{avgScore}%</StatNum>
              <StatLabel>Avg Score</StatLabel>
            </StatBox>
          </StatsBar>
        )}

        {/* ── Main Card ── */}
        <Card>
          <CardHead $b="#dbeafe" $bg="#eff6ff">
            <LayoutList size={15} color="#3b82f6" />
            <CardTitle $c="#2563eb">Assessment Results</CardTitle>
          </CardHead>

          {/* Tabs: All | Pass | Fail */}
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

          {/* Exam Rows */}
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
                        `/exam-result/${encodeURIComponent(
                          exam.examId
                        )}/${encodeURIComponent(
                          decodedUserId
                        )}/${encodeURIComponent(decodedUserName)}`,
                        { state: { exam } } // ✅ pass full exam object via state
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
                        Questions
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

/* ════════════════════════════════════════════════════
   RESULT DETAIL — STYLED COMPONENTS
   ════════════════════════════════════════════════════ */
const ResultHeroCard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 28px rgba(0, 0, 0, 0.09);
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease both;
`;
const ResultCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 28px 8px;
  text-align: center;
`;
const ResultBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 24px;
  border-radius: 30px;
  margin-bottom: 18px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1px;
  background: ${({ $pass }) => ($pass ? "#f0fdf4" : "#fef2f2")};
  color: ${({ $pass }) => ($pass ? "#10b981" : "#ef4444")};
  border: 1.5px solid ${({ $pass }) => ($pass ? "#bbf7d0" : "#fecaca")};
  animation: ${pulse} 2s ease infinite;
`;
const ExamTitle = styled.h1`
  color: #1e293b;
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 4px;
  letter-spacing: -0.4px;
`;
const ExamSub = styled.p`
  color: #94a3b8;
  font-size: 13px;
  margin: 0;
`;
const RingWrap = styled.div`
  margin: 24px 0 8px;
`;
const ScoreRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  padding: 20px 24px;
  border-top: 1px solid #f1f5f9;
`;
const ScoreItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;
const ScoreVal = styled.span`
  font-size: 30px;
  font-weight: 800;
  color: ${({ $c }) => $c || "#1e293b"};
  font-family: "Sora", sans-serif;
  letter-spacing: -1px;
`;
const ScoreLbl = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: 0.1s;
`;
const InfoCard = styled.div`
  background: #f8fafc;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const InfoLabel = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const InfoValue = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
`;
const BreakdownCard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 28px rgba(0, 0, 0, 0.09);
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: 0.15s;
`;
const BreakRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  &:last-child {
    border-bottom: none;
  }
`;
const BreakIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;
const BreakInfo = styled.div`
  flex: 1;
`;
const BreakLabel = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
`;
const BreakSub = styled.p`
  margin: 3px 0 0;
  font-size: 12px;
  color: #94a3b8;
`;
const BreakRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;
const BreakVal = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: ${({ $c }) => $c};
  font-family: "Sora", sans-serif;
`;
const BarBg = styled.div`
  width: 100px;
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
`;
const BarFill = styled.div`
  height: 100%;
  border-radius: 3px;
  background: ${({ $c }) => $c};
  width: ${({ $w }) => $w};
  transition: width 0.8s ease;
`;
const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid rgba(99, 102, 241, 0.15);
  border-top-color: #6366f1;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto;
`;

/* ════════════════════════════════════════════════════
   CompletedExam — /exam-result/:examId/:userId/:userName
   All data comes from router state — NO extra API call
   ════════════════════════════════════════════════════ */
const CompletedExam = () => {
  const { examId, userId, userName } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const decodedExamId = decodeURIComponent(examId);
  const decodedUserId = decodeURIComponent(userId);
  const decodedUserName = decodeURIComponent(userName);

  // ✅ exam data passed from list via navigate state — no undefined!
  const exam = state?.exam || null;

  const goBack = () => navigate(-1);

  const formatDate = (ts) =>
    ts
      ? new Date(ts).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  /* ── No data guard ── */
  if (!exam) {
    return (
      <Layout>
        <PageWrap>
          <HeroBar
            $bg="linear-gradient(135deg,#0f172a,#1e293b,#0f4c81)"
            $glow="rgba(59,130,246,0.2)"
          >
            <HeroLeft>
              <HeroIcon
                $bg="rgba(59,130,246,0.2)"
                $border="rgba(147,197,253,0.4)"
                $color="#93c5fd"
              >
                <Trophy size={24} strokeWidth={1.8} />
              </HeroIcon>
              <div>
                <HeroTitle>Exam Result</HeroTitle>
                <HeroSub>{decodedExamId}</HeroSub>
              </div>
            </HeroLeft>
            <BackBtn onClick={goBack}>
              <ArrowLeft size={14} /> Back
            </BackBtn>
          </HeroBar>
          <ResultHeroCard>
            <div style={{ padding: "64px 0", textAlign: "center" }}>
              <Spinner />
              <p
                style={{
                  color: "#94a3b8",
                  marginTop: 16,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                No result data — please go back and try again.
              </p>
            </div>
          </ResultHeroCard>
        </PageWrap>
      </Layout>
    );
  }

  const isPassed = exam.userPassed === 1;
  const pct =
    exam.noOfQuestions > 0
      ? Math.round((exam.totalCorrect / exam.noOfQuestions) * 100)
      : 0;
  const accent = isPassed ? "#10b981" : "#ef4444";
  const heroBg = isPassed
    ? "linear-gradient(135deg,#14532d,#166534,#15803d)"
    : "linear-gradient(135deg,#7f1d1d,#991b1b,#b91c1c)";
  const heroGlow = isPassed
    ? "rgba(16,185,129,0.22)"
    : "rgba(239,68,68,0.22)";
  const iconBg = isPassed
    ? "rgba(16,185,129,0.22)"
    : "rgba(239,68,68,0.22)";
  const iconBorder = isPassed
    ? "rgba(52,211,153,0.4)"
    : "rgba(252,165,165,0.4)";
  const iconColor = isPassed ? "#34d399" : "#fca5a5";

  const circumference = 2 * Math.PI * 54;

  return (
    <Layout>
      <PageWrap>
        {/* ── Hero ── */}
        <HeroBar $bg={heroBg} $glow={heroGlow}>
          <HeroLeft>
            <HeroIcon $bg={iconBg} $border={iconBorder} $color={iconColor}>
              {isPassed ? (
                <Trophy size={24} strokeWidth={1.8} />
              ) : (
                <XCircle size={24} strokeWidth={1.8} />
              )}
            </HeroIcon>
            <div>
              <HeroTitle>{decodedExamId}</HeroTitle>
              <HeroSub>
                {decodedUserName} · {decodedUserId}
              </HeroSub>
            </div>
          </HeroLeft>
          <BackBtn onClick={goBack}>
            <ArrowLeft size={14} /> Back
          </BackBtn>
        </HeroBar>

        {/* ── Result Hero Card ── */}
        <ResultHeroCard>
          <ResultCenter>
            <ResultBadge $pass={isPassed}>
              {isPassed ? "🏆 PASSED" : "✗ FAILED"}
            </ResultBadge>
            <ExamTitle>{decodedExamId}</ExamTitle>
            <ExamSub>Performance ID: {exam.performanceId}</ExamSub>

            {/* Score Ring */}
            <RingWrap>
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle
                  cx="75"
                  cy="75"
                  r="54"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="11"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="54"
                  fill="none"
                  stroke={accent}
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - pct / 100)}
                  transform="rotate(-90 75 75)"
                  style={{ transition: "stroke-dashoffset 1.2s ease" }}
                />
                <text
                  x="75"
                  y="68"
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="28"
                  fontWeight="800"
                  fontFamily="Sora,sans-serif"
                >
                  {pct}%
                </text>
                <text
                  x="75"
                  y="86"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="DM Sans,sans-serif"
                  fontWeight="600"
                >
                  Score
                </text>
              </svg>
            </RingWrap>
          </ResultCenter>

          {/* Score Details */}
          <ScoreRow>
            <ScoreItem>
              <ScoreVal $c={accent}>{exam.score?.toFixed(0) ?? "—"}</ScoreVal>
              <ScoreLbl>Score</ScoreLbl>
            </ScoreItem>
            <ScoreItem>
              <ScoreVal $c="#10b981">{exam.totalCorrect}</ScoreVal>
              <ScoreLbl>Correct</ScoreLbl>
            </ScoreItem>
            <ScoreItem>
              <ScoreVal $c="#ef4444">{exam.totalWrong}</ScoreVal>
              <ScoreLbl>Wrong</ScoreLbl>
            </ScoreItem>
            <ScoreItem>
              <ScoreVal>{exam.noOfQuestions}</ScoreVal>
              <ScoreLbl>Total Qs</ScoreLbl>
            </ScoreItem>
          </ScoreRow>
        </ResultHeroCard>

        {/* ── Info Grid ── */}
        <InfoGrid>
          {[
            { label: "Candidate", value: decodedUserName },
            { label: "User ID", value: decodedUserId },
            { label: "Exam ID", value: decodedExamId },
            { label: "Attempt No", value: `#${exam.attemptNo ?? 1}` },
            { label: "Date", value: formatDate(exam.date) },
            { label: "Result", value: isPassed ? "✓ Passed" : "✗ Failed" },
          ].map((item, i) => (
            <InfoCard key={i}>
              <InfoLabel>{item.label}</InfoLabel>
              <InfoValue
                style={{
                  color: item.label === "Result" ? accent : "#1e293b",
                }}
              >
                {item.value}
              </InfoValue>
            </InfoCard>
          ))}
        </InfoGrid>

        {/* ── Performance Breakdown ── */}
        <BreakdownCard>
          <CardHead $b="#e2e8f0" $bg="#f8fafc">
            <CardTitle $c="#475569">Performance Breakdown</CardTitle>
          </CardHead>
          <div>
            <BreakRow>
              <BreakIcon $bg="#f0fdf4">✅</BreakIcon>
              <BreakInfo>
                <BreakLabel>Correct Answers</BreakLabel>
                <BreakSub>out of {exam.noOfQuestions} questions</BreakSub>
              </BreakInfo>
              <BreakRight>
                <BreakVal $c="#10b981">{exam.totalCorrect}</BreakVal>
                <BarBg>
                  <BarFill
                    $c="#10b981"
                    $w={`${
                      exam.noOfQuestions
                        ? (exam.totalCorrect / exam.noOfQuestions) * 100
                        : 0
                    }%`}
                  />
                </BarBg>
              </BreakRight>
            </BreakRow>

            <BreakRow>
              <BreakIcon $bg="#fef2f2">❌</BreakIcon>
              <BreakInfo>
                <BreakLabel>Wrong Answers</BreakLabel>
                <BreakSub>out of {exam.noOfQuestions} questions</BreakSub>
              </BreakInfo>
              <BreakRight>
                <BreakVal $c="#ef4444">{exam.totalWrong}</BreakVal>
                <BarBg>
                  <BarFill
                    $c="#ef4444"
                    $w={`${
                      exam.noOfQuestions
                        ? (exam.totalWrong / exam.noOfQuestions) * 100
                        : 0
                    }%`}
                  />
                </BarBg>
              </BreakRight>
            </BreakRow>

            <BreakRow>
              <BreakIcon $bg="#eff6ff">🎯</BreakIcon>
              <BreakInfo>
                <BreakLabel>Accuracy</BreakLabel>
                <BreakSub>percentage of correct answers</BreakSub>
              </BreakInfo>
              <BreakRight>
                <BreakVal $c={accent}>{pct}%</BreakVal>
                <BarBg>
                  <BarFill $c={accent} $w={`${pct}%`} />
                </BarBg>
              </BreakRight>
            </BreakRow>

            <BreakRow>
              <BreakIcon $bg="#faf5ff">🔁</BreakIcon>
              <BreakInfo>
                <BreakLabel>Attempt Number</BreakLabel>
                <BreakSub>times this exam was attempted</BreakSub>
              </BreakInfo>
              <BreakRight>
                <BreakVal $c="#7c3aed">#{exam.attemptNo ?? 1}</BreakVal>
              </BreakRight>
            </BreakRow>
          </div>
        </BreakdownCard>
      </PageWrap>
    </Layout>
  );
};

export { CompletedExamList };
export default CompletedExam;
