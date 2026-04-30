// // // // import React, { useEffect, useState, useRef } from "react";
// // // // import styled from "styled-components";
// // // // import { useSelector } from "react-redux";
// // // // import { useNavigate, useParams } from "react-router-dom";
// // // // import { toast } from "sonner";
// // // // import UserHeader from "../user/UserHeader";

// // // // /* ===================== STYLES (UNCHANGED) ===================== */

// // // // const Layout = styled.div`
// // // //   display: flex;
// // // //   gap: 24px;
// // // //   padding: 24px;
// // // //   background: #f8fafc;
// // // //   min-height: 100vh;
// // // // `;

// // // // const Left = styled.div`
// // // //   flex: 3;
// // // // `;

// // // // const Right = styled.div`
// // // //   flex: 1;
// // // //   background: #ffffff;
// // // //   padding: 20px;
// // // //   border-radius: 14px;
// // // //   box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
// // // // `;

// // // // const Box = styled.div`
// // // //   background: #ffffff;
// // // //   padding: 28px;
// // // //   border-radius: 14px;
// // // //   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
// // // // `;

// // // // const Title = styled.h3`
// // // //   margin-bottom: 10px;
// // // // `;

// // // // const SubInfo = styled.div`
// // // //   display: flex;
// // // //   justify-content: space-between;
// // // //   margin-bottom: 15px;
// // // //   font-size: 14px;
// // // //   color: #555;
// // // // `;

// // // // const Option = styled.label`
// // // //   display: flex;
// // // //   align-items: center;
// // // //   gap: 10px;
// // // //   padding: 12px;
// // // //   margin: 10px 0;
// // // //   border: 1px solid #e2e8f0;
// // // //   border-radius: 8px;
// // // //   cursor: pointer;

// // // //   &:hover {
// // // //     background: #f1f5f9;
// // // //   }

// // // //   input {
// // // //     accent-color: #2563eb;
// // // //   }
// // // // `;

// // // // const Button = styled.button`
// // // //   margin: 10px 8px 0 0;
// // // //   padding: 10px 18px;
// // // //   border: none;
// // // //   border-radius: 8px;
// // // //   font-weight: 500;
// // // //   cursor: pointer;
// // // //   background: ${(p) => p.bg || "#2563eb"};
// // // //   color: white;

// // // //   &:hover {
// // // //     opacity: 0.9;
// // // //     transform: translateY(-1px);
// // // //   }

// // // //   &:disabled {
// // // //     background: #cbd5e1;
// // // //     cursor: not-allowed;
// // // //   }
// // // // `;

// // // // const Palette = styled.div`
// // // //   display: grid;
// // // //   grid-template-columns: repeat(5, 1fr);
// // // //   gap: 10px;
// // // // `;

// // // // const QBtn = styled.button`
// // // //   padding: 12px;
// // // //   border-radius: 8px;
// // // //   font-weight: 600;
// // // //   cursor: pointer;

// // // //   border: ${(p) => (p.active ? "2px solid #111827" : "1px solid #e5e7eb")};

// // // //   background: ${(p) => {
// // // //     switch (p.status) {
// // // //       case "attempted":
// // // //         return "#22c55e";
// // // //       case "not_answered":
// // // //         return "#ef4444";
// // // //       case "marked_review":
// // // //         return "#facc15";
// // // //       default:
// // // //         return "#ffffff";
// // // //     }
// // // //   }};

// // // //   color: ${(p) => (p.status ? "#fff" : "#111")};
// // // // `;

// // // // /* ===================== COMPONENT ===================== */

// // // // const ExamAttend = () => {
// // // //   const navigate = useNavigate();
// // // //   const { examId, duration } = useParams();
// // // //   const userId = useSelector((state) => state.auth.user);
// // // //   const [skipped, setSkipped] = useState(0);
// // // //   const [question, setQuestion] = useState({});
// // // //   const [offSet, setOffSet] = useState(0);
// // // //   const [totalQuestions, setTotalQuestions] = useState(0);
// // // //   const [answersMap, setAnswersMap] = useState({});

// // // //   // ✅ minutes → seconds
// // // //   const [time, setTime] = useState(duration * 60);

// // // //   const timerRef = useRef(null);

// // // //   const currentAnswer = answersMap[offSet]?.answer || [];

// // // //   /* ===================== TIMER ===================== */

// // // //   useEffect(() => {
// // // //     if (timerRef.current) return;

// // // //     timerRef.current = setInterval(() => {
// // // //       setTime((t) => {
// // // //         if (t <= 1) {
// // // //           clearInterval(timerRef.current);
// // // //           autoSubmitExam("Time up! Exam submitted.");
// // // //           return 0;
// // // //         }
// // // //         return t - 1;
// // // //       });
// // // //     }, 1000);

// // // //     return () => clearInterval(timerRef.current);
// // // //   }, []);

// // // //   /* ===================== FETCH ===================== */

// // // //   const getQuestion = async (offsetValue) => {
// // // //     try {
// // // //       const res = await fetch(
// // // //         `https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${offsetValue}`,
// // // //       );
// // // //       const data = await res.json();

// // // //       if (res.ok) {
// // // //         setQuestion(data.questions?.[0] || {});
// // // //         setTotalQuestions(data.totalQuestions || 0);
// // // //       }
// // // //     } catch (err) {
// // // //       console.log(err);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     getQuestion(offSet);
// // // //   }, [offSet]);

// // // //   /* ===================== HANDLERS ===================== */

// // // //   const handleAnswer = (val) => {
// // // //     const type = question.questionTypeId;
// // // //     let updated = [];

// // // //     if (type === "SINGLE_CHOICE" || type === "TRUE_FALSE") {
// // // //       updated = [val];
// // // //     } else {
// // // //       updated = currentAnswer.includes(val)
// // // //         ? currentAnswer.filter((x) => x !== val)
// // // //         : [...currentAnswer, val];
// // // //     }

// // // //     setAnswersMap((prev) => ({
// // // //       ...prev,
// // // //       [offSet]: { answer: updated, status: "attempted" },
// // // //     }));
// // // //   };

// // // //   const handleFill = (val) => {
// // // //     const isAnswered = val.trim() !== "";

// // // //     setAnswersMap((prev) => ({
// // // //       ...prev,
// // // //       [offSet]: {
// // // //         answer: isAnswered ? [val] : [],
// // // //         status: isAnswered ? "attempted" : "not_answered",
// // // //       },
// // // //     }));
// // // //   };

// // // //   const saveAnswer = async () => {
// // // //     const data = answersMap[offSet] || { answer: [] };
// // // //     if (!data.answer.length) return;

// // // //     const payload = {
// // // //       questionId: question.qId,
// // // //       examId,
// // // //       submittedAnswer: data.answer.join(","),
// // // //       sNo: offSet + 1,
// // // //       isFlagged: 1,
// // // //       userLoginId: userId,
// // // //     };

// // // //     await fetch("https://localhost:8443/sphinx/api/user/submited-answer", {
// // // //       method: "POST",
// // // //       headers: { "Content-Type": "application/json" },
// // // //       body: JSON.stringify(payload),
// // // //     });
// // // //   };

// // // //   const handleNext = async () => {
// // // //     await saveAnswer();
// // // //     if (offSet < totalQuestions - 1) setOffSet((p) => p + 1);
// // // //   };

// // // //   const handlePrev = async () => {
// // // //     await saveAnswer();
// // // //     if (offSet > 0) setOffSet((p) => p - 1);
// // // //   };

// // // //   const handleJump = async (i) => {
// // // //     await saveAnswer();
// // // //     setOffSet(i);
// // // //   };

// // // //   const markReview = () => {
// // // //     setAnswersMap((prev) => ({
// // // //       ...prev,
// // // //       [offSet]: { answer: currentAnswer, status: "marked_review" },
// // // //     }));
// // // //   };

// // // //   /* ===================== AUTO SUBMIT ===================== */

// // // //   const autoSubmitExam = async (msg) => {
// // // //     try {
// // // //       await saveAnswer();

// // // //       const res = await fetch(
// // // //         "https://localhost:8443/sphinx/api/user/submit-final",
// // // //         {
// // // //           method: "POST",
// // // //           headers: { "Content-Type": "application/json" },
// // // //           body: JSON.stringify({ examId: examId, userLoginId: userId }),
// // // //         },
// // // //       );

// // // //       const data = await res.json();

// // // //       if (!res.ok) toast.error(data.error);
// // // //       else {
// // // //         toast.success(msg);
// // // //         console.log(data.skipped);
// // // //         // setSkipped(data.skipped);
// // // //         navigate(`/examresult/${examId}/${userId}/${data.skipped}`);
// // // //       }
// // // //     } catch {
// // // //       toast.error("Auto submit failed");
// // // //     }
// // // //   };

// // // //   /* ===================== MANUAL SUBMIT ===================== */

// // // //   const handleSubmitExam = async () => {
// // // //     if (!window.confirm("Submit exam?")) return;

// // // //     await saveAnswer();

// // // //     const res = await fetch(
// // // //       "https://localhost:8443/sphinx/api/user/submit-final",
// // // //       {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify({ examId, userLoginId: userId }),
// // // //       },
// // // //     );

// // // //     const data = await res.json();

// // // //     if (!res.ok) toast.error(data.error);
// // // //     else {
// // // //       toast.success(data.success);
// // // //       setSkipped(data.skipped);

// // // //       navigate(`/examresult/${examId}/${userId}/${skipped}`);
// // // //     }
// // // //   };

// // // //   /* ===================== RENDER ===================== */

// // // //   const renderOptions = () => {
// // // //     const type = question.questionTypeId;

// // // //     if (type === "FILL_BLANK") {
// // // //       return (
// // // //         <input
// // // //           style={{ padding: "10px", width: "100%" }}
// // // //           value={currentAnswer[0] || ""}
// // // //           onChange={(e) => handleFill(e.target.value)}
// // // //         />
// // // //       );
// // // //     }

// // // //     const opts =
// // // //       type === "TRUE_FALSE" ? ["True", "False"] : ["A", "B", "C", "D"];

// // // //     return opts.map((opt) => (
// // // //       <Option key={opt}>
// // // //         <input
// // // //           type={type === "MULTI_CHOICE" ? "checkbox" : "radio"}
// // // //           checked={currentAnswer.includes(opt)}
// // // //           onChange={() => handleAnswer(opt)}
// // // //         />
// // // //         {question[`option${opt}`] || opt}
// // // //       </Option>
// // // //     ));
// // // //   };

// // // //   const formatTime = () => {
// // // //     const m = Math.floor(time / 60);
// // // //     const s = time % 60;
// // // //     return `${m}:${s < 10 ? "0" : ""}${s}`;
// // // //   };

// // // //   return (
// // // //     <>
// // // //       <UserHeader />

// // // //       <Layout>
// // // //         <Left>
// // // //           <Box>
// // // //             <SubInfo>
// // // //               <span>
// // // //                 Question {offSet + 1} / {totalQuestions}
// // // //               </span>
// // // //               <span>⏱ {formatTime()}</span>
// // // //             </SubInfo>

// // // //             <Title>
// // // //               Q{offSet + 1}. {question.questionDetail}
// // // //             </Title>

// // // //             {renderOptions()}

// // // //             <div>
// // // //               <Button onClick={handlePrev} disabled={offSet === 0} bg="#6c757d">
// // // //                 Prev
// // // //               </Button>

// // // //               <Button
// // // //                 onClick={handleNext}
// // // //                 disabled={offSet >= totalQuestions - 1}
// // // //               >
// // // //                 Save & Next
// // // //               </Button>

// // // //               <Button onClick={markReview} bg="#f59e0b">
// // // //                 Mark Review
// // // //               </Button>

// // // //               <Button
// // // //                 bg="#22c55e"
// // // //                 onClick={() => autoSubmitExam("Exam submitted!")}
// // // //               >
// // // //                 Submit Exam
// // // //               </Button>
// // // //             </div>
// // // //           </Box>
// // // //         </Left>

// // // //         <Right>
// // // //           <h4>Question Palette</h4>

