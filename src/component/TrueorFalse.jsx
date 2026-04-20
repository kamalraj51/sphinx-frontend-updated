import React from 'react'
import ExamAttend from '../pages/ExamAttend'

const TrueorFalse = () => {
 const [next,setNext]=useState(false)
  const [answer,setAnswer]=useState("")
     const handleChange=(e)=>{
        setAnswer(e.target.value)
         setNext(true)
     }
   return (
     <>
         
             <input type="radio" name="option" value="A" onChange={(e)=>{handleChange(e)}}/>true
             <input type="radio" name="option" value="B"   onChange={(e)=>{handleChange(e)}}/>false
            
            {
             next&&<ExamAttend answer={answer}/>
            }
  
        
         
        
  
  
     </>
   )
 }


export default TrueorFalse