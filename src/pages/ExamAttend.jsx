// // // // import React, { useEffect, useState } from "react";
// // // // import styled from "styled-components";
// // // // import { useSelector } from "react-redux";
// // // // import { useParams } from "react-router-dom";
// // // // import { toast } from "sonner";

// // // // /* ================== STYLES ================== */

// // // // const Layout = styled.div`
// // // //   display: flex;
// // // //   gap: 20px;
// // // //   padding: 20px;
// // // // `;

// // // // const Left = styled.div`
// // // //   flex: 3;
// // // // `;

// // // // const Right = styled.div`
// // // //   flex: 1;
// // // //   background: #f4f6f8;
// // // //   padding: 15px;
// // // //   border-radius: 10px;
// // // // `;

// // // // const Box = styled.div`
// // // //   background: white;
// // // //   padding: 20px;
// // // //   border-radius: 10px;
// // // // `;

// // // // const Option = styled.label`
// // // //   display: block;
// // // //   padding: 10px;
// // // //   margin: 8px 0;
// // // //   border: 1px solid #ddd;
// // // //   border-radius: 6px;
// // // //   cursor: pointer;
// // // // `;

// // // // const Button = styled.button`
// // // //   margin: 8px 5px 0 0;
// // // //   padding: 10px 15px;
// // // //   border: none;
// // // //   border-radius: 6px;
// // // //   cursor: pointer;
// // // //   background: ${(p) => p.bg || "#007bff"};
// // // //   color: white;

// // // //   &:disabled {
// // // //     background: #ccc;
// // // //     cursor: not-allowed;
// // // //   }
// // // // `;

// // // // const Palette = styled.div`
// // // //   display: grid;
// // // //   grid-template-columns: repeat(5, 1fr);
// // // //   gap: 8px;
// // // // `;

// // // // const QBtn = styled.button`
// // // //   padding: 10px;
// // // //   border: none;
// // // //   border-radius: 6px;
// // // //   color: white;
// // // //   cursor: pointer;

// // // //   background: ${(p) => {
// // // //     switch (p.status) {
// // // //       case "attempted":
// // // //         return "#28a745";
// // // //       case "not_answered":
// // // //         return "#dc3545";
// // // //       case "marked_review":
// // // //         return "#ffc107";
// // // //       default:
// // // //         return "#6c757d";
// // // //     }
// // // //   }};
// // // // `;

// // // // /* ================== COMPONENT ================== */

// // // // const ExamAttend = () => {
// // // //   const { examId } = useParams();
// // // //   const userId = useSelector((state) => state.auth.user);

// // // //   const [question, setQuestion] = useState({});
// // // //   const [offSet, setOffSet] = useState(0);
// // // //   const [totalQuestions, setTotalQuestions] = useState(0);

// // // //   const [answersMap, setAnswersMap] = useState({});

// // // //   const currentQ = question;
// // // //   const currentAnswer = answersMap[currentQ.qId]?.answer || [];

// // // //   /* ================== FETCH QUESTION ================== */

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

// // // //   /* ================== ANSWER HANDLING ================== */

// // // //   const handleAnswer = (val) => {
// // // //     const type = currentQ.questionTypeId;

// // // //     let updated = [];

// // // //     if (type === "SINGLE_CHOICE" || type === "TRUE_FALSE") {
// // // //       updated = [val];
// // // //     } else if (type === "MULTI_CHOICE") {
// // // //       updated = currentAnswer.includes(val)
// // // //         ? currentAnswer.filter((x) => x !== val)
// // // //         : [...currentAnswer, val];
// // // //     }

// // // //     setAnswersMap((prev) => ({
// // // //       ...prev,
// // // //       [currentQ.qId]: {
// // // //         answer: updated,
// // // //         status: "attempted",
// // // //       },
// // // //     }));
// // // //   };

// // // //   const handleFill = (val) => {
// // // //     setAnswersMap((prev) => ({
// // // //       ...prev,
// // // //       [currentQ.qId]: {
// // // //         answer: val ? [val] : [],
// // // //         status: "attempted",
// // // //       },
// // // //     }));
// // // //   };

// // // //   /* ================== NAVIGATION ================== */

// // // //   const handleNext = async () => {
// // // //     const data = answersMap[currentQ.qId];

// // // //     // mark not answered if empty
// // // //     if (!data || data.answer.length === 0) {
// // // //       setAnswersMap((prev) => ({
// // // //         ...prev,
// // // //         [currentQ.qId]: {
// // // //           answer: [],
// // // //           status: "not_answered",
// // // //         },
// // // //       }));
// // // //     }

// // // //     // submit answer
// // // //     await fetch("https://localhost:8443/sphinx/api/user/submited-answer", {
// // // //       method: "POST",
// // // //       headers: { "Content-Type": "application/json" },
// // // //       body: JSON.stringify({
// // // //         questionId: currentQ.qId,
// // // //         examId,
// // // //         submittedAnswer: data?.answer?.join(",") || "",
// // // //         sNo: offSet + 1,
// // // //         isFlagged: data?.answer?.length > 0 ? 1 : 0,
// // // //         userLoginId: userId,
// // // //       }),
// // // //     });

