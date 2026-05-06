import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { jsPDF } from "jspdf";
import Layout from "../component/Layout";

/* ===================== GLOBAL ===================== */
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    --green-50:  #EAF3DE; --green-100: #C0DD97;
    --green-600: #3B6D11; --green-800: #27500A;
    --teal-50:   #E1F5EE; --teal-100:  #9FE1CB; --teal-600:  #0F6E56;
    --red-50:    #FCEBEB; --red-100:   #F7C1C1; --red-600:   #A32D2D;
    --amber-50:  #FAEEDA; --amber-100: #FAC775; --amber-600: #854F0B;
    --blue-50:   #E6F1FB; --blue-100:  #B5D4F4;
    --blue-400:  #378ADD; --blue-600:  #185FA5;
    --gray-50:   #F7F6F2; --gray-100:  #EEEDE8;
    --gray-200:  #D3D1C7; --gray-400:  #888780;
    --gray-600:  #5F5E5A; --gray-800:  #2C2C2A;
    --font: 'Sora', sans-serif;
    --mono: 'DM Mono', monospace;
  }
  body { font-family: var(--font); background: #F5F4EF; margin: 0; padding: 0; }
`;

/* ===================== ANIMATIONS ===================== */
const fadeUp   = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;
const pulse    = keyframes`0%,100%{opacity:1}50%{opacity:0.4}`;
const strokeIn = keyframes`from{stroke-dashoffset:440}to{stroke-dashoffset:0}`;
const shimmer  = keyframes`0%{background-position:-600px 0}100%{background-position:600px 0}`;
const spin     = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;

/* ===================== PAGE ===================== */
const Page = styled.div`
  min-height: 100vh;
  background: #F5F4EF;
  padding: 36px 16px 64px;
  font-family: var(--font);
`;
const Inner = styled.div`
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
`;

/* ===================== BREADCRUMB / HEADER ===================== */
const HeaderWrap = styled.div`margin-bottom: 24px;`;

const Breadcrumb = styled.button`
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--blue-50); border: 1px solid var(--blue-100);
  border-radius: 99px; padding: 5px 14px;
  font-family: var(--font); font-size: 11px; font-weight: 700;
  color: var(--blue-600); letter-spacing: 0.05em; text-transform: uppercase;
  cursor: pointer; margin-bottom: 16px;
  transition: background 0.15s, border-color 0.15s;
  &:hover { background: var(--blue-100); border-color: var(--blue-400); }
`;
const BreadDot = styled.span`
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--blue-400);
  animation: ${pulse} 2s ease infinite;
  flex-shrink: 0;
`;
const PageTitle = styled.h1`
  font-size: 24px; font-weight: 800;
  color: var(--gray-800); letter-spacing: -0.5px;
  margin: 0 0 4px;
  span { color: var(--blue-600); }
`;
const PageSub = styled.p`
  font-size: 13px; color: var(--gray-400);
  margin: 0; font-weight: 400; line-height: 1.5;
`;

/* ===================== MAIN CARD ===================== */
const Card = styled.div`
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: 20px;
  overflow: hidden;
  animation: ${fadeUp} 0.45s ease both;
  box-shadow: 0 2px 12px rgba(44,44,42,0.06);
`;
const CardTopStripe = styled.div`
  height: 5px;
  background: ${(p) =>
    p.$pass
      ? "linear-gradient(90deg, var(--green-600), var(--teal-600))"
      : "linear-gradient(90deg, var(--red-600), #c94040)"};
`;
const CardBody = styled.div`padding: 32px 28px 28px;`;

/* ===================== SCORE RING ===================== */
const RingSection = styled.div`
  display: flex; flex-direction: column; align-items: center;
  margin-bottom: 24px;
`;
const RingWrap = styled.div`
  position: relative; width: 156px; height: 156px;
  margin-bottom: 16px;
`;
const RingSvg = styled.svg`transform: rotate(-90deg);`;
const RingBg = styled.circle`
  fill: none; stroke: var(--gray-100); stroke-width: 12;
`;
const RingFg = styled.circle`
  fill: none;
  stroke: ${(p) => (p.$pass ? "url(#rPass)" : "url(#rFail)")};
  stroke-width: 12; stroke-linecap: round;
  stroke-dasharray: 440;
  stroke-dashoffset: ${(p) => 440 - (440 * Math.min(parseFloat(p.$pct), 100)) / 100};
  animation: ${strokeIn} 1.3s 0.2s cubic-bezier(0.4,0,0.2,1) both;
