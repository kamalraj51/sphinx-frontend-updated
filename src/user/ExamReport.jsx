// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// const ExamReport = () => {
//   const { userId } = useParams();
//   const [record, setRecord] = useState([]);
//   const getAllReport = async () => {
//     const response = await fetch(
//       "https://localhost:8443/sphinx/api/user/getUserReport",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userLoginId: userId }),
//       },
//     );
//     const data = await response.json();
//     if (response.ok) {
//       setRecord(data);
//     } else {
//       toast.error = data.error;
//     }
//   };
//   useEffect(() => {
//     getAllReport();
//   });

//   return <>{record.map((e, i) => {

//   })}</>;
// };

// export default ExamReport;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import Layout from "../component/Layout";

/* ─── Global Fonts ─── */
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
`;

/* ─── Animations ─── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const pulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,.35); }
  50%      { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
`;
const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

/* ─── Layout ─── */
const Page = styled.div`
  min-height: 100vh;
  background: #0a0a14;
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
const Inner = styled.div`
  position: relative;
  max-width: 680px;
  margin: 0 auto;
`;

/* ─── Header ─── */
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
  margin-bottom: 8px;
`;
const ChipDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6366f1;
  animation: ${pulse} 2s infinite;
`;
const PageTitle = styled.h1`
  font-family: "Syne", sans-serif;
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #a5b4fc, #f0abfc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
`;
const PageSub = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.38);
  margin-bottom: 32px;
`;

/* ─── Grid ─── */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

/* ─── Card ─── */
const Card = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 24px;
  padding: 28px 24px 22px;
  cursor: pointer;
  overflow: hidden;
  animation: ${fadeUp} 0.6s ${(p) => p.$delay || "0s"} both;
  transition:
    transform 0.2s,
    border-color 0.2s,
    background 0.2s,
    box-shadow 0.2s;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 24px;
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
    opacity: 0;
    transition: opacity 0.2s;
  }
  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(99, 102, 241, 0.35);
    box-shadow: 0 20px 60px rgba(99, 102, 241, 0.15);
  }
  &:hover::before {
    opacity: 1;
  }
`;

const ClickHint = styled.span`
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.2s;
  ${Card}:hover & {
    opacity: 1;
  }
`;

/* ─── Ring ─── */
const RingWrap = styled.div`
  position: relative;
  width: 90px;
  height: 90px;
  margin: 0 auto 18px;
`;
const RingSvg = styled.svg`
  transform: rotate(-90deg);
`;
const RingBg = styled.circle`
  fill: none;
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 10;
`;
const RingFg = styled.circle`
  fill: none;
  stroke: url(#ringGradReport);
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: 220;
  stroke-dashoffset: ${(p) => 220 - (220 * p.$pct) / 100};
  transition: stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1);
`;
const RingLabel = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const RingScore = styled.span`
  font-family: "Syne", sans-serif;
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #a5b4fc, #f0abfc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const RingSub = styled.span`
  font-size: 9px;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.06em;
  margin-top: 2px;
`;

/* ─── Badge ─── */
const BadgePill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 50px;
  margin-bottom: 16px;
  font-family: "Syne", sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  background: ${(p) =>
    p.$pass
      ? "linear-gradient(135deg,#064e3b,#065f46)"
      : "linear-gradient(135deg,#7f1d1d,#991b1b)"};
  border: 1px solid
    ${(p) => (p.$pass ? "rgba(52,211,153,.3)" : "rgba(248,113,113,.3)")};
  color: ${(p) => (p.$pass ? "#34d399" : "#f87171")};
`;

/* ─── Stats Row ─── */
const StatsRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 18px;
`;
const Stat = styled.div`
  text-align: center;
`;
const StatVal = styled.div`
  font-family: "Syne", sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: ${(p) => p.$color || "#fff"};
`;
const StatLabel = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-top: 2px;
`;

/* ─── Bar ─── */
const BarWrap = styled.div`
  margin-bottom: 16px;
`;
const BarHead = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.38);
  margin-bottom: 6px;
