import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { Button, Buttons, EditExContainer, Heading, TopicContaienEx, TopicName } from '../styles/EditExam.style'
import {  FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggle } from '../reducer/apiReduce';


const ContentEdit=(props)=>{
   const dispatch=useDispatch()
    const deleteTopic= async(topicId,examId)=>{
        try{
            const response = await fetch(`https://localhost:8443/sphinx/api/exam/examtopicdeletebyid?topicId=${encodeURIComponent(topicId)}&examId=${encodeURIComponent(examId)}`, 
            {
                   method: 'DELETE', }
            );
             if(!response.ok){
                     console.log("not working  "+topicId)
            console.log(data.message || "Failed to delete topic")
            return;
                }    
                alert('topic deleted successfully')
        }catch(err){
            console.log(err)
        }finally{
            dispatch(toggle())
        }
    }


    return(
        <TopicContaienEx>
          
            <TopicName>{props.topic.topicName}</TopicName>
            
            <Buttons>
                
                {/* <Button onClick={()=>deleteTopic(props.topic.topicId,props.topic.examId)}><FaTrash/> <p>delete</p></Button> */}
            </Buttons>
        </TopicContaienEx>
    )

}

const EditExam = () => {
    const { examId } = useParams    ();
     const [topic, setExamTopics] = useState([]);
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


console.log(topic)
  return (
    <Layout>
        <EditExContainer>
            <Heading>Topics</Heading>
            {topic.length=== 0 ?"no topics available ":topic.map((topic)=>{
                return <ContentEdit examId={examId} topic={topic} />
            })}
            
        </EditExContainer>
    </Layout>
  )
}

export default EditExam