`;
const RingCenter = styled.div`
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 3px;
`;
const ScoreNum = styled.span`
  font-family: var(--mono); font-size: 36px; font-weight: 500;
  color: var(--gray-800); line-height: 1;
`;
const ScoreSub = styled.span`
  font-size: 10px; color: var(--gray-400);
  text-transform: uppercase; letter-spacing: 0.1em;
`;
const PassBadge = styled.div`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 20px; border-radius: 99px;
  font-size: 12.5px; font-weight: 700; letter-spacing: 0.03em;
  background: ${(p) => (p.$pass ? "var(--green-50)" : "var(--red-50)")};
  border: 1.5px solid ${(p) => (p.$pass ? "var(--green-100)" : "var(--red-100)")};
  color: ${(p) => (p.$pass ? "var(--green-600)" : "var(--red-600)")};
`;

/* ===================== DIVIDER ===================== */
const Divider = styled.div`
  height: 1px; background: var(--gray-100);
  margin: 4px 0 20px;
`;

/* ===================== STATS GRID ===================== */
const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 8px; margin-bottom: 20px;
`;
const StatTile = styled.div`
  background: ${(p) => p.$bg || "var(--gray-50)"};
  border: 1px solid ${(p) => p.$border || "var(--gray-100)"};
  border-radius: 12px; padding: 12px 6px 10px;
  text-align: center;
`;
const StatVal = styled.div`
  font-family: var(--mono); font-size: 20px; font-weight: 500;
  color: ${(p) => p.$color || "var(--gray-800)"};
  line-height: 1; margin-bottom: 5px;
`;
const StatLabel = styled.div`
  font-size: 10px; color: var(--gray-400);
  text-transform: uppercase; letter-spacing: 0.6px; font-weight: 600;
`;

/* ===================== ACCURACY BAR ===================== */
const BarSection = styled.div`margin-bottom: 20px;`;
const BarHead = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 8px;
`;
const BarLabel = styled.span`
  font-size: 12px; color: var(--gray-400); font-weight: 500;
`;
const BarVal = styled.span`
  font-family: var(--mono); font-size: 13px; font-weight: 500;
  color: var(--gray-800);
`;
const BarTrack = styled.div`
  height: 7px; background: var(--gray-100);
  border-radius: 99px; overflow: hidden;
`;
const BarFill = styled.div`
  height: 100%; border-radius: 99px;
  width: ${(p) => p.$pct}%;
  background: ${(p) =>
    p.$pct >= 70
      ? "linear-gradient(90deg, var(--green-600), var(--teal-600))"
      : p.$pct >= 40
        ? "linear-gradient(90deg, var(--amber-600), #c48012)"
        : "linear-gradient(90deg, var(--red-600), #c94040)"};
  transition: width 1.1s 0.4s cubic-bezier(0.4,0,0.2,1);
`;

/* ===================== META TABLE ===================== */
const MetaTable = styled.div`
  display: flex; flex-direction: column;
  border: 1px solid var(--gray-100); border-radius: 14px;
  overflow: hidden; margin-bottom: 24px;
`;
const MetaRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 11px 16px;
  background: ${(p) => (p.$alt ? "var(--gray-50)" : "#fff")};
  border-bottom: 1px solid var(--gray-100);
  &:last-child { border-bottom: none; }
`;
const MetaKey = styled.span`
  font-size: 12.5px; color: var(--gray-400); font-weight: 500;
`;
const MetaVal = styled.span`
  font-family: var(--mono); font-size: 12.5px;
  color: var(--gray-800); font-weight: 500;
`;

/* ===================== ATTEMPT BADGE ===================== */
const AttemptRow = styled.div`
  display: flex; justify-content: center;
  margin-bottom: 20px;
`;
const AttemptPill = styled.div`
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--amber-50); border: 1px solid var(--amber-100);
  border-radius: 99px; padding: 5px 16px;
  font-size: 12px; font-weight: 700; font-family: var(--mono);
  color: var(--amber-600);
`;

