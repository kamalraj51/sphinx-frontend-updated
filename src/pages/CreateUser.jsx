import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../component/Layout";
import {
  Button,
  Card,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
} from "../styles/CreateUser.style";
import { RegisterError } from "../styles/SignupStyle";
import { H2, HeadingTable } from "../styles/AvailableExamStyle";
import { RedSpan } from "../styles/FontsStyle";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const CreateUser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const userId = useSelector((state) => state.auth.user)
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "SPX_EXAMINEE",
    userName: "",
    userLoginId: userId
  });
  // Regex patterns
  const firstNameRegex = /^[A-Za-z][A-Za-z '\-]{0,49}$/;
  const lastNameRegex = /^[A-Za-z][A-Za-z '\-\.]{0,49}$/;
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  const userNameRegex = /^[a-zA-Z0-9_]{3,20}$/;

  // Handle input change
  const setValue = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    console.log("form submitted");
    
    e.preventDefault();

    const err = {};

    if (!data.firstName) {
      err.firstName = "First name is mandatory";
    } else if (!firstNameRegex.test(data.firstName)) {
      err.firstName = "First name should be valid";
    }

    if (!data.lastName) {
      err.lastName = "Last name is mandatory";
    } else if (!lastNameRegex.test(data.lastName)) {
      err.lastName = "Last name should be valid";
    }

    if (!data.email) {
      err.email = "Email is mandatory";
    } else if (!emailRegex.test(data.email)) {
      err.email = "Email should be valid";
    }

    if (!data.userName) {
      err.userName = "Username is mandatory";
    } else if (!userNameRegex.test(data.userName)) {
      err.userName = "Username should be valid";
    }

    setErrors(err);

    // 🚫 Stop API call if validation fails
    if (Object.keys(err).length > 0){
      console.log("stoped");
       return};

    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/addUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const result = await response.json(); // ✅ renamed from "data"

      if (response.ok) {
        setShow(true);
        toast.success(result.successMessage);

        // Optional: reset form
        setData({
          firstName: "",
          lastName: "",
          email: "",
          role: "SPX_USER",
          userName: "",
        });

        // Optional: navigate after success
        // navigate("/");
      } else {
        toast.error(result.errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Layout>
      <HeadingTable>
        <H2>Add User</H2>
      </HeadingTable>

      <Container>
        {show && <Card>Submitted successfully</Card>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>
              First Name <RedSpan>*</RedSpan>
            </Label>
            <Input
              name="firstName"
              value={data.firstName}
              onChange={setValue}
            />
          </FormGroup>
          {errors.firstName && (
            <RegisterError>{errors.firstName}</RegisterError>
          )}

          <FormGroup>
            <Label>
              Last Name <RedSpan>*</RedSpan>
            </Label>
            <Input
              name="lastName"
              value={data.lastName}
              onChange={setValue}
            />
          </FormGroup>
          {errors.lastName && (
            <RegisterError>{errors.lastName}</RegisterError>
          )}

          <FormGroup>
            <Label>
              Username <RedSpan>*</RedSpan>
            </Label>
            <Input
              name="userName"
              value={data.userName}
              onChange={setValue}
            />
          </FormGroup>
          {errors.userName && (
            <RegisterError>{errors.userName}</RegisterError>
          )}

          <FormGroup>
            <Label>
              Email Address <RedSpan>*</RedSpan>
            </Label>
            <Input
              name="email"
              value={data.email}
              onChange={setValue}
            />
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

export default CreateUser;