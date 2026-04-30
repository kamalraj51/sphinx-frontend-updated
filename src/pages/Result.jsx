// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import styled, { keyframes, createGlobalStyle } from "styled-components";
// import Layout from "../component/Layout";

// /* ─── Fonts ─── */
// const GlobalStyle = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
// `;

// /* ─── Animations ─── */
// const fadeUp = keyframes`
//   from { opacity: 0; transform: translateY(28px); }
//   to   { opacity: 1; transform: translateY(0); }
// `;

// const pulse = keyframes`
//   0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,.35); }
//   50%      { box-shadow: 0 0 0 18px rgba(99,102,241,0); }
// `;

// const strokeDraw = keyframes`
//   from { stroke-dashoffset: 440; }
//   to   { stroke-dashoffset: 0; }
// `;

// const countUp = keyframes`
//   from { opacity: 0; transform: scale(.6); }
//   to   { opacity: 1; transform: scale(1); }
// `;

// const shimmer = keyframes`
//   0%   { background-position: -600px 0; }
//   100% { background-position: 600px 0; }
// `;

// /* ─── Layout ─── */
// const Page = styled.div`
//   min-height: 100vh;
//   background: #0a0a14;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 40px 16px;
//   font-family: "DM Sans", sans-serif;
// `;

// const Glow = styled.div`
//   position: fixed;
//   inset: 0;
//   pointer-events: none;
//   background:
//     radial-gradient(
//       ellipse 60% 50% at 20% 20%,
//       rgba(99, 102, 241, 0.18) 0%,
//       transparent 70%
//     ),
//     radial-gradient(
//       ellipse 50% 40% at 80% 80%,
//       rgba(236, 72, 153, 0.12) 0%,
//       transparent 70%
//     );
// `;

// /* ─── Card ─── */
// const Card = styled.div`
//   position: relative;
//   width: 100%;
//   max-width: 520px;
//   background: rgba(255, 255, 255, 0.04);
//   border: 1px solid rgba(255, 255, 255, 0.09);
//   border-radius: 28px;
//   padding: 48px 40px 40px;
//   backdrop-filter: blur(24px);
//   animation: ${fadeUp} 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
//   overflow: hidden;

//   &::before {
//     content: "";
//     position: absolute;
//     inset: 0;
//     border-radius: 28px;
//     padding: 1px;
//     background: linear-gradient(
//       135deg,
//       rgba(99, 102, 241, 0.4),
//       rgba(236, 72, 153, 0.25),
//       transparent 60%
//     );
//     -webkit-mask:
//       linear-gradient(#fff 0 0) content-box,
//       linear-gradient(#fff 0 0);
//     -webkit-mask-composite: destination-out;
//     mask-composite: exclude;
//     pointer-events: none;
//   }
// `;

// /* ─── Header chip ─── */
// const Chip = styled.div`
//   display: inline-flex;
//   align-items: center;
//   gap: 6px;
//   background: rgba(99, 102, 241, 0.15);
//   border: 1px solid rgba(99, 102, 241, 0.3);
//   border-radius: 50px;
//   padding: 6px 14px;
//   font-size: 11px;
//   font-weight: 500;
//   letter-spacing: 0.08em;
//   text-transform: uppercase;
//   color: #a5b4fc;
//   margin-bottom: 32px;
// `;

// const Dot = styled.span`
//   width: 6px;
//   height: 6px;
//   border-radius: 50%;
//   background: #6366f1;
//   animation: ${pulse} 2s infinite;
// `;

// /* ─── Ring ─── */
// const RingWrap = styled.div`
//   position: relative;
//   width: 180px;
//   height: 180px;
//   margin: 0 auto 36px;
//   animation: ${countUp} 0.6s 0.3s both;
// `;

// const RingSvg = styled.svg`
//   transform: rotate(-90deg);
// `;

// const RingBg = styled.circle`
//   fill: none;
//   stroke: rgba(255, 255, 255, 0.06);
//   stroke-width: 14;
// `;

// const RingFg = styled.circle`
//   fill: none;
//   stroke: url(#ringGrad);
//   stroke-width: 14;
//   stroke-linecap: round;
//   stroke-dasharray: 440;
//   stroke-dashoffset: ${(p) => 440 - (440 * p.pct) / 100};
//   animation: ${strokeDraw} 1.2s 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
// `;

// const RingLabel = styled.div`
//   position: absolute;
//   inset: 0;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
// `;