// // // //     // 🚨 BLOCK IF LAST QUESTION
// // // //     if (offSet >= totalQuestions - 1) return;

// // // //     setOffSet((prev) => prev + 1);
// // // //   };

// // // //   const handlePrev = () => {
// // // //     if (offSet <= 0) return; // 🚨 block negative

// // // //     setOffSet((prev) => prev - 1);
// // // //   };

// // // //   const markReview = () => {
// // // //     setAnswersMap((prev) => ({
// // // //       ...prev,
// // // //       [currentQ.qId]: {
// // // //         answer: currentAnswer,
// // // //         status: "marked_review",
// // // //       },
// // // //     }));
// // // //   };

// // // //   /* ================== PALETTE STATUS ================== */

// // // //   const getStatus = (qId) => {
// // // //     return answersMap[qId]?.status || "not_visited";
// // // //   };
// // // //   //lastsubmit
// // // //   const handleSubmitExam = async () => {
// // // //     const response = await fetch(
// // // //       "https://localhost:8443/sphinx/api/user/submit-final",
// // // //       {
// // // //         method: "POST",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //         },
// // // //         body: JSON.stringify({ examId: examId, userLoginId: userId })
// // // //       },
// // // //     );
// // // //     const data = await response.json();
// // // //     if (response.ok) {
// // // //       toast.success(data.success);
// // // //     } else {
// // // //       toast.error(data.error);
// // // //     }
// // // //   };

// // // //   /* ================== OPTIONS ================== */

// // // //   const renderOptions = () => {
// // // //     const type = currentQ.questionTypeId;

// // // //     if (type === "FILL_BLANK") {
// // // //       return (
// // // //         <input
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
// // // //         {currentQ[`option${opt}`] || opt}
// // // //       </Option>
// // // //     ));
// // // //   };

// // // //   /* ================== UI ================== */

// // // //   return (
// // // //     <Layout>
// // // //       <Left>
// // // //         <Box>
// // // //           <h3>
// // // //             Q{offSet + 1}. {currentQ.questionDetail}
// // // //           </h3>

// // // //           {renderOptions()}

// // // //           <div>
// // // //             <Button onClick={handlePrev} bg="#6c757d" disabled={offSet === 0}>
// // // //               Prev
// // // //             </Button>

// // // //             <Button
// // // //               onClick={handleNext}
// // // //               disabled={offSet >= totalQuestions - 1}
// // // //             >
// // // //               Save & Next
// // // //             </Button>

// // // //             <Button onClick={markReview} bg="#ffc107">
// // // //               Mark Review
// // // //             </Button>
// // // //             <Button bg="#28a745" onClick={handleSubmitExam}>
// // // //               Submit Exam
// // // //             </Button>
// // // //           </div>
// // // //         </Box>
// // // //       </Left>

// // // //       <Right>
// // // //         <h4>Question Palette</h4>

// // // //         <Palette>
// // // //           {Array.from({ length: totalQuestions }).map((_, i) => (
// // // //             <QBtn
// // // //               key={i}
// // // //               status={answersMap[Object.keys(answersMap)[i]]?.status}
// // // //               onClick={() => setOffSet(i)}
// // // //             >
// // // //               {i + 1}
// // // //             </QBtn>
// // // //           ))}
// // // //         </Palette>

// // // //         <hr />

// // // //         <p>🟢 Attempted</p>
// // // //         <p>🔴 Not Answered</p>
// // // //         <p>🟡 Marked Review</p>
// // // //         <p>⚪ Not Visited</p>
// // // //       </Right>
// // // //     </Layout>
// // // //   );
// // // // };

// // // // export default ExamAttend;

// // // import React, { useEffect, useState } from "react";
// // // import styled from "styled-components";
// // // import { useSelector } from "react-redux";
// // // import { useNavigate, useParams } from "react-router-dom";
// // // import { toast } from "sonner";

// // // /* ================== STYLES ================== */

// // // const Layout = styled.div`
// // //   display: flex;
// // //   gap: 20px;
// // //   padding: 20px;
// // // `;

// // // const Left = styled.div`
// // //   flex: 3;
// // // `;

// // // const Right = styled.div`
// // //   flex: 1;
// // //   background: #f4f6f8;
// // //   padding: 15px;
// // //   border-radius: 10px;
// // // `;

// // // const Box = styled.div`
// // //   background: white;
// // //   padding: 20px;
// // //   border-radius: 10px;
// // // `;

// // // const Option = styled.label`
// // //   display: block;
// // //   padding: 10px;
// // //   margin: 8px 0;
// // //   border: 1px solid #ddd;
// // //   border-radius: 6px;
// // //   cursor: pointer;
// // // `;

