import React, { useEffect, useState } from 'react'

import { NavLink, useLocation } from 'react-router-dom'
import { Container } from '../styles/UserList.style'
import { Button, ButtonSecondary, Form, Input, Option, Select } from '../styles/AvailableExamStyle'
import Layout from '../component/Layout'


const UsersList = () => {
    let location =useLocation()
    const [user, setUser] = useState([])
    const [userName,setUserName] =useState("")
    const [data,setData]=useState({allData:[]})

    const [formData,setFormData]=useState(
        {
            examId: location.state?.examId || "",
            partyId:"",
            noOfAttempts:"",
            allowedAttempts:"",
            timeoutDays:"",

            
        }
    )
    const handleSubmit=(e)=>{
        e.preventDefault()
        setData(prev => ({ allData: [...prev.allData, formData] }))
    }
    const lastSubmit=async()=>{
        console.log(data)
        const rsponse=await fetch("https://localhost:8443/sphinx/api/user/saveexamrelationship",{
            method:"POST",
            headers:{
                "content-Type":"application/json"
            },
            body:JSON.stringify(data),
        })
    }

     const handleform = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleUser = async () => {
        const response = await fetch("https://localhost:8443/sphinx/api/user/getAllUser", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })

        if (response.ok) {
            const data = await response.json()
            console.log(data)
            setUser(data.allUser)
        }
    }

    useEffect(() => {
        handleUser()
    }, [])

    return (
    <>
    <Layout>
        <Form onSubmit={handleSubmit}>
            <Select onChange={(e)=>handleform(e)} name="partyId">
            <Option>select </Option>
            {
                user.map((e, i) => {
                    return (
                       <Option value={e} key={i}>{e}</Option>
                    )
                })
            }
        </Select>
        <Input type="text" name="allowedAttempts" onChange={(e)=>handleform(e)} placeholder='allowedattempts'/>
         {/* <Input type="text" name="noOfAttempts" onChange={(e)=>handleform(e)} placeholder='noofattempts'/> */}
         <Input type="text" name="timeoutDays" onChange={(e)=>handleform(e)} placeholder='timeoutdays'/>
         <Button type="submit">assign</Button>
        </Form>

         <ButtonSecondary onClick={lastSubmit}>submit all</ButtonSecondary>
    </Layout>

    </>
       
    )
}

export default UsersList