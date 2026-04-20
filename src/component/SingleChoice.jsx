import React, { useState } from 'react'
import ExamAttend from '../pages/ExamAttend'
 
const SingleChoice = ({item}) => {
 const [next,setNext]=useState(false)
 const [answer,setAnswer]=useState("")
    const handleSubmit=()=>{
       
        setNext(true)
    }
  return (
    <>
        <Qusetion>{item.questionDetail}</Qusetion>
        <Form onSubmit={handleSubmit}>
            <input type="radio" name="option" value="A" onChange={(e)=>{setAnswer(e.target.value)}}/>item.optionA
            <input type="radio" name="option" value="B"   onChange={(e)=>{setAnswer(e.target.value)}}/>item.optionB 
             <input type="radio" name="option" value="C"   onChange={(e)=>{setAnswer(e.target.value)}}/>item.optionC
            <input type="radio" name="option" value="D"   onChange={(e)=>{setAnswer(e.target.value)}}/>item.optionD
            <Button type="submit">next</Button>

        </Form>
        {
            next&&<ExamAttend answers={answer}/>
        }
        
 
 
    </>
  )
}
 
export default SingleChoice
 