// // // const Button = styled.button`
// // //   margin: 8px 5px 0 0;
// // //   padding: 10px 15px;
// // //   border: none;
// // //   border-radius: 6px;
// // //   cursor: pointer;
// // //   background: ${(p) => p.bg || "#007bff"};
// // //   color: white;

// // //   &:disabled {
// // //     background: #ccc;
// // //     cursor: not-allowed;
// // //   }
// // // `;

// // // const Palette = styled.div`
// // //   display: grid;
// // //   grid-template-columns: repeat(5, 1fr);
// // //   gap: 8px;
// // // `;

// // // const QBtn = styled.button`
// // //   padding: 10px;
// // //   border: none;
// // //   border-radius: 6px;
// // //   color: white;
// // //   cursor: pointer;

// // //   background: ${(p) => {
// // //     switch (p.status) {
// // //       case "attempted":
// // //         return "#28a745";
// // //       case "not_answered":
// // //         return "#dc3545";
// // //       case "marked_review":
// // //         return "#ffc107";
// // //       default:
// // //         return "#6c757d";
// // //     }
// // //   }};
// // // `;

// // // /* ================== COMPONENT ================== */

// // // const ExamAttend = () => {
// // //   const navigate = useNavigate();
// // //   const { examId } = useParams();
// // //   const userId = useSelector((state) => state.auth.user);

// // //   const [question, setQuestion] = useState({});
// // //   const [offSet, setOffSet] = useState(0);
// // //   const [totalQuestions, setTotalQuestions] = useState(0);

// // //   const [answersMap, setAnswersMap] = useState({});

// // //   const currentQ = question;
// // //   const currentAnswer = answersMap[currentQ.qId]?.answer || [];

// // //   /* ================== FETCH QUESTION ================== */

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

// // //   /* ================== ANSWER HANDLING ================== */

// // //   const handleAnswer = (val) => {
// // //     const type = currentQ.questionTypeId;

// // //     let updated = [];

// // //     if (type === "SINGLE_CHOICE" || type === "TRUE_FALSE") {
// // //       updated = [val];
// // //     } else if (type === "MULTI_CHOICE") {
// // //       updated = currentAnswer.includes(val)
// // //         ? currentAnswer.filter((x) => x !== val)
// // //         : [...currentAnswer, val];
// // //     }

// // //     setAnswersMap((prev) => ({
// // //       ...prev,
// // //       [currentQ.qId]: {
// // //         answer: updated,
// // //         status: "attempted",
// // //       },
// // //     }));
// // //   };

// // //   const handleFill = (val) => {
// // //     setAnswersMap((prev) => ({
// // //       ...prev,
// // //       [currentQ.qId]: {
// // //         answer: val ? [val] : [],
// // //         status: "attempted",
// // //       },
// // //     }));
// // //   };

// // //   /* ================== SAVE & NEXT ================== */

// // //   const handleNext = async () => {
// // //     try {
// // //       const data = answersMap[currentQ.qId] || {
// // //         answer: [],
// // //         status: "not_answered",
// // //       };

// // //       const payload = {
// // //         questionId: currentQ.qId,
// // //         examId,
// // //         submittedAnswer: data.answer.join(","),
// // //         sNo: offSet + 1,
// // //         isFlagged: data.answer.length > 0 ? 1 : 0,
// // //         userLoginId: userId,
// // //       };

// // //       const response = await fetch(
// // //         "https://localhost:8443/sphinx/api/user/submited-answer",
// // //         {
// // //           method: "POST",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify(payload),
// // //         },
// // //       );

// // //       if (!response.ok) {
// // //         const err = await response.text();
// // //         throw new Error(err);
// // //       }

// // //       if (offSet < totalQuestions - 1) {
// // //         setOffSet((prev) => prev + 1);
// // //       }
// // //     } catch (err) {
// // //       toast.error("Save failed");
// // //       console.log(err.message);
// // //     }
// // //   };

// // //   /* ================== PREV ================== */

// // //   const handlePrev = () => {
// // //     if (offSet > 0) setOffSet((prev) => prev - 1);
// // //   };

// // //   /* ================== MARK REVIEW ================== */

// // //   const markReview = () => {
// // //     setAnswersMap((prev) => ({
// // //       ...prev,
// // //       [currentQ.qId]: {
// // //         answer: currentAnswer,
// // //         status: "marked_review",
// // //       },
// // //     }));
// // //   };

// // //   /* ================== FINAL SUBMIT ================== */

// // //   const handleSubmitExam = async () => {
// // //     await handleNext();
// // //     try {
// // //       const response = await fetch(
// // //         "https://localhost:8443/sphinx/api/user/submit-final",
// // //         {
// // //           method: "POST",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify({ examId: examId, userLoginId: userId }),
// // //         },
// // //       );

