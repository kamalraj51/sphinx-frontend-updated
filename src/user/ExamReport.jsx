
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import Layout from "../component/Layout";
import UserHeader from "./UserHeader";

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

    --amber-50:  #FAEEDA;
    --amber-100: #FAC775;
    --amber-600: #854F0B;

    --red-50:    #FCEBEB;
    --red-100:   #F7C1C1;
    --red-200:   #F09595;
    --red-600:   #A32D2D;

    --teal-50:   #E1F5EE;
    --teal-100:  #9FE1CB;
    --teal-600:  #0F6E56;

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
    --radius-xl: 22px;
  }

  body {
    font-family: var(--font);
    background: #F5F4EF;
    margin: 0;
    padding: 0;
  }
`;

/* ===================== KEYFRAMES ===================== */
const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.4}`;
const barSlide = keyframes`from{width:0}to{width:var(--bar-w)}`;

/* ===================== PAGE ===================== */
const Page = styled.div`
  min-height: 100vh;
  background: #f5f4ef;
  padding: 40px 20px 60px;
  font-family: var(--font);
`;

const Inner = styled.div`
  max-width: 780px;
  margin: 0 auto;
`;

/* ===================== HEADER ===================== */
const HeaderWrap = styled.div`
  margin-bottom: 36px;
`;

const Breadcrumb = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--blue-50);
  border: 1px solid var(--blue-100);
  border-radius: 99px;
  padding: 5px 14px;
  font-size: 11px;
  font-weight: 600;
  color: var(--blue-600);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 14px;
`;

const BreadDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--blue-400);
  animation: ${pulse} 2s ease infinite;
`;

const PageTitle = styled.h1`
  font-size: 30px;
  font-weight: 800;
  color: var(--gray-800);
  letter-spacing: -0.8px;
  margin: 0 0 6px;
  span {
    color: var(--blue-600);
  }
`;

const PageSub = styled.p`
  font-size: 13.5px;
  color: var(--gray-400);
  margin: 0;
  font-weight: 400;
`;

/* ===================== SUMMARY STRIP ===================== */
const SummaryStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 32px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SummaryTile = styled.div`
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 16px 14px;
  text-align: center;
`;

const SummaryVal = styled.div`
  font-size: 22px;
  font-weight: 800;
  font-family: var(--mono);
  color: ${(p) => p.color || "var(--gray-800)"};
  line-height: 1;
  margin-bottom: 5px;
`;

const SummaryLabel = styled.div`
  font-size: 10px;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 600;
`;

/* ===================== GRID ===================== */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
`;

/* ===================== CARD ===================== */
const Card = styled.div`
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: 24px;
  cursor: pointer;
  animation: ${fadeUp} 0.5s ${(p) => p.$delay || "0s"} both;
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    border-color 0.2s;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(p) =>
      p.$pass
        ? "linear-gradient(90deg, var(--green-600), var(--teal-600))"
        : "linear-gradient(90deg, var(--red-600), #c94040)"};
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(44, 44, 42, 0.12);
    border-color: var(--blue-200);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
`;

/* ── Score Ring ── */
const RingWrap = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
`;

const RingSvg = styled.svg`
  transform: rotate(-90deg);
`;

const RingBg = styled.circle`
  fill: none;
  stroke: var(--gray-100);
  stroke-width: 9;
`;

const RingFg = styled.circle`
  fill: none;
  stroke: ${(p) => (p.$pass ? "url(#ringGradPass)" : "url(#ringGradFail)")};
  stroke-width: 9;
  stroke-linecap: round;
  stroke-dasharray: 195;
  stroke-dashoffset: ${(p) => 195 - (195 * Math.min(p.$pct, 100)) / 100};
  transition: stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1);
`;

const RingCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RingScore = styled.span`
  font-family: var(--mono);
  font-size: 16px;
  font-weight: 500;
  color: var(--gray-800);
  line-height: 1;
`;

const RingSub = styled.span`
  font-size: 9px;
  color: var(--gray-400);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-top: 2px;
`;