// const ScoreNum = styled.span`
//   font-family: "Syne", sans-serif;
//   font-size: 42px;
//   font-weight: 800;
//   line-height: 1;
//   background: linear-gradient(135deg, #a5b4fc, #f0abfc);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
// `;

// const ScoreSub = styled.span`
//   font-size: 12px;
//   color: rgba(255, 255, 255, 0.4);
//   margin-top: 4px;
//   letter-spacing: 0.06em;
// `;

// /* ─── Badge ─── */
// const Badge = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 8px;
//   margin-bottom: 32px;
// `;

// const BadgePill = styled.div`
//   padding: 8px 22px;
//   border-radius: 50px;
//   font-family: "Syne", sans-serif;
//   font-size: 15px;
//   font-weight: 700;
//   letter-spacing: 0.05em;
//   background: ${(p) =>
//     p.pass
//       ? "linear-gradient(135deg,#064e3b,#065f46)"
//       : "linear-gradient(135deg,#7f1d1d,#991b1b)"};
//   border: 1px solid
//     ${(p) => (p.pass ? "rgba(52,211,153,.3)" : "rgba(248,113,113,.3)")};
//   color: ${(p) => (p.pass ? "#34d399" : "#f87171")};
// `;

// const BadgeIcon = styled.span`
//   font-size: 20px;
// `;

// /* ─── Stats grid ─── */
// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 12px;
//   margin-bottom: 32px;
// `;

// const StatBox = styled.div`
//   background: rgba(255, 255, 255, 0.03);
//   border: 1px solid rgba(255, 255, 255, 0.07);
//   border-radius: 16px;
//   padding: 18px 16px;
//   text-align: center;
//   animation: ${fadeUp} 0.5s ${(p) => p.delay || "0s"} both;
//   transition:
//     border-color 0.2s,
//     background 0.2s;

//   &:hover {
//     background: rgba(255, 255, 255, 0.06);
//     border-color: rgba(99, 102, 241, 0.3);
//   }
// `;

// const StatIcon = styled.div`
//   font-size: 22px;
//   margin-bottom: 8px;
// `;

// const StatVal = styled.div`
//   font-family: "Syne", sans-serif;
//   font-size: 26px;
//   font-weight: 800;
//   color: ${(p) => p.color || "#fff"};
// `;

// const StatLabel = styled.div`
//   font-size: 11px;
//   color: rgba(255, 255, 255, 0.38);
//   text-transform: uppercase;
//   letter-spacing: 0.07em;
//   margin-top: 4px;
// `;

// /* ─── Progress bar ─── */
// const BarWrap = styled.div`
//   margin-bottom: 32px;
//   animation: ${fadeUp} 0.5s 0.55s both;
// `;

// const BarLabel = styled.div`
//   display: flex;
//   justify-content: space-between;
//   font-size: 12px;
//   color: rgba(255, 255, 255, 0.45);
//   margin-bottom: 8px;
// `;

// const BarTrack = styled.div`
//   height: 8px;
//   background: rgba(255, 255, 255, 0.06);
//   border-radius: 50px;
//   overflow: hidden;
// `;

// const BarFill = styled.div`
//   height: 100%;
//   width: ${(p) => p.pct}%;
//   border-radius: 50px;
//   background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
//   background-size: 200%;
//   animation: ${shimmer} 2s linear infinite;
//   transition: width 1s 0.6s cubic-bezier(0.4, 0, 0.2, 1);
// `;

// /* ─── Meta row ─── */
// const Meta = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 14px 18px;
//   background: rgba(255, 255, 255, 0.03);
//   border: 1px solid rgba(255, 255, 255, 0.07);
//   border-radius: 14px;
//   margin-bottom: 12px;
//   font-size: 13px;
//   animation: ${fadeUp} 0.5s ${(p) => p.delay || "0s"} both;
// `;

// const MetaKey = styled.span`
//   color: rgba(255, 255, 255, 0.4);
// `;

// const MetaVal = styled.span`
//   color: rgba(255, 255, 255, 0.85);
//   font-weight: 500;
// `;

// /* ─── Button ─── */
// const Btn = styled.button`
//   width: 100%;
//   margin-top: 28px;
//   padding: 16px;
//   border: none;
//   border-radius: 14px;
//   font-family: "Syne", sans-serif;
//   font-size: 15px;
//   font-weight: 700;
//   letter-spacing: 0.04em;
//   cursor: pointer;
//   background: linear-gradient(135deg, #6366f1, #a855f7);
//   color: #fff;
//   transition:
//     opacity 0.2s,
//     transform 0.15s;
//   animation: ${fadeUp} 0.5s 0.7s both;