// // // //           <Palette>
// // // //             {Array.from({ length: totalQuestions }).map((_, i) => (
// // // //               <QBtn
// // // //                 key={i}
// // // //                 status={answersMap[i]?.status}
// // // //                 active={i === offSet}
// // // //                 onClick={() => handleJump(i)}
// // // //               >
// // // //                 {i + 1}
// // // //               </QBtn>
// // // //             ))}
// // // //           </Palette>

// // // //           <hr />

// // // //           <p>🟢 Attempted</p>
// // // //           <p>🔴 Not Answered</p>
// // // //           <p>🟡 Marked Review</p>
// // // //           <p>⬜ Not Visited</p>
// // // //         </Right>
// // // //       </Layout>
// // // //     </>
// // // //   );
// // // // };

// // // // export default ExamAttend;
// // // import React, { useEffect, useState, useRef } from "react";
// // // import styled from "styled-components";
// // // import { useSelector } from "react-redux";
// // // import { useNavigate, useParams } from "react-router-dom";
// // // import { toast } from "sonner";
// // // import UserHeader from "../user/UserHeader";

// // // /* ===================== STYLES ===================== */

// // // const Layout = styled.div`
// // //   display: flex;
// // //   gap: 24px;
// // //   padding: 24px;
// // //   background: #f8fafc;
// // //   min-height: 100vh;
// // // `;

// // // const Left = styled.div`
// // //   flex: 3;
// // // `;

// // // const Right = styled.div`
// // //   flex: 1;
// // //   background: #ffffff;
// // //   padding: 20px;
// // //   border-radius: 14px;
// // //   box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
// // // `;

// // // const Box = styled.div`
// // //   background: #ffffff;
// // //   padding: 28px;
// // //   border-radius: 14px;
// // //   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
// // // `;

// // // const Title = styled.h3`
// // //   margin-bottom: 10px;
// // // `;

// // // const SubInfo = styled.div`
// // //   display: flex;
// // //   justify-content: space-between;
// // //   margin-bottom: 15px;
// // //   font-size: 14px;
// // //   color: #555;
// // // `;

// // // const Option = styled.label`
// // //   display: flex;
// // //   align-items: center;
// // //   gap: 10px;
// // //   padding: 12px;
// // //   margin: 10px 0;
// // //   border: 1px solid #e2e8f0;
// // //   border-radius: 8px;
// // //   cursor: pointer;

// // //   &:hover {
// // //     background: #f1f5f9;
// // //   }

// // //   input {
// // //     accent-color: #2563eb;
// // //   }
// // // `;

// // // const Button = styled.button`
// // //   margin: 10px 8px 0 0;
// // //   padding: 10px 18px;
// // //   border: none;
// // //   border-radius: 8px;
// // //   font-weight: 500;
// // //   cursor: pointer;
// // //   background: ${(p) => p.bg || "#2563eb"};
// // //   color: white;

// // //   &:hover {
// // //     opacity: 0.9;
// // //     transform: translateY(-1px);
// // //   }

// // //   &:disabled {
// // //     background: #cbd5e1;
// // //     cursor: not-allowed;
// // //   }
// // // `;

// // // const Palette = styled.div`
// // //   display: grid;
// // //   grid-template-columns: repeat(5, 1fr);
// // //   gap: 10px;
// // // `;

// // // /*
// // //   Status priority (highest → lowest):
// // //     attempted       → green  (#22c55e)
// // //     marked_review   → yellow (#facc15)
// // //     not_answered    → red    (#ef4444)  ← visited but skipped/left blank
// // //     not_visited     → white  (#ffffff)  ← never opened
// // // */
// // // const QBtn = styled.button`
// // //   padding: 12px;
// // //   border-radius: 8px;
// // //   font-weight: 600;
// // //   cursor: pointer;
// // //   border: ${(p) => (p.active ? "2px solid #111827" : "1px solid #e5e7eb")};

// // //   background: ${(p) => {
// // //     switch (p.status) {
// // //       case "attempted":
// // //         return "#22c55e";
// // //       case "marked_review":
// // //         return "#facc15";
// // //       case "not_answered":
// // //         return "#ef4444"; /* visited, no answer */
// // //       default:
// // //         return "#ffffff"; /* not_visited */
// // //     }
// // //   }};

// // //   color: ${(p) => (p.status ? "#fff" : "#111")};
// // // `;

// // // /* ===================== COMPONENT ===================== */

// // // const ExamAttend = () => {
// // //   const navigate = useNavigate();
// // //   const { examId, duration } = useParams();
// // //   const userId = useSelector((state) => state.auth.user);

// // //   const [question, setQuestion] = useState({});
// // //   const [offSet, setOffSet] = useState(0);
// // //   const [totalQuestions, setTotalQuestions] = useState(0);
// // //   const [answersMap, setAnswersMap] = useState({});
// // //   const [visitedSet, setVisitedSet] = useState(new Set([0])); // track visited indices

// // //   const [time, setTime] = useState(duration * 60);
// // //   const timerRef = useRef(null);

// // //   const currentAnswer = answersMap[offSet]?.answer || [];

// // //   /* ===================== TIMER ===================== */

// // //   useEffect(() => {
// // //     if (timerRef.current) return;

// // //     timerRef.current = setInterval(() => {
// // //       setTime((t) => {
// // //         if (t <= 1) {
// // //           clearInterval(timerRef.current);
// // //           autoSubmitExam("Time up! Exam submitted.");
// // //           return 0;
// // //         }
// // //         return t - 1;
// // //       });
// // //     }, 1000);

// // //     return () => clearInterval(timerRef.current);
// // //   }, []);

// // //   /* ===================== FETCH ===================== */

// // //   const getQuestion = async (offsetValue) => {
// // //     try {
// // //       const res = await fetch(
// // //         `https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${offsetValue}`,
// // //       );
// // //       const data = await res.json();

// // //       if (res.ok) {
// // //         setQuestion(data.questions?.[0] || {});
// // //         setTotalQuestions(data.totalQuestions || 0);
// // //       }
// // //     } catch (err) {
// // //       console.log(err);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     getQuestion(offSet);
// // //   }, [offSet]);

// // //   /* ===================== DERIVED STATUS ===================== */

// // //   /**
// // //    * Returns the display status for a given question index:
// // //    *  - "attempted"     → user selected/typed an answer
// // //    *  - "marked_review" → flagged for review
// // //    *  - "not_answered"  → visited but left blank
// // //    *  - undefined       → never visited (renders white)
// // //    */
// // //   const getStatus = (i) => {
// // //     if (answersMap[i]?.status) return answersMap[i].status;
// // //     if (visitedSet.has(i)) return "not_answered";
// // //     return undefined; // not visited
// // //   };

// // //   /* ===================== NAVIGATION HELPERS ===================== */

// // //   const markVisited = (i) => {
// // //     setVisitedSet((prev) => {
// // //       if (prev.has(i)) return prev;
// // //       const next = new Set(prev);
// // //       next.add(i);
// // //       return next;
// // //     });
// // //   };

// // //   const goTo = async (i) => {
// // //     await saveAnswer();
// // //     setOffSet(i);
// // //     markVisited(i);
// // //   };

// // //   /* ===================== HANDLERS ===================== */

// // //   const handleAnswer = (val) => {
// // //     const type = question.questionTypeId;
// // //     let updated = [];

// // //     if (type === "SINGLE_CHOICE" || type === "TRUE_FALSE") {
// // //       updated = [val];
// // //     } else {
// // //       updated = currentAnswer.includes(val)
// // //         ? currentAnswer.filter((x) => x !== val)
// // //         : [...currentAnswer, val];
// // //     }

// // //     setAnswersMap((prev) => ({
// // //       ...prev,
// // //       [offSet]: { answer: updated, status: "attempted" },
// // //     }));
// // //   };

// // //   const handleFill = (val) => {
// // //     const isAnswered = val.trim() !== "";
// // //     setAnswersMap((prev) => ({
// // //       ...prev,
// // //       [offSet]: {
// // //         answer: isAnswered ? [val] : [],
// // //         status: isAnswered ? "attempted" : "not_answered",
// // //       },
// // //     }));
// // //   };

// // //   const saveAnswer = async () => {
// // //     const data = answersMap[offSet] || { answer: [] };
// // //     if (!data.answer.length) return;

// // //     const payload = {
// // //       questionId: question.qId,
// // //       examId,
// // //       submittedAnswer: data.answer.join(","),
// // //       sNo: offSet + 1,
// // //       isFlagged: 1,
// // //       userLoginId: userId,
// // //     };

// // //     await fetch("https://localhost:8443/sphinx/api/user/submited-answer", {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify(payload),
// // //     });
// // //   };

// // //   const handleNext = async () => {
// // //     await saveAnswer();
// // //     if (offSet < totalQuestions - 1) {
// // //       const next = offSet + 1;
// // //       setOffSet(next);
// // //       markVisited(next);
// // //     }
// // //   };

// // //   const handlePrev = async () => {
// // //     await saveAnswer();
// // //     if (offSet > 0) {
// // //       const prev = offSet - 1;
// // //       setOffSet(prev);
// // //       markVisited(prev);
// // //     }
// // //   };

// // //   const markReview = () => {
// // //     setAnswersMap((prev) => ({
// // //       ...prev,
// // //       [offSet]: { answer: currentAnswer, status: "marked_review" },
// // //     }));
// // //   };

// // //   /* ===================== SUBMIT ===================== */

// // //   const autoSubmitExam = async (msg) => {
// // //     try {
// // //       await saveAnswer();
// // //       const res = await fetch(
// // //         "https://localhost:8443/sphinx/api/user/submit-final",
// // //         {
// // //           method: "POST",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify({ examId, userLoginId: userId }),
// // //         },
// // //       );
// // //       const data = await res.json();
// // //       if (!res.ok) toast.error(data.error);
// // //       else {
// // //         toast.success(msg);
// // //         navigate(`/examresult/${examId}/${userId}/${data.skipped}`);
// // //       }
// // //     } catch {
// // //       toast.error("Auto submit failed");
// // //     }
// // //   };

// // //   const handleSubmitExam = async () => {
// // //     if (!window.confirm("Submit exam?")) return;
// // //     await saveAnswer();
// // //     const res = await fetch(
// // //       "https://localhost:8443/sphinx/api/user/submit-final",
// // //       {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ examId, userLoginId: userId }),
// // //       },
// // //     );
// // //     const data = await res.json();
// // //     if (!res.ok) toast.error(data.error);
// // //     else {
// // //       toast.success(data.success);
// // //       navigate(`/examresult/${examId}/${userId}/${data.skipped}`);
// // //     }
// // //   };

// // //   /* ===================== RENDER ===================== */

// // //   const renderOptions = () => {
// // //     const type = question.questionTypeId;

// // //     if (type === "FILL_BLANK") {
// // //       return (
// // //         <input
// // //           style={{ padding: "10px", width: "100%" }}
// // //           value={currentAnswer[0] || ""}
// // //           onChange={(e) => handleFill(e.target.value)}
// // //         />
// // //       );
// // //     }

// // //     const opts =
// // //       type === "TRUE_FALSE" ? ["True", "False"] : ["A", "B", "C", "D"];

// // //     return opts.map((opt) => (
// // //       <Option key={opt}>
// // //         <input
// // //           type={type === "MULTI_CHOICE" ? "checkbox" : "radio"}
// // //           checked={currentAnswer.includes(opt)}
// // //           onChange={() => handleAnswer(opt)}
// // //         />
// // //         {question[`option${opt}`] || opt}
// // //       </Option>
// // //     ));
// // //   };

// // //   const formatTime = () => {
// // //     const m = Math.floor(time / 60);
// // //     const s = time % 60;
// // //     return `${m}:${s < 10 ? "0" : ""}${s}`;
// // //   };

// // //   return (
// // //     <>
// // //       <UserHeader />

// // //       <Layout>
// // //         <Left>
// // //           <Box>
// // //             <SubInfo>
// // //               <span>
// // //                 Question {offSet + 1} / {totalQuestions}
// // //               </span>
// // //               <span>⏱ {formatTime()}</span>
// // //             </SubInfo>

// // //             <Title>
// // //               Q{offSet + 1}. {question.questionDetail}
// // //             </Title>

// // //             {renderOptions()}

