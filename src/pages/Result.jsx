import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import Layout from "../component/Layout";
import UserHeader from "../user/UserHeader";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --blue-50:   #E6F1FB;
    --blue-100:  #B5D4F4;
    --blue-200:  #85B7EB;
    --blue-400:  #378ADD;
    --blue-600:  #185FA5;
    --blue-800:  #0C447C;

    --green-50:  #EAF3DE;
    --green-100: #C0DD97;
    --green-600: #3B6D11;
    --green-800: #27500A;

    --teal-50:   #E1F5EE;
    --teal-100:  #9FE1CB;
    --teal-600:  #0F6E56;

    --amber-50:  #FAEEDA;
    --amber-100: #FAC775;
    --amber-600: #854F0B;

    --red-50:    #FCEBEB;
    --red-100:   #F7C1C1;
    --red-200:   #F09595;
    --red-600:   #A32D2D;

    --gray-50:   #F7F6F2;
    --gray-100:  #EEEDE8;
    --gray-200:  #D3D1C7;
    --gray-400:  #888780;
    --gray-600:  #5F5E5A;
    --gray-800:  #2C2C2A;

    --font: 'Sora', sans-serif;
    --mono: 'DM Mono', monospace;
    --radius-sm: 10px;
    --radius-md: 14px;
    --radius-lg: 18px;
    --radius-xl: 24px;
  }

  body {
    font-family: var(--font);
    background: #F5F4EF;
    margin: 0; padding: 0;
  }
`;

const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.35}`;
const countUp = keyframes`from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}`;
const shimmerBg = keyframes`0%{background-position:-400px 0}100%{background-position:400px 0}`;

const Page = styled.div`
  min-height: 100vh;
  background: #f5f4ef;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px 60px;
  font-family: var(--font);
`;

const Card = styled.div`
  width: 100%;
  max-width: 520px;
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: 48px 40px 40px;
  animation: ${fadeUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  box-shadow:
    0 8px 40px rgba(44, 44, 42, 0.08),
    0 1px 4px rgba(44, 44, 42, 0.04);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(p) =>
      p.$pass
        ? "linear-gradient(90deg, var(--green-600), var(--teal-600))"
        : "linear-gradient(90deg, var(--red-600), #c94040)"};
  }

  @media (max-width: 560px) {
    padding: 36px 22px 30px;
  }
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--blue-50);
  border: 1px solid var(--blue-100);
  border-radius: 99px;
  padding: 5px 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--blue-600);
  margin-bottom: 32px;
`;

const ChipDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--blue-400);
  animation: ${pulse} 2s ease infinite;
`;

const RingWrap = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto 28px;
  animation: ${countUp} 0.6s 0.25s both;
`;

const RingSvg = styled.svg`
  transform: rotate(-90deg);
`;

const RingBg = styled.circle`
  fill: none;
  stroke: var(--gray-100);
  stroke-width: 14;
`;

const RingFg = styled.circle`
  fill: none;
  stroke: url(#resultRingGrad);
  stroke-width: 14;
  stroke-linecap: round;
  stroke-dasharray: 440;
  stroke-dashoffset: ${(p) =>
    440 - (440 * Math.min(parseFloat(p.$pct), 100)) / 100};
  transition: stroke-dashoffset 1.3s 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const RingCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ScoreNum = styled.span`
  font-family: var(--mono);
  font-size: 44px;
  font-weight: 500;
  color: var(--gray-800);
  line-height: 1;
  letter-spacing: -1px;
`;

const ScoreSub = styled.span`
  font-size: 11px;
  color: var(--gray-400);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 4px;
  font-weight: 600;
`;

const BadgeWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
`;

const PassBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
  border-radius: 99px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.04em;
  background: ${(p) =>
    p.$pass
      ? "linear-gradient(135deg, var(--green-50), #d1f0b8)"
      : "linear-gradient(135deg, var(--red-50), #fdd0d0)"};
  border: 2px solid ${(p) => (p.$pass ? "var(--green-100)" : "var(--red-100)")};
  color: ${(p) => (p.$pass ? "var(--green-600)" : "var(--red-600)")};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 28px;
`;

const StatBox = styled.div`
  background: ${(p) => p.bg || "var(--gray-50)"};
  border: 1.5px solid ${(p) => p.border || "var(--gray-100)"};
  border-radius: var(--radius-md);
  padding: 18px 16px;
  text-align: center;
  animation: ${fadeUp} 0.45s ${(p) => p.$delay || "0s"} both;
`;

const StatIcon = styled.div`
  font-size: 20px;
  margin-bottom: 8px;
`;

const StatVal = styled.div`
  font-family: var(--mono);
  font-size: 28px;
  font-weight: 500;
  color: ${(p) => p.color || "var(--gray-800)"};