//   &:hover {
//     opacity: 0.88;
//     transform: translateY(-1px);
//   }
//   &:active {
//     transform: translateY(0);
//   }
// `;

// /* ─── Skeleton ─── */
// const SkeletonBox = styled.div`
//   height: ${(p) => p.h || "20px"};
//   border-radius: 10px;
//   background: linear-gradient(
//     90deg,
//     rgba(255, 255, 255, 0.05) 25%,
//     rgba(255, 255, 255, 0.1) 50%,
//     rgba(255, 255, 255, 0.05) 75%
//   );
//   background-size: 600px 100%;
//   animation: ${shimmer} 1.6s infinite;
//   margin-bottom: ${(p) => p.mb || "0"};
// `;

// /* ═══════════════════════════════════════════════ */

// const Result = () => {
//   const { examId, userId ,skipped} = useParams();
//   const navigate = useNavigate();
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const getResult = async () => {
//     try {
//       const response = await fetch(
//         "https://localhost:8443/sphinx/api/user/exam-result",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ examId, userLoginId: userId }),
//         },
//       );
//       const data = await response.json();
//       if (response.ok) {
//         setResult(data.result[0]);
//       } else {
//         toast.error("Result not updated yet — please wait.");
//       }
//     } catch {
//       toast.error("Could not fetch result.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getResult();
//   }, []);

//   const passed = result?.userPassed === 1;
//   const score = parseFloat(result?.score || 0).toFixed(1);
//   const correct = result?.totalCorrect ?? 0;
//   const wrong = result?.totalWrong ?? 0;
//   const total = result?.noOfQuestions ?? correct + wrong;
//   const attempt = (result?.attemptNo ?? 0) + 1;

//   return (
//     <Layout>
//       <GlobalStyle />
//       <Page>
//         <Glow />
//         <Card>
//           {/* Header chip */}
//           <Chip>
//             <Dot /> Exam Report
//           </Chip>

//           {loading ? (
//             <>
//               <SkeletonBox h="180px" mb="24px" style={{ borderRadius: 90 }} />
//               <SkeletonBox h="40px" mb="16px" />
//               <SkeletonBox h="120px" mb="16px" />
//             </>
//           ) : (
//             <>
//               {/* Ring */}
//               <RingWrap>
//                 <RingSvg width="180" height="180" viewBox="0 0 180 180">
//                   <defs>
//                     <linearGradient
//                       id="ringGrad"
//                       x1="0%"
//                       y1="0%"
//                       x2="100%"
//                       y2="100%"
//                     >
//                       <stop offset="0%" stopColor="#6366f1" />
//                       <stop offset="50%" stopColor="#a855f7" />
//                       <stop offset="100%" stopColor="#ec4899" />
//                     </linearGradient>
//                   </defs>
//                   <RingBg cx="90" cy="90" r="70" />
//                   <RingFg cx="90" cy="90" r="70" pct={score} />
//                 </RingSvg>
//                 <RingLabel>
//                   <ScoreNum>{score}%</ScoreNum>
//                   <ScoreSub>SCORE</ScoreSub>
//                 </RingLabel>
//               </RingWrap>

//               {/* Pass / Fail badge */}
//               <Badge>
//                 <BadgePill pass={passed}>
//                   <BadgeIcon>{passed ? "🏆" : "📋"}</BadgeIcon>
//                   {passed ? " PASSED" : " FAILED"}
//                 </BadgePill>
//               </Badge>

//               {/* Stat grid */}
//               <Grid>
//                 <StatBox delay=".1s">
//                   <StatIcon>📝</StatIcon>
//                   <StatVal>{total}</StatVal>
//                   <StatLabel>Total Questions</StatLabel>
//                 </StatBox>
//                 <StatBox delay=".15s">
//                   <StatIcon>✅</StatIcon>
//                   <StatVal color="#34d399">{correct}</StatVal>
//                   <StatLabel>Correct</StatLabel>
//                 </StatBox>
//                 <StatBox delay=".2s">
//                   <StatIcon>❌</StatIcon>
//                   <StatVal color="#f87171">{wrong}</StatVal>
//                   <StatLabel>Wrong</StatLabel>
//                 </StatBox>
//                 <StatBox delay=".2s">
//                   <StatIcon>⚪</StatIcon>
//                   <StatVal color="#f87171">{Number(skipped) || 0}</StatVal>
//                   <StatLabel>Skipped</StatLabel>
//                 </StatBox>
//                 <StatBox delay=".25s">
//                   <StatIcon>🔁</StatIcon>
//                   <StatVal color="#fbbf24">{attempt}</StatVal>
//                   <StatLabel>Attempt No.</StatLabel>
//                 </StatBox>
//               </Grid>

//               {/* Accuracy bar */}
//               <BarWrap>
//                 <BarLabel>
//                   <span>Accuracy</span>
//                   <span>
//                     {total ? ((correct / total) * 100).toFixed(0) : 0}%
//                   </span>
//                 </BarLabel>
//                 <BarTrack>
//                   <BarFill pct={total ? (correct / total) * 100 : 0} />
//                 </BarTrack>
//               </BarWrap>

//               {/* Meta info */}
//               <Meta delay=".3s">
//                 <MetaKey>Exam ID</MetaKey>
//                 <MetaVal>{result?.examId || examId}</MetaVal>
//               </Meta>
//               <Meta delay=".35s">
//                 <MetaKey>Performance ID</MetaKey>
//                 <MetaVal>{result?.performanceId ?? "—"}</MetaVal>
//               </Meta>

//               <Btn onClick={() => navigate("/")}>← Back to Dashboard</Btn>
//             </>
//           )}
//         </Card>
//       </Page>
//     </Layout>
//   );
// };

// export default Result;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import Layout from "../component/Layout";
import UserHeader from "../user/UserHeader";

/* ===================== GLOBAL ===================== */
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

/* ===================== KEYFRAMES ===================== */
const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.35}`;
const strokeDraw = keyframes`from{stroke-dashoffset:440}to{stroke-dashoffset:var(--target-offset)}`;
const countUp = keyframes`from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}`;
const shimmerBg = keyframes`0%{background-position:-400px 0}100%{background-position:400px 0}`;

/* ===================== PAGE ===================== */
const Page = styled.div`
  min-height: 100vh;
  background: #f5f4ef;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px 60px;
  font-family: var(--font);
