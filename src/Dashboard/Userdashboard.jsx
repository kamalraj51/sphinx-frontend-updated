import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import {ActionRow, Attempts, Card, Container, Description, ExamId, StyledLink, Title} from '../styles/UserDashboar.style'
import Layout from '../component/Layout';
import { NavLink } from 'react-router-dom';


const Userdashboard = () => {
  
  const [data,setData] = useState([])
   useEffect(()=>{
      getExamData()

    },[])
  
   const userId = useSelector((state) => state.auth.user);
   console.log(userId)
  const getExamData=async()=>{
    const response=await fetch("https://localhost:8443/sphinx/api/user/getAssignUserExam",{
      method:"POST",
      headers:{
         "Content-Type": "application/json"
      },
      body:JSON.stringify({userLoginId:userId})
    })
    const value=await response.json()
    if(response.ok){
      setData(value.userExam)
    }else{
      toast.error(value.error)
    }
}

  return (

    <Layout>
  
    <Container>
       {
        data&& data.map((e,i)=>{
          return(
          <Card>
          <ExamId>{e.examId}</ExamId>
          <Title>{e.examName}</Title>
          <Description>{e.description}</Description>
          
          <Attempts>{e.noOfAttempts}</Attempts>
           <ActionRow>
          <StyledLink to={`/exam-attend/${e.examId}`}>attend</StyledLink>
         </ActionRow>
          </Card>
          )
        })



       }

    </Container>
   
        


      
    </Layout>
  )
}

export default Userdashboard