import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { jsPDF } from "jspdf";
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
  stroke-dashoffset: ${(p) => 440 - (440 * p.$pct) / 100};
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
    p.$pass
      ? "linear-gradient(135deg,#064e3b,#065f46)"
      : "linear-gradient(135deg,#7f1d1d,#991b1b)"};
  border: 1px solid
    ${(p) => (p.$pass ? "rgba(52,211,153,.3)" : "rgba(248,113,113,.3)")};
  color: ${(p) => (p.$pass ? "#34d399" : "#f87171")};
`;

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
  animation: ${fadeUp} 0.5s ${(p) => p.$delay || "0s"} both;
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
  color: ${(p) => p.$color || "#fff"};
`;
const StatLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.38);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-top: 4px;
`;

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
  width: ${(p) => p.$pct}%;
  border-radius: 50px;
  background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
  background-size: 200%;
  animation: ${shimmer} 2s linear infinite;
  transition: width 1s 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

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
  animation: ${fadeUp} 0.5s ${(p) => p.$delay || "0s"} both;
`;
const MetaKey = styled.span`
  color: rgba(255, 255, 255, 0.4);
`;
const MetaVal = styled.span`
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 28px;
  animation: ${fadeUp} 0.5s 0.7s both;
`;
const Btn = styled.button`
  flex: 1;
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
  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;
const CertBtn = styled(Btn)`
  background: linear-gradient(135deg, #065f46, #047857);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  &:disabled {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
    transform: none;
    opacity: 1;
  }
`;

const SkeletonBox = styled.div`
  height: ${(p) => p.$h || "20px"};
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.6s infinite;
  margin-bottom: ${(p) => p.$mb || "0"};