`;

/* ===================== CARD ===================== */
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

  /* top accent bar */
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

/* ===================== CHIP ===================== */
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

/* ===================== RING ===================== */
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

/* ===================== PASS/FAIL BADGE ===================== */
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
  box-shadow: 0 4px 16px
    ${(p) => (p.$pass ? "rgba(59,109,17,0.12)" : "rgba(163,45,45,0.12)")};
`;

/* ===================== STATS GRID ===================== */
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
  transition:
    transform 0.15s,
    box-shadow 0.15s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(44, 44, 42, 0.08);
  }
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
  line-height: 1;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 10.5px;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  font-weight: 600;
`;

/* ===================== ACCURACY BAR ===================== */
const BarSection = styled.div`
  margin-bottom: 28px;
  animation: ${fadeUp} 0.45s 0.5s both;
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
  background: ${(p) =>
    p.$pct >= 70
      ? "linear-gradient(90deg, var(--green-600), var(--teal-600))"
      : p.$pct >= 40
        ? "linear-gradient(90deg, var(--amber-600), #c48012)"
        : "linear-gradient(90deg, var(--red-600), #c94040)"};
  transition: width 1.1s 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

/* ===================== META ROWS ===================== */
const MetaSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 28px;
  animation: ${fadeUp} 0.45s 0.55s both;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--gray-50);
  border: 1px solid var(--gray-100);
  border-radius: var(--radius-sm);
`;

const MetaKey = styled.span`
  font-size: 12px;
  color: var(--gray-400);
  font-weight: 500;
`;

const MetaVal = styled.span`
  font-size: 13px;
  color: var(--gray-800);
  font-weight: 700;
  font-family: var(--mono);
`;

/* ===================== BUTTON ===================== */
const BackBtn = styled.button`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font);
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
  background: var(--blue-600);
  color: #fff;
  letter-spacing: 0.04em;
  animation: ${fadeUp} 0.45s 0.65s both;
  transition:
    background 0.15s,
    transform 0.12s,
    box-shadow 0.15s;
  box-shadow: 0 4px 16px rgba(24, 95, 165, 0.22);

  &:hover {
    background: var(--blue-800);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(24, 95, 165, 0.3);
  }
  &:active {
    transform: translateY(0);
  }