/* ── Card Title Area ── */
const CardMeta = styled.div`
  flex: 1;
  padding-top: 2px;
`;

const ExamIdLabel = styled.div`
  font-size: 11px;
  color: var(--gray-400);
  font-weight: 500;
  margin-bottom: 4px;
  font-family: var(--mono);
`;

const ExamName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: var(--gray-800);
  letter-spacing: -0.2px;
  margin-bottom: 10px;
`;

const PassBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: ${(p) => (p.$pass ? "var(--green-50)" : "var(--red-50)")};
  border: 1.5px solid
    ${(p) => (p.$pass ? "var(--green-100)" : "var(--red-100)")};
  color: ${(p) => (p.$pass ? "var(--green-600)" : "var(--red-600)")};
`;

/* ── Stats Row ── */
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 18px;
`;

const StatTile = styled.div`
  background: ${(p) => p.bg || "var(--gray-50)"};
  border: 1px solid ${(p) => p.border || "var(--gray-100)"};
  border-radius: var(--radius-sm);
  padding: 10px 6px;
  text-align: center;
`;

const StatVal = styled.div`
  font-size: 16px;
  font-weight: 700;
  font-family: var(--mono);
  color: ${(p) => p.color || "var(--gray-800)"};
  line-height: 1;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 9.5px;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.7px;
  font-weight: 600;
`;

/* ── Accuracy Bar ── */
const BarSection = styled.div`
  margin-bottom: 16px;
`;

const BarHead = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: var(--gray-400);
  font-weight: 500;
  margin-bottom: 7px;
`;

const BarHeadVal = styled.span`
  color: var(--gray-800);
  font-weight: 700;
  font-family: var(--mono);
`;

const BarTrack = styled.div`
  height: 6px;
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
  transition: width 1s 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

/* ── Card Footer ── */
const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid var(--gray-100);
`;

const FooterDate = styled.div`
  font-size: 11.5px;
  color: var(--gray-400);
  font-weight: 500;
`;

const ViewBtn = styled.div`
  font-size: 11.5px;
  font-weight: 700;
  color: var(--blue-600);
  background: var(--blue-50);
  border: 1px solid var(--blue-100);
  border-radius: 99px;
  padding: 5px 14px;
  transition: all 0.15s;
  ${Card}:hover & {
    background: var(--blue-100);
    border-color: var(--blue-200);
  }
`;

const AttemptBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 10px;
  font-weight: 700;
  font-family: var(--mono);
  color: var(--amber-600);
  background: var(--amber-50);
  border: 1px solid var(--amber-100);
  border-radius: 99px;
  padding: 3px 10px;
`;

/* ── Empty / Loading ── */
const Empty = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: var(--gray-400);
  font-size: 14px;
`;

