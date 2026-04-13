import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Field, Form, Input, Label } from '../styles/CreateExam.style';
import { RegisterError } from '../styles/SignupStyle';
import Layout from '../component/Layout';
import { H2, HeadingTable } from '../styles/AvailableExamStyle';
import { Container } from '../styles/CreateExam.style';

const ExamUpdate = () => {
  const navigate=useNavigate()
    const location = useLocation();
  const { examData } = location.state || {};
  const [errors,setErrors]=useState({})
  const [data,setData]=useState(
    examData || {}
  
)

  const handleChange=(e)=>{
   
    
    setData({
        ...data,
        [e.target.name]:e.target.value
    }
    )
  }
   const durationRegex=/^(1[0-9]|[2-9][0-9]|\d{3,})$/

  const noOfQuestionRegex=  /^[1-9]\d*$/
  const passPercentageRegex=/^(100|[1-9][0-9]?)$/
  const handleSubmit= async(e)=>{
      e.preventDefault();
      const err={}
      let flag=true
    if(data.examName.trim()==""){
        err.examName="Exam name is mandatory"
        flag=false
      }
      if(data.duration==""){
        err.duration="duration is mandatory"
        flag=false
      }

       else if(!durationRegex.test(data.duration) && data.duration){
        err.duration="valid duration minimum 10 minutes"
        flag=false
      }

      if(data.noOfQuestions==""){
        err.noOfQuestions="npof questions is a mandatory"
        flag=false
      }
      else if(!noOfQuestionRegex.test(data.noOfQuestions)){
        err.noOfQuestions="should be enter valid noofquestions"
        flag=false
      }
        if(data.passPercentage==""){
        err.passPercentage="pass percentage is a mandatory"
        flag=false
      }
       else if(!passPercentageRegex.test(data.passPercentage) && data.passPercentage){
        console.log("pass")
        err.passPercentage="should be enter valid pass percentage"
        flag=false
      }

      if(data.description.trim()==""){
        err.description="description is a mandatory"
        flag=false
      }
      if(! flag){
        setErrors(err)
        return
      }
      
    console.log("inside handle submit");
     try{
    const response=await fetch("https://localhost:8443/sphinx/api/exam/examUpdate",{
        method:"PUT",
        headers:{
             "Content-Type": "application/json"
        },
        body:JSON.stringify(data)
    })
    if(response.ok){
        console.log("successfully")
        navigate("/adminhome",{ state: { message: "Update Successful" } })
  }}catch(err){
    console.log("unexpected error occured");
    
  }
}

  return (
    <Layout>
      <HeadingTable>
        <H2>Update Assessment</H2>
      </HeadingTable>
      <Container>
        <Form onSubmit={handleSubmit}>
                     
            <Field>
                <Label>Exam Name</Label>
                <Input type="text" name="examName" onChange={handleChange} value={data.examName}/>
            </Field>
            {errors.examName && (
                  <RegisterError>{errors.examName}</RegisterError>
              )}
            <Field>
                 <Label>Description</Label>
                 <Input type="text"  name="description" onChange={handleChange} value={data.description}/>
            </Field>
            {errors.description && (
                  <RegisterError>{errors.description}</RegisterError>
              )}
            <Field>
                 <Label>No.Of.Questions</Label>
                <Input type="text" name="noOfQuestions" onChange={handleChange} value={data.noOfQuestions}/>      
            </Field>
            {errors.noOfQuestions && (
                  <RegisterError>{errors.noOfQuestions}</RegisterError>
              )}
            <Field>
                <Label>Duration</Label>
                <Input type="text" name="duration" onChange={handleChange} value={data.duration}/>
            </Field>
            {errors.duration && (
                  <RegisterError>{errors.duration}</RegisterError>
              )}
            <Field>
                <Label>Pass percentage</Label>
                <Input type="text" name="passPercentage" onChange={handleChange} value={data.passPercentage}/><span><b>%</b></span>
            </Field>
            {errors.passPercentage && (
                  <RegisterError>{errors.passPercentage}</RegisterError>
              )}
            <Button type="submit">Update</Button>
        </Form>
      </Container>
    </Layout>
  )
}

export default ExamUpdate