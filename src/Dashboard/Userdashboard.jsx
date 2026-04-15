import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'sonner';



const Userdashboar = () => {

  const [data,setData] = useState([])
   const userId = useSelector((state) => state.auth.user);
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
      setData(value)
    }else{
      toast.error(value.error)
    }
  }
  return (

    <>
    <h1>user</h1>
    <div>
       {
        data&& data.map((e,i)=>{
          <p></p>
        })



       }

    </div>
   
        


      
    </>
  )
}

export default Userdashboar