// // //             <div>
// // //               <Button onClick={handlePrev} disabled={offSet === 0} bg="#6c757d">
// // //                 Prev
// // //               </Button>
// // //               <Button
// // //                 onClick={handleNext}
// // //                 disabled={offSet >= totalQuestions - 1}
// // //               >
// // //                 Save & Next
// // //               </Button>
// // //               <Button onClick={markReview} bg="#f59e0b">
// // //                 Mark Review
// // //               </Button>
// // //               <Button bg="#22c55e" onClick={handleSubmitExam}>
// // //                 Submit Exam
// // //               </Button>
// // //             </div>
// // //           </Box>
// // //         </Left>

// // //         <Right>
// // //           <h4>Question Palette</h4>

// // //           <Palette>
// // //             {Array.from({ length: totalQuestions }).map((_, i) => (
// // //               <QBtn
// // //                 key={i}
// // //                 status={getStatus(i)}
// // //                 active={i === offSet}
// // //                 onClick={() => goTo(i)}
// // //               >
// // //                 {i + 1}
// // //               </QBtn>
// // //             ))}
// // //           </Palette>

// // //           <hr />

// // //           <p>🟢 Attempted</p>
// // //           <p>🔴 Not Answered</p>
// // //           <p>🟡 Marked Review</p>
// // //           <p>⬜ Not Visited</p>
// // //         </Right>
// // //       </Layout>
// // //     </>
// // //   );
// // // };

// // // export default ExamAttend;

// // import React, { useEffect, useState, useRef } from "react";
// // import styled, { keyframes } from "styled-components";
// // import { useSelector } from "react-redux";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { toast } from "sonner";
// // import UserHeader from "../user/UserHeader";

// // /* ===================== SUBMIT CONFIRM MODAL ===================== */

// // const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
// // const slideUp = keyframes`from { opacity: 0; transform: scale(0.92) translateY(24px); } to { opacity: 1; transform: scale(1) translateY(0); }`;
// // const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;

// // const Overlay = styled.div`
// //   position: fixed;
// //   inset: 0;
// //   background: rgba(10, 14, 23, 0.6);
// //   backdrop-filter: blur(6px);
// //   display: flex;
// //   align-items: center;
// //   justify-content: center;
// //   z-index: 9999;
// //   animation: ${fadeIn} 0.2s ease;
// //   padding: 16px;
// // `;

// // const ModalBox = styled.div`
// //   background: #ffffff;
// //   border-radius: 20px;
// //   padding: 36px 32px 28px;
// //   width: 100%;
// //   max-width: 420px;
// //   position: relative;
// //   animation: ${slideUp} 0.3s cubic-bezier(0.22, 0.68, 0, 1.2) both;
// //   box-shadow:
// //     0 32px 80px rgba(0, 0, 0, 0.2),
// //     0 2px 8px rgba(0, 0, 0, 0.08);
// //   border: 0.5px solid rgba(0, 0, 0, 0.07);
// // `;

// // const ModalIconRing = styled.div`
// //   width: 64px;
// //   height: 64px;
// //   border-radius: 50%;
// //   background: #fff7ed;
// //   border: 1.5px solid #fed7aa;
// //   display: flex;
// //   align-items: center;
// //   justify-content: center;
// //   margin: 0 auto 20px;
// //   font-size: 26px;
// // `;

// // const ModalTitle = styled.h2`
// //   font-size: 20px;
// //   font-weight: 700;
// //   color: #0f1117;
// //   text-align: center;
// //   margin: 0 0 8px;
// //   letter-spacing: -0.3px;
// // `;

// // const ModalSub = styled.p`
// //   font-size: 13.5px;
// //   color: #6b7280;
// //   text-align: center;
// //   margin: 0 0 24px;
// //   line-height: 1.6;
// // `;

// // const StatRow = styled.div`
// //   display: grid;
// //   grid-template-columns: repeat(3, 1fr);
// //   gap: 10px;
// //   margin-bottom: 24px;
// // `;

// // const StatTile = styled.div`
// //   background: ${(p) => p.bg || "#f8f9fa"};
// //   border: 1px solid ${(p) => p.border || "rgba(0,0,0,0.07)"};
// //   border-radius: 12px;
// //   padding: 12px 8px;
// //   text-align: center;
// // `;

// // const StatVal = styled.div`
// //   font-size: 22px;
// //   font-weight: 700;
// //   color: ${(p) => p.color || "#0f1117"};
// //   line-height: 1;
// // `;

// // const StatLabel = styled.div`
// //   font-size: 10px;
// //   color: #9ca3af;
// //   text-transform: uppercase;
// //   letter-spacing: 0.7px;
// //   margin-top: 4px;
// // `;

// // const Divider = styled.div`
// //   height: 0.5px;
// //   background: rgba(0, 0, 0, 0.08);
// //   margin-bottom: 20px;
// // `;

// // const ModalBtnRow = styled.div`
// //   display: flex;
// //   gap: 10px;
// // `;

// // const ModalBtn = styled.button`
// //   flex: 1;
// //   padding: 13px;
// //   border-radius: 10px;
// //   font-size: 14px;
// //   font-weight: 600;
// //   cursor: pointer;
// //   border: none;
// //   transition:
// //     opacity 0.15s,
// //     transform 0.15s,
// //     box-shadow 0.15s;
// //   display: flex;
// //   align-items: center;
// //   justify-content: center;
// //   gap: 7px;

// //   background: ${(p) => p.bg || "#f3f4f6"};
// //   color: ${(p) => p.color || "#374151"};

// //   &:hover:not(:disabled) {
// //     opacity: 0.88;
// //     transform: translateY(-1px);
// //     box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
// //   }
// //   &:active:not(:disabled) {
// //     transform: translateY(0);
// //   }
// //   &:disabled {
// //     opacity: 0.6;
// //     cursor: not-allowed;
// //   }
// // `;

// // const Spinner = styled.svg`
// //   animation: ${spin} 0.8s linear infinite;
// // `;

// // const SubmitConfirmModal = ({ stats, onConfirm, onCancel, submitting }) => (
// //   <Overlay
// //     onClick={(e) => e.target === e.currentTarget && !submitting && onCancel()}
// //   >
// //     <ModalBox>
// //       <ModalIconRing>📋</ModalIconRing>
// //       <ModalTitle>Submit Exam?</ModalTitle>
// //       <ModalSub>
// //         Once submitted, you cannot change your answers.
// //         <br />
// //         Please review your progress below.
// //       </ModalSub>

// //       <StatRow>
// //         <StatTile bg="#f0fdf4" border="#bbf7d0">
// //           <StatVal color="#16a34a">{stats.attempted}</StatVal>
// //           <StatLabel>Attempted</StatLabel>
// //         </StatTile>
// //         <StatTile bg="#fff5f5" border="#fecaca">
// //           <StatVal color="#dc2626">{stats.notAnswered}</StatVal>
// //           <StatLabel>Skipped</StatLabel>
// //         </StatTile>
// //         <StatTile bg="#fefce8" border="#fde68a">
// //           <StatVal color="#d97706">{stats.markedReview}</StatVal>
// //           <StatLabel>Review</StatLabel>
// //         </StatTile>
// //       </StatRow>

// //       <Divider />

// //       <ModalBtnRow>
// //         <ModalBtn onClick={onCancel} disabled={submitting}>
// //           ✕ Go Back
// //         </ModalBtn>
// //         <ModalBtn
// //           bg="#16a34a"
// //           color="#fff"
// //           onClick={onConfirm}
// //           disabled={submitting}
// //         >
// //           {submitting ? (
// //             <>
// //               <Spinner
// //                 width="15"
// //                 height="15"
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 strokeWidth="2.5"
// //                 strokeLinecap="round"
// //               >
// //                 <path d="M21 12a9 9 0 1 1-6.219-8.56" />
// //               </Spinner>
// //               Submitting…
// //             </>
// //           ) : (
// //             <>✓ Submit Now</>
// //           )}
// //         </ModalBtn>
// //       </ModalBtnRow>
// //     </ModalBox>
// //   </Overlay>
// // );

// // /* ===================== STYLES ===================== */

// // const Layout = styled.div`
// //   display: flex;
// //   gap: 24px;
// //   padding: 24px;
// //   background: #f8fafc;
// //   min-height: 100vh;
// // `;

// // const Left = styled.div`
// //   flex: 3;
// // `;

// // const Right = styled.div`
// //   flex: 1;
// //   background: #ffffff;
// //   padding: 20px;
// //   border-radius: 14px;
// //   box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
// // `;

// // const Box = styled.div`
// //   background: #ffffff;
// //   padding: 28px;
// //   border-radius: 14px;
// //   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
// // `;

// // const Title = styled.h3`
// //   margin-bottom: 10px;
// // `;

// // const SubInfo = styled.div`
// //   display: flex;
// //   justify-content: space-between;
// //   margin-bottom: 15px;
// //   font-size: 14px;
// //   color: #555;
// // `;

// // const Option = styled.label`
// //   display: flex;
// //   align-items: center;
// //   gap: 10px;
// //   padding: 12px;
// //   margin: 10px 0;
// //   border: 1px solid #e2e8f0;
// //   border-radius: 8px;
// //   cursor: pointer;

// //   &:hover {
// //     background: #f1f5f9;
// //   }

// //   input {
// //     accent-color: #2563eb;
// //   }
// // `;

// // const Button = styled.button`
// //   margin: 10px 8px 0 0;
// //   padding: 10px 18px;
// //   border: none;
// //   border-radius: 8px;
// //   font-weight: 500;
// //   cursor: pointer;
// //   background: ${(p) => p.bg || "#2563eb"};
// //   color: white;

// //   &:hover {
// //     opacity: 0.9;
// //     transform: translateY(-1px);
// //   }

// //   &:disabled {
// //     background: #cbd5e1;
// //     cursor: not-allowed;
// //   }
// // `;

// // const Palette = styled.div`
// //   display: grid;
// //   grid-template-columns: repeat(5, 1fr);
// //   gap: 10px;
// // `;

// // /*
// //   Status priority (highest → lowest):
// //     attempted       → green  (#22c55e)
// //     marked_review   → yellow (#facc15)
// //     not_answered    → red    (#ef4444)  ← visited but skipped/left blank
// //     not_visited     → white  (#ffffff)  ← never opened
// // */
// // const QBtn = styled.button`
// //   padding: 12px;
// //   border-radius: 8px;
// //   font-weight: 600;
// //   cursor: pointer;
// //   border: ${(p) => (p.active ? "2px solid #111827" : "1px solid #e5e7eb")};

// //   background: ${(p) => {
// //     switch (p.status) {
// //       case "attempted":
// //         return "#22c55e";
// //       case "marked_review":
// //         return "#facc15";
// //       case "not_answered":
// //         return "#ef4444"; /* visited, no answer */
// //       default:
// //         return "#ffffff"; /* not_visited */
// //     }
// //   }};

// //   color: ${(p) => (p.status ? "#fff" : "#111")};
// // `;

// // /* ===================== COMPONENT ===================== */

// // const ExamAttend = () => {
// //   const navigate = useNavigate();
// //   const { examId, duration } = useParams();
// //   const userId = useSelector((state) => state.auth.user);

// //   const [question, setQuestion] = useState({});
// //   const [offSet, setOffSet] = useState(0);
// //   const [totalQuestions, setTotalQuestions] = useState(0);
// //   const [answersMap, setAnswersMap] = useState({});
// //   const [visitedSet, setVisitedSet] = useState(new Set([0])); // track visited indices
// //   const [showConfirm, setShowConfirm] = useState(false);
// //   const [submitting, setSubmitting] = useState(false);

// //   const [time, setTime] = useState(duration * 60);
// //   const timerRef = useRef(null);

// //   const currentAnswer = answersMap[offSet]?.answer || [];

// //   /* ===================== TIMER ===================== */

// //   useEffect(() => {
// //     if (timerRef.current) return;

// //     timerRef.current = setInterval(() => {
// //       setTime((t) => {
// //         if (t <= 1) {
// //           clearInterval(timerRef.current);
// //           autoSubmitExam("Time up! Exam submitted.");
// //           return 0;
// //         }
// //         return t - 1;
// //       });
// //     }, 1000);

// //     return () => clearInterval(timerRef.current);
// //   }, []);

// //   /* ===================== FETCH ===================== */