`;
const BarTrack = styled.div`
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50px;
  overflow: hidden;
`;
const BarFill = styled.div`
  height: 100%;
  width: ${(p) => p.$pct}%;
  border-radius: 50px;
  background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
  background-size: 200%;
  animation: ${shimmer} 2s linear infinite;
  transition: width 1s 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

/* ─── Meta ─── */
const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 14px;
`;
const MetaVal = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

/* ─── Empty ─── */
const Empty = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
`;

/* ═══════════════════════════════════════════════ */

const ExamReport = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllReport = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/getUserReport",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userLoginId: userId }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setRecords(data.data ?? data); // handle { data: [...] } or plain array
      } else {
        toast.error(data.error || "Failed to load reports.");
      }
    } catch {
      toast.error("Could not fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllReport();
  }, []);

  const fmtDate = (ts) =>
    new Date(ts).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <Layout>
      <GlobalStyle />
      <Page>
        <Glow />
        {/* SVG gradient definition (shared across all rings) */}
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <linearGradient
              id="ringGradReport"
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
        </svg>

        <Inner>
          <Chip>
            <ChipDot /> My Reports
          </Chip>
          <PageTitle>Exam History</PageTitle>
          <PageSub>Click any card to view the full result breakdown</PageSub>

          {loading ? (
            <Empty>Loading reports…</Empty>
          ) : records.length === 0 ? (
            <Empty>No exam records found.</Empty>
          ) : (
            <Grid>
              {records.map((r, i) => {
                const passed = r.userPassed === 1;
                const score = parseFloat(r.score).toFixed(1);
                const total = r.noOfQuestions ?? r.totalCorrect + r.totalWrong;
                const acc = total
                  ? Math.round((r.totalCorrect / total) * 100)
                  : 0;

                return (
                  <Card
                    key={r.performanceId}
                    $delay={`${i * 0.1}s`}
                    onClick={() => navigate(`/result/${r.examId}/${userId}`)}
                  >
                    {/* Ring */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <RingWrap>
                        <RingSvg width="90" height="90" viewBox="0 0 90 90">
                          <RingBg cx="45" cy="45" r="35" />
                          <RingFg cx="45" cy="45" r="35" $pct={score} />
                        </RingSvg>
                        <RingLabel>
                          <RingScore>{score}%</RingScore>
                          <RingSub>SCORE</RingSub>
                        </RingLabel>
                      </RingWrap>

                      <BadgePill $pass={passed}>
                        {passed ? "🏆 PASSED" : "📋 FAILED"}
                      </BadgePill>
                    </div>

                    {/* Stats */}
                    <StatsRow>
                      <Stat>
                        <StatVal>{total}</StatVal>
                        <StatLabel>Total</StatLabel>
                      </Stat>
                      <Stat>
                        <StatVal $color="#34d399">{r.totalCorrect}</StatVal>
                        <StatLabel>Correct</StatLabel>
                      </Stat>
                      <Stat>
                        <StatVal $color="#f87171">{r.totalWrong}</StatVal>
                        <StatLabel>Wrong</StatLabel>
                      </Stat>
                      <Stat>
                        <StatVal $color="#fbbf24">#{r.attemptNo + 1}</StatVal>
                        <StatLabel>Attempt</StatLabel>
                      </Stat>
                    </StatsRow>

                    {/* Accuracy bar */}
                    <BarWrap>
                      <BarHead>
                        <span>Accuracy</span>
                        <span>{acc}%</span>
                      </BarHead>
                      <BarTrack>
                        <BarFill $pct={acc} />
                      </BarTrack>
                    </BarWrap>

                    {/* Meta */}
                    <MetaRow>
                      <span>{r.examId}</span>
                      <MetaVal>{fmtDate(r.date)}</MetaVal>
                    </MetaRow>

                    <ClickHint>View Details →</ClickHint>
                  </Card>
                );
              })}
            </Grid>
          )}
        </Inner>
      </Page>
    </Layout>
  );
};

export default ExamReport;
