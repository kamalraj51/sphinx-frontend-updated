


import { useLocation } from 'react-router-dom'
import { Form, Input, Option, Select, Button } from '../styles/AvailableExamStyle'
import Layout from '../component/Layout'
import Assign from '../component/Assign'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { RegisterError } from '../styles/SignupStyle'
import {ActionWrapper, Attempt,Cell,CellPrimary, HeaderRow, Outer,Row,Section,Title} from '../styles/Assign.style';
import { ButtonSecondary } from '../styles/AvailableExamStyle';
import { List } from '../styles/Assign.style'
import Assignexamtempoaryupdate from '../component/Assignexamtempoaryupdate'
const UsersList = () => {
  const location = useLocation()
  const examId = location.state?.examId

  const [user, setUser] = useState([])
  const [assignedUsers, setAssignedUsers] = useState([])
  const [alreadyAssignedUsers,setAlreadyAssignedUsers] =useState([])
 const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    examId: examId,
    partyId: "",
    noOfAttempts: "0",
    allowedAttempts: "",
    timeoutDays: "",
    userLoginId: ""
  })
  const [errors,setErrors]=useState({})

 
const numberRegex = /^[0-9]+$/
 
  useEffect(() => {
    if (examId) {
      setFormData(prev => ({
        ...prev,
        examId
      }))
    }
  }, [examId])
// useEffect(()=>{
//     getAll()
//     getAllAssignedUsers()
// },[examId])
  
  const handleUser = async () => {
    try {
      const response = await fetch("https://localhost:8443/sphinx/api/user/getAllUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          examId: formData.examId,
          servicetype: "not assiggned"
        })
      })

      if (!response.ok) throw new Error("Failed")

      const data = await response.json()
      setUser(data.allUser || [])

    } catch (err) {
      console.log("Retrying...")
      setTimeout(handleUser, 1000)
    }
  }

  
  const getAllAssignedUsers = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/getAllUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            examId: formData.examId,
            userLoginId:formData.userLoginId,
            servicetype: "assigned"
          })
        }
      )
      const value = await response.json()
      if (response.ok) {
        
        setAssignedUsers(value.allUser || [])
        
      }else{
          setAssignedUsers([])
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (formData.examId) {
      handleUser()
      getAllAssignedUsers()
      getAll()
      
      
    }
  }, [formData.examId])

  
  const handleform = (e) => {
    const { name, value } = e.target

    if (name === "partyId") {
      const selectedUser = user.find(u => u.partyId === value)

      if (selectedUser) {
        setFormData(prev => ({
          ...prev,
          partyId: selectedUser.partyId,
          userLoginId: selectedUser.userLoginId
        }))
      }
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  
 const handleSubmit = async (e) => {
  e.preventDefault()

  let err = {}
  let flag = true

  if (!formData.allowedAttempts) {
    err.allowedAttempts = "Allowed attempts is mandatory"
    flag = false
  } else if (!numberRegex.test(formData.allowedAttempts)) {
    err.allowedAttempts = "Must be a valid number"
    flag = false
  }

  if (!formData.timeoutDays) {
    err.timeoutDays = "Timeout days is mandatory"
    flag = false
  } else if (!numberRegex.test(formData.timeoutDays)) {
    err.timeoutDays = "Must be a valid number"
    flag = false
  }

  if (!flag) {
    setErrors(err)
    return
  }
  setErrors({})

  try {
    const response = await fetch(
      "https://localhost:8443/sphinx/api/user/assigntempoary",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      }
    )
    if (response.ok) {

    const data = await response.json()
    console.log("veera");
    
      toast.success(data.success)
      handleUser()
      getAllAssignedUsers()

    } else {
        console.log("RESPONSE => ", response);
      toast.error(data.error || "Failed to Load Data!")
    }
  } catch (err) {
    console.log(err)
    // toast.error("retrying")
  }
}
 
   const alreadyAssigned = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/saveexamrelationship",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ allData: assignedUsers })
        }
      );

      const data = await response.json();

      if (response.ok) {


        console.log("hello")
        toast.success(data.success);
        getAll();
        getAllAssignedUsers()
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (!assignedUsers) {
    return <p>No users assigned</p>;
  }
 
   const getAll = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/getPartyExam",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ examId:examId })
        }
      )

      if (response.ok) {
        const value = await response.json()
        setAlreadyAssignedUsers(value.allData || []) 
      } else {
        setAlreadyAssignedUsers([])

      }
    } catch (err) {
      console.error(err)
      setAlreadyAssignedUsers([])
    }
  }
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
        console.log("hii");
        
        toast.success(data.success)
        getAll() // refresh
        handleUser()
      } else {
        toast.error(data.error)
      }

    } catch (err) {
      console.error(err)
      toast.error("Delete failed")
    }
  }

  


  return (
    <Layout>
      <Form onSubmit={handleSubmit}>
        <Select onChange={handleform} name="partyId">
          <Option value="">select</Option>
          {user.map((item) => (
            <Option value={item.partyId} key={item.partyId}>
              {item.userLoginId}
            </Option>
          ))}
        </Select>

        <Input
          type="text"
          name="allowedAttempts"
          onChange={handleform}
          placeholder='allowed attempts'
        />
         {errors.allowedAttempts && (
            <RegisterError>{errors.allowedAttempts}</RegisterError>
          )}

        <Input
          type="text"
          name="timeoutDays"
          onChange={handleform}
          placeholder='timeout days'
        />
         {errors.timeoutDays && (
            <RegisterError>{errors.timeoutDays}</RegisterError>
          )}

        <Button type="submit">Assign</Button>
      </Form>
      <Outer>
        <Title>Assign</Title>

        <HeaderRow>
          <p>User Name</p>
          <p>Allowed Attempts</p>
          <p>No Of Attempts</p>
          <p>Time Out Days</p>
        </HeaderRow>

        {assignedUsers.length === 0 ? (
          <p>No assigned users found</p>
        ) : (
          assignedUsers.map((item) => (
            <Row key={item.partyId}>
              <CellPrimary>{item.userLoginId}</CellPrimary>

              <Cell>{item.allowedAttempts}</Cell>

              <Attempt danger={item.noOfAttempts > item.allowedAttempts}>
                {item.noOfAttempts}
              </Attempt>

              <Cell>{item.timeoutDays}</Cell>
              <Button onClick={() => setSelectedUser(item)}>update</Button>
              
            </Row>
          ))
        )}
        {selectedUser && (<Assignexamtempoaryupdate item={selectedUser}
                            onClose={() => {setSelectedUser(null), getAllAssignedUsers()}}
                           />
        )}

        <ActionWrapper>
          <ButtonSecondary onClick={alreadyAssigned}>
            Submit All
          </ButtonSecondary>
        </ActionWrapper>
      </Outer>

      <Section>
         <List>
      {alreadyAssignedUsers.map((item) => (
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
      </Section>

      
    </Layout>
  )
}

export default UsersList