// //   const getQuestion = async (offsetValue) => {
// //     try {
// //       const res = await fetch(
// //         `https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${offsetValue}`,
// //       );
// //       const data = await res.json();

// //       if (res.ok) {
// //         setQuestion(data.questions?.[0] || {});
// //         setTotalQuestions(data.totalQuestions || 0);
// //       }
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };

// //   useEffect(() => {
// //     getQuestion(offSet);
// //   }, [offSet]);

// //   /* ===================== DERIVED STATUS ===================== */

// //   /**
// //    * Returns the display status for a given question index:
// //    *  - "attempted"     → user selected/typed an answer
// //    *  - "marked_review" → flagged for review
// //    *  - "not_answered"  → visited but left blank
// //    *  - undefined       → never visited (renders white)
// //    */
// //   const getStatus = (i) => {
// //     if (answersMap[i]?.status) return answersMap[i].status;
// //     if (visitedSet.has(i)) return "not_answered";
// //     return undefined; // not visited
// //   };

// //   /* ===================== NAVIGATION HELPERS ===================== */

// //   const markVisited = (i) => {
// //     setVisitedSet((prev) => {
// //       if (prev.has(i)) return prev;
// //       const next = new Set(prev);
// //       next.add(i);
// //       return next;
// //     });
// //   };

// //   const goTo = async (i) => {
// //     await saveAnswer();
// //     setOffSet(i);
// //     markVisited(i);
// //   };

// //   /* ===================== HANDLERS ===================== */

// //   const handleAnswer = (val) => {
// //     const type = question.questionTypeId;
// //     let updated = [];

// //     if (type === "SINGLE_CHOICE" || type === "TRUE_FALSE") {
// //       updated = [val];
// //     } else {
// //       updated = currentAnswer.includes(val)
// //         ? currentAnswer.filter((x) => x !== val)
// //         : [...currentAnswer, val];
// //     }

// //     setAnswersMap((prev) => ({
// //       ...prev,
// //       [offSet]: { answer: updated, status: "attempted" },
// //     }));
// //   };

// //   const handleFill = (val) => {
// //     const isAnswered = val.trim() !== "";
// //     setAnswersMap((prev) => ({
// //       ...prev,
// //       [offSet]: {
// //         answer: isAnswered ? [val] : [],
// //         status: isAnswered ? "attempted" : "not_answered",
// //       },
// //     }));
// //   };

// //   const saveAnswer = async () => {
// //     const data = answersMap[offSet] || { answer: [] };
// //     if (!data.answer.length) return;

// //     const payload = {
// //       questionId: question.qId,
// //       examId,
// //       submittedAnswer: data.answer.join(","),
// //       sNo: offSet + 1,
// //       isFlagged: 1,
// //       userLoginId: userId,
// //     };

// //     await fetch("https://localhost:8443/sphinx/api/user/submited-answer", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(payload),
// //     });
// //   };

// //   const handleNext = async () => {
// //     await saveAnswer();
// //     if (offSet < totalQuestions - 1) {
// //       const next = offSet + 1;
// //       setOffSet(next);
// //       markVisited(next);
// //     }
// //   };

// //   const handlePrev = async () => {
// //     await saveAnswer();
// //     if (offSet > 0) {
// //       const prev = offSet - 1;
// //       setOffSet(prev);
// //       markVisited(prev);
// //     }
// //   };

// //   const markReview = () => {
// //     setAnswersMap((prev) => ({
// //       ...prev,
// //       [offSet]: { answer: currentAnswer, status: "marked_review" },
// //     }));
// //   };

// //   /* ===================== SUBMIT ===================== */

// //   const autoSubmitExam = async (msg) => {
// //     try {
// //       await saveAnswer();
// //       const res = await fetch(
// //         "https://localhost:8443/sphinx/api/user/submit-final",
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ examId, userLoginId: userId }),
// //         },
// //       );
// //       const data = await res.json();
// //       if (!res.ok) toast.error(data.error);
// //       else {
// //         toast.success(msg);
// //         navigate(`/examresult/${examId}/${userId}/${data.skipped}`);
// //       }
// //     } catch {
// //       toast.error("Auto submit failed");
// //     }
// //   };

// //   const handleSubmitExam = async () => {
// //     await saveAnswer();
// //     setShowConfirm(true);
// //   };

// //   const confirmSubmit = async () => {
// //     setSubmitting(true);
// //     try {
// //       const res = await fetch(
// //         "https://localhost:8443/sphinx/api/user/submit-final",
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ examId, userLoginId: userId }),
// //         },
// //       );
// //       const data = await res.json();
// //       if (!res.ok) {
// //         toast.error(data.error);
// //         setSubmitting(false);
// //         setShowConfirm(false);
// //       } else {
// //         toast.success(data.success || "Exam submitted successfully!");
// //         navigate(`/examresult/${examId}/${userId}/${data.skipped}`);
// //       }
// //     } catch {
// //       toast.error("Submission failed. Please try again.");
// //       setSubmitting(false);
// //     }
// //   };

// //   /* ── Compute stats for the modal ── */
// //   const getSubmitStats = () => {
// //     let attempted = 0,
// //       notAnswered = 0,
// //       markedReview = 0;
// //     for (let i = 0; i < totalQuestions; i++) {
// //       const s = answersMap[i]?.status;
// //       if (s === "attempted") attempted++;
// //       else if (s === "marked_review") markedReview++;
// //       else if (visitedSet.has(i)) notAnswered++;
// //     }
// //     return { attempted, notAnswered, markedReview };
// //   };

// //   /* ===================== RENDER ===================== */

// //   const renderOptions = () => {
// //     const type = question.questionTypeId;

// //     if (type === "FILL_BLANK") {
// //       return (
// //         <input
// //           style={{ padding: "10px", width: "100%" }}
// //           value={currentAnswer[0] || ""}
// //           onChange={(e) => handleFill(e.target.value)}
// //         />
// //       );
// //     }

// //     const opts =
// //       type === "TRUE_FALSE" ? ["True", "False"] : ["A", "B", "C", "D"];

// //     return opts.map((opt) => (
// //       <Option key={opt}>
// //         <input
// //           type={type === "MULTI_CHOICE" ? "checkbox" : "radio"}
// //           checked={currentAnswer.includes(opt)}
// //           onChange={() => handleAnswer(opt)}
// //         />
// //         {question[`option${opt}`] || opt}
// //       </Option>
// //     ));
// //   };

// //   const formatTime = () => {
// //     const m = Math.floor(time / 60);
// //     const s = time % 60;
// //     return `${m}:${s < 10 ? "0" : ""}${s}`;
// //   };

// //   return (
// //     <>
// //       <UserHeader />

// //       {showConfirm && (
// //         <SubmitConfirmModal
// //           stats={getSubmitStats()}
// //           onConfirm={confirmSubmit}
// //           onCancel={() => setShowConfirm(false)}
// //           submitting={submitting}
// //         />
// //       )}

// //       <Layout>
// //         <Left>
// //           <Box>
// //             <SubInfo>
// //               <span>
// //                 Question {offSet + 1} / {totalQuestions}
// //               </span>
// //               <span>⏱ {formatTime()}</span>
// //             </SubInfo>

// //             <Title>
// //               Q{offSet + 1}. {question.questionDetail}
// //             </Title>

// //             {renderOptions()}

// //             <div>
// //               <Button onClick={handlePrev} disabled={offSet === 0} bg="#6c757d">
// //                 Prev
// //               </Button>
// //               <Button
// //                 onClick={handleNext}
// //                 disabled={offSet >= totalQuestions - 1}
// //               >
// //                 Save & Next
// //               </Button>
// //               <Button onClick={markReview} bg="#f59e0b">
// //                 Mark Review
// //               </Button>
// //               <Button bg="#22c55e" onClick={handleSubmitExam}>
// //                 Submit Exam
// //               </Button>
// //             </div>
// //           </Box>
// //         </Left>

// //         <Right>
// //           <h4>Question Palette</h4>

// //           <Palette>
// //             {Array.from({ length: totalQuestions }).map((_, i) => (
// //               <QBtn
// //                 key={i}
// //                 status={getStatus(i)}
// //                 active={i === offSet}
// //                 onClick={() => goTo(i)}
// //               >
// //                 {i + 1}
// //               </QBtn>
// //             ))}
// //           </Palette>

// //           <hr />

// //           <p>🟢 Attempted</p>
// //           <p>🔴 Not Answered</p>
// //           <p>🟡 Marked Review</p>
// //           <p>⬜ Not Visited</p>
// //         </Right>
// //       </Layout>
// //     </>
// //   );
// // };

// // export default ExamAttend;

// import React, { useEffect, useState, useRef } from "react";
// import styled, { keyframes, createGlobalStyle } from "styled-components";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";
// import UserHeader from "../user/UserHeader";

// /* ===================== GLOBAL FONT ===================== */
// const GlobalStyle = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
// `;

// /* ===================== KEYFRAMES ===================== */
// const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
// const slideUp = keyframes`from{opacity:0;transform:scale(.94) translateY(28px)}to{opacity:1;transform:scale(1) translateY(0)}`;
// const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
// const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.45}`;
// const popIn = keyframes`from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}`;
// const slideIn = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;
// const timerWarn = keyframes`0%,100%{color:#f87171}50%{color:#fca5a5}`;

// /* ===================== SUBMIT MODAL ===================== */
// const Overlay = styled.div`
//   position: fixed;
//   inset: 0;
//   background: rgba(6, 8, 15, 0.75);
//   backdrop-filter: blur(10px);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 9999;
//   animation: ${fadeIn} 0.2s ease;
//   padding: 16px;
// `;

// const ModalBox = styled.div`
//   background: #fff;
//   border-radius: 24px;
//   padding: 40px 36px 32px;
//   width: 100%;
//   max-width: 440px;
//   animation: ${slideUp} 0.32s cubic-bezier(0.22, 0.68, 0, 1.2) both;
//   box-shadow:
//     0 40px 100px rgba(0, 0, 0, 0.3),
//     0 2px 8px rgba(0, 0, 0, 0.1);
//   border: 0.5px solid rgba(0, 0, 0, 0.06);
//   font-family: "Outfit", sans-serif;
// `;

// const ModalIconRing = styled.div`
//   width: 72px;
//   height: 72px;
//   border-radius: 50%;
//   background: linear-gradient(135deg, #fef3c7, #fde68a);
//   border: 1.5px solid #fcd34d;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin: 0 auto 22px;
//   font-size: 28px;
//   box-shadow: 0 8px 24px rgba(251, 191, 36, 0.25);
// `;

// const ModalTitle = styled.h2`
//   font-size: 22px;
//   font-weight: 800;
//   color: #0c0f1a;
//   text-align: center;
//   margin: 0 0 8px;
//   letter-spacing: -0.5px;
// `;

// const ModalSub = styled.p`
//   font-size: 13.5px;
//   color: #6b7280;
//   text-align: center;
//   margin: 0 0 28px;
//   line-height: 1.65;
// `;

// const StatRow = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 12px;
//   margin-bottom: 28px;
// `;

// const StatTile = styled.div`
//   background: ${(p) => p.bg || "#f8f9fa"};
//   border: 1.5px solid ${(p) => p.border || "rgba(0,0,0,.07)"};
//   border-radius: 16px;
//   padding: 16px 8px;
//   text-align: center;
//   transition: transform 0.15s;
//   &:hover {
//     transform: translateY(-2px);
//   }
// `;

// const StatVal = styled.div`
//   font-size: 26px;
//   font-weight: 800;
//   color: ${(p) => p.color || "#0c0f1a"};
//   line-height: 1;
//   font-family: "JetBrains Mono", monospace;
// `;
// const StatLabel = styled.div`
//   font-size: 10px;
//   color: #9ca3af;
//   text-transform: uppercase;
//   letter-spacing: 0.8px;
//   margin-top: 5px;
//   font-weight: 600;
// `;

// const ModalDivider = styled.div`
//   height: 0.5px;
//   background: rgba(0, 0, 0, 0.07);
//   margin-bottom: 22px;
// `;

// const ModalBtnRow = styled.div`
//   display: flex;
//   gap: 12px;
// `;

