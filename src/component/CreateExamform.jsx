import React, { useState } from 'react'
import { ApiError, Button, Container, Field, Form, Heading, Input, Label } from '../styles/CreateExam.style'
import { NavLink, useNavigate } from 'react-router-dom'
import { RegisterError } from '../styles/SignupStyle'
import { H2, HeadingTable } from '../styles/AvailableExamStyle'

const CreateExamform = () => {
  const navigate = useNavigate()
  const [msg, setMsg] = useState("")
  const [errors, setErrors] = useState({})
  let [formData, setFormData] = useState({
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

    let response = await fetch("https://localhost:8443/sphinx/api/exam/createexam", {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),

    })

    if (response.ok) {
      console.log("hii fronytend")
      const data = await response.json();
      const examId = data.examId;
      console.log("1", data.examId);

      navigate(`/examcreatetopic/${examId}`)
    } else if (!response.ok) {
      const data = await response.json();
      setMsg(data.error)

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
            <Label>Assessment Name</Label>
            <Input type="text" name="examName" onChange={handleChange} />
          </Field>
          {errors.examName && (
            <RegisterError>{errors.examName}</RegisterError>
          )}
          <Field>
            <Label>Description</Label>
            <Input type="text" name="description" onChange={handleChange} />
          </Field>
          {errors.description && (
            <RegisterError>{errors.description}</RegisterError>
          )}

          <Field>
            <Label>No. Of Questions</Label>
            <Input type="text" name="noOfQuestions" onChange={handleChange} />
          </Field>
          {errors.noOfQuestions && (
            <RegisterError>{errors.noOfQuestions}</RegisterError>
          )}
          <Field>
            <Label>Duration (<b>Minutes</b>)</Label>
            <Input type="text" name="duration" onChange={handleChange} />
          </Field>
          {errors.duration && (
            <RegisterError>{errors.duration}</RegisterError>
          )}
          <Field>
            <Label>Pass percentage <span><b>%</b></span></Label>
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