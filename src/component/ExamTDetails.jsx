import React, { use, useEffect, useState } from 'react'
import { Button, ContainerExamTD, ContentETD, H2, P } from '../styles/ExamTDetails.style'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ExamTDetails = (props) => {
 const [examTopics, setExamTopics] = useState([]);
 let { examId } = useParams();
 const [sumbit,setSubmit]=useState(false)
 
  if(!examId){
    examId=props.examId
  }
 const apiRefresh=useSelector((state)=>state.api.value)
  

  useEffect(()=>{
    const fetchTopics=async()=>{
     try{
       const response=await fetch(`https://localhost:8443/sphinx/api/exam/examtopicbyid?examId=${examId}`,{
        method:"GET",
        headers:{
          "Content-Type": "application/json",
        },
        
       });

      if(!response.ok){
         throw new Error(`HTTP error! status: ${response.status}`)
      }

      
      const res = await response.json();

      console.log(res.topic);
      setExamTopics(res.topic || []); 

     }catch(err){
      console.log(err,"fetching")
     }
    
    }
     fetchTopics()
  },[apiRefresh])

   
  const loadExam=async()=>{
    try{
      setSubmit(true);
      
      const response = await fetch(
     `https://localhost:8443/sphinx/api/question/generateExamQuestions`,
    {
      method:"POST",
       headers:{
          "Content-Type": "application/json",
        },
        body:JSON.stringify({examId})

    });

     if(!response.ok){
      console.log("failed to generate question")
      return;
     }
     await new Promise(resolve => setTimeout(resolve, 1000));
     const data=await response.json();
     alert("generated")

}catch(err){
      console.log(err)
    }finally{
      setSubmit(false)
    }
  }


  return (
    <ContainerExamTD>
        <H2>Exam Topics</H2>
        <ContentETD>
            <P>SNO.</P>
            <P>TopicName</P>
            <P>Percentage</P>
        </ContentETD>
         

        {examTopics.length ===0 ? "no topic available" : examTopics.map((topic,i)=>{
         return(<ContentETD key={i}>
            <P>{i+1}</P>
            <P>{topic.topicName}</P>
            <P>{topic.topicPassPercentage}</P>
          </ContentETD>)
          
        })}

        <Button disabled={sumbit} onClick={()=>{
          loadExam()
        }}>{sumbit?"Submitting..":"Load Question"}</Button>
    
    </ContainerExamTD>
  )
}

export default ExamTDetails
