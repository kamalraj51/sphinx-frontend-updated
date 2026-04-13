import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../component/Layout";
import { Button, Card, Container, Form, FormGroup, Input, Label, Title } from "../styles/CreateUser.style";
import { RegisterError } from "../styles/SignupStyle";
import { H2, HeadingTable } from "../styles/AvailableExamStyle";
import { RedSpan } from "../styles/FontsStyle";

const CreateUser = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [data, setData] = useState({

    firstName: "",
    lastName: "",
    email: "",

    role: "SPX_USER",
    userName: ""
  });
  const firstName = /^[A-Za-z][A-Za-z '\-]{0,49}$/
  const lastName = /^[A-Za-z][A-Za-z '\-\.]{0,49}$/
  const email = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
  const userName = /^[a-zA-Z0-9_]{3,20}$/

  const setValue = (e) => {
    console.log(e.target.name + e.target.value)
    setData({

      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    const err = {}
    //   firstName:"",
    //   userName:"",
    //   email:"",
    //   lastName:""

    // }
    e.preventDefault();


    if (!firstName.test(data.firstName) && data.firstName != "") {
      err.firstName = "firstname shold be valid name"
    } else if (data.firstName == "") {
      err.firstName = "firstname is mandatory"
    }

    if (!lastName.test(data.lastName) && data.lastName != "") {
      err.lastName = "last Name should be valid lastNmae"
    } else if (data.lastName == "") {
      err.lastName = "lastname is mandatory"
    }
    if (!email.test(data.email) && data.email != "") {
      err.email = "email should be valid "
    } else if (data.email == "") {
      err.email = "Email is mandatory"
    }
    if (!userName.test(data.userName) && data.userName != "") {
      err.userName = "username should be valid"
    } else if (data.userName == "") {
      err.userName = "userName is mandatory"
    }
    console.log(err)
    setErrors(err)
    try {
      console.log(data)
      const response = await fetch("https://localhost:8443/sphinx/api/user/addUser", {

        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // navigate("/");
        setShow(true)
      } else {
        console.error("Failed to add user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Layout>
      <HeadingTable>
        <H2>Add User</H2>
      </HeadingTable>
      <Container>
        {/* <Title>Add User</Title> */}
        {
          show && <Card>submited successfully</Card>
        }
        <Form onSubmit={handleSubmit}>


          <FormGroup>
            <Label>First Name <RedSpan>*</RedSpan></Label>
            <Input name="firstName" onChange={setValue} />
          </FormGroup>
          {errors.firstName && (
            <RegisterError>{errors.firstName}</RegisterError>
          )}
          <FormGroup>
            <Label>Last Name <RedSpan>*</RedSpan></Label>
            <Input name="lastName" onChange={setValue} />
          </FormGroup>
          {errors.lastName && (
            <RegisterError>{errors.lastName}</RegisterError>
          )}
          <FormGroup>
            <Label>UserName <RedSpan>*</RedSpan></Label>
            <Input name="userName" onChange={setValue} type="text" />
          </FormGroup>
          {errors.userName && (
            <RegisterError>{errors.userName}</RegisterError>
          )}

          <FormGroup>
            <Label>Email Address <RedSpan>*</RedSpan></Label>
            <Input name="email" onChange={setValue} />
          </FormGroup>
          {errors.email && (
            <RegisterError>{errors.email}</RegisterError>
          )}



          <Button type="submit">Add User +</Button>
        </Form>
      </Container>
    </Layout>
  );
};
export default CreateUser