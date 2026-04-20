import React, { useState } from 'react'
import { Button } from '../styles/AvailableExamStyle'
import { toast } from 'sonner'
import { CloseIcon, PopupBox, PopupInput, PopupTitle, PopupWrapper } from '../styles/AssigntempoaryUpdate.style'

const Assignexamtempoaryupdate = ({item, onClose}) => {
  const [show,setShow]=useState (true)
  const [form,setForm]=useState({
     examId: item.examId,
    partyId: item.partyId,
    noOfAttempts: item.noOfAttempts,
    allowedAttempts:item.allowedAttempts,
    timeoutDays: item.timeoutDays
  })
  const update=async(e)=>{
    e.preventDefault()
    const response=await fetch("https://localhost:8443/sphinx/api/user/asssignTempoaryUpdate",{
      method:"PUT",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify(form)

    })
    const msg=await response.json()
    if(response.ok){
      toast.success(msg.success)
    }else{
      toast.error(msg.error)
    }
  }
  const handleForm=(e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value

    })
  }
  return (
    <>
         <PopupWrapper>
    <PopupBox>
       <CloseIcon onClick={onClose}>×</CloseIcon> 

      <PopupTitle>Update</PopupTitle>

      <form onSubmit={update}>
        <PopupInput
          value={form.allowedAttempts}
          name="allowedAttempts"
          onChange={handleForm}
          placeholder="No of Attempts"
        />

        <PopupInput
          value={form.timeoutDays}
          name="timeoutDays"
          onChange={handleForm}
          placeholder="Timeout Days"
        />

        <Button type="submit">Update</Button>
      </form>
    </PopupBox>
  </PopupWrapper>

        
    </>
  )
}

export default Assignexamtempoaryupdate