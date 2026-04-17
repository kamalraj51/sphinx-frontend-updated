import React, { useState } from "react";

import { Navigate, NavLink, useNavigate } from "react-router-dom";

import {
  InputWrapper,
  LoginButton,
  LoginContainer,
  LoginError,
  LoginField,
  LoginFooter,
  LoginForm,
  LoginInput,
  LoginInputPass,
  LoginLabel,
  LoginTitle,
  LoginWrapper,
} from "../styles/LoginStyle";
import {
  ApiError,
  FieldWrapper,
  FloatingInput,
  FloatingLabel,
  PasswordWrapper,
  RegisterButton,
  Spinner,
  TogglePassword,
} from "../styles/SignupStyle";
import { useDispatch, useSelector } from "react-redux";

import { login,setRole } from "../reducer/authSlice";
import Header from "../component/Header";
//riswan
const UserSignin = () => {
  const [formData, setFormData] = useState({
    userLoginId: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false);
  const [apiError, setApiError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleForm = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.id]: "",
    });

    setApiError("");
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.userLoginId) {
      newErrors.userLoginId = "userName should not be blank";
    }
    if (!formData.password) {
      newErrors.password = "password should not be blank";
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
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/signIn",
        {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        console.log("not login...");

        setApiError(data.message || "invalid credinatilas ");


        return;
      }
      console.log("h")
      //sucess =>redirect
      dispatch(login({ userLoginId: formData.userLoginId }));
      // dispatch(setLoginId(formData.userLoginId));
      await new Promise((resolve) => setTimeout(resolve, 1000));

      //navigate(data.role);
      
       dispatch(setRole(data.role))
      if (data.role == "admin") {
       
       navigate("/adminhome", { state: { userLoginId: formData.userLoginId } });
      } else if (data.role == "user") {
       
        navigate("/userdashboard");
      }
      
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <LoginContainer>
        <LoginWrapper>
          <LoginTitle>SPHINX</LoginTitle>

          <LoginForm onSubmit={handleSubmit}>
            <h2>SignIn</h2>
            {apiError && <ApiError>{apiError}</ApiError>}

            <FieldWrapper>
              <FloatingInput
                id="userLoginId"
                placeholder=" "
                value={formData.userLoginId}
                onChange={handleForm}
              />
              <FloatingLabel>Username</FloatingLabel>
              {errors.userLoginId && (
                <LoginError>{errors.userLoginId}</LoginError>
              )}
            </FieldWrapper>

            <PasswordWrapper>
              <FloatingInput
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder=" "
                onChange={handleForm}
              />
              <FloatingLabel>Password</FloatingLabel>

              <TogglePassword
                className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}
                onClick={() => setShowPassword((p) => !p)}
              ></TogglePassword>

              {errors.password && <LoginError>{errors.password}</LoginError>}
            </PasswordWrapper>

            {/* BUTTON */}
            <RegisterButton type="submit">
              {loading ? (
                <>
                  <Spinner /> Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </RegisterButton>
          </LoginForm>
        </LoginWrapper>
      </LoginContainer>
    </>
  );
};

export default UserSignin;