// const ModalBtn = styled.button`
//   flex: 1;
//   padding: 14px;
//   border-radius: 12px;
//   font-size: 14px;
//   font-weight: 700;
//   cursor: pointer;
//   border: none;
//   transition:
//     opacity 0.15s,
//     transform 0.15s,
//     box-shadow 0.15s;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 8px;
//   background: ${(p) => p.bg || "#f3f4f6"};
//   color: ${(p) => p.color || "#374151"};
//   font-family: "Outfit", sans-serif;
//   letter-spacing: 0.1px;
//   &:hover:not(:disabled) {
//     opacity: 0.88;
//     transform: translateY(-1px);
//     box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
//   }
//   &:active:not(:disabled) {
//     transform: translateY(0);
//   }
//   &:disabled {
//     opacity: 0.55;
//     cursor: not-allowed;
//   }
// `;

// const Spinner = styled.svg`
//   animation: ${spin} 0.8s linear infinite;
// `;

// const SubmitConfirmModal = ({ stats, onConfirm, onCancel, submitting }) => (
//   <Overlay
//     onClick={(e) => e.target === e.currentTarget && !submitting && onCancel()}
//   >
//     <ModalBox>
//       <ModalIconRing>📋</ModalIconRing>
//       <ModalTitle>Ready to Submit?</ModalTitle>
//       <ModalSub>
//         Once submitted, your answers are final.
//         <br />
//         Here's a snapshot of your progress.
//       </ModalSub>

//       <StatRow>
//         <StatTile bg="#f0fdf4" border="#86efac">
//           <StatVal color="#16a34a">{stats.attempted}</StatVal>
//           <StatLabel>Answered</StatLabel>
//         </StatTile>
//         <StatTile bg="#fff1f2" border="#fda4af">
//           <StatVal color="#e11d48">{stats.notAnswered}</StatVal>
//           <StatLabel>Skipped</StatLabel>
//         </StatTile>
//         <StatTile bg="#fffbeb" border="#fcd34d">
//           <StatVal color="#d97706">{stats.markedReview}</StatVal>
//           <StatLabel>Review</StatLabel>
//         </StatTile>
//       </StatRow>

//       <ModalDivider />

//       <ModalBtnRow>
//         <ModalBtn onClick={onCancel} disabled={submitting}>
//           ← Go Back
//         </ModalBtn>
//         <ModalBtn
//           bg="linear-gradient(135deg,#16a34a,#15803d)"
//           color="#fff"
//           onClick={onConfirm}
//           disabled={submitting}
//           style={{ boxShadow: "0 4px 16px rgba(22,163,74,.3)" }}
//         >
//           {submitting ? (
//             <>
//               <Spinner
//                 width="15"
//                 height="15"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//               >
//                 <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//               </Spinner>
//               Submitting…
//             </>
//           ) : (
//             <>✓ Confirm Submit</>
//           )}
//         </ModalBtn>
//       </ModalBtnRow>
//     </ModalBox>
//   </Overlay>
// );

// /* ===================== LAYOUT ===================== */

// const PageWrap = styled.div`
//   display: flex;
//   flex-direction: column;
//   min-height: 100vh;
//   background: #0d1117;
//   font-family: "Outfit", sans-serif;
// `;

// const TopBar = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 16px;
//   padding: 14px 28px;
//   background: rgba(255, 255, 255, 0.03);
//   border-bottom: 1px solid rgba(255, 255, 255, 0.07);
//   position: sticky;
//   top: 0;
//   z-index: 100;
//   backdrop-filter: blur(12px);
// `;

// const ProgressWrap = styled.div`
//   flex: 1;
//   height: 5px;
//   background: rgba(255, 255, 255, 0.07);
//   border-radius: 99px;
//   overflow: hidden;
// `;

// const ProgressFill = styled.div`
//   height: 100%;
//   border-radius: 99px;
//   background: linear-gradient(90deg, #3b82f6, #6366f1);
//   transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//   box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
// `;

// const QProgress = styled.div`
//   font-size: 12px;
//   font-weight: 600;
//   color: rgba(255, 255, 255, 0.45);
//   white-space: nowrap;
//   font-family: "JetBrains Mono", monospace;
// `;

// const TimerChip = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 7px;
//   background: ${(p) =>
//     p.warn ? "rgba(239,68,68,.12)" : "rgba(255,255,255,.05)"};
//   border: 1px solid
//     ${(p) => (p.warn ? "rgba(239,68,68,.3)" : "rgba(255,255,255,.1)")};
//   border-radius: 99px;
//   padding: 7px 18px;
//   font-size: 15px;
//   font-weight: 700;
//   color: ${(p) => (p.warn ? "#f87171" : "rgba(255,255,255,.85)")};
//   font-family: "JetBrains Mono", monospace;
//   transition: all 0.3s;
//   animation: ${(p) => (p.warn ? `${timerWarn} 1s ease infinite` : "none")};
// `;

// const TimerDot = styled.div`
//   width: 7px;
//   height: 7px;
//   border-radius: 50%;
//   background: ${(p) => (p.warn ? "#f87171" : "#22c55e")};
//   animation: ${pulse} 1.8s ease infinite;
// `;

// const Content = styled.div`
//   display: flex;
//   flex: 1;
//   overflow: hidden;
// `;

// const QuestionPane = styled.div`
//   flex: 1;
//   padding: 32px 36px;
//   overflow-y: auto;
//   animation: ${slideIn} 0.3s ease both;
// `;

// const QuestionCard = styled.div`
//   background: rgba(255, 255, 255, 0.04);
//   border: 1px solid rgba(255, 255, 255, 0.08);
//   border-radius: 20px;
//   padding: 32px;
//   margin-bottom: 24px;
// `;

// const QuestionMeta = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   margin-bottom: 20px;
// `;

// const QNumBadge = styled.div`
//   background: linear-gradient(135deg, #3b82f6, #6366f1);
//   color: #fff;
//   font-size: 11px;
//   font-weight: 700;
//   padding: 5px 14px;
//   border-radius: 99px;
//   letter-spacing: 0.5px;
//   text-transform: uppercase;
// `;

// const QTypeBadge = styled.div`
//   background: rgba(255, 255, 255, 0.06);
//   border: 1px solid rgba(255, 255, 255, 0.1);
//   color: rgba(255, 255, 255, 0.4);
//   font-size: 11px;
//   font-weight: 600;
//   padding: 5px 12px;
//   border-radius: 99px;
//   text-transform: uppercase;
//   letter-spacing: 0.4px;
// `;

// const QuestionText = styled.h2`
//   font-size: 18px;
//   font-weight: 600;
//   color: rgba(255, 255, 255, 0.92);
//   line-height: 1.65;
//   margin: 0;
//   letter-spacing: -0.1px;
// `;

// const OptionLabel = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 14px;
//   padding: 16px 20px;
//   margin: 10px 0;
//   border: 1.5px solid
//     ${(p) => (p.selected ? "#6366f1" : "rgba(255,255,255,.07)")};
//   border-radius: 14px;
//   cursor: pointer;
//   background: ${(p) =>
//     p.selected ? "rgba(99,102,241,.1)" : "rgba(255,255,255,.02)"};
//   transition: all 0.18s;
//   &:hover {
//     border-color: rgba(99, 102, 241, 0.4);
//     background: rgba(99, 102, 241, 0.05);
//   }
// `;

// const OptionRadio = styled.div`
//   width: 20px;
//   height: 20px;
//   border-radius: ${(p) => (p.multi ? "6px" : "50%")};
//   border: 2px solid ${(p) => (p.selected ? "#6366f1" : "rgba(255,255,255,.2)")};
//   background: ${(p) => (p.selected ? "#6366f1" : "transparent")};
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-shrink: 0;
//   transition: all 0.15s;
// `;

// const OptionCheck = styled.div`
//   width: 9px;
//   height: 9px;
//   border-radius: ${(p) => (p.multi ? "3px" : "50%")};
//   background: #fff;
//   animation: ${popIn} 0.15s ease;
// `;

// const OptionKey = styled.span`
//   width: 28px;
//   height: 28px;
//   border-radius: 8px;
//   background: ${(p) =>
//     p.selected ? "rgba(99,102,241,.2)" : "rgba(255,255,255,.06)"};
//   color: ${(p) => (p.selected ? "#a5b4fc" : "rgba(255,255,255,.35)")};
//   font-size: 12px;
//   font-weight: 700;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-shrink: 0;
//   transition: all 0.15s;
//   font-family: "JetBrains Mono", monospace;
// `;

// const OptionText = styled.span`
//   font-size: 14.5px;
//   color: ${(p) =>
//     p.selected ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.6)"};
//   line-height: 1.5;
//   transition: color 0.15s;
//   flex: 1;
// `;

// const FillInput = styled.input`
//   width: 100%;
//   padding: 14px 18px;
//   background: rgba(255, 255, 255, 0.05);
//   border: 1.5px solid rgba(255, 255, 255, 0.1);
//   border-radius: 12px;
//   color: rgba(255, 255, 255, 0.9);
//   font-size: 15px;
//   font-family: "Outfit", sans-serif;
//   outline: none;
//   transition:
//     border-color 0.15s,
//     box-shadow 0.15s;
//   &:focus {
//     border-color: #6366f1;
//     box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
//   }
//   &::placeholder {
//     color: rgba(255, 255, 255, 0.18);
//   }
// `;

// const ActionBar = styled.div`
//   display: flex;
//   gap: 10px;
//   flex-wrap: wrap;
//   padding-top: 8px;
// `;

// const ActionBtn = styled.button`
//   display: inline-flex;
//   align-items: center;
//   gap: 7px;
//   padding: 11px 20px;
//   border-radius: 11px;
//   font-size: 13px;
//   font-weight: 600;
//   cursor: pointer;
//   font-family: "Outfit", sans-serif;
//   transition: all 0.15s;
//   background: ${(p) => p.bg || "rgba(255,255,255,.06)"};
//   color: ${(p) => p.color || "rgba(255,255,255,.7)"};
//   border: 1px solid ${(p) => p.border || "rgba(255,255,255,.1)"};
//   &:hover:not(:disabled) {
//     filter: brightness(1.15);
//     transform: translateY(-1px);
//     box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
//   }
//   &:active:not(:disabled) {
//     transform: translateY(0);
//   }
//   &:disabled {
//     opacity: 0.3;
//     cursor: not-allowed;
//   }
// `;

// const PalettePane = styled.div`
//   width: 272px;
//   flex-shrink: 0;
//   background: rgba(255, 255, 255, 0.02);
//   border-left: 1px solid rgba(255, 255, 255, 0.06);
//   padding: 24px 18px;
//   overflow-y: auto;
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
// `;

// const PaletteHeader = styled.div`
//   font-size: 10px;
//   font-weight: 700;
//   color: rgba(255, 255, 255, 0.28);
//   text-transform: uppercase;
//   letter-spacing: 1.4px;
//   margin-bottom: 12px;
// `;

// const PaletteGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(5, 1fr);
//   gap: 7px;
// `;

// const PaletteBtn = styled.button`
//   aspect-ratio: 1;
//   border-radius: 9px;
//   font-size: 11px;
//   font-weight: 700;
//   cursor: pointer;
//   border: 2px solid
//     ${(p) => (p.active ? "rgba(255,255,255,.8)" : "transparent")};
//   font-family: "JetBrains Mono", monospace;
//   transition: all 0.15s;
//   box-shadow: ${(p) => (p.active ? "0 0 0 3px rgba(255,255,255,.1)" : "none")};
//   transform: ${(p) => (p.active ? "scale(1.1)" : "scale(1)")};
//   background: ${(p) => {
//     switch (p.status) {
//       case "attempted":
//         return "linear-gradient(135deg,#22c55e,#16a34a)";
//       case "marked_review":
//         return "linear-gradient(135deg,#f59e0b,#d97706)";
//       case "not_answered":
//         return "linear-gradient(135deg,#ef4444,#dc2626)";
//       default:
//         return "rgba(255,255,255,.07)";
//     }
//   }};
//   color: ${(p) => (p.status ? "#fff" : "rgba(255,255,255,.35)")};
//   &:hover {
//     transform: scale(1.12);
//     filter: brightness(1.1);
//   }
// `;

