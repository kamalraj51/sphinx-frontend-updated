import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { toast } from "react-toastify";
import { ArrowLeft, Trophy, XCircle, LayoutList } from "lucide-react";
import Layout from "../component/Layout";

/* ─────────────────────────────────────────────────────
   CompletedExamList  — route: /completed-exams/:userId/:userName
   ───────────────────────────────────────────────────── */

/* ── Animations ───────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* ── Shared Wrappers ──────────────────────────────── */
const PageWrap = styled.div`
  font-family: "Sora", "DM Sans", "Segoe UI", sans-serif;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeroBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 32px;
  background: ${({ $bg }) =>
    $bg || "linear-gradient(135deg,#1e1b4b,#312e81,#3730a3)"};
  border-radius: 16px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -60px;
    right: -60px;
    width: 260px;
    height: 260px;
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

const HeroIconRing = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: ${({ $bg }) => $bg || "rgba(99,102,241,0.22)"};
  border: 1.5px solid ${({ $border }) => $border || "rgba(165,180,252,0.4)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $color }) => $color || "#a5b4fc"};
  flex-shrink: 0;
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
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.1);
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  font-family: "Sora", "DM Sans", sans-serif;
  cursor: pointer;
  transition: all 0.18s ease;
  position: relative;
  z-index: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
    transform: translateX(-2px);
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.1),
    0 1px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeUp} 0.45s ease both;
  animation-delay: ${({ $d }) => $d || "0.05s"};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
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

const CardBody = styled.div`
  padding: 8px 0;
`;

/* ── Tabs ─────────────────────────────────────────── */
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
  padding: 9px 18px;
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

/* ── Exam Result Row ──────────────────────────────── */
const ResultRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 24px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.18s ease;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => $i * 0.04}s;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f8fafc;
  }
  &:hover .res-arrow {
    opacity: 1;
    transform: translateX(3px);
  }
`;

const ResultIconBox = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

const ResultInfo = styled.div`
  flex: 1;
`;

const ResultName = styled.p`
  margin: 0;
  color: #1e293b;
  font-weight: 700;
  font-size: 14px;
`;

const ResultMeta = styled.p`
  margin: 3px 0 0;
  color: #94a3b8;
  font-size: 12px;
`;

const ResultRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
`;

const PassFailBadge = styled.span`
  border-radius: 20px;
  padding: 4px 14px;
  font-size: 12px;
  font-weight: 800;
  background: ${({ $pass }) => ($pass ? "#f0fdf4" : "#fef2f2")};
  color: ${({ $pass }) => ($pass ? "#10b981" : "#ef4444")};
  border: 1.5px solid ${({ $pass }) => ($pass ? "#bbf7d0" : "#fecaca")};
`;

const ResArrow = styled.span`
  opacity: 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  color: #94a3b8;
`;

const EmptyWrap = styled.div`
  text-align: center;
  padding: 56px 0;
  color: #94a3b8;
  font-size: 15px;
  font-weight: 500;
`;

const SkeletonRow = styled.div`
  height: 68px;
  margin: 4px 16px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

/* ═══════════════════════════════════════════════════
   CompletedExamList Component
   Route: /completed-exams/:userId/:userName
   ═══════════════════════════════════════════════════ */
