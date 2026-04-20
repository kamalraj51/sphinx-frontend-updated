import React, { useState } from 'react'
import ExamAttend from '../pages/ExamAttend'
 
const SingleChoice = ({item,setAnswerValue}) => {
 
 
    const handleChange=(e)=>{
       setAnswerValue(e.target.value)
       
    }
  return (
    <>
       
            <input type="radio" name="option" value="A" onClick={(e)=>{handleChange(e)}}/>{item.optionA}
            <input type="radio" name="option" value="B"   onClick={(e)=>{handleChange(e)}}/>{item.optionB}
             <input type="radio" name="option" value="C"   onClick={(e)=>{handleChange(e)}}/>{item.optionC}
            <input type="radio" name="option" value="D"   onClick={(e)=>{handleChange(e)}}/>{item.optionD}
         
 
       
       
       
 
 
    </>
  )
}
 
export default SingleChoice
 
 
 