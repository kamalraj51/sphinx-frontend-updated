import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import Layout from "../component/Layout";

/* ─── Fonts ─── */
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
`;

/* ─── Animations ─── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,.35); }
  50%      { box-shadow: 0 0 0 18px rgba(99,102,241,0); }
`;

const strokeDraw = keyframes`
  from { stroke-dashoffset: 440; }
  to   { stroke-dashoffset: 0; }
`;

const countUp = keyframes`
  from { opacity: 0; transform: scale(.6); }
  to   { opacity: 1; transform: scale(1); }
`;

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

/* ─── Layout ─── */
const Page = styled.div`
  min-height: 100vh;
  background: #0a0a14;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  font-family: "DM Sans", sans-serif;
`;

const Glow = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 60% 50% at 20% 20%,
      rgba(99, 102, 241, 0.18) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 50% 40% at 80% 80%,
      rgba(236, 72, 153, 0.12) 0%,
      transparent 70%
    );
`;

/* ─── Card ─── */
const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 28px;
  padding: 48px 40px 40px;
  backdrop-filter: blur(24px);
  animation: ${fadeUp} 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 28px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.4),
      rgba(236, 72, 153, 0.25),
      transparent 60%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

/* ─── Header chip ─── */
const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 50px;
  padding: 6px 14px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #a5b4fc;
  margin-bottom: 32px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6366f1;
  animation: ${pulse} 2s infinite;
`;

/* ─── Ring ─── */
const RingWrap = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto 36px;
  animation: ${countUp} 0.6s 0.3s both;
`;

const RingSvg = styled.svg`
  transform: rotate(-90deg);