`;

/* ═══════════════════════════════════════════════════════════
   CERTIFICATE HTML — fully self-contained, zero oklch
   All colors are plain hex so html2canvas renders perfectly.
═══════════════════════════════════════════════════════════ */
const buildCertificateHTML = ({
  userId,
  examId,
  examName,   
  score,
  correct,
  total,
  acc,
  attempt,
  date,
}) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1122px;
    height: 794px;
    background: #ffffff;
    font-family: Georgia, 'Times New Roman', serif;
    overflow: hidden;
    position: relative;
  }
  .top-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 10px;
    background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
  }
  .bottom-bar {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 10px;
    background: linear-gradient(90deg, #ec4899, #a855f7, #6366f1);
  }
  .outer-border {
    position: absolute;
    inset: 18px;
    border: 3px solid #6366f1;
    border-radius: 8px;
  }
  .inner-border {
    position: absolute;
    inset: 26px;
    border: 1px solid #a5b4fc;
    border-radius: 4px;
  }
  .watermark {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 200px;
    font-weight: 900;
    color: rgba(99,102,241,0.04);
    transform: rotate(-30deg);
    user-select: none;
    pointer-events: none;
  }
  .content {
    position: absolute;
    inset: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .org-name {
    font-size: 13px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #6366f1;
    font-family: Arial, sans-serif;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .trophy { font-size: 52px; margin-bottom: 12px; line-height: 1; }
  .cert-type {
    font-size: 13px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #64748b;
    font-family: Arial, sans-serif;
    margin-bottom: 8px;
  }
  .certify-text {
    font-size: 34px;
    font-weight: 700;
    color: #6366f1;
    margin-bottom: 20px;
    line-height: 1.2;
  }
  .user-id {
    font-size: 22px;
    color: #1e293b;
    font-family: Arial, sans-serif;
    font-weight: 500;
    margin-bottom: 4px;
  }
  .divider {
    width: 300px;
    height: 2px;
    margin: 14px auto;
    background: linear-gradient(90deg, transparent, #a855f7, transparent);
  }
  .body-text {
    font-size: 16px;
    color: #475569;
    font-family: Arial, sans-serif;
    line-height: 1.7;
    max-width: 680px;
    margin-bottom: 24px;
  }
  .body-text strong { color: #1e293b; }
  .body-text .exam-name { font-size: 18px; }
  .body-text .score-val { color: #6366f1; font-size: 20px; }
  .stats-pills {
    display: inline-flex;
    align-items: center;
    gap: 32px;
    background: linear-gradient(135deg, #f8f9ff, #f0f4ff);
    border: 1px solid #e0e7ff;
    border-radius: 16px;
    padding: 14px 40px;
    margin-bottom: 28px;
  }
  .stat-item { text-align: center; }
  .stat-val {
    font-size: 22px;
    font-weight: 800;
    font-family: Arial, sans-serif;
  }
  .stat-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #94a3b8;
    font-family: Arial, sans-serif;
    margin-top: 2px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
  }
  .footer-label {
    font-size: 10px;
    color: #94a3b8;
    font-family: Arial, sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .footer-val {
    font-size: 13px;
    color: #1e293b;
    font-family: Arial, sans-serif;
    font-weight: 600;
    margin-top: 2px;
  }
  .footer-logo {
    font-size: 11px;
    color: #6366f1;
    font-family: Arial, sans-serif;
    letter-spacing: 0.15em;
  }
</style>
</head>
<body>
  <div class="top-bar"></div>
  <div class="bottom-bar"></div>
  <div class="outer-border"></div>
  <div class="inner-border"></div>
  <div class="watermark">✦</div>
  <div class="content">
    <div class="org-name">Sphinx Learning Platform</div>
    <div class="trophy">🏆</div>
    <div class="cert-type">Certificate of Achievement</div>
    <div class="certify-text">This is to certify that</div>
    <div class="user-id">Name: <strong>${userId}</strong></div>
    <div class="divider"></div>
    <div class="body-text">
      has successfully completed the examination<br/>
      <strong class="exam-name">${examName}</strong><br/>
     
      on <strong>${date}</strong>
    </div>
    <div class="stats-pills">
      <div class="stat-item">
        <div class="stat-val" style="color:#6366f1">${score}%</div>
        <div class="stat-label">Score</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-val" style="color:#f59e0b">#${attempt}</div>
        <div class="stat-label">Attempt</div>
      </div>
    </div>
    <div class="footer">
      <div style="text-align:left">
        <div class="footer-label">Performance ID</div>
        <div class="footer-val">—</div>
      </div>
      <div style="display:flex;align-items:center">
        <div class="footer-logo">✦ SPHINX ✦</div>
      </div>
      <div style="text-align:right">
        <div class="footer-label">Issue Date</div>
        <div class="footer-val">${date}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const ResultPage = () => {
  const { examId, userId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  

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
 

  const fmtDate = (ts) =>
    ts
      ? new Date(ts).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

  /* ─── Download Certificate via isolated iframe ─── */
  const handleDownloadCertificate = async () => {
    if (!passed) return;
    setDownloading(true);

    try {
      // 1. Dynamically import html2canvas only when needed
      const html2canvas = (await import("html2canvas")).default;

      // 2. Build the isolated HTML string — no Tailwind, no oklch
    const certHTML = buildCertificateHTML({
  userId,
  examId: result?.examId || examId,
  examName: result?.examName || "Exam", // ✅ add this
  score,
  correct,
  total,
  acc,
  attempt,
  date: fmtDate(result?.date),
});

      // 3. Create an off-screen iframe with NO inherited styles
      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "position:fixed;left:-9999px;top:-9999px;width:1122px;height:794px;border:none;visibility:hidden;";
      document.body.appendChild(iframe);

      // 4. Write the certificate HTML into the iframe
      const iDoc = iframe.contentDocument || iframe.contentWindow.document;
      iDoc.open();
      iDoc.write(certHTML);
      iDoc.close();

      // 5. Wait for fonts/emoji to settle
      await new Promise((res) => setTimeout(res, 800));

      // 6. Capture the iframe body — completely isolated from Tailwind
      const canvas = await html2canvas(iDoc.body, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 1122,
        height: 794,
        windowWidth: 1122,
        windowHeight: 794,
      });

      // 7. Cleanup iframe
      document.body.removeChild(iframe);

      // 8. Export to PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1122, 794],
        hotfixes: ["px_scaling"],
      });
      pdf.addImage(imgData, "PNG", 0, 0, 1122, 794);
      pdf.save(`Certificate_${examId}.pdf`);
      toast.success("Certificate downloaded!");
    } catch (err) {
      console.error("Certificate error:", err);
      toast.error("Download failed: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Layout>
      <GlobalStyle />
      <Page>
        <Glow />

        {/* SVG gradient for ring */}
        <svg style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        <Card>
          <Chip>
            <Dot /> Exam Report
          </Chip>

          {loading ? (
            <>
              <SkeletonBox $h="180px" $mb="24px" style={{ borderRadius: 90 }} />
              <SkeletonBox $h="40px" $mb="16px" />
              <SkeletonBox $h="120px" $mb="16px" />
            </>
          ) : (
            <>
              {/* Score Ring */}
              <RingWrap>
                <RingSvg width="180" height="180" viewBox="0 0 180 180">
                  <RingBg cx="90" cy="90" r="70" />
                  <RingFg cx="90" cy="90" r="70" $pct={score} />
                </RingSvg>
                <RingLabel>
                  <ScoreNum>{score}%</ScoreNum>
                  <ScoreSub>SCORE</ScoreSub>
                </RingLabel>
              </RingWrap>

              {/* Pass / Fail */}
              <Badge>
                <BadgePill $pass={passed}>
                  {passed ? "🏆 PASSED" : "📋 FAILED"}
                </BadgePill>
              </Badge>

              {/* Stats */}
              <Grid>
                <StatBox $delay=".1s">
                  <StatIcon>📝</StatIcon>
                  <StatVal>{total}</StatVal>
                  <StatLabel>Total Questions</StatLabel>
                </StatBox>
                <StatBox $delay=".15s">
                  <StatIcon>✅</StatIcon>
                  <StatVal $color="#34d399">{correct}</StatVal>
                  <StatLabel>Correct</StatLabel>
                </StatBox>
                <StatBox $delay=".2s">
                  <StatIcon>❌</StatIcon>
                  <StatVal $color="#f87171">{wrong}</StatVal>
                  <StatLabel>Wrong</StatLabel>
                </StatBox>
                <StatBox $delay=".25s">
                  <StatIcon>🔁</StatIcon>
                  <StatVal $color="#fbbf24">{attempt}</StatVal>
                  <StatLabel>Attempt No.</StatLabel>
                </StatBox>
              </Grid>

              {/* Accuracy bar */}
              <BarWrap>
                <BarLabel>
                  <span>Accuracy</span>
                  <span>{acc}%</span>
                </BarLabel>
                <BarTrack>
                  <BarFill $pct={acc} />
                </BarTrack>
              </BarWrap>

              {/* Meta */}
              <Meta $delay=".3s">
                <MetaKey>Exam ID</MetaKey>
                <MetaVal>{result?.examId || examId}</MetaVal>
              </Meta>
              <Meta $delay=".35s">
                <MetaKey>Performance ID</MetaKey>
                <MetaVal>{result?.performanceId ?? "—"}</MetaVal>
              </Meta>
              <Meta $delay=".4s">
                <MetaKey>Date</MetaKey>
                <MetaVal>{fmtDate(result?.date)}</MetaVal>
              </Meta>

              {/* Buttons */}
              <BtnRow>
                <Btn onClick={() => navigate(-1)}>← Back</Btn>
                {passed && (
                  <CertBtn
                    onClick={handleDownloadCertificate}
                    disabled={downloading}
                  >
                    {downloading ? "⏳ Generating…" : "📄 Download Certificate"}
                  </CertBtn>
                )}
              </BtnRow>
            </>
          )}
        </Card>
      </Page>
    </Layout>
  );
};

export default ResultPage;