// const LegendItem = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   font-size: 12px;
//   color: rgba(255, 255, 255, 0.45);
//   font-weight: 500;
// `;

// const LegendDot = styled.div`
//   width: 11px;
//   height: 11px;
//   border-radius: 4px;
//   flex-shrink: 0;
//   background: ${(p) => p.color};
// `;

// const PaletteDivider = styled.div`
//   height: 0.5px;
//   background: rgba(255, 255, 255, 0.05);
// `;

// /* ===================== COMPONENT ===================== */
// const ExamAttend = () => {
//   const navigate = useNavigate();
//   const { examId, duration } = useParams();
//   const userId = useSelector((s) => s.auth.user);

//   const [question, setQuestion] = useState({});
//   const [offSet, setOffSet] = useState(0);
//   const [totalQuestions, setTotalQuestions] = useState(0);
//   const [answersMap, setAnswersMap] = useState({});
//   const [visitedSet, setVisitedSet] = useState(new Set([0]));
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [time, setTime] = useState(Number(duration) * 60);
//   const timerRef = useRef(null);

//   const currentAnswer = answersMap[offSet]?.answer || [];
//   const timeWarn = time <= 300;

//   /* ── Timer ── */
//   useEffect(() => {
//     if (timerRef.current) return;
//     timerRef.current = setInterval(() => {
//       setTime((t) => {
//         if (t <= 1) {
//           clearInterval(timerRef.current);
//           autoSubmitExam("Time up! Exam auto-submitted.");
//           return 0;
//         }
//         return t - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timerRef.current);
//   }, []);

//   /* ── Fetch question ── */
//   const getQuestion = async (idx) => {
//     try {
//       const res = await fetch(
//         `https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${idx}`,
//       );
//       const data = await res.json();
//       if (res.ok) {
//         setQuestion(data.questions?.[0] || {});
//         setTotalQuestions(data.totalQuestions || 0);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   };
//   useEffect(() => {
//     getQuestion(offSet);
//   }, [offSet]);

//   /* ── Status helper ── */
//   const getStatus = (i) => {
//     if (answersMap[i]?.status) return answersMap[i].status;
//     if (visitedSet.has(i)) return "not_answered";
//     return undefined;
//   };

//   /* ── Navigation ── */
//   const markVisited = (i) =>
//     setVisitedSet((prev) => {
//       if (prev.has(i)) return prev;
//       const n = new Set(prev);
//       n.add(i);
//       return n;
//     });
//   const goTo = async (i) => {
//     await saveAnswer();
//     setOffSet(i);
//     markVisited(i);
//   };

//   /* ── Handlers ── */
//   const handleAnswer = (val) => {
//     const type = question.questionTypeId;
//     const updated =
//       type === "SINGLE_CHOICE" || type === "TRUE_FALSE"
//         ? [val]
//         : currentAnswer.includes(val)
//           ? currentAnswer.filter((x) => x !== val)
//           : [...currentAnswer, val];
//     setAnswersMap((p) => ({
//       ...p,
//       [offSet]: { answer: updated, status: "attempted" },
//     }));
//   };

//   const handleFill = (val) => {
//     const ok = val.trim() !== "";
//     setAnswersMap((p) => ({
//       ...p,
//       [offSet]: {
//         answer: ok ? [val] : [],
//         status: ok ? "attempted" : "not_answered",
//       },
//     }));
//   };

//   const saveAnswer = async () => {
//     const d = answersMap[offSet] || { answer: [] };
//     if (!d.answer.length) return;
//     await fetch("https://localhost:8443/sphinx/api/user/submited-answer", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         questionId: question.qId,
//         examId,
//         submittedAnswer: d.answer.join(","),
//         sNo: offSet + 1,
//         isFlagged: 1,
//         userLoginId: userId,
//       }),
//     });
//   };

//   const handleNext = async () => {
//     await saveAnswer();
//     if (offSet < totalQuestions - 1) {
//       const n = offSet + 1;
//       setOffSet(n);
//       markVisited(n);
//     }
//   };
//   const handlePrev = async () => {
//     await saveAnswer();
//     if (offSet > 0) {
//       const p = offSet - 1;
//       setOffSet(p);
//       markVisited(p);
//     }
//   };
//   const markReview = () =>
//     setAnswersMap((p) => ({
//       ...p,
//       [offSet]: { answer: currentAnswer, status: "marked_review" },
//     }));

//   /* ── Submit ── */
//   const autoSubmitExam = async (msg) => {
//     try {
//       await saveAnswer();
//       const res = await fetch(
//         "https://localhost:8443/sphinx/api/user/submit-final",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ examId, userLoginId: userId }),
//         },
//       );
//       const data = await res.json();
//       if (!res.ok) toast.error(data.error);
//       else {
//         toast.success(msg);
//         navigate(`/examresult/${examId}/${userId}/${data.skipped}`);
//       }
//     } catch {
//       toast.error("Auto submit failed");
//     }
//   };

//   const handleSubmitExam = async () => {
//     await saveAnswer();
//     setShowConfirm(true);
//   };

//   const confirmSubmit = async () => {
//     setSubmitting(true);
//     try {
//       const res = await fetch(
//         "https://localhost:8443/sphinx/api/user/submit-final",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ examId, userLoginId: userId }),
//         },
//       );
//       const data = await res.json();
//       if (!res.ok) {
//         toast.error(data.error);
//         setSubmitting(false);
//         setShowConfirm(false);
//       } else {
//         toast.success(data.success || "Exam submitted successfully!");
//         navigate(`/examresult/${examId}/${userId}/${data.skipped}`);
//       }
//     } catch {
//       toast.error("Submission failed. Please try again.");
//       setSubmitting(false);
//     }
//   };

//   const getSubmitStats = () => {
//     let attempted = 0,
//       notAnswered = 0,
//       markedReview = 0;
//     for (let i = 0; i < totalQuestions; i++) {
//       const s = answersMap[i]?.status;
//       if (s === "attempted") attempted++;
//       else if (s === "marked_review") markedReview++;
//       else if (visitedSet.has(i)) notAnswered++;
//     }
//     return { attempted, notAnswered, markedReview };
//   };

//   const formatTime = () => {
//     const m = Math.floor(time / 60),
//       s = time % 60;
//     return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
//   };

//   const renderOptions = () => {
//     const type = question.questionTypeId;
//     const isMulti = type === "MULTI_CHOICE";

//     if (type === "FILL_BLANK") {
//       return (
//         <FillInput
//           placeholder="Type your answer here…"
//           value={currentAnswer[0] || ""}
//           onChange={(e) => handleFill(e.target.value)}
//         />
//       );
//     }

//     const opts =
//       type === "TRUE_FALSE"
//         ? [
//             { key: "T", label: "True", val: "True" },
//             { key: "F", label: "False", val: "False" },
//           ]
//         : ["A", "B", "C", "D"].map((k) => ({
//             key: k,
//             label: question[`option${k}`] || k,
//             val: k,
//           }));

//     return opts.map(({ key, label, val }) => {
//       const selected = currentAnswer.includes(val);
//       return (
//         <OptionLabel
//           key={key}
//           selected={selected}
//           onClick={() => handleAnswer(val)}
//         >
//           <OptionRadio selected={selected} multi={isMulti}>
//             {selected && <OptionCheck multi={isMulti} />}
//           </OptionRadio>
//           <OptionKey selected={selected}>{key}</OptionKey>
//           <OptionText selected={selected}>{label}</OptionText>
//         </OptionLabel>
//       );
//     });
//   };

//   const progress = totalQuestions ? ((offSet + 1) / totalQuestions) * 100 : 0;
//   const attempted = Object.values(answersMap).filter(
//     (v) => v.status === "attempted",
//   ).length;

//   return (
//     <>
//       <GlobalStyle />
//       <PageWrap>
//         <UserHeader />

//         {showConfirm && (
//           <SubmitConfirmModal
//             stats={getSubmitStats()}
//             onConfirm={confirmSubmit}
//             onCancel={() => setShowConfirm(false)}
//             submitting={submitting}
//           />
//         )}

//         {/* ── Top progress bar ── */}
//         <TopBar>
//           <QProgress>
//             {offSet + 1}&nbsp;/&nbsp;{totalQuestions || "—"}
//           </QProgress>
//           <ProgressWrap>
//             <ProgressFill style={{ width: `${progress}%` }} />
//           </ProgressWrap>
//           <QProgress style={{ color: "rgba(255,255,255,.25)" }}>
//             {attempted} answered
//           </QProgress>
//           <TimerChip warn={timeWarn}>
//             <TimerDot warn={timeWarn} />
//             {formatTime()}
//           </TimerChip>
//         </TopBar>

//         {/* ── Main ── */}
//         <Content>
//           {/* ── Question pane ── */}
//           <QuestionPane>
//             <QuestionCard>
//               <QuestionMeta>
//                 <QNumBadge>Question {offSet + 1}</QNumBadge>
//                 {question.questionTypeId && (
//                   <QTypeBadge>
//                     {question.questionTypeId.replace(/_/g, " ")}
//                   </QTypeBadge>
//                 )}
//               </QuestionMeta>
//               <QuestionText>
//                 {question.questionDetail || "Loading question…"}
//               </QuestionText>
//             </QuestionCard>

//             <div style={{ marginBottom: 28 }}>{renderOptions()}</div>

//             <ActionBar>
//               <ActionBtn onClick={handlePrev} disabled={offSet === 0}>
//                 ← Prev
//               </ActionBtn>
//               <ActionBtn
//                 onClick={handleNext}
//                 disabled={offSet >= totalQuestions - 1}
//                 bg="rgba(59,130,246,.14)"
//                 color="#93c5fd"
//                 border="rgba(59,130,246,.28)"
//               >
//                 Save & Next →
//               </ActionBtn>
//               <ActionBtn
//                 onClick={markReview}
//                 bg="rgba(245,158,11,.1)"
//                 color="#fcd34d"
//                 border="rgba(245,158,11,.2)"
//               >
//                 🚩 Mark Review
//               </ActionBtn>
//               <ActionBtn
//                 onClick={handleSubmitExam}
//                 bg="rgba(34,197,94,.12)"
//                 color="#86efac"
//                 border="rgba(34,197,94,.22)"
//                 style={{ marginLeft: "auto" }}
//               >
//                 ✓ Submit Exam
//               </ActionBtn>
//             </ActionBar>
//           </QuestionPane>

//           {/* ── Palette pane ── */}
//           <PalettePane>
//             <div>
//               <PaletteHeader>Question Map</PaletteHeader>
//               <PaletteGrid>
//                 {Array.from({ length: totalQuestions }).map((_, i) => (
//                   <PaletteBtn
//                     key={i}
//                     status={getStatus(i)}
//                     active={i === offSet}
//                     onClick={() => goTo(i)}
//                     title={`Question ${i + 1}`}
//                   >
//                     {i + 1}
//                   </PaletteBtn>
//                 ))}
//               </PaletteGrid>
//             </div>

//             <PaletteDivider />

//             <div>
//               <PaletteHeader>Legend</PaletteHeader>
//               <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
//                 <LegendItem>
//                   <LegendDot color="linear-gradient(135deg,#22c55e,#16a34a)" />
//                   Answered
//                 </LegendItem>
//                 <LegendItem>
//                   <LegendDot color="linear-gradient(135deg,#ef4444,#dc2626)" />
//                   Not Answered
//                 </LegendItem>
//                 <LegendItem>
//                   <LegendDot color="linear-gradient(135deg,#f59e0b,#d97706)" />
//                   Marked Review
//                 </LegendItem>
//                 <LegendItem>
//                   <LegendDot color="rgba(255,255,255,.1)" />
//                   Not Visited
//                 </LegendItem>
//               </div>
//             </div>

//             <PaletteDivider />