`;

/* ===================== SKELETON ===================== */
const SkeletonBox = styled.div`
  height: ${(p) => p.$h || "20px"};
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    var(--gray-100) 25%,
    var(--gray-50) 50%,
    var(--gray-100) 75%
  );
  background-size: 600px 100%;
  animation: ${shimmerBg} 1.6s ease infinite;
  margin-bottom: ${(p) => p.$mb || "0"};
`;

const SkeletonRing = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  margin: 0 auto 28px;
  background: linear-gradient(
    90deg,
    var(--gray-100) 25%,
    var(--gray-50) 50%,
    var(--gray-100) 75%
  );
  background-size: 600px 100%;
  animation: ${shimmerBg} 1.6s ease infinite;
`;

/* ═══════════════════════════════════════════════ */

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
  const acc = total ? Math.round((correct / total) * 100) : 0;

  return (
    <>
      <UserHeader />
      <GlobalStyle />

      {/* SVG gradient defs — shared */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <linearGradient
            id="resultRingGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
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
              <SkeletonBox $h="48px" $mb="16px" style={{ borderRadius: 99 }} />
              <SkeletonBox $h="120px" $mb="12px" />
              <SkeletonBox $h="60px" $mb="12px" />
              <SkeletonBox $h="44px" />
            </>
          ) : (
            <>
              {/* ── Score ring ── */}
              <RingWrap>
                <RingSvg width="180" height="180" viewBox="0 0 180 180">
                  <RingBg cx="90" cy="90" r="70" />
                  <RingFg cx="90" cy="90" r="70" $pct={score} />
                </RingSvg>
                <RingCenter>
                  <ScoreNum>{score}%</ScoreNum>
                  <ScoreSub>Score</ScoreSub>
                </RingCenter>
              </RingWrap>

              {/* ── Pass / Fail ── */}
              <BadgeWrap>
                <PassBadge $pass={passed}>
                  {passed ? "🏆 Passed" : "📋 Failed"}
                </PassBadge>
              </BadgeWrap>

              {/* ── Stats grid ── */}
              <StatsGrid>
                <StatBox
                  bg="var(--gray-50)"
                  border="var(--gray-100)"
                  $delay=".08s"
                >
                  <StatIcon>📝</StatIcon>
                  <StatVal color="var(--gray-800)">{total}</StatVal>
                  <StatLabel>Total Questions</StatLabel>
                </StatBox>

                <StatBox
                  bg="var(--green-50)"
                  border="var(--green-100)"
                  $delay=".13s"
                >
                  <StatIcon>✅</StatIcon>
                  <StatVal color="var(--green-600)">{correct}</StatVal>
                  <StatLabel>Correct</StatLabel>
                </StatBox>

                <StatBox
                  bg="var(--red-50)"
                  border="var(--red-100)"
                  $delay=".18s"
                >
                  <StatIcon>❌</StatIcon>
                  <StatVal color="var(--red-600)">{wrong}</StatVal>
                  <StatLabel>Wrong</StatLabel>
                </StatBox>

                <StatBox
                  bg="var(--gray-50)"
                  border="var(--gray-100)"
                  $delay=".18s"
                >
                  <StatIcon>⏭️</StatIcon>
                  <StatVal color="var(--gray-600)">
                    {Number(skipped) || 0}
                  </StatVal>
                  <StatLabel>Skipped</StatLabel>
                </StatBox>

                <StatBox
                  bg="var(--amber-50)"
                  border="var(--amber-100)"
                  $delay=".23s"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <StatIcon>🔁</StatIcon>
                  <StatVal color="var(--amber-600)">{attempt}</StatVal>
                  <StatLabel>Attempt No.</StatLabel>
                </StatBox>
              </StatsGrid>

              {/* ── Accuracy bar ── */}
              <BarSection>
                <BarHead>
                  <span>Accuracy</span>
                  <BarHeadVal>{acc}%</BarHeadVal>
                </BarHead>
                <BarTrack>
                  <BarFill $pct={acc} />
                </BarTrack>
              </BarSection>

              {/* ── Meta info ── */}
              <MetaSection>
                <MetaRow>
                  <MetaKey>Exam ID</MetaKey>
                  <MetaVal>{result?.examId || examId}</MetaVal>
                </MetaRow>
                <MetaRow>
                  <MetaKey>Performance ID</MetaKey>
                  <MetaVal>{result?.performanceId ?? "—"}</MetaVal>
                </MetaRow>
              </MetaSection>

              {/* ── Back button ── */}
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