// // //       const data = await response.json();
// // //       if (!response.ok) {
// // //         toast.error(data.error);
// // //       } else {
// // //         toast.success(data.success);
// // //         navigate("/examresult");
// // //       }
// // //     } catch (err) {
// // //       toast.error("Final submit failed");
// // //       console.log(err.message);
// // //     }
// // //   };

// // //   /* ================== OPTIONS ================== */

// // //   const renderOptions = () => {
// // //     const type = currentQ.questionTypeId;

// // //     if (type === "FILL_BLANK") {
// // //       return (
// // //         <input
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
// // //         {currentQ[`option${opt}`] || opt}
// // //       </Option>
// // //     ));
// // //   };

// // //   /* ================== UI ================== */

// // //   return (
// // //     <Layout>
// // //       <Left>
// // //         <Box>
// // //           <h3>
// // //             Q{offSet + 1}. {currentQ.questionDetail}
// // //           </h3>

// // //           {renderOptions()}

// // //           <div>
// // //             <Button onClick={handlePrev} bg="#6c757d" disabled={offSet === 0}>
// // //               Prev
// // //             </Button>

// // //             <Button
// // //               onClick={handleNext}
// // //               disabled={offSet >= totalQuestions - 1}
// // //             >
// // //               Save & Next
// // //             </Button>

// // //             <Button onClick={markReview} bg="#ffc107">
// // //               Mark Review
// // //             </Button>

// // //             <Button bg="#28a745" onClick={handleSubmitExam}>
// // //               Submit Exam
// // //             </Button>
// // //           </div>
// // //         </Box>
// // //       </Left>

// // //       <Right>
// // //         <h4>Question Palette</h4>

// // //         <Palette>
// // //           {Array.from({ length: totalQuestions }).map((_, i) => {
// // //             const qIds = Object.keys(answersMap);
// // //             const qId = qIds[i];

// // //             return (
// // //               <QBtn key={i} status={answersMap[qId]?.status}>
// // //                 {i + 1}
// // //               </QBtn>
// // //             );
// // //           })}
// // //         </Palette>

// // //         <hr />

// // //         <p>🟢 Attempted</p>
// // //         <p>🔴 Not Answered</p>
// // //         <p>🟡 Marked Review</p>
// // //         <p>⚪ Not Visited</p>
// // //       </Right>
// // //     </Layout>
// // //   );
// // // };

// // // export default ExamAttend;

// // import React, { useEffect, useState } from "react";
// // import styled from "styled-components";
// // import { useSelector } from "react-redux";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { toast } from "sonner";

// // /* ================== STYLES ================== */

// // const Layout = styled.div`
// //   display: flex;
// //   gap: 20px;
// //   padding: 20px;
// // `;

// // const Left = styled.div`
// //   flex: 3;
// // `;
// // const Right = styled.div`
// //   flex: 1;
// //   background: #f4f6f8;
// //   padding: 15px;
// //   border-radius: 10px;
// // `;

// // const Box = styled.div`
// //   background: white;
// //   padding: 20px;
// //   border-radius: 10px;
// // `;

// // const Option = styled.label`
// //   display: block;
// //   padding: 10px;
// //   margin: 8px 0;
// //   border: 1px solid #ddd;
// //   border-radius: 6px;
// //   cursor: pointer;
// // `;

// // const Button = styled.button`
// //   margin: 8px 5px 0 0;
// //   padding: 10px 15px;
// //   border: none;
// //   border-radius: 6px;
// //   cursor: pointer;
// //   background: ${(p) => p.bg || "#007bff"};
// //   color: white;

// //   &:disabled {
// //     background: #ccc;
// //     cursor: not-allowed;
// //   }
// // `;

// // const Palette = styled.div`
// //   display: grid;
// //   grid-template-columns: repeat(5, 1fr);
// //   gap: 8px;
// // `;

// // const QBtn = styled.button`
// //   padding: 10px;
// //   border: none;
// //   border-radius: 6px;
// //   color: white;
// //   cursor: pointer;

// //   background: ${(p) => {
// //     switch (p.status) {
// //       case "attempted":
// //         return "#28a745";
// //       case "not_answered":
// //         return "#dc3545";
// //       case "marked_review":
// //         return "#ffc107";
// //       default:
// //         return "#6c757d";
// //     }
// //   }};
// // `;

// // /* ================== COMPONENT ================== */

// // const ExamAttend = () => {
// //   const navigate = useNavigate();
// //   const { examId } = useParams();
// //   const userId = useSelector((state) => state.auth.user);

// //   const [question, setQuestion] = useState({});
// //   const [offSet, setOffSet] = useState(0);
// //   const [totalQuestions, setTotalQuestions] = useState(0);

// //   // ✅ index-based mapping (fixed)
// //   const [answersMap, setAnswersMap] = useState({});

// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const currentQ = question;
// //   const currentAnswer = answersMap[offSet]?.answer || [];

// //   /* ================== FETCH ================== */

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

