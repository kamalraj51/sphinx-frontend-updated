import React, { useEffect, useState } from 'react'
import { Button } from '../styles/AvailableExamStyle'
import { toast } from 'sonner'
import { List } from '../styles/Assign.style'

const AlreadyExam = ({ examId }) => {
  const [data, setData] = useState([])

 

  useEffect(() => {
    if (examId) {
      getAll()
    }
  }, [examId]) // ✅ FIXED

  const handleDeleteExam = async (item) => {
    try {
      const res = await fetch(
        "https://localhost:8443/sphinx/api/user/deleteExamRelationship",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examId,
            partyId: item.partyId
          })
        }
      )

      const data = await res.json()

      if (res.ok) {
        toast.success(data.success)
        getAll() // refresh
      } else {
        toast.error(data.error)
      }

    } catch (err) {
      console.error(err)
      toast.error("Delete failed")
    }
  }

  if (data.length === 0) {
    return <p>No exams found</p>
  }

  return (
    <List>
      {data.map((item) => (
        <li
          key={item.partyId}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            marginBottom: "10px"
          }}
        >
          <div>
            <strong>{item.partyId}</strong>
            <div>{item.userLoginId}</div>
          </div>

          <Button onClick={() => handleDeleteExam(item)}>
            Delete
          </Button>
        </li>
      ))}
    </List>
  )
}

export default AlreadyExam