export const CompletedExamList = () => {
  const { userId, userName } = useParams();
  const decodedUserId = decodeURIComponent(userId);
  const decodedUserName = decodeURIComponent(userName);
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://localhost:8443/sphinx/api/user/getAssignUserExam",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userLoginId: decodedUserId }),
          },
        );
        const value = await res.json();
        if (res.ok) {
          const completed = (value.userExam || []).filter(
            (e) => (e.status || "").toLowerCase() === "completed",
          );
          setExams(completed);
        } else {
          toast.error(value.error);
        }
      } catch {
        toast.error("Failed to load completed exams.");
      } finally {
        setLoading(false);
      }
    })();
  }, [decodedUserId]);

  const passed = exams.filter(
    (e) => (e.result || e.passStatus || "").toLowerCase() === "pass",
  );
  const failed = exams.filter(
    (e) => (e.result || e.passStatus || "").toLowerCase() === "fail",
  );
  const displayed = tab === "pass" ? passed : tab === "fail" ? failed : exams;

  return (
    <Layout>
      <PageWrap>
        {/* Hero */}
        <HeroBar
          $bg="linear-gradient(135deg,#14532d,#166534,#15803d)"
          $glow="rgba(16,185,129,0.22)"
        >
          <HeroLeft>
            <HeroIconRing
              $bg="rgba(16,185,129,0.22)"
              $border="rgba(52,211,153,0.4)"
              $color="#34d399"
            >
              <Trophy size={24} strokeWidth={1.8} />
            </HeroIconRing>
            <div>
              <HeroTitle>Completed Assessments</HeroTitle>
              <HeroSub>
                {decodedUserName} · {exams.length} completed
              </HeroSub>
            </div>
          </HeroLeft>
          <BackBtn
            onClick={() =>
              navigate(
                `/user-exam-details/${encodeURIComponent(decodedUserId)}/${encodeURIComponent(decodedUserName)}`,
              )
            }
          >
            <ArrowLeft size={14} /> Back
          </BackBtn>
        </HeroBar>

        {/* Card */}
        <Card>
          <CardHeader $b="#d1fae5" $bg="#f0fdf4">
            <LayoutList size={15} color="#059669" />
            <CardTitle $c="#059669">Assessment Results</CardTitle>
          </CardHeader>

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

          <CardBody>
            {loading ? (
              [1, 2, 3].map((i) => <SkeletonRow key={i} />)
            ) : displayed.length === 0 ? (
              <EmptyWrap>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🗂️</div>
                No exams in this category
              </EmptyWrap>
            ) : (
              displayed.map((exam, idx) => {
                const isPassed =
                  (exam.result || exam.passStatus || "").toLowerCase() ===
                  "pass";
                return (
                  <ResultRow
                    key={exam.examId || idx}
                    $i={idx}
                    onClick={() =>
                      navigate(
                        `/exam-result/${encodeURIComponent(exam.examId)}/${encodeURIComponent(decodedUserId)}/${encodeURIComponent(exam.examName || exam.examId)}`,
                      )
                    }
                  >
                    <ResultIconBox $bg={isPassed ? "#f0fdf4" : "#fef2f2"}>
                      {isPassed ? "🏆" : "📄"}
                    </ResultIconBox>

                    <ResultInfo>
                      <ResultName>{exam.examName || exam.examId}</ResultName>
                      {exam.completedDate && (
                        <ResultMeta>Completed: {exam.completedDate}</ResultMeta>
                      )}
                      {exam.score !== undefined && (
                        <ResultMeta>Score: {exam.score}</ResultMeta>
                      )}
                    </ResultInfo>

                    <ResultRight>
                      <PassFailBadge $pass={isPassed}>
                        {isPassed ? "✓ Passed" : "✗ Failed"}
                      </PassFailBadge>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#94a3b8",
                          fontWeight: 600,
                        }}
                      >
                        View Details →
                      </span>
                    </ResultRight>

                    <ResArrow className="res-arrow">›</ResArrow>
                  </ResultRow>
                );
              })
            )}
          </CardBody>
        </Card>
      </PageWrap>
    </Layout>
  );
};

/* ═══════════════════════════════════════════════════
   CompletedExam (Result Detail)
   Route: /exam-result/:examId/:userId/:examName
   ═══════════════════════════════════════════════════ */

/* ── Result-specific styles ───────────────────────── */
const ScoreWrap = styled.div`
  display: flex;
  justify-content: center;
  margin: 24px 0 20px;
`;

const ScoreDetailsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 36px;
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

const ScoreValue = styled.span`
  font-size: 30px;
  font-weight: 800;
  font-family: "Sora", sans-serif;
  color: ${({ $c }) => $c || "#1e293b"};
  letter-spacing: -1px;
`;

const ScoreLabel = styled.span`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
  padding: 24px;
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: 0.15s;
`;

const DetailCard = styled.div`
  background: #f8fafc;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailLabel = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
`;

const SectionCard = styled.div`
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: 0.2s;
`;

const SectionRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 24px;
  border-bottom: 1px solid #f1f5f9;
  &:last-child {
    border-bottom: none;
  }
`;

const SecTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SecName = styled.span`
  color: #1e293b;
  font-size: 13.5px;
  font-weight: 700;
`;
const SecPct = styled.span`
  font-size: 13px;
  font-weight: 800;
  font-family: "Sora", sans-serif;
  color: ${({ $c }) => $c};
