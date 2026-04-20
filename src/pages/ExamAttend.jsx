import React from "react";

const ExamAttend = () => {
  const [answer, setAnswer] = useState({
    questionId: item.qId,
    examId: item.examId,
    submittedAnswer: "",
    sNo: "",
    isFlagged: false,
  });
  const submitAnswer = async () => {
    const response = await fetch(
      "https://localhost:8443/sphinx/api/user/submited-answer",
      {
        methods: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answer)
      },

    );
    if(response.ok){
        
    }
  };
  const getQuestion=async ()=>{
    const response=await fetch("https://localhost:8443/sphinx/api/question/get-Exam-Question",{
        method:
    })
  }
  return(
    <>

    </>
  )
  
};

export default ExamAttend;