/* ===================== BUTTONS ===================== */
const BtnRow = styled.div`display: flex; gap: 10px;`;
const BackBtn = styled.button`
  flex: 1; padding: 13px 16px;
  background: var(--gray-50); border: 1.5px solid var(--gray-200);
  border-radius: 12px; font-family: var(--font);
  font-size: 13.5px; font-weight: 700;
  color: var(--gray-600); cursor: pointer;
  transition: all 0.18s;
  &:hover { background: var(--gray-100); transform: translateY(-1px); }
  &:active { transform: scale(0.97); }
`;
const CertBtn = styled.button`
  flex: 1.4; padding: 13px 16px;
  background: ${(p) => p.disabled ? "var(--gray-100)" : "linear-gradient(135deg, var(--green-600), var(--teal-600))"};
  border: 1.5px solid ${(p) => p.disabled ? "var(--gray-200)" : "transparent"};
  border-radius: 12px; font-family: var(--font);
  font-size: 13.5px; font-weight: 700;
  color: ${(p) => p.disabled ? "var(--gray-400)" : "#fff"};
  cursor: ${(p) => p.disabled ? "not-allowed" : "pointer"};
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.18s;
  box-shadow: ${(p) => p.disabled ? "none" : "0 3px 12px rgba(59,109,17,0.22)"};
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,109,17,0.3);
  }
  &:active:not(:disabled) { transform: scale(0.97); }
`;
const SpinIcon = styled.span`
  display: inline-block;
  animation: ${spin} 0.8s linear infinite;
  font-style: normal;
`;

/* ===================== SKELETON ===================== */
const Skel = styled.div`
  height: ${(p) => p.$h || "16px"};
  border-radius: ${(p) => p.$r || "8px"};
  margin-bottom: ${(p) => p.$mb || "0"};
  background: linear-gradient(
    90deg, var(--gray-100) 25%, var(--gray-50) 50%, var(--gray-100) 75%
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.5s infinite;
`;
const SkelRow = styled.div`
  display: grid; grid-template-columns: ${(p) => p.$cols || "1fr"};
  gap: ${(p) => p.$gap || "8px"}; margin-bottom: ${(p) => p.$mb || "0"};
`;