`;
const SecScore = styled.span`
  font-size: 12px;
  color: #94a3b8;
  align-self: flex-end;
`;

const ProgressBg = styled.div`
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
`;
const ProgressBar = styled.div`
  height: 100%;
  border-radius: 3px;
  background: ${({ $c }) => $c};
  width: ${({ $w }) => $w};
  transition: width 0.9s ease;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid rgba(16, 185, 129, 0.15);
  border-top-color: #10b981;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto;
`;

const ResultHeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 28px 0;
  text-align: center;
`;

const ResultBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 22px;
  border-radius: 20px;
  margin-bottom: 16px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.2px;
  font-family: "Sora", sans-serif;
  background: ${({ $pass }) => ($pass ? "#f0fdf4" : "#fef2f2")};
  color: ${({ $pass }) => ($pass ? "#10b981" : "#ef4444")};
  border: 1.5px solid ${({ $pass }) => ($pass ? "#bbf7d0" : "#fecaca")};
`;

const ExamTitleText = styled.h1`
  color: #1e293b;
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 4px;
  letter-spacing: -0.4px;
`;

const ExamIdText = styled.p`
  color: #94a3b8;
  font-size: 13px;
  margin: 0;
`;

/* ── CompletedExam Component ──────────────────────── */
const CompletedExam = () => {
  const { examId, userId, examName } = useParams();
  const decodedExamId = decodeURIComponent(examId);
  const decodedUserId = decodeURIComponent(userId);
  const decodedExamName = decodeURIComponent(examName);
  const navigate = useNavigate();

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
            body: JSON.stringify({
              examId: decodedExamId,
              userLoginId: decodedUserId,
            }),
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

  const goBack = () => navigate(-1);

  if (loading) {
    return (
      <Layout>
        <PageWrap>
          <HeroBar
            $bg="linear-gradient(135deg,#14532d,#166534,#15803d)"
            $glow="rgba(16,185,129,0.22)"
          >
            <HeroLeft>
              <HeroIconRing
                $bg="rgba(16,185,129,0.22)"
                $border="rgba(52,211,153,0.4)"
                $color="#34d399"
              >
                <Trophy size={24} strokeWidth={1.8} />
              </HeroIconRing>
              <div>
                <HeroTitle>Exam Result</HeroTitle>
                <HeroSub>Loading…</HeroSub>
              </div>
            </HeroLeft>
            <BackBtn onClick={goBack}>
              <ArrowLeft size={14} /> Back
            </BackBtn>
          </HeroBar>
          <Card>
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
                Loading result…
              </p>
            </div>
          </Card>
        </PageWrap>
      </Layout>
    );
  }

  if (!result) {
    return (
      <Layout>
        <PageWrap>
          <HeroBar
            $bg="linear-gradient(135deg,#14532d,#166534,#15803d)"
            $glow="rgba(16,185,129,0.22)"
          >
            <HeroLeft>
              <HeroIconRing
                $bg="rgba(16,185,129,0.22)"
                $border="rgba(52,211,153,0.4)"
                $color="#34d399"
              >
                <Trophy size={24} strokeWidth={1.8} />
              </HeroIconRing>
              <div>
                <HeroTitle>Exam Result</HeroTitle>
                <HeroSub>{decodedExamName}</HeroSub>
              </div>
            </HeroLeft>
            <BackBtn onClick={goBack}>
              <ArrowLeft size={14} /> Back
            </BackBtn>
          </HeroBar>
          <Card>
            <EmptyWrap>
              <div style={{ fontSize: 44, marginBottom: 12 }}>⏳</div>
              Result not available yet
            </EmptyWrap>
          </Card>
        </PageWrap>
      </Layout>
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
  const accentColor = isPassed ? "#10b981" : "#ef4444";
  const passColor = "#10b981";
  const failColor = "#ef4444";

  return (
    <Layout>
      <PageWrap>
        {/* Hero */}
        <HeroBar
          $bg={
            isPassed
              ? "linear-gradient(135deg,#14532d,#166534,#15803d)"
              : "linear-gradient(135deg,#7f1d1d,#991b1b,#b91c1c)"
          }
          $glow={isPassed ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.22)"}
        >
          <HeroLeft>
            <HeroIconRing
              $bg={isPassed ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.22)"}
              $border={
                isPassed ? "rgba(52,211,153,0.4)" : "rgba(252,165,165,0.4)"
              }
              $color={isPassed ? "#34d399" : "#fca5a5"}
            >
              {isPassed ? (
                <Trophy size={24} strokeWidth={1.8} />
              ) : (
                <XCircle size={24} strokeWidth={1.8} />
              )}
            </HeroIconRing>
            <div>
              <HeroTitle>{decodedExamName}</HeroTitle>
              <HeroSub>{decodedUserId}</HeroSub>
            </div>
          </HeroLeft>
          <BackBtn onClick={goBack}>
            <ArrowLeft size={14} /> Back
          </BackBtn>
        </HeroBar>

        {/* Result Hero Card */}
        <Card $d="0.05s">
          <ResultHeroContent>
            <ResultBadge $pass={isPassed}>
              {isPassed ? "🏆 PASSED" : "📄 FAILED"}
            </ResultBadge>
            <ExamTitleText>{result.name || decodedExamName}</ExamTitleText>
            <ExamIdText>Exam ID: {decodedExamId}</ExamIdText>

            {/* SVG Score Ring */}
            {percentage !== null && (
              <ScoreWrap>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r="58"
                    fill="none"
                    stroke="#f1f5f9"
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
                    y="64"
                    textAnchor="middle"
                    fill="#1e293b"
                    fontSize="26"
                    fontWeight="800"
                    fontFamily="Sora,sans-serif"
                  >
                    {percentage}%
                  </text>
                  <text
                    x="70"
                    y="82"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="11"
                    fontFamily="DM Sans,sans-serif"
                    fontWeight="600"
                  >
                    Score
                  </text>
                </svg>
              </ScoreWrap>
            )}
          </ResultHeroContent>

          <ScoreDetailsRow>
            {score !== null && (
              <ScoreItem>
                <ScoreValue $c={accentColor}>{score}</ScoreValue>
                <ScoreLabel>Marks Obtained</ScoreLabel>
              </ScoreItem>
            )}
            {maxScore !== null && (
              <ScoreItem>
                <ScoreValue>{maxScore}</ScoreValue>
                <ScoreLabel>Total Marks</ScoreLabel>
              </ScoreItem>
            )}
            {result.timeTaken && (
              <ScoreItem>
                <ScoreValue>{result.timeTaken}</ScoreValue>
                <ScoreLabel>Time Taken</ScoreLabel>
              </ScoreItem>
            )}
          </ScoreDetailsRow>
        </Card>

        {/* Details Grid */}
        <DetailsGrid>
          {[
            { label: "Candidate", value: result.name || decodedUserId },
            { label: "User ID", value: decodedUserId },
            { label: "Exam", value: decodedExamName },
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
              <DetailCard key={i}>
                <DetailLabel>{item.label}</DetailLabel>
                <DetailValue>{item.value}</DetailValue>
              </DetailCard>
            ))}
        </DetailsGrid>

        {/* Section Breakdown */}
        {result.sections && result.sections.length > 0 && (
          <SectionCard>
            <Card $d="0.2s">
              <CardHeader $b="#e2e8f0" $bg="#f8fafc">
                <CardTitle $c="#475569">Section Breakdown</CardTitle>
              </CardHeader>
              <div>
                {result.sections.map((sec, i) => {
                  const pct = sec.maxMarks
                    ? Math.round((sec.marks / sec.maxMarks) * 100)
                    : null;
                  const c =
                    pct !== null
                      ? pct >= 50
                        ? passColor
                        : failColor
                      : "#6366f1";
                  return (
                    <SectionRow key={i}>
                      <SecTop>
                        <SecName>{sec.name || `Section ${i + 1}`}</SecName>
                        {pct !== null && <SecPct $c={c}>{pct}%</SecPct>}
                      </SecTop>
                      {pct !== null && (
                        <ProgressBg>
                          <ProgressBar $c={c} $w={`${pct}%`} />
                        </ProgressBg>
                      )}
                      <SecScore>
                        {sec.marks ?? "—"} / {sec.maxMarks ?? "—"}
                      </SecScore>
                    </SectionRow>
                  );
                })}
              </div>
            </Card>
          </SectionCard>
        )}
      </PageWrap>
    </Layout>
  );
};

export { CompletedExamList };
export default CompletedExam;
