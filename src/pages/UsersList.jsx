import { NavLink, useLocation, useParams } from 'react-router-dom'
import { Container } from '../styles/UserList.style'
import { Button, ButtonSecondary, Form, Input, Option, Select } from '../styles/AvailableExamStyle'
import Layout from '../component/Layout'
import Assign from '../component/Assign'
import AlreadyExam from '../component/AlreadyExam'
import { useEffect, useState } from 'react'

const UsersList = () => {

    let location = useLocation()
    const [user, setUser] = useState([])

    const [data, setData] = useState({ allData: [] })

    const [formData, setFormData] = useState({
        examId: location.state?.examId,
        partyId: "",
        noOfAttempts: "0",
        allowedAttempts: "",
        timeoutDays: "",
        userLoginId: ""
    })

    
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            examId: location.state?.examId
        }))
    }, [location.state?.examId])

    const handleSubmit = async (e) => {
        e.preventDefault()

        setData(prev => ({ allData: [...prev.allData, formData] }))

        const response = await fetch("https://localhost:8443/sphinx/api/user/assigntempoary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            console.log("success")
        }
    }

    const handleform = (e) => {
        let value = e.target.value

        if (e.target.name === "partyId") {
            const selectedUser = user.find(u => u.partyId === value)

            setFormData({
                ...formData,
                partyId: selectedUser.partyId,
                userLoginId: selectedUser.userLoginId
            })

            return
        }

        setFormData({
            ...formData,
            [e.target.name]: value
        })
    }

    const handleUser = async () => {
        try {
            const response = await fetch("https://localhost:8443/sphinx/api/user/getAllUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    examId: formData.examId,
                    servicetype: "assig"
                })
            })

            if (!response.ok) throw new Error("Failed")

            const data = await response.json()
            setUser(data.allUser || [])

        } catch (err) {
            console.log("Retrying...")

            setTimeout(() => {
                handleUser()
            }, 1000)
        }
    }

    useEffect(() => {
        if (formData.examId) {
            handleUser()
        }
    }, [formData.examId])

    return (
        <>
            <Layout>
                <Form onSubmit={handleSubmit}>
                    <Select onChange={(e) => handleform(e)} name="partyId">
                        <Option>select</Option>
                        {
                            user.map((item, i) => (
                                <Option value={item.partyId} key={i}>
                                    {item.userLoginId}
                                </Option>
                            ))
                        }
                    </Select>

                    <Input
                        type="text"
                        name="allowedAttempts"
                        onChange={(e) => handleform(e)}
                        placeholder='allowedattempts'
                    />

                    <Input
                        type="text"
                        name="timeoutDays"
                        onChange={(e) => handleform(e)}
                        placeholder='timeoutdays'
                    />

                    <Button type="submit">assign</Button>
                </Form>

               
                <Assign key={formData.examId} examId={formData.examId} />
               

            </Layout>
        </>
    )
}

export default UsersList