// //   /* ================== ANSWERS ================== */

// //   const handleAnswer = (val) => {
// //     const type = currentQ.questionTypeId;

// //     let updated = [];

// //     if (type === "SINGLE_CHOICE" || type === "TRUE_FALSE") {
// //       updated = [val];
// //     } else if (type === "MULTI_CHOICE") {
// //       updated = currentAnswer.includes(val)
// //         ? currentAnswer.filter((x) => x !== val)
// //         : [...currentAnswer, val];
// //     }

// //     setAnswersMap((prev) => ({
// //       ...prev,
// //       [offSet]: {
// //         answer: updated,
// //         status: "attempted",
// //       },
// //     }));
// //   };

// //   const handleFill = (val) => {
// //     setAnswersMap((prev) => ({
// //       ...prev,
// //       [offSet]: {
// //         answer: val ? [val] : [],
// //         status: "attempted",
// //       },
// //     }));
// //   };

// //   /* ================== SAVE ================== */

// //   const saveAnswer = async () => {
// //     const data = answersMap[offSet] || {
// //       answer: [],
// //       status: "not_answered",
// //     };

// //     // ensure UI consistency
// //     if (!answersMap[offSet]) {
// //       setAnswersMap((prev) => ({
// //         ...prev,
// //         [offSet]: data,
// //       }));
// //     }

// //     const payload = {
// //       questionId: currentQ.qId,
// //       examId,
// //       submittedAnswer: data.answer.join(","),
// //       sNo: offSet + 1,
// //       isFlagged: data.status === "marked_review" ? 1 : 0,
// //       userLoginId: userId,
// //     };

// //     const response = await fetch(
// //       "https://localhost:8443/sphinx/api/user/submited-answer",
// //       {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       },
// //     );

// //     if (!response.ok) {
// //       throw new Error(await response.text());
// //     }
// //   };

// //   /* ================== NAV ================== */

// //   const handleNext = async () => {
// //     try {
// //       await saveAnswer();

// //       if (offSet < totalQuestions - 1) {
// //         setOffSet((prev) => prev + 1);
// //       }
// //     } catch (err) {
// //       toast.error("Save failed");
// //     }
// //   };

// //   const handlePrev = async () => {
// //     try {
// //       await saveAnswer();

// //       if (offSet > 0) {
// //         setOffSet((prev) => prev - 1);
// //       }
// //     } catch {
// //       toast.error("Save failed");
// //     }
// //   };

// //   const goToQuestion = async (index) => {
// //     try {
// //       await saveAnswer();
// //       setOffSet(index);
// //     } catch {
// //       toast.error("Save failed");
// //     }
// //   };

// //   /* ================== REVIEW ================== */

// //   const markReview = () => {
// //     setAnswersMap((prev) => ({
// //       ...prev,
// //       [offSet]: {
// //         answer: currentAnswer,
// //         status: "marked_review",
// //       },
// //     }));
// //   };

// //   /* ================== SUBMIT ================== */

// //   const handleSubmitExam = async () => {
// //     if (isSubmitting) return;

// //     setIsSubmitting(true);

// //     try {
// //       await saveAnswer();

// //       const response = await fetch(
// //         "https://localhost:8443/sphinx/api/user/submit-final",
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ examId:examId, userLoginId: userId }),
// //         },
// //       );

// //       const data = await response.json();

// //       if (!response.ok) {
// //         toast.error(data.error);
// //       } else {
// //         toast.success(data.success);
// //         navigate("/examresult");
// //       }
// //     } catch (err) {
// //       toast.error("Final submit failed");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   /* ================== OPTIONS ================== */

// //   const renderOptions = () => {
// //     const type = currentQ.questionTypeId;

// //     if (type === "FILL_BLANK") {
// //       return (
// //         <input
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
// //         {currentQ[`option${opt}`] || opt}
// //       </Option>
// //     ));
// //   };

// //   /* ================== UI ================== */

// //   return (
// //     <Layout>
// //       <Left>
// //         <Box>
// //           <h3>
// //             Q{offSet + 1}. {currentQ.questionDetail}
// //           </h3>

// //           {renderOptions()}

// //           <div>
// //             <Button onClick={handlePrev} disabled={offSet === 0} bg="#6c757d">
// //               Prev
// //             </Button>

// //             <Button
// //               onClick={handleNext}
// //               disabled={offSet >= totalQuestions - 1}
// //             >
// //               Save & Next
// //             </Button>

// //             <Button onClick={markReview} bg="#ffc107">
// //               Mark Review
// //             </Button>

// //             <Button
// //               bg="#28a745"
// //               onClick={handleSubmitExam}
// //               disabled={isSubmitting}
// //             >
// //               Submit Exam
// //             </Button>
// //           </div>
// //         </Box>
// //       </Left>

// //       <Right>
// //         <h4>Question Palette</h4>

