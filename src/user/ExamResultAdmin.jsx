import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ClipboardCheck,
  User,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  BarChart2,
  Calendar,
  Hash,
} from "lucide-react";
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
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
`;
const progressFill = keyframes`
  from { width: 0%; }
  to   { width: var(--target-width); }
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
    background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
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
   SKELETON
───────────────────────────────────────────────────── */
const SkeletonBlock = styled.div`
  height: ${({ $h }) => $h || "80px"};
  border-radius: 16px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

/* ─────────────────────────────────────────────────────
   RESULT HERO CARD
───────────────────────────────────────────────────── */
const ResultHeroCard = styled.div`
  border-radius: 20px;
  padding: 32px;
  background: ${({ $pass }) =>
    $pass
      ? "linear-gradient(135deg, #064e3b, #065f46, #047857)"
      : "linear-gradient(135deg, #7f1d1d, #991b1b, #b91c1c)"};
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;
  overflow: hidden;
  animation: ${scaleIn} 0.4s ease both;
  &::before {
    content: "";
    position: absolute;
    top: -60px;
    right: -60px;
    width: 260px;
    height: 260px;
    background: radial-gradient(
      circle,
      ${({ $pass }) => ($pass ? "rgba(52,211,153,0.18)" : "rgba(248,113,113,0.18)")} 0%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
  }
`;
const ResultBadgeCircle = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $pass }) =>
    $pass ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"};
  border: 2.5px solid
    ${({ $pass }) => ($pass ? "rgba(52,211,153,0.5)" : "rgba(248,113,113,0.5)")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
`;
const ResultHeroInfo = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
`;
const ResultStatus = styled.h2`
  color: ${({ $pass }) => ($pass ? "#6ee7b7" : "#fca5a5")};
  font-size: 28px;
  font-weight: 900;
  margin: 0 0 4px;
  letter-spacing: -0.8px;
`;
const ResultSubText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  margin: 0;
  font-weight: 500;
`;
const ScoreDisplay = styled.div`
  text-align: right;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
`;
const ScoreBig = styled.div`
  font-size: 52px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -2px;
  line-height: 1;
`;
const ScoreLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 4px;
`;

/* ─────────────────────────────────────────────────────
   STATS GRID
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
const StatIconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`;
const StatNum = styled.span`
  font-size: 26px;
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
   SCORE PROGRESS BAR
───────────────────────────────────────────────────── */
const ProgressCard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 28px rgba(0, 0, 0, 0.09), 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: 0.08s;
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
const CardBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const BarRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const BarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const BarLabelText = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;
`;
const BarLabelVal = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: ${({ $c }) => $c || "#1e293b"};
`;
const BarBg = styled.div`
  height: 10px;
  background: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
`;
const BarFill = styled.div`
  height: 100%;
  border-radius: 6px;
  background: ${({ $c }) => $c};
  width: 0%;
  --target-width: ${({ $w }) => $w};
  animation: ${progressFill} 1s ease 0.3s forwards;
`;

/* ─────────────────────────────────────────────────────
   INFO CARD (user + exam meta)
───────────────────────────────────────────────────── */
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;
const InfoCard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 28px rgba(0, 0, 0, 0.09), 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $d }) => $d || "0.1s"};
`;
const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 22px;
  border-bottom: 1px solid #f1f5f9;
  &:last-child {
    border-bottom: none;
  }
`;
const InfoIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg || "#f1f5f9"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
const InfoMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const InfoKey = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const InfoVal = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
`;

/* ─────────────────────────────────────────────────────
   PASS/FAIL VERDICT BANNER
───────────────────────────────────────────────────── */
const VerdictBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 22px;
  border-radius: 14px;
  background: ${({ $pass }) => ($pass ? "#f0fdf4" : "#fef2f2")};
  border: 1.5px solid ${({ $pass }) => ($pass ? "#bbf7d0" : "#fecaca")};
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: 0.2s;
`;
const VerdictText = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: ${({ $pass }) => ($pass ? "#065f46" : "#991b1b")};
`;
const VerdictSub = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ $pass }) => ($pass ? "#10b981" : "#ef4444")};
  margin-left: auto;