//             <div>
//               <PaletteHeader>Progress</PaletteHeader>
//               <div
//                 style={{ display: "flex", flexDirection: "column", gap: 10 }}
//               >
//                 {[
//                   {
//                     label: "Answered",
//                     val: Object.values(answersMap).filter(
//                       (v) => v.status === "attempted",
//                     ).length,
//                     color: "#22c55e",
//                   },
//                   {
//                     label: "Skipped",
//                     val: [...visitedSet].filter(
//                       (i) =>
//                         !answersMap[i] || answersMap[i].answer.length === 0,
//                     ).length,
//                     color: "#ef4444",
//                   },
//                   {
//                     label: "Review",
//                     val: Object.values(answersMap).filter(
//                       (v) => v.status === "marked_review",
//                     ).length,
//                     color: "#f59e0b",
//                   },
//                 ].map(({ label, val, color }) => (
//                   <div
//                     key={label}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <span
//                       style={{
//                         fontSize: 12,
//                         color: "rgba(255,255,255,.38)",
//                         fontWeight: 500,
//                       }}
//                     >
//                       {label}
//                     </span>
//                     <span
//                       style={{
//                         fontSize: 14,
//                         fontWeight: 700,
//                         color,
//                         fontFamily: "'JetBrains Mono',monospace",
//                       }}
//                     >
//                       {val}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </PalettePane>
//         </Content>
//       </PageWrap>
//     </>
//   );
// };

// export default ExamAttend;

import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import UserHeader from "../user/UserHeader";

/* ===================== GLOBAL STYLES ===================== */
export const GlobalStyle = createGlobalStyle`
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
    --gray-50:   #F7F6F2;
    --gray-100:  #EEEDE8;
    --gray-200:  #D3D1C7;
    --gray-400:  #888780;
    --gray-600:  #5F5E5A;
    --gray-800:  #2C2C2A;
    --font:      'Sora', sans-serif;
    --mono:      'DM Mono', monospace;
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
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp = keyframes`from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}`;
const slideIn = keyframes`from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}`;
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.35}`;
const popIn = keyframes`from{opacity:0;transform:scale(.75)}to{opacity:1;transform:scale(1)}`;
const timerWarn = keyframes`0%,100%{color:var(--red-600)}50%{color:#c94040}`;

/* ===================== SUBMIT MODAL ===================== */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(44, 44, 42, 0.38);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease;
  padding: 16px;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 40px 36px 32px;
  width: 100%;
  max-width: 440px;
  animation: ${slideUp} 0.3s cubic-bezier(0.22, 0.68, 0, 1.2) both;
  box-shadow:
    0 32px 80px rgba(44, 44, 42, 0.18),
    0 2px 8px rgba(44, 44, 42, 0.06);
  border: 1px solid var(--gray-200);
  font-family: var(--font);
`;

const ModalIconRing = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: var(--blue-50);
  border: 1.5px solid var(--blue-100);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 26px;
`;

const ModalTitle = styled.h2`
  font-size: 21px;
  font-weight: 800;
  color: var(--gray-800);
  text-align: center;
  margin: 0 0 8px;
  letter-spacing: -0.5px;
`;

const ModalSub = styled.p`
  font-size: 13px;
  color: var(--gray-400);
  text-align: center;
  margin: 0 0 26px;
  line-height: 1.7;
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 26px;
`;

const StatTile = styled.div`
  background: ${(p) => p.bg || "var(--gray-50)"};
  border: 1.5px solid ${(p) => p.border || "var(--gray-200)"};
  border-radius: var(--radius-md);
  padding: 16px 8px;
  text-align: center;
  transition: transform 0.15s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatVal = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: ${(p) => p.color || "var(--gray-800)"};
  line-height: 1;
  font-family: var(--mono);
`;
const StatLabel = styled.div`
  font-size: 10px;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 5px;
  font-weight: 600;
`;

const ModalDivider = styled.div`
  height: 1px;
  background: var(--gray-100);
  margin-bottom: 22px;
`;

const ModalBtnRow = styled.div`
  display: flex;
  gap: 10px;
`;

const ModalBtn = styled.button`
  flex: 1;
  padding: 13px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: 1.5px solid ${(p) => (p.primary ? "transparent" : "var(--gray-200)")};
  background: ${(p) =>
    p.primary
      ? "linear-gradient(135deg, var(--green-600), var(--green-800))"
      : "var(--gray-50)"};
  color: ${(p) => (p.primary ? "#fff" : "var(--gray-600)")};
  font-family: var(--font);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s;
  box-shadow: ${(p) =>
    p.primary ? "0 4px 16px rgba(59,109,17,0.22)" : "none"};
  &:hover:not(:disabled) {
    opacity: 0.88;
    transform: translateY(-1px);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Spinner = styled.svg`
  animation: ${spin} 0.8s linear infinite;
`;

const SubmitConfirmModal = ({ stats, onConfirm, onCancel, submitting }) => (
  <Overlay
    onClick={(e) => e.target === e.currentTarget && !submitting && onCancel()}
  >
    <ModalBox>
      <ModalIconRing>📋</ModalIconRing>
      <ModalTitle>Ready to Submit?</ModalTitle>
      <ModalSub>
        Once submitted, your answers are final.
        <br />
        Here's a snapshot of your progress.
      </ModalSub>

      <StatRow>
        <StatTile bg="var(--green-50)" border="var(--green-100)">
          <StatVal color="var(--green-600)">{stats.attempted}</StatVal>
          <StatLabel>Answered</StatLabel>
        </StatTile>
        <StatTile bg="var(--red-50)" border="var(--red-100)">
          <StatVal color="var(--red-600)">{stats.notAnswered}</StatVal>
          <StatLabel>Skipped</StatLabel>
        </StatTile>
        <StatTile bg="var(--amber-50)" border="var(--amber-100)">
          <StatVal color="var(--amber-600)">{stats.markedReview}</StatVal>
          <StatLabel>Review</StatLabel>
        </StatTile>
      </StatRow>

      <ModalDivider />

      <ModalBtnRow>
        <ModalBtn onClick={onCancel} disabled={submitting}>
          ← Go Back
        </ModalBtn>
        <ModalBtn primary onClick={onConfirm} disabled={submitting}>
          {submitting ? (
            <>
              <Spinner
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </Spinner>
              Submitting…
            </>
          ) : (
            <>✓ Confirm Submit</>
          )}
        </ModalBtn>
      </ModalBtnRow>
    </ModalBox>
  </Overlay>
);

/* ===================== LAYOUT ===================== */
const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f4ef;
  font-family: var(--font);
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 58px;
  background: #fff;
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const ExamLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: var(--gray-800);
  letter-spacing: -0.2px;
  white-space: nowrap;
  span {
    color: var(--blue-600);
  }
`;

const ProgressWrap = styled.div`
  flex: 1;
  height: 4px;
  background: var(--gray-100);
  border-radius: 99px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--blue-400), var(--blue-600));
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const QCounter = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-400);
  white-space: nowrap;
  font-family: var(--mono);
`;

const TimerChip = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  background: ${(p) => (p.warn ? "var(--red-50)" : "var(--green-50)")};
  border: 1px solid ${(p) => (p.warn ? "var(--red-100)" : "var(--green-100)")};
  border-radius: 99px;
  padding: 6px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${(p) => (p.warn ? "var(--red-600)" : "var(--green-600)")};
  font-family: var(--mono);
  white-space: nowrap;
  transition: all 0.3s;
  animation: ${(p) => (p.warn ? `${timerWarn} 1.2s ease infinite` : "none")};
`;

const TimerDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${(p) => (p.warn ? "var(--red-200)" : "var(--green-100)")};
  animation: ${pulse} 1.8s ease infinite;
`;

const SubmitTopBtn = styled.button`
  background: var(--blue-600);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  padding: 8px 18px;
  font-size: 12.5px;
  font-weight: 700;
  font-family: var(--font);
  cursor: pointer;
  letter-spacing: 0.1px;
  white-space: nowrap;
  transition:
    background 0.15s,
    transform 0.1s;
  &:hover {
    background: var(--blue-800);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

/* ===================== QUESTION PANE ===================== */
const QuestionPane = styled.div`
  flex: 1;
  padding: 28px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${slideIn} 0.3s ease both;
`;

const QuestionCard = styled.div`
  background: #fff;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 28px;
`;

const QuestionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const QNumBadge = styled.div`
  background: var(--blue-50);
  color: var(--blue-600);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 99px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: 1px solid var(--blue-100);
`;

const QTypeBadge = styled.div`
  background: var(--gray-100);
  color: var(--gray-600);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 11px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const QMarksBadge = styled.div`
  margin-left: auto;
  background: var(--amber-50);
  color: var(--amber-600);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 11px;
  border-radius: 99px;
  border: 1px solid var(--amber-100);
`;

const QuestionText = styled.h2`
  font-size: 16.5px;
  font-weight: 500;
  color: var(--gray-800);
  line-height: 1.7;
  margin: 0;
  letter-spacing: -0.1px;
`;

/* ===================== OPTIONS ===================== */
const OptionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  margin: 0;
  border: 1.5px solid
    ${(p) => (p.selected ? "var(--blue-400)" : "var(--gray-200)")};
  border-radius: var(--radius-md);
  cursor: pointer;
  background: ${(p) => (p.selected ? "var(--blue-50)" : "#fff")};
  transition: all 0.18s;
  &:hover {
    border-color: ${(p) =>
      p.selected ? "var(--blue-400)" : "var(--blue-200)"};
    background: ${(p) => (p.selected ? "var(--blue-50)" : "var(--blue-50)")};
  }
`;

const OptionRadio = styled.div`
  width: 20px;
  height: 20px;
  border-radius: ${(p) => (p.multi ? "6px" : "50%")};
  border: 2px solid
    ${(p) => (p.selected ? "var(--blue-400)" : "var(--gray-200)")};
  background: ${(p) => (p.selected ? "var(--blue-400)" : "#fff")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
`;

const OptionDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: ${(p) => (p.multi ? "3px" : "50%")};
  background: #fff;
  animation: ${popIn} 0.15s ease;
`;

const OptionKey = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${(p) => (p.selected ? "var(--blue-100)" : "var(--gray-100)")};
  color: ${(p) => (p.selected ? "var(--blue-800)" : "var(--gray-600)")};
  font-size: 12px;
  font-weight: 700;
  font-family: var(--mono);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
`;

const OptionText = styled.span`
  font-size: 14px;
  color: ${(p) => (p.selected ? "var(--gray-800)" : "var(--gray-600)")};
  font-weight: ${(p) => (p.selected ? "500" : "400")};
  line-height: 1.55;
  transition: all 0.15s;
  flex: 1;
`;

const OptionsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FillInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  background: #fff;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
  color: var(--gray-800);
  font-size: 15px;
  font-family: var(--font);
  outline: none;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  &:focus {
    border-color: var(--blue-400);
    box-shadow: 0 0 0 3px var(--blue-50);
  }
  &::placeholder {
    color: var(--gray-200);
  }
`;

/* ===================== ACTION BAR ===================== */
const ActionBar = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 18px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font);
  transition: all 0.15s;
  background: ${(p) => p.bg || "#fff"};
  color: ${(p) => p.color || "var(--gray-600)"};
  border: 1.5px solid ${(p) => p.border || "var(--gray-200)"};
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(44, 44, 42, 0.1);
    filter: brightness(0.97);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

/* ===================== PALETTE PANE ===================== */
const PalettePane = styled.div`
  width: 260px;
  flex-shrink: 0;
  background: #fff;
  border-left: 1px solid var(--gray-200);
  padding: 22px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PaletteHeader = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 1.4px;
  margin-bottom: 12px;
`;

const PaletteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
`;

const PaletteBtn = styled.button`
  aspect-ratio: 1;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
  font-family: var(--mono);
  cursor: pointer;
  transition: all 0.15s;
  border: 2px solid ${(p) => (p.active ? "var(--blue-400)" : "transparent")};
  box-shadow: ${(p) => (p.active ? "0 0 0 3px var(--blue-50)" : "none")};
  transform: ${(p) => (p.active ? "scale(1.12)" : "scale(1)")};
  background: ${(p) => {
    switch (p.status) {
      case "attempted":
        return "var(--green-50)";
      case "marked_review":
        return "var(--amber-50)";
      case "not_answered":
        return "var(--red-50)";
      default:
        return "var(--gray-100)";
    }
  }};
  color: ${(p) => {
    switch (p.status) {
      case "attempted":
        return "var(--green-600)";
      case "marked_review":
        return "var(--amber-600)";
      case "not_answered":
        return "var(--red-600)";
      default:
        return "var(--gray-400)";
    }
  }};
  outline: 1.5px solid
    ${(p) => {
      switch (p.status) {
        case "attempted":
          return "var(--green-100)";
        case "marked_review":
          return "var(--amber-100)";
        case "not_answered":
          return "var(--red-100)";
        default:
          return "var(--gray-200)";
      }
    }};
  &:hover {
    transform: scale(1.12);
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  color: var(--gray-600);
  font-weight: 500;
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 4px;
  flex-shrink: 0;
  background: ${(p) => p.bg};
  border: 1.5px solid ${(p) => p.border};
`;

const PaletteDivider = styled.div`
  height: 1px;
  background: var(--gray-100);
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 10px;
  background: var(--gray-50);
  border: 1px solid var(--gray-100);
`;

const StatItemLabel = styled.span`
  font-size: 12px;
  color: var(--gray-600);
  font-weight: 500;
`;
const StatItemVal = styled.span`
  font-size: 15px;
  font-weight: 700;
  font-family: var(--mono);
  color: ${(p) => p.color};
`;

/* ===================== COMPONENT ===================== */
const ExamAttend = () => {
  const navigate = useNavigate();
  const { examId, duration } = useParams();
  const userId = useSelector((s) => s.auth.user);

  const [question, setQuestion] = useState({});
  const [offSet, setOffSet] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [visitedSet, setVisitedSet] = useState(new Set([0]));
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [time, setTime] = useState(Number(duration) * 60);
  const timerRef = useRef(null);

  const currentAnswer = answersMap[offSet]?.answer || [];
  const timeWarn = time <= 300;

  /* ── Timer ── */
  useEffect(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          autoSubmitExam("Time up! Exam auto-submitted.");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  /* ── Fetch question ── */
  const getQuestion = async (idx) => {
    try {
      const res = await fetch(
        `https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${idx}`,
      );
      const data = await res.json();
      if (res.ok) {
        setQuestion(data.questions?.[0] || {});
        setTotalQuestions(data.totalQuestions || 0);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getQuestion(offSet);
  }, [offSet]);

  /* ── Status helper ── */
  const getStatus = (i) => {
    if (answersMap[i]?.status) return answersMap[i].status;
    if (visitedSet.has(i)) return "not_answered";
    return undefined;
  };

  /* ── Navigation ── */
  const markVisited = (i) =>
    setVisitedSet((prev) => {
      if (prev.has(i)) return prev;
      const n = new Set(prev);
      n.add(i);
      return n;
    });

  const goTo = async (i) => {
    await saveAnswer();
    setOffSet(i);
    markVisited(i);
  };

  /* ── Handlers ── */
  const handleAnswer = (val) => {
    const type = question.questionTypeId;
    const updated =
      type === "SINGLE_CHOICE" || type === "TRUE_FALSE"
        ? [val]
        : currentAnswer.includes(val)
          ? currentAnswer.filter((x) => x !== val)
          : [...currentAnswer, val];
    setAnswersMap((p) => ({
      ...p,
      [offSet]: { answer: updated, status: "attempted" },
    }));
  };

  const handleFill = (val) => {
    const ok = val.trim() !== "";
    setAnswersMap((p) => ({
      ...p,
      [offSet]: {
        answer: ok ? [val] : [],
        status: ok ? "attempted" : "not_answered",
      },
    }));
  };

  const saveAnswer = async () => {
    const d = answersMap[offSet] || { answer: [] };
    if (!d.answer.length) return;
    await fetch("https://localhost:8443/sphinx/api/user/submited-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: question.qId,
        examId,
        submittedAnswer: d.answer.join(","),
        sNo: offSet + 1,
        isFlagged: 1,
        userLoginId: userId,
      }),
    });
  };

  const handleNext = async () => {
    await saveAnswer();
    if (offSet < totalQuestions - 1) {
      const n = offSet + 1;
      setOffSet(n);
      markVisited(n);
    }
  };
  const handlePrev = async () => {
    await saveAnswer();
    if (offSet > 0) {
      const p = offSet - 1;
      setOffSet(p);
      markVisited(p);
    }
  };
  const markReview = () =>
    setAnswersMap((p) => ({
      ...p,
      [offSet]: { answer: currentAnswer, status: "marked_review" },
    }));

  const clearAnswer = () =>
    setAnswersMap((p) => ({
      ...p,
      [offSet]: { answer: [], status: "not_answered" },
    }));

  /* ── Submit ── */
  const autoSubmitExam = async (msg) => {
    try {
      await saveAnswer();
      const res = await fetch(
        "https://localhost:8443/sphinx/api/user/submit-final",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId, userLoginId: userId }),
        },
      );
      const data = await res.json();
      if (!res.ok) toast.error(data.error);
      else {
        toast.success(msg);
        navigate(`/examresult/${examId}/${userId}/${data.skipped}`);
      }
    } catch {
      toast.error("Auto submit failed");
    }
  };

  const handleSubmitExam = async () => {
    await saveAnswer();
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(
        "https://localhost:8443/sphinx/api/user/submit-final",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId, userLoginId: userId }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        setSubmitting(false);
        setShowConfirm(false);
      } else {
        toast.success(data.success || "Exam submitted successfully!");
        navigate(`/examresult/${examId}/${userId}/${data.skipped}`);
      }
    } catch {
      toast.error("Submission failed. Please try again.");
      setSubmitting(false);
    }
  };

  const getSubmitStats = () => {
    let attempted = 0,
      notAnswered = 0,
      markedReview = 0;
    for (let i = 0; i < totalQuestions; i++) {
      const s = answersMap[i]?.status;
      if (s === "attempted") attempted++;
      else if (s === "marked_review") markedReview++;
      else if (visitedSet.has(i)) notAnswered++;
    }
    return { attempted, notAnswered, markedReview };
  };

  const formatTime = () => {
    const m = Math.floor(time / 60),
      s = time % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const renderOptions = () => {
    const type = question.questionTypeId;
    const isMulti = type === "MULTI_CHOICE";

    if (type === "FILL_BLANK") {
      return (
        <FillInput
          placeholder="Type your answer here…"
          value={currentAnswer[0] || ""}
          onChange={(e) => handleFill(e.target.value)}
        />
      );
    }

    const opts =
      type === "TRUE_FALSE"
        ? [
            { key: "T", label: "True", val: "True" },
            { key: "F", label: "False", val: "False" },
          ]
        : ["A", "B", "C", "D"].map((k) => ({
            key: k,
            label: question[`option${k}`] || k,
            val: k,
          }));

    return (
      <OptionsWrap>
        {opts.map(({ key, label, val }) => {
          const selected = currentAnswer.includes(val);
          return (
            <OptionLabel
              key={key}
              selected={selected}
              onClick={() => handleAnswer(val)}
            >
              <OptionRadio selected={selected} multi={isMulti}>
                {selected && <OptionDot multi={isMulti} />}
              </OptionRadio>
              <OptionKey selected={selected}>{key}</OptionKey>
              <OptionText selected={selected}>{label}</OptionText>
            </OptionLabel>
          );
        })}
      </OptionsWrap>
    );
  };

  const progress = totalQuestions ? ((offSet + 1) / totalQuestions) * 100 : 0;
  const attempted = Object.values(answersMap).filter(
    (v) => v.status === "attempted",
  ).length;
  const skipped = [...visitedSet].filter(
    (i) => !answersMap[i] || answersMap[i].answer.length === 0,
  ).length;
  const review = Object.values(answersMap).filter(
    (v) => v.status === "marked_review",
  ).length;

  return (
    <>
      <GlobalStyle />
      <PageWrap>
        <UserHeader />

        {showConfirm && (
          <SubmitConfirmModal
            stats={getSubmitStats()}
            onConfirm={confirmSubmit}
            onCancel={() => setShowConfirm(false)}
            submitting={submitting}
          />
        )}

        {/* ── Top Bar ── */}
        <TopBar>
          <ExamLabel>
            Exam <span>#{examId}</span>
          </ExamLabel>
          <ProgressWrap>
            <ProgressFill style={{ width: `${progress}%` }} />
          </ProgressWrap>
          <QCounter>
            {offSet + 1}&nbsp;/&nbsp;{totalQuestions || "—"}
          </QCounter>
          <TimerChip warn={timeWarn}>
            <TimerDot warn={timeWarn} />
            {formatTime()}
          </TimerChip>
          <SubmitTopBtn onClick={handleSubmitExam}>Submit Exam</SubmitTopBtn>
        </TopBar>

        {/* ── Main Content ── */}
        <Content>
          {/* ── Question Pane ── */}
          <QuestionPane>
            <QuestionCard>
              <QuestionMeta>
                <QNumBadge>Question {offSet + 1}</QNumBadge>
                {question.questionTypeId && (
                  <QTypeBadge>
                    {question.questionTypeId.replace(/_/g, " ")}
                  </QTypeBadge>
                )}
                <QMarksBadge>+2 / –0.67</QMarksBadge>
              </QuestionMeta>
              <QuestionText>
                {question.questionDetail || "Loading question…"}
              </QuestionText>
            </QuestionCard>

            {renderOptions()}

            <ActionBar>
              <ActionBtn onClick={handlePrev} disabled={offSet === 0}>
                ← Prev
              </ActionBtn>

              <ActionBtn
                onClick={handleNext}
                disabled={offSet >= totalQuestions - 1}
                bg="var(--blue-50)"
                color="var(--blue-600)"
                border="var(--blue-100)"
              >
                Save &amp; Next →
              </ActionBtn>

              <ActionBtn
                onClick={markReview}
                bg="var(--amber-50)"
                color="var(--amber-600)"
                border="var(--amber-100)"
              >
                🚩 Mark Review
              </ActionBtn>

              <ActionBtn
                onClick={clearAnswer}
                bg="var(--red-50)"
                color="var(--red-600)"
                border="var(--red-100)"
              >
                ✕ Clear
              </ActionBtn>

              <ActionBtn
                onClick={handleSubmitExam}
                bg="var(--green-50)"
                color="var(--green-600)"
                border="var(--green-100)"
                style={{ marginLeft: "auto" }}
              >
                ✓ Submit
              </ActionBtn>
            </ActionBar>
          </QuestionPane>

          {/* ── Palette Pane ── */}
          <PalettePane>
            <div>
              <PaletteHeader>Question Map</PaletteHeader>
              <PaletteGrid>
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <PaletteBtn
                    key={i}
                    status={getStatus(i)}
                    active={i === offSet}
                    onClick={() => goTo(i)}
                    title={`Question ${i + 1}`}
                  >
                    {i + 1}
                  </PaletteBtn>
                ))}
              </PaletteGrid>
            </div>

            <PaletteDivider />

            <div>
              <PaletteHeader>Legend</PaletteHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <LegendItem>
                  <LegendDot bg="var(--green-50)" border="var(--green-100)" />
                  Answered
                </LegendItem>
                <LegendItem>
                  <LegendDot bg="var(--red-50)" border="var(--red-100)" />
                  Not Answered
                </LegendItem>
                <LegendItem>
                  <LegendDot bg="var(--amber-50)" border="var(--amber-100)" />
                  Marked Review
                </LegendItem>
                <LegendItem>
                  <LegendDot bg="var(--gray-100)" border="var(--gray-200)" />
                  Not Visited
                </LegendItem>
              </div>
            </div>

            <PaletteDivider />

            <div>
              <PaletteHeader>Progress</PaletteHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <StatItem>
                  <StatItemLabel>Answered</StatItemLabel>
                  <StatItemVal color="var(--green-600)">
                    {attempted}
                  </StatItemVal>
                </StatItem>
                <StatItem>
                  <StatItemLabel>Skipped</StatItemLabel>
                  <StatItemVal color="var(--red-600)">{skipped}</StatItemVal>
                </StatItem>
                <StatItem>
                  <StatItemLabel>Review</StatItemLabel>
                  <StatItemVal color="var(--amber-600)">{review}</StatItemVal>
                </StatItem>
                <StatItem>
                  <StatItemLabel>Not Visited</StatItemLabel>
                  <StatItemVal color="var(--gray-400)">
                    {totalQuestions - visitedSet.size}
                  </StatItemVal>
                </StatItem>
              </div>
            </div>
          </PalettePane>
        </Content>
      </PageWrap>
    </>
  );
};

export default ExamAttend;
