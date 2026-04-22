// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// import SingleChoice from "../component/SingleChoice";
// import MultiChoice from "../component/MultiChoice";
// import TrueorFalse from "../component/TrueorFalse";
// import FillBlanks from "../component/FillBlanks";
// import DetailedAnswer from "../component/DetailedAnswer";
// import Layout from "../component/Layout";

// const QUESTION_COMPONENTS = {
//   SINGLE_CHOICE: SingleChoice,
//   MULTI_CHOICE: MultiChoice,
//   TRUE_FALSE: TrueorFalse,
//   FILL_BLANKS: FillBlanks,
//   DETAILED_ANSWER: DetailedAnswer,
// };

// const UserAttendAssessment = () => {
//   const { examId } = useParams();

//   const [question, setQuestion] = useState(null);
//   const [offset, setOffset] = useState(0);
//   const [totalQuestions, setTotalQuestions] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isCompleted, setIsCompleted] = useState(false);

//   const fetchQuestion = async (currentOffset) => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(
//         `https://localhost:8443/sphinx/api/question/get-Exam-Question?examId=${examId}&offSet=${currentOffset}`
//       );
//       const data = await res.json();

//       if (data.questions?.length > 0) {
//         setQuestion(data.questions[0]);
//         setTotalQuestions(data.totalQuestions);
//       } else {
//         setIsCompleted(true);
//       }
//     } catch {
//       setError("Failed to fetch question. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestion(offset);
//   }, [offset]);

//   const submitAnswer = async () => {
//     try {
//       await fetch("https://localhost:8443/sphinx/api/user/submited-answer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           examId,
//           questionId: question.qId,
//           submittedAnswer: selectedAnswer,
//         }),
//       });
//     } catch (err) {
//       console.error("Failed to submit answer:", err);
//     }
//   };

//   const handleNext = async () => {
//     await submitAnswer();
//     const next = offset + 1;
//     if (next >= totalQuestions) {
//       setIsCompleted(true);
//       return;
//     }
//     setSelectedAnswer("");
//     setOffset(next);
//   };

//   const progressPercent = Math.round(((offset + 1) / totalQuestions) * 100);

//   const QuestionComponent =
//     question && QUESTION_COMPONENTS[question.questionTypeId];

//   // ── States ──────────────────────────────────────────────────────────────────

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen gap-3 text-gray-500">
//         <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
//         <p className="text-sm font-medium">Loading question…</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center space-y-3">
//           <p className="text-red-500 font-semibold">{error}</p>
//           <button
//             onClick={() => fetchQuestion(offset)}
//             className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (isCompleted) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen gap-4">

//         <h2 className="text-2xl font-bold text-gray-800">Exam Completed!</h2>
//         <p className="text-gray-500 text-sm">
//           You answered all {totalQuestions} questions.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <Layout>
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center px-4 py-12">
//         <div style={{padding:"20px"}} className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

//           {/* Progress Bar */}
//           <div className="h-1.5 bg-gray-100">
//             <div
//               className="h-1.5 bg-blue-600 transition-all duration-500 ease-out"
//               style={{ width: `${progressPercent}%` }}
//             />
//           </div>

//           {/* Header */}
//           <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <span className="font-medium text-gray-700">Exam</span>
//               <span className="text-gray-300">/</span>
//               <span className="text-blue-600 font-semibold">{examId}</span>
//             </div>

//             <div className="flex items-center gap-3">
//               <span className="text-xs text-gray-400">
//                 {progressPercent}% complete
//               </span>
//               <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
//                 {offset + 1} / {totalQuestions}
//               </span>
//             </div>
//           </div>

//           {/* Body */}
//           <div className="px-6 py-8 space-y-8">

//             {/* Question */}
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">
//                 Question {offset + 1}
//               </p>
//               <h3 className="text-lg md:text-xl font-semibold text-gray-800 leading-relaxed">
//                 {question.questionDetail}
//               </h3>
//             </div>

//             {/* Answer Component */}
//             <div>
//               {QuestionComponent ? (
//                 <QuestionComponent
//                   question={question}
//                   selectedAnswer={selectedAnswer}
//                   setSelectedAnswer={setSelectedAnswer}
//                 />
//               ) : (
//                 <p className="text-sm text-red-400">Unsupported question type.</p>
//               )}
//             </div>

//             <div className="flex items-center justify-between pt-2 border-t border-gray-100">

//             </div>

//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default UserAttendAssessment;
import React from "react";

const UserAttendAssessment = () => {
  return <div></div>;
};

export default UserAttendAssessment;