`;

/* ════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════ */
const ExamResultAdmin = () => {
  const { examId, userId, userName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const decodedExamId = decodeURIComponent(examId || "");
  const decodedUserId = decodeURIComponent(userId || "");
  const decodedUserName = decodeURIComponent(userName || "");
  

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
          }
        );
        const data = await res.json();
        if (res.ok) {
          setResult({ ...data.result, name: data.name });
         
        } else {
          toast.error("Result not updated yet — please wait.");
        }
      } catch {
        toast.error("Could not fetch result.");
      } finally {
        setLoading(false);
      }
    })();
  }, [decodedExamId, decodedUserId]);

  /* ── Helpers ── */
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const isPassed = result?.userPassed === 1;
  const pct =
    result?.noOfQuestions > 0
      ? Math.round((result.totalCorrect / result.noOfQuestions) * 100)
      : 0;
  const wrongPct =
    result?.noOfQuestions > 0
      ? Math.round((result.totalWrong / result.noOfQuestions) * 100)
      : 0;
  const skippedCount =
    result
      ? result.noOfQuestions - result.totalCorrect - result.totalWrong
      : 0;
  const skippedPct =
    result?.noOfQuestions > 0
      ? Math.round((skippedCount / result.noOfQuestions) * 100)
      : 0;

  return (
    <Layout>
      <PageWrap>

        {/* ── Hero Bar ── */}
        <HeroBar>
          <HeroLeft>
            <HeroIcon>
              <ClipboardCheck size={24} strokeWidth={1.8} />
            </HeroIcon>
            <div>
              <HeroTitle>Exam Result Details</HeroTitle>
              <HeroSub>
               <HeroSub>
                 {result?.name|| " "} -- {result?.examName || decodedExamId}
             </HeroSub>
                
              </HeroSub>
            </div>
          </HeroLeft>
          <BackBtn onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </BackBtn>
        </HeroBar>

        {loading ? (
          <>
            <SkeletonBlock $h="140px" />
            <StatsBar>
              {[1, 2, 3, 4].map((i) => (
                <SkeletonBlock key={i} $h="88px" style={{ flex: 1, minWidth: 110 }} />
              ))}
            </StatsBar>
            <SkeletonBlock $h="180px" />
          </>
        ) : !result ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "#94a3b8",
              fontSize: 15,
              fontWeight: 500,
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 10 }}>📭</div>
            No result data available yet
          </div>
        ) : (
          <>
            {/* ── Result Hero Card ── */}
            <ResultHeroCard $pass={isPassed}>
              <ResultBadgeCircle $pass={isPassed}>
                {isPassed ? "🏆" : "📄"}
              </ResultBadgeCircle>
              <ResultHeroInfo>
                <ResultStatus $pass={isPassed}>
                  {isPassed ? "Passed" : "Failed"}
                </ResultStatus>
                <ResultSubText>
                  {result.name || decodedUserName} · Attempt #{result.attemptNo ?? 1}
                </ResultSubText>
                <ResultSubText style={{ marginTop: 6 }}>
                  📅 {formatDate(result.date)}
                </ResultSubText>
              </ResultHeroInfo>
              <ScoreDisplay>
                <ScoreBig>{pct}%</ScoreBig>
                <ScoreLabel>Score</ScoreLabel>
              </ScoreDisplay>
            </ResultHeroCard>

            {/* ── Verdict Banner ── */}
            <VerdictBanner $pass={isPassed}>
              {isPassed ? (
                <CheckCircle2 size={20} color="#10b981" />
              ) : (
                <XCircle size={20} color="#ef4444" />
              )}
              <VerdictText $pass={isPassed}>
                {isPassed
                  ? "This student has successfully passed the exam."
                  : "This student did not meet the passing criteria."}
              </VerdictText>
              <VerdictSub $pass={isPassed}>
                {result.totalCorrect}/{result.noOfQuestions} correct
              </VerdictSub>
            </VerdictBanner>

            {/* ── Stats Bar ── */}
            <StatsBar>
              <StatBox $bg="#f0f9ff" $border="#bae6fd" $d="0.05s">
                <StatIconRow>
                  <BookOpen size={14} color="#0369a1" />
                  <StatLabel>Total Qs</StatLabel>
                </StatIconRow>
                <StatNum $c="#0369a1">{result.noOfQuestions}</StatNum>
              </StatBox>
              <StatBox $bg="#f0fdf4" $border="#bbf7d0" $d="0.1s">
                <StatIconRow>
                  <CheckCircle2 size={14} color="#10b981" />
                  <StatLabel>Correct</StatLabel>
                </StatIconRow>
                <StatNum $c="#10b981">{result.totalCorrect}</StatNum>
              </StatBox>
              <StatBox $bg="#fef2f2" $border="#fecaca" $d="0.15s">
                <StatIconRow>
                  <XCircle size={14} color="#ef4444" />
                  <StatLabel>Wrong</StatLabel>
                </StatIconRow>
                <StatNum $c="#ef4444">{result.totalWrong}</StatNum>
              </StatBox>
              <StatBox $bg="#fefce8" $border="#fde68a" $d="0.2s">
                <StatIconRow>
                  <BarChart2 size={14} color="#d97706" />
                  <StatLabel>Skipped</StatLabel>
                </StatIconRow>
                <StatNum $c="#d97706">{skippedCount}</StatNum>
              </StatBox>
            </StatsBar>

            {/* ── Score Breakdown ── */}
            <ProgressCard>
              <CardHead>
                <BarChart2 size={15} color="#3b82f6" />
                <CardTitle>Score Breakdown</CardTitle>
              </CardHead>
              <CardBody>
                <BarRow>
                  <BarLabel>
                    <BarLabelText>
                      <CheckCircle2 size={14} color="#10b981" /> Correct Answers
                    </BarLabelText>
                    <BarLabelVal $c="#10b981">
                      {result.totalCorrect} / {result.noOfQuestions} ({pct}%)
                    </BarLabelVal>
                  </BarLabel>
                  <BarBg>
                    <BarFill $c="#10b981" $w={`${pct}%`} />
                  </BarBg>
                </BarRow>
                <BarRow>
                  <BarLabel>
                    <BarLabelText>
                      <XCircle size={14} color="#ef4444" /> Wrong Answers
                    </BarLabelText>
                    <BarLabelVal $c="#ef4444">
                      {result.totalWrong} / {result.noOfQuestions} ({wrongPct}%)
                    </BarLabelVal>
                  </BarLabel>
                  <BarBg>
                    <BarFill $c="#ef4444" $w={`${wrongPct}%`} />
                  </BarBg>
                </BarRow>
                {skippedCount > 0 && (
                  <BarRow>
                    <BarLabel>
                      <BarLabelText>
                        <Hash size={14} color="#d97706" /> Skipped
                      </BarLabelText>
                      <BarLabelVal $c="#d97706">
                        {skippedCount} / {result.noOfQuestions} ({skippedPct}%)
                      </BarLabelVal>
                    </BarLabel>
                    <BarBg>
                      <BarFill $c="#f59e0b" $w={`${skippedPct}%`} />
                    </BarBg>
                  </BarRow>
                )}
              </CardBody>
            </ProgressCard>

            {/* ── Info Cards ── */}
            <InfoGrid>
              {/* Student Info */}
              <InfoCard $d="0.12s">
                <CardHead>
                  <User size={15} color="#3b82f6" />
                  <CardTitle>Student Info</CardTitle>
                </CardHead>
                <div>
                  <InfoRow>
                    <InfoIcon $bg="#eff6ff">
                      <User size={16} color="#3b82f6" />
                    </InfoIcon>
                    <InfoMeta>
                      <InfoKey>Name</InfoKey>
                      <InfoVal>{result.name || decodedUserName}</InfoVal>
                    </InfoMeta>
                  </InfoRow>
                  <InfoRow>
                    <InfoIcon $bg="#f0fdf4">
                      <Hash size={16} color="#10b981" />
                    </InfoIcon>
                    <InfoMeta>
                      <InfoKey>Login ID</InfoKey>
                      <InfoVal>{decodedUserId}</InfoVal>
                    </InfoMeta>
                  </InfoRow>
                  <InfoRow>
                    <InfoIcon $bg="#fef9c3">
                      <Award size={16} color="#ca8a04" />
                    </InfoIcon>
                    <InfoMeta>
                      <InfoKey>Attempt No</InfoKey>
                      <InfoVal>#{result.attemptNo ?? 1}</InfoVal>
                    </InfoMeta>
                  </InfoRow>
                </div>
              </InfoCard>

              {/* Exam Info */}
              <InfoCard $d="0.17s">
                <CardHead>
                  <ClipboardCheck size={15} color="#3b82f6" />
                  <CardTitle>Exam Info</CardTitle>
                </CardHead>
                <div>
                  <InfoRow>
                    <InfoIcon $bg="#eff6ff">
                      <BookOpen size={16} color="#3b82f6" />
                    </InfoIcon>
                    <InfoMeta>
                      <InfoKey>Exam ID</InfoKey>
                      <InfoVal>{decodedExamId}</InfoVal>
                    </InfoMeta>
                  </InfoRow>
                  <InfoRow>
                    <InfoIcon $bg="#f0f9ff">
                      <Calendar size={16} color="#0369a1" />
                    </InfoIcon>
                    <InfoMeta>
                      <InfoKey>Date Taken</InfoKey>
                      <InfoVal>{formatDate(result.date)}</InfoVal>
                    </InfoMeta>
                  </InfoRow>
                  <InfoRow>
                    <InfoIcon $bg={isPassed ? "#f0fdf4" : "#fef2f2"}>
                      {isPassed ? (
                        <CheckCircle2 size={16} color="#10b981" />
                      ) : (
                        <XCircle size={16} color="#ef4444" />
                      )}
                    </InfoIcon>
                    <InfoMeta>
                      <InfoKey>Result</InfoKey>
                      <InfoVal style={{ color: isPassed ? "#10b981" : "#ef4444" }}>
                        {isPassed ? "✓ Passed" : "✗ Failed"}
                      </InfoVal>
                    </InfoMeta>
                  </InfoRow>
                </div>
              </InfoCard>
            </InfoGrid>
          </>
        )}
      </PageWrap>
    </Layout>
  );
};

export default ExamResultAdmin;
