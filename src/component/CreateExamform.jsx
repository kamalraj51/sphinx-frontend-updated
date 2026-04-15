import React, { useState } from 'react'
import { ApiError, Button, Container, Field, Form, Heading, Input, Label } from '../styles/CreateExam.style'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { RegisterError } from '../styles/SignupStyle'
import { H2, HeadingTable } from '../styles/AvailableExamStyle'
import { RedSpan } from '../styles/FontsStyle'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

const CreateExamform = () => {
   const userId = useSelector((state) => state.auth.user);
   console.log("user",userId);
   
  const navigate = useNavigate()
  const [msg, setMsg] = useState("")
  const [errors, setErrors] = useState({})
  const location=useLocation()
  const dispatch=useDispatch()
  let [formData, setFormData] = useState({
    userLoginId:userId,
    examName: "",
    description: "",
    noOfQuestions: "",
    duration: "",
    passPercentage: ""
  })



  const durationRegex = /^(1[0-9]|[2-9][0-9]|\d{3,})$/

  const noOfQuestionRegex = /^[1-9]\d*$/
  const passPercentageRegex = /^(100|[1-9][0-9]?)$/



  let handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  let handleCreate = async (e) => {
    e.preventDefault()
    let flag = true
    const err = {}
    if (formData.examName.trim() == "") {
      err.examName = "Exam name is mandatory"
      flag = false
    }

    if (!durationRegex.test(formData.duration) && formData.duration) {
      err.duration = "valid duration"
      flag = false
    } else if (formData.duration == "") {
      err.duration = "duration is mandatory"
      flag = false
    }
    if (!noOfQuestionRegex.test(formData.noOfQuestions) && formData.noOfQuestions) {
      err.noOfQuestions = "should be enter valid noofquestions"
      flag = false
    } else if (formData.noOfQuestions == "") {
      err.noOfQuestions = "npof questions is a mandatory"
      flag = false
    }

    if (!passPercentageRegex.test(formData.passPercentage) && formData.passPercentage) {
      err.passPercentage = "should be enter valid pass percentage"
      flag = false
    } else if (formData.passPercentage == "") {
      err.passPercentage = "pass percentage is a mandatory"
      flag = false
    }

    if (formData.description.trim() == "") {
      err.description = "description is a mandatory"
      flag = false
    }
    if (!flag) {
      setErrors(err)
      return
    }
   
    const response = await fetch("https://localhost:8443/sphinx/api/exam/createexam", {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),

    })
    const data = await response.json();
    if (response.ok) {
      console.log("hii fronytend")
     
      const examId = data.examId;
      console.log("1", data.examId);

      navigate(`/examcreatetopic/${examId}`)
    } else{
      
      toast.error(data.error)

    }


  }
  return (
    <>
      <HeadingTable>
        <H2>Create Assessment</H2>
      </HeadingTable>
      <Container>
        {/* <Heading>Create Assessment</Heading> */}
        <ApiError>{msg}</ApiError>
        <Form onSubmit={handleCreate}>

          <Field>
            <Label>Assessment Name<RedSpan>*</RedSpan></Label>
            <Input type="text" name="examName" onChange={handleChange} />
          </Field>
          {errors.examName && (
            <RegisterError>{errors.examName}</RegisterError>
          )}
          <Field>
            <Label>Description<RedSpan>*</RedSpan></Label>
            <Input type="text" name="description" onChange={handleChange} />
          </Field>
          {errors.description && (
            <RegisterError>{errors.description}</RegisterError>
          )}

          <Field>
            <Label>No. Of Questions<RedSpan>*</RedSpan></Label>
            <Input type="text" name="noOfQuestions" onChange={handleChange} />
          </Field>
          {errors.noOfQuestions && (
            <RegisterError>{errors.noOfQuestions}</RegisterError>
          )}
          <Field>
            <Label>Duration (<b>Minutes</b>)<RedSpan>*</RedSpan></Label>
            <Input type="text" name="duration" onChange={handleChange} />
          </Field>
          {errors.duration && (
            <RegisterError>{errors.duration}</RegisterError>
          )}
          <Field>
            <Label>Pass percentage <span><b>%</b><RedSpan>*</RedSpan></span></Label>
            <Input type="text" name="passPercentage" onChange={handleChange} />
          </Field>
          {errors.passPercentage && (
            <RegisterError>{errors.passPercentage}</RegisterError>
          )}
          <Button type="submit">Create</Button>

        </Form>
      </Container>


    </>
  )
}

export default CreateExamform