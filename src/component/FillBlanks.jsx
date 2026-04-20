import React from 'react'

const FillBlanks = ({answer, setAnswerValue}) => {
  return (
    <>
        <Textarea value={answer} onChange={(e)=>{setAnswerValue(e.target.value)}}/>
    </>
  )
}

export default FillBlanks