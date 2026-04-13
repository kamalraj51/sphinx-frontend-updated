import React, { useEffect, useState } from 'react'
import { List } from '../styles/Assign.style'
import { Button } from '../styles/AvailableExamStyle'
import UsersList from '../pages/UsersList'
import { toast } from 'sonner'

const AlreadyExam = ({ examId }) => {
    const [data, setData] = useState([])
    const [isdelete,setIsDelete]=useState(false)
    const getAll = async () => {
        try {
            const response = await fetch("https://localhost:8443/sphinx/api/user/getPartyExam", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ examId })
            })

            if (response.ok) {
                const value = await response.json()
                setData(value?.allData || [])  
            } else {
                console.log("data not found")
                setData([]) 
            }
        } catch (err) {
            console.log(err)
            setData([])
        }
    }

    useEffect(() => {
        if (examId) {
            getAll()
        }
    }, [examId])

    const handleDeleteExam = async (item) => {
        const response = await fetch("https://localhost:8443/sphinx/api/user/deleteExamRelationship", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                examId,
                partyId: item.partyId
            })
        })
        const data=await response.json()
        if (response.ok) {
            toast.success(data.success)
            getAll() // 🔥 always refresh from DB
        }else{
            toast.success(data.error)
        }
    }

    return (
    <>
        <List>
            {
                data.map((item, i) => (
                    <React.Fragment key={i}>
                        <li>{item.partyId}</li>
                        <li>{item.userLoginId}</li>
                        <Button onClick={() =>{ handleDeleteExam(item);setIsDelete(true)}}>
                            delete
                        </Button>
                        
                    </React.Fragment>
                ))
            }
        </List>
         
    </>
    )
}

export default AlreadyExam