// //         <Palette>
// //           {Array.from({ length: totalQuestions }).map((_, i) => (
// //             <QBtn
// //               key={i}
// //               status={answersMap[i]?.status}
// //               onClick={() => goToQuestion(i)}
// //             >
// //               {i + 1}
// //             </QBtn>
// //           ))}
// //         </Palette>

// //         <hr />

// //         <p>🟢 Attempted</p>
// //         <p>🔴 Not Answered</p>
// //         <p>🟡 Marked Review</p>
// //         <p>⚪ Not Visited</p>
// //       </Right>
// //     </Layout>
// //   );
// // };

// // export default ExamAttend;

// import React, { useEffect, useState } from "react";
// import styled from "styled-components";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";

// /* ================== STYLES ================== */

// const Layout = styled.div`
//   display: flex;
//   gap: 20px;
//   padding: 20px;
// `;

// const Left = styled.div`
//   flex: 3;
// `;

// const Right = styled.div`
//   flex: 1;
//   background: #f4f6f8;
//   padding: 15px;
//   border-radius: 10px;
// `;

// const Box = styled.div`
//   background: white;
//   padding: 20px;
//   border-radius: 10px;
// `;

// const Option = styled.label`
//   display: block;
//   padding: 10px;
//   margin: 8px 0;
//   border: 1px solid #ddd;
//   border-radius: 6px;
//   cursor: pointer;
// `;

// const Button = styled.button`
//   margin: 8px 5px 0 0;
//   padding: 10px 15px;
//   border: none;
//   border-radius: 6px;
//   cursor: pointer;
//   background: ${(p) => p.bg || "#007bff"};
//   color: white;

//   &:disabled {
//     background: #ccc;
//     cursor: not-allowed;
//   }
// `;

// const Palette = styled.div`
//   display: grid;
//   grid-template-columns: repeat(5, 1fr);
//   gap: 8px;
// `;

// const QBtn = styled.button`
//   padding: 10px;
//   border: none;
//   border-radius: 6px;
//   color: white;
//   cursor: pointer;

//   background: ${(p) => {
//     switch (p.status) {
//       case "attempted":
//         return "#28a745";
//       case "not_answered":
//         return "#dc3545";
//       case "marked_review":
//         return "#ffc107";
//       default:
//         return "#6c757d";
//     }
//   }};
// `;

// /* ================== COMPONENT ================== */

// const ExamAttend = () => {
//   const navigate = useNavigate();
//   const { examId } = useParams();
//   const userId = useSelector((state) => state.auth.user);

//   const [question, setQuestion] = useState({});
//   const [offSet, setOffSet] = useState(0);
//   const [totalQuestions, setTotalQuestions] = useState(0);

//   const [answersMap, setAnswersMap] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const currentQ = question;
//   const currentAnswer = answersMap[offSet]?.answer || [];

//   /* ================== FETCH ================== */

//   const getQuestion = async (offsetValue) => {
//     try {
//       const res = await fetch(
//         `https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${offsetValue}`,
//       );

//       const data = await res.json();

//       if (res.ok) {
//         setQuestion(data.questions?.[0] || {});
//         setTotalQuestions(data.totalQuestions || 0);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     getQuestion(offSet);
//   }, [offSet]);

//   /* ================== ANSWERS ================== */

//   const handleAnswer = (val) => {
//     const type = currentQ.questionTypeId;

//     let updated = [];

//     if (type === "SINGLE_CHOICE" || type === "TRUE_FALSE") {
//       updated = [val];
//     } else if (type === "MULTI_CHOICE") {
//       updated = currentAnswer.includes(val)
//         ? currentAnswer.filter((x) => x !== val)
//         : [...currentAnswer, val];
//     }

//     setAnswersMap((prev) => ({
//       ...prev,
//       [offSet]: {
//         answer: updated,
//         status: "attempted",
//         isFlagged: prev[offSet]?.isFlagged || false, // preserve flag
//       },
//     }));
//   };

//   const handleFill = (val) => {
//     setAnswersMap((prev) => ({
//       ...prev,
//       [offSet]: {
//         answer: val ? [val] : [],
//         status: "attempted",
//         isFlagged: prev[offSet]?.isFlagged || false,
//       },
//     }));
//   };

//   /* ================== SAVE ================== */

//   const saveAnswer = async () => {
//     const data = answersMap[offSet] || {
//       answer: [],
//       status: "not_answered",
//       isFlagged: false,
//     };

//     if (!answersMap[offSet]) {
//       setAnswersMap((prev) => ({
//         ...prev,
//         [offSet]: data,
//       }));
//     }

//     const payload = {
//       questionId: currentQ.qId,
//       examId,
//       submittedAnswer: data.answer.join(","),
//       sNo: offSet + 1,
//       isFlagged: data.isFlagged ? 1 : 0, // ✅ FIXED
//       userLoginId: userId,
//     };

//     const response = await fetch(
//       "https://localhost:8443/sphinx/api/user/submited-answer",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       },
//     );

