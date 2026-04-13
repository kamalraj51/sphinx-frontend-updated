import React, { useEffect, useState } from 'react'
import UserPromote from '../pages/UserPromote';

const Getalluser = () => {
  let [users,setUser] = useState([])
  let [error,setError]=useState("")
  let[success,setSuccess]=useState("")
    useEffect(()=>{
      getDetails();
  
    },[])
    let getDetails= async ()=>{
       try {
        const response = await fetch(
          "https://localhost:8443/sphinx/api/user/getall",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          
          },
        );
  
        const data = await response.json();
        console.log("data", data);
  
        if (data.status === "404" && data.message === "error") {
          setError("data not found");
        } else if (data.status === "200" || data.status === "success") {
          setSuccess("data found");
          console.log("data:", data);
          setUser(data.message)
        } else {
          setError("Login failed. Please try again.");
        }
      } catch (err) {
        console.error("data error:", err);
        setError("Network error. Please check your connection and try again.");
      } 
    
  
    }
  return (
    <>
        <UserPromote alluser={users}/>

    </>
  )
}

export default Getalluser