`;

const RingBg = styled.circle`
  fill: none;
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 14;
`;

const RingFg = styled.circle`
  fill: none;
  stroke: url(#ringGrad);
  stroke-width: 14;
  stroke-linecap: round;
  stroke-dasharray: 440;
  stroke-dashoffset: ${(p) => 440 - (440 * p.pct) / 100};
  animation: ${strokeDraw} 1.2s 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
`;

const RingLabel = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ScoreNum = styled.span`
  font-family: "Syne", sans-serif;
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #a5b4fc, #f0abfc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ScoreSub = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 4px;
  letter-spacing: 0.06em;
`;

/* ─── Badge ─── */
const Badge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
`;

const BadgePill = styled.div`
  padding: 8px 22px;
  border-radius: 50px;
  font-family: "Syne", sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.05em;
  background: ${(p) =>
    p.pass
      ? "linear-gradient(135deg,#064e3b,#065f46)"
      : "linear-gradient(135deg,#7f1d1d,#991b1b)"};
  border: 1px solid
    ${(p) => (p.pass ? "rgba(52,211,153,.3)" : "rgba(248,113,113,.3)")};
  color: ${(p) => (p.pass ? "#34d399" : "#f87171")};
`;

const BadgeIcon = styled.span`
  font-size: 20px;
`;

/* ─── Stats grid ─── */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 32px;
`;

const StatBox = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 18px 16px;
  text-align: center;
  animation: ${fadeUp} 0.5s ${(p) => p.delay || "0s"} both;
  transition:
    border-color 0.2s,
    background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(99, 102, 241, 0.3);
  }
`;

const StatIcon = styled.div`
  font-size: 22px;
  margin-bottom: 8px;
`;

const StatVal = styled.div`
  font-family: "Syne", sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: ${(p) => p.color || "#fff"};
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.38);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-top: 4px;
`;

/* ─── Progress bar ─── */
const BarWrap = styled.div`
  margin-bottom: 32px;
  animation: ${fadeUp} 0.5s 0.55s both;
`;

const BarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 8px;
`;

const BarTrack = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  width: ${(p) => p.pct}%;
  border-radius: 50px;
  background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
  background-size: 200%;
  animation: ${shimmer} 2s linear infinite;
  transition: width 1s 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

/* ─── Meta row ─── */
const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  margin-bottom: 12px;
  font-size: 13px;
  animation: ${fadeUp} 0.5s ${(p) => p.delay || "0s"} both;
`;

const MetaKey = styled.span`
  color: rgba(255, 255, 255, 0.4);
`;

const MetaVal = styled.span`
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
`;

/* ─── Button ─── */
const Btn = styled.button`
  width: 100%;
  margin-top: 28px;
  padding: 16px;
  border: none;
  border-radius: 14px;
  font-family: "Syne", sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: #fff;
  transition:
    opacity 0.2s,
    transform 0.15s;
  animation: ${fadeUp} 0.5s 0.7s both;

  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

/* ─── Skeleton ─── */
const SkeletonBox = styled.div`
  height: ${(p) => p.h || "20px"};
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.6s infinite;
  margin-bottom: ${(p) => p.mb || "0"};
`;

/* ═══════════════════════════════════════════════ */

const Result = () => {
  const { examId, userId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const getResult = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/exam-result",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId, userLoginId: userId }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setResult(data.result[0]);
      } else {
        toast.error("Result not updated yet — please wait.");
      }
    } catch {
      toast.error("Could not fetch result.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResult();
  }, []);

  const passed = result?.userPassed === 1;
  const score = parseFloat(result?.score || 0).toFixed(1);
  const correct = result?.totalCorrect ?? 0;
  const wrong = result?.totalWrong ?? 0;
  const total = result?.noOfQuestions ?? correct + wrong;
  const attempt = (result?.attemptNo ?? 0) + 1;

  return (
    <Layout>
      <GlobalStyle />
      <Page>
        <Glow />
        <Card>
          {/* Header chip */}
          <Chip>
            <Dot /> Exam Report
          </Chip>

          {loading ? (
            <>
              <SkeletonBox h="180px" mb="24px" style={{ borderRadius: 90 }} />
              <SkeletonBox h="40px" mb="16px" />
              <SkeletonBox h="120px" mb="16px" />
            </>
          ) : (
            <>
              {/* Ring */}
              <RingWrap>
                <RingSvg width="180" height="180" viewBox="0 0 180 180">
                  <defs>
                    <linearGradient
                      id="ringGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <RingBg cx="90" cy="90" r="70" />
                  <RingFg cx="90" cy="90" r="70" pct={score} />
                </RingSvg>
                <RingLabel>
                  <ScoreNum>{score}%</ScoreNum>
                  <ScoreSub>SCORE</ScoreSub>
                </RingLabel>
              </RingWrap>

              {/* Pass / Fail badge */}
              <Badge>
                <BadgePill pass={passed}>
                  <BadgeIcon>{passed ? "🏆" : "📋"}</BadgeIcon>
                  {passed ? " PASSED" : " FAILED"}
                </BadgePill>
              </Badge>

              {/* Stat grid */}
              <Grid>
                <StatBox delay=".1s">
                  <StatIcon>📝</StatIcon>
                  <StatVal>{total}</StatVal>
                  <StatLabel>Total Questions</StatLabel>
                </StatBox>
                <StatBox delay=".15s">
                  <StatIcon>✅</StatIcon>
                  <StatVal color="#34d399">{correct}</StatVal>
                  <StatLabel>Correct</StatLabel>
                </StatBox>
                <StatBox delay=".2s">
                  <StatIcon>❌</StatIcon>
                  <StatVal color="#f87171">{wrong}</StatVal>
                  <StatLabel>Wrong</StatLabel>
                </StatBox>
                <StatBox delay=".25s">
                  <StatIcon>🔁</StatIcon>
                  <StatVal color="#fbbf24">{attempt}</StatVal>
                  <StatLabel>Attempt No.</StatLabel>
                </StatBox>
              </Grid>

              {/* Accuracy bar */}
              <BarWrap>
                <BarLabel>
                  <span>Accuracy</span>
                  <span>
                    {total ? ((correct / total) * 100).toFixed(0) : 0}%
                  </span>
                </BarLabel>
                <BarTrack>
                  <BarFill pct={total ? (correct / total) * 100 : 0} />
                </BarTrack>
              </BarWrap>

              {/* Meta info */}
              <Meta delay=".3s">
                <MetaKey>Exam ID</MetaKey>
                <MetaVal>{result?.examId || examId}</MetaVal>
              </Meta>
              <Meta delay=".35s">
                <MetaKey>Performance ID</MetaKey>
                <MetaVal>{result?.performanceId ?? "—"}</MetaVal>
              </Meta>

              <Btn onClick={() => navigate("/")}>← Back to Dashboard</Btn>
            </>
          )}
        </Card>
      </Page>
    </Layout>
  );
};

export default Result;