//     if (!response.ok) {
//       throw new Error(await response.text());
//     }
//   };

//   /* ================== NAVIGATION ================== */

//   const handleNext = async () => {
//     try {
//       await saveAnswer();

//       if (offSet < totalQuestions - 1) {
//         setOffSet((prev) => prev + 1);
//       }
//     } catch {
//       toast.error("Save failed");
//     }
//   };

//   const handlePrev = async () => {
//     try {
//       await saveAnswer();

//       if (offSet > 0) {
//         setOffSet((prev) => prev - 1);
//       }
//     } catch {
//       toast.error("Save failed");
//     }
//   };

//   const goToQuestion = async (index) => {
//     try {
//       await saveAnswer();
//       setOffSet(index);
//     } catch {
//       toast.error("Save failed");
//     }
//   };

//   /* ================== REVIEW ================== */

//   const markReview = () => {
//     setAnswersMap((prev) => ({
//       ...prev,
//       [offSet]: {
//         answer: currentAnswer,
//         status: "marked_review",
//         isFlagged: true, // ✅ FIXED
//       },
//     }));
//   };

//   /* ================== FINAL SUBMIT ================== */

//   const handleSubmitExam = async () => {
//     if (isSubmitting) return;

//     setIsSubmitting(true);

//     try {
//       await saveAnswer();

//       const response = await fetch(
//         "https://localhost:8443/sphinx/api/user/submit-final",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ examId, userLoginId: userId }),
//         },
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         toast.error(data.error);
//       } else {
//         toast.success(data.success);
//         navigate("/examresult");
//       }
//     } catch {
//       toast.error("Final submit failed");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* ================== OPTIONS ================== */

//   const renderOptions = () => {
//     const type = currentQ.questionTypeId;

//     if (type === "FILL_BLANK") {
//       return (
//         <input
//           value={currentAnswer[0] || ""}
//           onChange={(e) => handleFill(e.target.value)}
//         />
//       );
//     }

//     const opts =
//       type === "TRUE_FALSE" ? ["True", "False"] : ["A", "B", "C", "D"];

//     return opts.map((opt) => (
//       <Option key={opt}>
//         <input
//           type={type === "MULTI_CHOICE" ? "checkbox" : "radio"}
//           checked={currentAnswer.includes(opt)}
//           onChange={() => handleAnswer(opt)}
//         />
//         {currentQ[`option${opt}`] || opt}
//       </Option>
//     ));
//   };

//   /* ================== UI ================== */

//   return (
//     <Layout>
//       <Left>
//         <Box>
//           <h3>
//             Q{offSet + 1}. {currentQ.questionDetail}
//           </h3>

//           {renderOptions()}

//           <div>
//             <Button onClick={handlePrev} disabled={offSet === 0} bg="#6c757d">
//               Prev
//             </Button>

//             <Button
//               onClick={handleNext}
//               disabled={offSet >= totalQuestions - 1}
//             >
//               Save & Next
//             </Button>

//             <Button onClick={markReview} bg="#ffc107">
//               Mark Review
//             </Button>

//             <Button
//               bg="#28a745"
//               onClick={handleSubmitExam}
//               disabled={isSubmitting}
//             >
//               Submit Exam
//             </Button>
//           </div>
//         </Box>
//       </Left>

//       <Right>
//         <h4>Question Palette</h4>

//         <Palette>
//           {Array.from({ length: totalQuestions }).map((_, i) => (
//             <QBtn
//               key={i}
//               status={answersMap[i]?.status}
//               onClick={() => goToQuestion(i)}
//             >
//               {i + 1}
//             </QBtn>
//           ))}
//         </Palette>

//         <hr />

//         <p>🟢 Attempted</p>
//         <p>🔴 Not Answered</p>
//         <p>🟡 Marked Review</p>
//         <p>⚪ Not Visited</p>
//       </Right>
//     </Layout>
//   );
// };

// export default ExamAttend;

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

/* ================== STYLES ================== */

const Layout = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
`;

const Left = styled.div`
  flex: 3;
`;

const Right = styled.div`
  flex: 1;
  background: #f4f6f8;
  padding: 15px;
  border-radius: 10px;
`;

const Box = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
`;

const Option = styled.label`
  display: block;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
`;

const Button = styled.button`
  margin: 8px 5px 0 0;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: ${(p) => p.bg || "#007bff"};
  color: white;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Palette = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
`;

const QBtn = styled.button`
  padding: 10px;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;

  background: ${(p) => {
    switch (p.status) {
      case "attempted":
        return "#28a745";
      case "not_answered":
        return "#dc3545";
      case "marked_review":
        return "#ffc107";
      default:
        return "#6c757d";
    }
  }};
`;

/* ================== COMPONENT ================== */

