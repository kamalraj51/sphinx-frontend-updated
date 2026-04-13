import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  ApiError,
  RegisterButton,
  RegisterContainer,
  RegisterError,
  RegisterFooter,
  RegisterForm,
  RegisterSubtitle,
  RegisterTitle,
  RegisterWrapper,
  FieldWrapper,
  FloatingInput,
  FloatingLabel,
  PasswordWrapper,
  TogglePassword,
  Spinner,
} from "../styles/SignupStyle";

import Layout from "../component/Layout";
import { H2, HeadingTable } from "../styles/AvailableExamStyle";

// REGEX
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
const phNoRegex = /^[1-9]\d{9}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;

const AddAdmin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phNo: "",
    password: "",
    confirmPassword: "",
    role: "SPX_ADMIN"
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));

    setApiError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!usernameRegex.test(formData.userName)) {

      newErrors.username = "3-15 chars, letters/numbers/_ only";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!phNoRegex.test(formData.phNo)) {
      newErrors.phNo = "Enter valid 10-digit Indian number";
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Min 8 chars, upper, lower, number, special char required";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setApiError("");

    try {
      const res = await fetch(
        "https://localhost:8443/sphinx/api/user/signUp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Signup failed");
        return;
      }

      navigate("/");
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <HeadingTable>
        <H2>Add Admin</H2>
      </HeadingTable>

      <RegisterContainer>
        <RegisterWrapper>
          {/* <RegisterTitle>SPHINX</RegisterTitle> */}
          {/* <RegisterSubtitle>Add Admin</RegisterSubtitle> */}

          <RegisterForm onSubmit={handleSubmit}>

            {apiError && <ApiError>{apiError}</ApiError>}

            {/* FIRST NAME */}
            <FieldWrapper>
              <FloatingInput id="firstName" placeholder=" " onChange={handleChange} />
              <FloatingLabel>First Name</FloatingLabel>
              {errors.firstName && (
                <RegisterError>{errors.firstName}</RegisterError>
              )}
            </FieldWrapper>

            {/* LAST NAME */}
            <FieldWrapper>
              <FloatingInput id="lastName" placeholder=" " onChange={handleChange} />
              <FloatingLabel>Last Name</FloatingLabel>
              {errors.lastName && (
                <RegisterError>{errors.lastName}</RegisterError>
              )}
            </FieldWrapper>

            {/* USERNAME */}
            <FieldWrapper>
              <FloatingInput id="userName" placeholder=" " onChange={handleChange} />
              <FloatingLabel>Username</FloatingLabel>
              {errors.userName && (
                <RegisterError>{errors.userName}</RegisterError>
              )}
            </FieldWrapper>

            {/* EMAIL */}
            <FieldWrapper>
              <FloatingInput
                type="email"
                id="email"
                placeholder=" "
                onChange={handleChange}
              />
              <FloatingLabel>Email</FloatingLabel>
              {errors.email && <RegisterError>{errors.email}</RegisterError>}
            </FieldWrapper>

            {/* PHONE */}
            <FieldWrapper>
              <FloatingInput id="phNo" placeholder=" " onChange={handleChange} />
              <FloatingLabel>Phone Number</FloatingLabel>
              {errors.phNo && <RegisterError>{errors.phNo}</RegisterError>}
            </FieldWrapper>

            {/* PASSWORD */}
            <PasswordWrapper>
              <FloatingInput
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=" "
                onChange={handleChange}
              />
              <FloatingLabel>Password</FloatingLabel>

              <TogglePassword className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"} onClick={() => setShowPassword((p) => !p)}>

              </TogglePassword>

              {errors.password && (
                <RegisterError>{errors.password}</RegisterError>
              )}
            </PasswordWrapper>

            {/* CONFIRM PASSWORD */}
            <PasswordWrapper>
              <FloatingInput
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                placeholder=" "
                onChange={handleChange}
              />
              <FloatingLabel>Confirm Password</FloatingLabel>

              <TogglePassword className={showConfirm ? "fa fa-eye-slash" : "fa fa-eye"} onClick={() => setShowConfirm((p) => !p)}>

              </TogglePassword>

              {errors.confirmPassword && (
                <RegisterError>{errors.confirmPassword}</RegisterError>
              )}
            </PasswordWrapper>

            {/* BUTTON */}
            <RegisterButton type="submit">
              {loading ? (
                <>
                  <Spinner /> Adding...
                </>
              ) : (
                "Add Admin"
              )}
            </RegisterButton>

          </RegisterForm>
        </RegisterWrapper>
      </RegisterContainer>
    </Layout>
  );
};

export default AddAdmin;