/* ===================== CERTIFICATE ===================== */
const buildCertificateHTML = ({ name, examId, examName, score, correct, total, acc, attempt, date }) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1122px;height:794px;background:#fff;font-family:Georgia,'Times New Roman',serif;overflow:hidden;position:relative}
  .top{position:absolute;top:0;left:0;right:0;height:10px;background:linear-gradient(90deg,#3B6D11,#0F6E56)}
  .bot{position:absolute;bottom:0;left:0;right:0;height:10px;background:linear-gradient(90deg,#0F6E56,#3B6D11)}
  .ob{position:absolute;inset:18px;border:3px solid #3B6D11;border-radius:8px}
  .ib{position:absolute;inset:26px;border:1px solid #C0DD97;border-radius:4px}
  .wm{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:200px;font-weight:900;color:rgba(59,109,17,0.04);transform:rotate(-30deg);user-select:none}
  .cnt{position:absolute;inset:50px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
  .org{font-size:13px;letter-spacing:.3em;text-transform:uppercase;color:#3B6D11;font-family:Arial,sans-serif;font-weight:600;margin-bottom:10px}
  .trophy{font-size:52px;margin-bottom:12px;line-height:1}
  .ct{font-size:13px;letter-spacing:.25em;text-transform:uppercase;color:#64748b;font-family:Arial,sans-serif;margin-bottom:8px}
  .main{font-size:34px;font-weight:700;color:#3B6D11;margin-bottom:18px}
  .uid{font-size:22px;color:#1e293b;font-family:Arial,sans-serif;font-weight:500;margin-bottom:4px}
  .div{width:300px;height:2px;margin:14px auto;background:linear-gradient(90deg,transparent,#0F6E56,transparent)}
  .body{font-size:16px;color:#475569;font-family:Arial,sans-serif;line-height:1.7;max-width:680px;margin-bottom:22px}
  .pills{display:inline-flex;align-items:center;gap:32px;background:linear-gradient(135deg,#f0fdf4,#EAF3DE);border:1px solid #C0DD97;border-radius:16px;padding:14px 40px;margin-bottom:26px}
  .pi{text-align:center}
  .pv{font-size:22px;font-weight:800;font-family:Arial,sans-serif}
  .pl{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;font-family:Arial,sans-serif;margin-top:2px}
  .footer{display:flex;justify-content:space-between;width:100%;padding-top:14px;border-top:1px solid #e2e8f0}
  .fl{font-size:10px;color:#94a3b8;font-family:Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}
  .fv{font-size:13px;color:#1e293b;font-family:Arial,sans-serif;font-weight:600;margin-top:2px}
  .logo{font-size:11px;color:#3B6D11;font-family:Arial,sans-serif;letter-spacing:.15em}
</style></head><body>
  <div class="top"></div><div class="bot"></div>
  <div class="ob"></div><div class="ib"></div>
  <div class="wm">✦</div>
  <div class="cnt">
    <div class="org">Sphinx Learning Platform</div>
    <div class="trophy">🏆</div>
    <div class="ct">Certificate of Achievement</div>
    <div class="main">This is to certify that</div>
    <div class="uid">Name: <strong>${name}</strong></div>
    <div class="div"></div>
    <div class="body">has successfully completed the examination<br/><strong>${examName}</strong><br/>on <strong>${date}</strong></div>
    <div class="pills">
      <div class="pi"><div class="pv" style="color:#3B6D11">${score}%</div><div class="pl">Score</div></div>
      </div>
    <div class="footer">

      <div style="display:flex;align-items:center"><div class="logo">✦ SPHINX ✦</div></div>
      <div style="text-align:right"><div class="fl">Issue Date</div><div class="fv">${date}</div></div>
    </div>
  </div>
</body></html>`;

/* ===================== COMPONENT ===================== */
const ResultPage = () => {
  const { examId, userId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://localhost:8443/sphinx/api/user/exam-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId, userLoginId: userId }),
        });
        const data = await res.json();
        if (res.ok) setResult({
  ...data.result,
  name: data.name
});
        else toast.error("Result not updated yet — please wait.");
      } catch { toast.error("Could not fetch result."); }
      finally { setLoading(false); }
    })();
  }, []);

  const passed  = result?.userPassed === 1;
  const score   = parseFloat(result?.score || 0).toFixed(1);
  const correct = result?.totalCorrect ?? 0;
  const wrong   = result?.totalWrong ?? 0;
  const total   = result?.noOfQuestions ?? (correct + wrong);
  const skipped = Math.max(0, total - correct - wrong);
  const attempt = result?.attemptNo ?? 0;
  const acc     = total ? Math.round((correct / total) * 100) : 0;

  const fmtDate = (ts) => ts
    ? new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const handleDownload = async () => {
    if (!passed) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const certHTML = buildCertificateHTML({
      name:result?.name , examId: result?.examId || examId,
        examName: result?.examName || "Exam",
        score, correct, total, acc, attempt, date: fmtDate(result?.date),
      });
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:1122px;height:794px;border:none;visibility:hidden;";
      document.body.appendChild(iframe);
      const iDoc = iframe.contentDocument || iframe.contentWindow.document;
      iDoc.open(); iDoc.write(certHTML); iDoc.close();
      await new Promise((r) => setTimeout(r, 800));
      const canvas = await html2canvas(iDoc.body, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: "#ffffff", logging: false,
        width: 1122, height: 794, windowWidth: 1122, windowHeight: 794,
      });
      document.body.removeChild(iframe);
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1122, 794], hotfixes: ["px_scaling"] });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 1122, 794);
      pdf.save(`Certificate_${examId}.pdf`);
      toast.success("Certificate downloaded!");
    } catch (err) {
      toast.error("Download failed: " + err.message);
    } finally { setDownloading(false); }
  };

  return (
    <>
      <GlobalStyle />

      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <linearGradient id="rPass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B6D11" />
            <stop offset="100%" stopColor="#0F6E56" />
          </linearGradient>
          <linearGradient id="rFail" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A32D2D" />
            <stop offset="100%" stopColor="#c94040" />
          </linearGradient>
        </defs>
      </svg>

      <Page>
        <Inner>

          {/* ── Header ── */}
          <HeaderWrap>
            <Breadcrumb onClick={() => navigate(-1)}>
              <BreadDot /> Back to Reports
            </Breadcrumb>
            <PageTitle>Exam <span>Result</span></PageTitle>
            <PageSub>Your performance breakdown for this attempt.</PageSub>
          </HeaderWrap>

          <Card>
            <CardTopStripe $pass={!loading && passed} />
            <CardBody>

              {loading ? (
                /* ── Skeleton ── */
                <>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                    <Skel $h="156px" $r="50%" style={{ width: 156 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                    <Skel $h="32px" $r="99px" style={{ width: 120 }} />
                  </div>
                  <Divider />
                  <SkelRow $cols="repeat(4,1fr)" $gap="8px" $mb="20px">
                    <Skel $h="68px" $r="12px" />
                    <Skel $h="68px" $r="12px" />
                    <Skel $h="68px" $r="12px" />
                    <Skel $h="68px" $r="12px" />
                  </SkelRow>
                  <Skel $h="7px" $r="99px" $mb="24px" />
                  <Skel $h="200px" $r="14px" $mb="24px" />
                  <SkelRow $cols="1fr 1.4fr" $gap="10px">
                    <Skel $h="48px" $r="12px" />
                    <Skel $h="48px" $r="12px" />
                  </SkelRow>
                </>
              ) : (
                <>
                  {/* ── Score Ring ── */}
                  <RingSection>
                    <RingWrap>
                      <RingSvg width="156" height="156" viewBox="0 0 156 156">
                        <RingBg cx="78" cy="78" r="66" />
                        <RingFg cx="78" cy="78" r="66" $pct={score} $pass={passed} />
                      </RingSvg>
                      <RingCenter>
                        <ScoreNum>{score}%</ScoreNum>
                        <ScoreSub>Score</ScoreSub>
                      </RingCenter>
                    </RingWrap>
                    <PassBadge $pass={passed}>
                      {passed ? "✓  Passed" : "✕  Failed"}
                    </PassBadge>
                  </RingSection>

                  <Divider />

                  {/* ── Stats ── */}
                  <StatsGrid>
                    <StatTile $bg="var(--gray-50)" $border="var(--gray-100)">
                      <StatVal $color="var(--gray-800)">{total}</StatVal>
                      <StatLabel>Total</StatLabel>
                    </StatTile>
                    <StatTile $bg="var(--green-50)" $border="var(--green-100)">
                      <StatVal $color="var(--green-600)">{correct}</StatVal>
                      <StatLabel>Correct</StatLabel>
                    </StatTile>
                    <StatTile $bg="var(--red-50)" $border="var(--red-100)">
                      <StatVal $color="var(--red-600)">{wrong}</StatVal>
                      <StatLabel>Wrong</StatLabel>
                    </StatTile>
                    <StatTile $bg="var(--amber-50)" $border="var(--amber-100)">
                      <StatVal $color="var(--amber-600)">{skipped}</StatVal>
                      <StatLabel>Skipped</StatLabel>
                    </StatTile>
                  </StatsGrid>

                  {/* ── Accuracy Bar ── */}
                  <BarSection>
                    <BarHead>
                      <BarLabel>Accuracy</BarLabel>
                      <BarVal>{acc}%</BarVal>
                    </BarHead>
                    <BarTrack><BarFill $pct={acc} /></BarTrack>
                  </BarSection>

                  {/* ── Attempt pill ── */}
                  <AttemptRow>
                    <AttemptPill>Attempt #{attempt}</AttemptPill>
                  </AttemptRow>

                  {/* ── Meta Table ── */}
                  <MetaTable>
                    <MetaRow>
                      <MetaKey>Name</MetaKey>
                      <MetaVal>{result?.name || "Na"}</MetaVal>
                    </MetaRow>
                    <MetaRow $alt>
                      <MetaKey>Exam Name</MetaKey>
                      <MetaVal>{result?.examName || "—"}</MetaVal>
                    </MetaRow>
                   
                    <MetaRow $alt>
                      <MetaKey>Date</MetaKey>
                      <MetaVal>{fmtDate(result?.date)}</MetaVal>
                    </MetaRow>
                  </MetaTable>

                  {/* ── Buttons ── */}
                  <BtnRow>
                    <BackBtn onClick={() => navigate(-1)}>← Back</BackBtn>
                    <CertBtn onClick={handleDownload} disabled={!passed || downloading}>
                      {downloading
                        ? <><SpinIcon>⏳</SpinIcon> Generating…</>
                        : passed
                          ? <>📄 Certificate</>
                          : <>🔒 Locked</>
                      }
                    </CertBtn>
                  </BtnRow>
                </>
              )}

            </CardBody>
          </Card>

        </Inner>
      </Page>
    </>
  );
};

export default ResultPage;