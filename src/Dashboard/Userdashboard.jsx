import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "../component/Layout";

/* ─── Palette ─── */
const PALETTE = [
  { bar: "#185fa5", id: { color: "#185fa5", bg: "#e6f1fb", border: "#b5d4f4" }, btn: "#185fa5" },
  { bar: "#639922", id: { color: "#3b6d11", bg: "#eaf3de", border: "#c0dd97" }, btn: "#3b6d11" },
  { bar: "#993556", id: { color: "#993556", bg: "#fbeaf0", border: "#f4c0d1" }, btn: "#72243e" },
  { bar: "#533ab7", id: { color: "#533ab7", bg: "#eeedfe", border: "#cecbf6" }, btn: "#3c3489" },
  { bar: "#854f0b", id: { color: "#854f0b", bg: "#faeeda", border: "#fac775" }, btn: "#633806" },
  { bar: "#0f6e56", id: { color: "#0f6e56", bg: "#e1f5ee", border: "#9fe1cb" }, btn: "#085041" },
];

/* ─── Style injection ─── */
const injectStyles = () => {
  if (document.getElementById("ud-v3-styles")) return;
  const s = document.createElement("style");
  s.id = "ud-v3-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');

    @keyframes ud-fadein { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes ud-shimmer { 0% { opacity: .6; } 50% { opacity: 1; } 100% { opacity: .6; } }
    @keyframes ud-pulsedot { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
    @keyframes modal-in { from { opacity: 0; transform: scale(0.93) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes overlay-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes shake { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-6px); } 40%,80% { transform: translateX(6px); } }
    @keyframes otp-success { 0% { transform: scale(1); } 50% { transform: scale(1.06); } 100% { transform: scale(1); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes beam { 0% { opacity:0; transform: scaleX(0); } 60% { opacity:1; } 100% { opacity:0; transform: scaleX(1); } }

    .ud-card-anim { animation: ud-fadein .35s cubic-bezier(.22,.68,0,1.2) both; }
    .ud-card-hover { transition: box-shadow .2s ease, border-color .2s ease, transform .2s ease; }
    .ud-card-hover:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.11); border-color: rgba(0,0,0,0.16) !important; transform: translateY(-2px); }

    .otp-input {
      width: 52px !important;
      height: 60px !important;
      border-radius: 12px !important;
      border: 1.5px solid rgba(0,0,0,0.12) !important;
      font-size: 24px !important;
      font-weight: 700 !important;
      text-align: center !important;
      outline: none !important;
      background: #f8f9fa !important;
      color: #0f1117 !important;
      transition: border-color .15s, box-shadow .15s, background .15s !important;
      caret-color: transparent !important;
      font-family: 'DM Sans', sans-serif !important;
    }
    .otp-input:focus {
      border-color: #185fa5 !important;
      background: #fff !important;
      box-shadow: 0 0 0 3px rgba(24,95,165,0.13) !important;
    }
    .otp-input.filled {
      background: #eef6ff !important;
      border-color: #185fa5 !important;
      color: #185fa5 !important;
    }
    .otp-input.error {
      border-color: #e03131 !important;
      background: #fff5f5 !important;
      animation: shake .35s ease !important;
    }
    .otp-input.success {
      border-color: #3b6d11 !important;
      background: #eaf3de !important;
      color: #3b6d11 !important;
      animation: otp-success .3s ease !important;
    }

    .verify-btn {
      background: #185fa5;
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 13px 28px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      transition: background .15s, transform .15s, box-shadow .15s;
      font-family: 'DM Sans', sans-serif;
      letter-spacing: 0.2px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .verify-btn:hover:not(:disabled) { background: #1451891; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(24,95,165,.3); }
    .verify-btn:active:not(:disabled) { transform: translateY(0); }
    .verify-btn:disabled { opacity: .6; cursor: not-allowed; }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #888780;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      padding: 6px;
      transition: background .15s, color .15s;
    }
    .close-btn:hover { background: #f3f4f6; color: #0f1117; }

    .start-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: none;
      border-radius: 9px;
      padding: 12px 20px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      width: 100%;
      margin-top: 16px;
      transition: opacity .15s, transform .15s, box-shadow .2s;
      font-family: 'DM Sans', sans-serif;
      letter-spacing: 0.2px;
    }
    .start-btn:hover { opacity: .9; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,.18); }
    .start-btn:active { transform: translateY(0); }

    * { box-sizing: border-box; }
  `;
  document.head.appendChild(s);
};

/* ─── Icons ─── */
const IconClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconTarget = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const IconRepeat = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);
const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconShield = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

/* ─── Skeleton ─── */
const Skel = ({ w, h }) => (
  <div style={{ width: w, height: h, borderRadius: 6, background: "rgba(0,0,0,0.07)", animation: "ud-shimmer 1.4s ease infinite" }} />
);
const SkeletonCard = ({ delay }) => (
  <div style={{ ...St.card, animationDelay: `${delay}s`, animation: "ud-fadein .35s ease both" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
      <Skel w={70} h={20} /><Skel w={80} h={20} />
    </div>
    <Skel w="65%" h={18} /><div style={{ height: 8 }} />
    <Skel w="90%" h={13} /><div style={{ height: 4 }} />
    <Skel w="70%" h={13} /><div style={{ height: 16 }} />
    <div style={{ display: "flex", gap: 8 }}>
      {[72, 72, 72].map((w, i) => <Skel key={i} w={w} h={56} />)}
    </div>
    <div style={{ height: 16 }} /><Skel w="100%" h={42} />
  </div>
);

/* ─── OTP Modal ─── */
const OtpModal = ({ exam, palBtn, onClose, onSuccess }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("idle"); // idle | verifying | error | success
  const [errMsg, setErrMsg] = useState("");
  const inputRefs = useRef([]);
  const userId = useSelector((state) => state.auth.user);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 120);
  }, []);

  // Prevent body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleKey = (e, idx) => {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        const next = [...otp]; next[idx] = ""; setOtp(next);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
        const next = [...otp]; next[idx - 1] = ""; setOtp(next);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    if (!val) return;
    const next = [...otp]; next[idx] = val; setOtp(next);
    if (idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(next);
    const focusIdx = Math.min(pasted.length, 5);
    setTimeout(() => inputRefs.current[focusIdx]?.focus(), 10);
    e.preventDefault();
  };

  const handleVerify = async () => {
    const otpStr = otp.join("");
    if (otpStr.length < 6) {
      setStatus("error"); setErrMsg("Please enter all 6 digits.");
      setTimeout(() => setStatus("idle"), 700);
      return;
    }
    setStatus("verifying");
    try {
      const res = await fetch("https://localhost:8443/sphinx/api/exam/check-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpIn: otpStr, partyId: userId, examId: exam.examId }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setTimeout(() => { onSuccess(); }, 700);
      } else {
        setStatus("error");
        setErrMsg(data.error || "Invalid OTP. Please try again.");
        toast.error(data.error || "Invalid OTP. Please try again.");
        setTimeout(() => { setStatus("idle"); setOtp(["","","","","",""]); inputRefs.current[0]?.focus(); }, 800);
      }
    } catch {
      setStatus("error");
      setErrMsg("Network error. Please try again.");
      toast.error("Network error. Please try again.");
      setTimeout(() => setStatus("idle"), 800);
    }
  };

  const otpComplete = otp.every(d => d !== "");
  const inputClass = (i) => {
    if (status === "error") return "otp-input error";
    if (status === "success") return "otp-input success";
    if (otp[i]) return "otp-input filled";
    return "otp-input";
  };

  return (
    <div style={St.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={St.modal}>

        {/* Close */}
        <button className="close-btn" style={{ position: "absolute", top: 14, right: 14 }} onClick={onClose}>
          <IconClose />
        </button>

        {/* Icon header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <div style={{ ...St.shieldWrap, background: palBtn + "18", border: `1.5px solid ${palBtn}30` }}>
            <div style={{ color: palBtn }}><IconShield /></div>
          </div>
          <h2 style={St.modalTitle}>Exam Verification</h2>
          <p style={St.modalSub}>
            Enter the 6-digit OTP to unlock
          </p>
          <div style={{ ...St.examTag, background: palBtn + "12", color: palBtn, border: `1px solid ${palBtn}30` }}>
            {exam.examName}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "0.5px", background: "rgba(0,0,0,0.08)", marginBottom: 24 }} />

        {/* OTP label */}
        <div style={{ fontSize: 11, fontWeight: 600, color: "#888780", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12, textAlign: "center" }}>
          One-Time Password
        </div>

        {/* OTP inputs */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }} onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              className={inputClass(i)}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKey(e, i)}
              disabled={status === "verifying" || status === "success"}
            />
          ))}
        </div>

        {/* Error message */}
        <div style={{ minHeight: 22, textAlign: "center", marginBottom: 20 }}>
          {status === "error" && errMsg && (
            <span style={{ fontSize: 12, color: "#e03131", fontWeight: 500 }}>⚠ {errMsg}</span>
          )}
          {status === "success" && (
            <span style={{ fontSize: 12, color: "#3b6d11", fontWeight: 500 }}>✓ Verified! Launching exam…</span>
          )}
        </div>

        {/* Verify button */}
        <button
          className="verify-btn"
          style={{ background: status === "success" ? "#3b6d11" : palBtn }}
          onClick={handleVerify}
          disabled={status === "verifying" || status === "success"}
        >
          {status === "verifying" ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Verifying…
            </>
          ) : status === "success" ? (
            <><span>✓</span> Verified!</>
          ) : (
            <><IconLock /> Verify & Start</>
          )}
        </button>

        {/* Footer note */}
        <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 16, marginBottom: 0, lineHeight: 1.6 }}>
          Contact your instructor if you haven't received your OTP.
        </p>
      </div>
    </div>
  );
};

/* ─── Main Component ─── */
const Userdashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalExam, setModalExam] = useState(null);
  const [modalPalBtn, setModalPalBtn] = useState("#185fa5");
  const userId = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    injectStyles();
    getExamData();
  }, []);

  const getExamData = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://localhost:8443/sphinx/api/user/getAssignUserExam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userLoginId: userId }),
      });
      const value = await response.json();
      if (response.ok) {
        setData(value.userExam || []);
      } else {
        toast.error(value.error);
      }
    } catch {
      toast.error("Failed to load exams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (exam, palBtn) => {
    setModalExam(exam);
    setModalPalBtn(palBtn);
  };

  const closeModal = () => {
    setModalExam(null);
  };

  const handleOtpSuccess = useCallback(() => {
    if (!modalExam) return;
    navigate(`/exam-attend/${modalExam.examId}/${modalExam.duration}`, {
      state: { duration: modalExam.duration, examName: modalExam.examName },
    });
  }, [modalExam, navigate]);

  return (
    <Layout>
      <div style={St.page}>

        {/* OTP Modal */}
        {modalExam && (
          <OtpModal
            exam={modalExam}
            palBtn={modalPalBtn}
            onClose={closeModal}
            onSuccess={handleOtpSuccess}
          />
        )}

        {/* ── Header ── */}
        <div style={St.header}>
          <div style={St.pill}>
            <span style={St.pillDot} />
            Assessment Portal
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={St.heroTitle}>
                Your <span style={St.heroAccent}>Assigned</span> Assessments
              </h1>
              <p style={St.heroSub}>
                {loading ? "Fetching your assignments…"
                  : data.length > 0 ? `${data.length} exam${data.length > 1 ? "s" : ""} ready for you`
                  : "No exams assigned yet"}
              </p>
            </div>
            {!loading && data.length > 0 && (
              <div style={St.statBadge}>
                <div style={{ fontSize: 30, fontWeight: 600, color: "#185fa5", lineHeight: 1 }}>{data.length}</div>
                <div style={{ fontSize: 11, color: "#888780", textTransform: "uppercase", letterSpacing: "0.8px", marginTop: 3 }}>Total Assessments</div>
              </div>
            )}
          </div>
          <div style={{ height: "0.5px", background: "rgba(0,0,0,0.1)", marginTop: 20 }} />
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div style={St.grid}>
            {[0, 0.08, 0.16, 0.24].map((d, i) => <SkeletonCard key={i} delay={d} />)}
          </div>
        ) : data.length === 0 ? (
          <div style={St.empty}>
            <div style={St.emptyIconWrap}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 500, margin: 0, color: "#1a1a1a" }}>Nothing here yet</p>
            <p style={{ fontSize: 13, color: "#888780", margin: 0, maxWidth: 280, textAlign: "center", lineHeight: 1.6 }}>
              Your assigned exams will appear here. Contact your instructor if you think this is a mistake.
            </p>
          </div>
        ) : (
          <div style={St.grid}>
            {data.map((exam, i) => {
              const pal = PALETTE[i % PALETTE.length];
              return (
                <div key={exam.examId} className="ud-card-anim ud-card-hover" style={{ ...St.card, animationDelay: `${i * 0.08}s` }}>
                  {/* Top accent bar */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: pal.bar, borderRadius: "12px 12px 0 0" }} />

                  {/* Header row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingTop: 4 }}>
                    <span style={{ ...St.examId, color: pal.id.color, background: pal.id.bg, borderColor: pal.id.border }}>
                      {exam.examId}
                    </span>
                    <span style={St.attempts}>
                      <IconRepeat />
                      {exam.noOfAttempts ?? 0} / {exam.allowedAttempts ?? "∞"} used
                    </span>
                  </div>

                  {/* Title & description */}
                  <h3 style={St.cardTitle}>{exam.examName}</h3>
                  <p style={St.cardDesc}>{exam.description || "No description provided for this exam."}</p>

                  {/* Divider */}
                  <div style={{ height: "0.5px", background: "rgba(0,0,0,0.07)", margin: "14px 0" }} />

                  {/* Meta tiles */}
                  <div style={St.metaGrid}>
                    {exam.duration && (
                      <div style={St.metaTile}>
                        <span style={{ color: "#185fa5", display: "flex", marginBottom: 3 }}><IconClock /></span>
                        <div style={St.metaVal}>{exam.duration}<span style={{ fontSize: 10, color: "#aaa", marginLeft: 2 }}>min</span></div>
                        <div style={St.metaKey}>Duration</div>
                      </div>
                    )}
                    {exam.totalMarks && (
                      <div style={St.metaTile}>
                        <span style={{ color: "#ba7517", display: "flex", marginBottom: 3 }}><IconTarget /></span>
                        <div style={St.metaVal}>{exam.totalMarks}</div>
                        <div style={St.metaKey}>Total Marks</div>
                      </div>
                    )}
                    {exam.passingMarks && (
                      <div style={St.metaTile}>
                        <span style={{ color: "#3b6d11", fontSize: 13, marginBottom: 3, display: "block" }}>✓</span>
                        <div style={St.metaVal}>{exam.passingMarks}</div>
                        <div style={St.metaKey}>Pass Marks</div>
                      </div>
                    )}
                    {exam.scheduledDate && (
                      <div style={St.metaTile}>
                        <span style={{ color: "#533ab7", display: "flex", marginBottom: 3 }}><IconCalendar /></span>
                        <div style={{ ...St.metaVal, fontSize: 12 }}>
                          {new Date(exam.scheduledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </div>
                        <div style={St.metaKey}>Scheduled</div>
                      </div>
                    )}
                  </div>

                  {/* CTA button — opens OTP modal instead of navigating directly */}
                  <button
                    className="start-btn"
                    style={{ background: pal.btn, color: "#fff" }}
                    onClick={() => openModal(exam, pal.btn)}
                  >
                    Start Assessment <IconArrow />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

/* ─── Styles ─── */
const St = {
  page: { fontFamily: "'DM Sans', sans-serif" },
  header: { marginBottom: "2rem" },
  pill: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "#eaf3de", border: "0.5px solid #c0dd97", borderRadius: 100,
    padding: "4px 12px", fontSize: 11, fontWeight: 500, color: "#3b6d11",
    marginBottom: 12, letterSpacing: "0.5px",
  },
  pillDot: { width: 6, height: 6, borderRadius: "50%", background: "#639922", animation: "ud-pulsedot 2s ease infinite" },
  heroTitle: { fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.5px", lineHeight: 1.2, color: "#0f1117", fontFamily: "'Syne', sans-serif" },
  heroAccent: { color: "#185fa5" },
  heroSub: { fontSize: 14, color: "#888780", margin: 0 },
  statBadge: { background: "#f3f4f6", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 10, padding: "12px 22px", textAlign: "center" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  card: { background: "#ffffff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 12, padding: 20, position: "relative", overflow: "hidden" },
  examId: { fontSize: 11, fontWeight: 500, border: "0.5px solid", borderRadius: 6, padding: "3px 8px", fontFamily: "monospace" },
  attempts: { display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500, color: "#888780", background: "#f3f4f6", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: 6, padding: "3px 8px" },
  cardTitle: { fontSize: 16, fontWeight: 600, color: "#0f1117", margin: "0 0 6px", lineHeight: 1.3, textTransform: "capitalize" },
  cardDesc: { fontSize: 13, color: "#888780", margin: 0, lineHeight: 1.6 },
  metaGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: 8, marginBottom: 4 },
  metaTile: { background: "#f8f9fa", borderRadius: 8, padding: "8px 10px", display: "flex", flexDirection: "column" },
  metaVal: { fontSize: 15, fontWeight: 600, color: "#0f1117", lineHeight: 1 },
  metaKey: { fontSize: 10, color: "#aaa", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.6px" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 12, textAlign: "center", background: "#ffffff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 12 },
  emptyIconWrap: { width: 52, height: 52, background: "#f3f4f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },

  /* Modal */
  overlay: {
    position: "fixed", inset: 0, background: "rgba(10,14,23,0.55)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    animation: "overlay-in .2s ease",
  },
  modal: {
    background: "#fff", borderRadius: 18, padding: "32px 28px 24px",
    width: "100%", maxWidth: 420, position: "relative",
    animation: "modal-in .3s cubic-bezier(.22,.68,0,1.2) both",
    boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
    border: "0.5px solid rgba(0,0,0,0.08)",
    margin: "0 16px",
  },
  shieldWrap: {
    width: 56, height: 56, borderRadius: 16,
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 14,
  },
  modalTitle: { fontSize: 20, fontWeight: 700, color: "#0f1117", margin: "0 0 6px", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.3px" },
  modalSub: { fontSize: 13, color: "#888780", margin: "0 0 12px", textAlign: "center" },
  examTag: { fontSize: 12, fontWeight: 500, borderRadius: 8, padding: "5px 14px", maxWidth: "100%", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
};

export default Userdashboard;