const ExamAttend = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const userId = useSelector((state) => state.auth.user);

  const [question, setQuestion] = useState({});
  const [offSet, setOffSet] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const [answersMap, setAnswersMap] = useState({});

  const currentQ = question;
  const currentAnswer = answersMap[offSet]?.answer || [];

  /* ================== FETCH QUESTION ================== */

  const getQuestion = async (offsetValue) => {
    try {
      const res = await fetch(
        `https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${offsetValue}`,
      );

      const data = await res.json();

      if (res.ok) {
        setQuestion(data.questions?.[0] || {});
        setTotalQuestions(data.totalQuestions || 0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getQuestion(offSet);
  }, [offSet]);

  /* ================== ANSWER HANDLING ================== */

  const handleAnswer = (val) => {
    const type = currentQ.questionTypeId;

    let updated = [];

    if (type === "SINGLE_CHOICE" || type === "TRUE_FALSE") {
      updated = [val];
    } else {
      updated = currentAnswer.includes(val)
        ? currentAnswer.filter((x) => x !== val)
        : [...currentAnswer, val];
    }

    setAnswersMap((prev) => ({
      ...prev,
      [offSet]: {
        answer: updated,
        status: "attempted",
      },
    }));
  };

  const handleFill = (val) => {
    setAnswersMap((prev) => ({
      ...prev,
      [offSet]: {
        answer: val ? [val] : [],
        status: "attempted",
      },
    }));
  };

  /* ================== SAVE LOGIC ================== */

  const saveAnswer = async () => {
    const data = answersMap[offSet] || {
      answer: [],
    };

    const isAnswered = data.answer.length > 0;

    const payload = {
      questionId: currentQ.qId,
      examId,
      submittedAnswer: data.answer.join(","),
      sNo: offSet + 1,

      // ✅ YOUR RULE:
      // answered → 1, not answered → 0
      isFlagged: isAnswered ? 1 : 0,

      userLoginId: userId,
    };

    const response = await fetch(
      "https://localhost:8443/sphinx/api/user/submited-answer",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }
  };

  /* ================== NAVIGATION ================== */

  const handleNext = async () => {
    try {
      await saveAnswer();

      if (offSet < totalQuestions - 1) {
        setOffSet((prev) => prev + 1);
      }
    } catch {
      toast.error("Save failed");
    }
  };

  const handlePrev = async () => {
    try {
      await saveAnswer();

      if (offSet > 0) {
        setOffSet((prev) => prev - 1);
      }
    } catch {
      toast.error("Save failed");
    }
  };

  /* ================== MARK REVIEW ================== */

  const markReview = () => {
    setAnswersMap((prev) => ({
      ...prev,
      [offSet]: {
        answer: currentAnswer,
        status: "marked_review",
      },
    }));
  };

  /* ================== FINAL SUBMIT ================== */

  const handleSubmitExam = async () => {
    try {
      await saveAnswer();

      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/submit-final",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId:examId, userLoginId: userId }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error);
      } else {
        toast.success(data.success);
        navigate(`/examresult/${examId}/${userId}`);
      }
    } catch {
      toast.error("Final submit failed");
    }
  };

  /* ================== OPTIONS ================== */

  const renderOptions = () => {
    const type = currentQ.questionTypeId;

    if (type === "FILL_BLANK") {
      return (
        <input
          value={currentAnswer[0] || ""}
          onChange={(e) => handleFill(e.target.value)}
        />
      );
    }

    const opts =
      type === "TRUE_FALSE" ? ["True", "False"] : ["A", "B", "C", "D"];

    return opts.map((opt) => (
      <Option key={opt}>
        <input
          type={type === "MULTI_CHOICE" ? "checkbox" : "radio"}
          checked={currentAnswer.includes(opt)}
          onChange={() => handleAnswer(opt)}
        />
        {currentQ[`option${opt}`] || opt}
      </Option>
    ));
  };

  /* ================== UI ================== */

  return (
    <Layout>
      <Left>
        <Box>
          <h3>
            Q{offSet + 1}. {currentQ.questionDetail}
          </h3>

          {renderOptions()}

          <div>
            <Button onClick={handlePrev} disabled={offSet === 0} bg="#6c757d">
              Prev
            </Button>

            <Button
              onClick={handleNext}
              disabled={offSet >= totalQuestions - 1}
            >
              Save & Next
            </Button>

            <Button onClick={markReview} bg="#ffc107">
              Mark Review
            </Button>

            <Button bg="#28a745" onClick={handleSubmitExam}>
              Submit Exam
            </Button>
          </div>
        </Box>
      </Left>

      <Right>
        <h4>Question Palette</h4>

        <Palette>
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <QBtn key={i} status={answersMap[i]?.status}>
              {i + 1}
            </QBtn>
          ))}
        </Palette>

        <hr />

        <p>🟢 Attempted</p>
        <p>🔴 Not Answered</p>
        <p>🟡 Marked Review</p>
        <p>⚪ Not Visited</p>
      </Right>
    </Layout>
  );
};

export default ExamAttend;