const EmptyIcon = styled.div`
  font-size: 36px;
  margin-bottom: 12px;
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
        setRecords(data.data ?? data);
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

  /* Summary aggregates */
  const totalExams = records.length;
  const totalPassed = records.filter((r) => r.userPassed === 1).length;
  const avgScore = totalExams
    ? (
        records.reduce((s, r) => s + parseFloat(r.score || 0), 0) / totalExams
      ).toFixed(1)
    : "—";
  const bestScore = totalExams
    ? Math.max(...records.map((r) => parseFloat(r.score || 0))).toFixed(1)
    : "—";

  return (
    <>
      <UserHeader />
      <GlobalStyle />

      {/* SVG gradient defs */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <linearGradient id="ringGradPass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B6D11" />
            <stop offset="100%" stopColor="#0F6E56" />
          </linearGradient>
          <linearGradient id="ringGradFail" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A32D2D" />
            <stop offset="100%" stopColor="#c94040" />
          </linearGradient>
        </defs>
      </svg>

      <Page>
        <Inner>
          {/* ── Header ── */}
          <HeaderWrap>
            <Breadcrumb>
              <BreadDot /> My Reports
            </Breadcrumb>
            <PageTitle>
              Exam <span>History</span>
            </PageTitle>
            <PageSub>Click any card to view the full result breakdown.</PageSub>
          </HeaderWrap>

          {/* ── Summary strip ── */}
          {!loading && records.length > 0 && (
            <SummaryStrip>
              <SummaryTile>
                <SummaryVal color="var(--blue-600)">{totalExams}</SummaryVal>
                <SummaryLabel>Exams Taken</SummaryLabel>
              </SummaryTile>
              <SummaryTile>
                <SummaryVal color="var(--green-600)">{totalPassed}</SummaryVal>
                <SummaryLabel>Passed</SummaryLabel>
              </SummaryTile>
              
            </SummaryStrip>
          )}

          {/* ── Cards ── */}
          {loading ? (
            <Empty>
              <EmptyIcon>⏳</EmptyIcon>
              Loading your reports…
            </Empty>
          ) : records.length === 0 ? (
            <Empty>
              <EmptyIcon>📋</EmptyIcon>
              No exam records found yet.
            </Empty>
          ) : (
            <Grid>
              {records.map((r, i) => {
                const passed = r.userPassed === 1;
                const score = parseFloat(r.score || 0).toFixed(1);
                const total = r.noOfQuestions ?? r.totalCorrect + r.totalWrong;
                const acc = total
                  ? Math.round((r.totalCorrect / total) * 100)
                  : 0;

                return (
                  <Card
                    key={r.performanceId ?? i}
                    $delay={`${i * 0.07}s`}
                    $pass={passed}
                    onClick={() => navigate(`/result/${r.examId}/${userId}`)}
                  >
                    <AttemptBadge>#{(r.attemptNo ?? 0) }</AttemptBadge>

                    {/* ── Ring + meta ── */}
                    <CardHeader>
                      <RingWrap>
                        <RingSvg width="80" height="80" viewBox="0 0 80 80">
                          <RingBg cx="40" cy="40" r="31" />
                          <RingFg
                            cx="40"
                            cy="40"
                            r="31"
                            $pct={parseFloat(score)}
                            $pass={passed}
                          />
                        </RingSvg>
                        <RingCenter>
                          <RingScore>{score}%</RingScore>
                          <RingSub>Score</RingSub>
                        </RingCenter>
                      </RingWrap>

                      <CardMeta>
                        <ExamIdLabel>Exam ID: {r.examId}</ExamIdLabel>
                        <ExamName>{r.examName || `Exam #${r.examId}`}</ExamName>
                        <PassBadge $pass={passed}>
                          {passed ? "✓ Passed" : "✕ Failed"}
                        </PassBadge>
                      </CardMeta>
                    </CardHeader>

                    {/* ── Stats ── */}
                    <StatsRow>
                      <StatTile bg="var(--gray-50)" border="var(--gray-100)">
                        <StatVal color="var(--gray-800)">{total}</StatVal>
                        <StatLabel>Total</StatLabel>
                      </StatTile>
                      <StatTile bg="var(--green-50)" border="var(--green-100)">
                        <StatVal color="var(--green-600)">
                          {r.totalCorrect}
                        </StatVal>
                        <StatLabel>Correct</StatLabel>
                      </StatTile>
                      <StatTile bg="var(--red-50)" border="var(--red-100)">
                        <StatVal color="var(--red-600)">{r.totalWrong}</StatVal>
                        <StatLabel>Wrong</StatLabel>
                      </StatTile>
                      <StatTile bg="var(--amber-50)" border="var(--amber-100)">
                        <StatVal color="var(--amber-600)">
                          {total - r.totalCorrect - r.totalWrong}
                        </StatVal>
                        <StatLabel>Skipped</StatLabel>
                      </StatTile>
                    </StatsRow>

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

                    {/* ── Footer ── */}
                    <CardFooter>
                      <FooterDate>📅 {fmtDate(r.date)}</FooterDate>
                      <ViewBtn>View Details →</ViewBtn>
                    </CardFooter>
                  </Card>
                );
              })}
            </Grid>
          )}
        </Inner>
      </Page>
    </>
  );
};

export default ExamReport;