`;

const StatLabel = styled.div`
  font-size: 10.5px;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  font-weight: 600;
`;

const BarSection = styled.div`
  margin-bottom: 28px;
`;

const BarHead = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12.5px;
  color: var(--gray-400);
  font-weight: 500;
  margin-bottom: 8px;
`;

const BarHeadVal = styled.span`
  color: var(--gray-800);
  font-weight: 700;
  font-family: var(--mono);
`;

const BarTrack = styled.div`
  height: 8px;
  background: var(--gray-100);
  border-radius: 99px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  border-radius: 99px;
  width: ${(p) => p.$pct}%;
  background: linear-gradient(90deg, var(--green-600), var(--teal-600));
`;

const MetaSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 28px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--gray-50);
  border: 1px solid var(--gray-100);
  border-radius: var(--radius-sm);
`;

const MetaKey = styled.span`
  font-size: 12px;
  color: var(--gray-400);
`;

const MetaVal = styled.span`
  font-size: 13px;
  color: var(--gray-800);
  font-weight: 700;
  font-family: var(--mono);
`;

const BackBtn = styled.button`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 700;
  cursor: pointer;
  background: var(--blue-600);
  color: #fff;
`;

const SkeletonBox = styled.div`
  height: ${(p) => p.$h || "20px"};
  border-radius: 10px;
  background: var(--gray-100);
`;

const SkeletonRing = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  margin: 0 auto 28px;
  background: var(--gray-100);
`;

const Result = () => {
  const { examId, userId, skipped } = useParams();
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
      if (response.ok) setResult(data.result[0]);
      else toast.error("Result not updated yet — please wait.");
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
  const acc = total ? Math.round((correct / total) * 100) : 0;

  return (
    <>
      <UserHeader />
      <GlobalStyle />

      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <linearGradient id="resultRingGrad">
            {passed ? (
              <>
                <stop offset="0%" stopColor="#3B6D11" />
                <stop offset="100%" stopColor="#0F6E56" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#A32D2D" />
                <stop offset="100%" stopColor="#c94040" />
              </>
            )}
          </linearGradient>
        </defs>
      </svg>

      <Page>
        <Card $pass={passed}>
          <Chip>
            <ChipDot /> Exam Report
          </Chip>

          {loading ? (
            <>
              <SkeletonRing />
              <SkeletonBox $h="48px" />
            </>
          ) : (
            <>
              <RingWrap>
                <RingSvg width="180" height="180">
                  <RingBg cx="90" cy="90" r="70" />
                  <RingFg cx="90" cy="90" r="70" $pct={score} />
                </RingSvg>
                <RingCenter>
                  <ScoreNum>{score}%</ScoreNum>
                  <ScoreSub>Score</ScoreSub>
                </RingCenter>
              </RingWrap>

              <BadgeWrap>
                <PassBadge $pass={passed}>
                  {passed ? "🏆 Passed" : "📋 Failed"}
                </PassBadge>
              </BadgeWrap>

              <StatsGrid>
                <StatBox bg="var(--gray-50)" border="var(--gray-100)">
                  <StatIcon>📝</StatIcon>
                  <StatVal>{total}</StatVal>
                  <StatLabel>Total Questions</StatLabel>
                </StatBox>

                <StatBox bg="var(--green-50)" border="var(--green-100)">
                  <StatIcon>✅</StatIcon>
                  <StatVal color="var(--green-600)">{correct}</StatVal>
                  <StatLabel>Correct</StatLabel>
                </StatBox>

                <StatBox bg="var(--red-50)" border="var(--red-100)">
                  <StatIcon>❌</StatIcon>
                  <StatVal color="var(--red-600)">{wrong}</StatVal>
                  <StatLabel>Wrong</StatLabel>
                </StatBox>

                <StatBox bg="var(--gray-50)" border="var(--gray-100)">
                  <StatIcon>⏭️</StatIcon>
                  <StatVal>{Number(skipped) || 0}</StatVal>
                  <StatLabel>Skipped</StatLabel>
                </StatBox>

                <StatBox bg="var(--amber-50)" border="var(--amber-100)">
                  <StatIcon>🔁</StatIcon>
                  <StatVal>{attempt - 1}</StatVal>
                  <StatLabel>Attempt No.</StatLabel>
                </StatBox>
              </StatsGrid>

              <BarSection>
                <BarHead>
                  <span>Accuracy</span>
                  <BarHeadVal>{acc}%</BarHeadVal>
                </BarHead>
                <BarTrack>
                  <BarFill $pct={acc} />
                </BarTrack>
              </BarSection>

              <MetaSection />

              <BackBtn onClick={() => navigate("/")}>
                ← Back to Dashboard
              </BackBtn>
            </>
          )}
        </Card>
      </Page>
    </>
  );
};

export default Result;