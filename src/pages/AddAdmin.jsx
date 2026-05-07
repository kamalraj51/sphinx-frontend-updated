import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../component/Layout";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import {
  ShieldPlus, User, AtSign, Mail, Phone,
  Lock, Eye, EyeOff, ChevronRight, Loader2, AlertCircle
} from "lucide-react";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const PageWrap = styled.div`
  font-family: 'Sora', 'DM Sans', 'Segoe UI', sans-serif;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeroBar = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 20px 32px;
  background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%);
  border-radius: 16px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
`;

const HeroIconRing = styled.div`
  width: 52px; height: 52px; border-radius: 16px;
  background: rgba(16,185,129,0.2);
  border: 1.5px solid rgba(52,211,153,0.35);
  display: flex; align-items: center; justify-content: center;
  color: #34d399; flex-shrink: 0;
  position: relative; z-index: 1;
`;

const HeroTitle = styled.h1`
  color: #fff; font-size: 20px; font-weight: 800;
  margin: 0; letter-spacing: -0.4px;
  position: relative; z-index: 1;
`;

const HeroSub = styled.p`
  color: rgba(255,255,255,0.6); font-size: 13px;
  margin: 2px 0 0; font-weight: 500;
  position: relative; z-index: 1;
`;

const Card = styled.div`
  background: #fff; border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.10), 0 1px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  animation: ${fadeUp} 0.45s ease both;
  animation-delay: 0.05s;
`;

const CardHeader = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 16px 24px;
  border-bottom: 2px solid #d1fae5;
  background: #f0fdf4;
`;

const CardTitle = styled.h2`
  font-size: 13px; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.8px;
  color: #059669; margin: 0;
`;

const CardBody = styled.div`
  padding: 28px 32px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FullSpan = styled.div`
  grid-column: 1 / -1;
`;

const FieldWrap = styled.div`
  display: flex; flex-direction: column; gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.6px;
  color: #64748b;
  display: flex; align-items: center; gap: 6px;
  svg { color: #10b981; }
`;

const RedStar = styled.span`
  color: #ef4444; font-size: 13px; line-height: 1;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  font-size: 13.5px; color: #1e293b;
  font-family: inherit; background: #f8fafc;
  transition: border-color 0.18s, box-shadow 0.18s;
  box-sizing: border-box;

  &:focus {
    outline: none; border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
    background: #fff;
  }
  &::placeholder { color: #94a3b8; }
`;

const PasswordWrap = styled.div`
  position: relative;
`;

const PasswordInput = styled(StyledInput)`
  padding-right: 44px;
`;

const ToggleBtn = styled.button`
  position: absolute;
  right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  color: #94a3b8; cursor: pointer;
  display: flex; align-items: center; padding: 0;
  transition: color 0.15s;
  &:hover { color: #10b981; }
`;

const ErrorText = styled.p`
  font-size: 11.5px; color: #ef4444; margin: 0; font-weight: 600;
`;

const ApiErrorBox = styled.div`
  display: flex; align-items: center; gap: 9px;
  padding: 11px 14px;
  border-radius: 10px;
  background: #fef2f2; border: 1px solid #fecaca;
  color: #dc2626; font-size: 13px; font-weight: 600;
  margin-bottom: 4px;
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const SubmitBtn = styled.button`
  display: flex; align-items: center; gap: 8px;
  padding: 11px 28px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff; border: none; border-radius: 10px;
  font-size: 14px; font-weight: 700; font-family: inherit;
  cursor: pointer; box-shadow: 0 3px 8px rgba(16,185,129,0.28);
  transition: all 0.18s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16,185,129,0.4);
  }
  &:active:not(:disabled) { transform: scale(0.97); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const SpinIcon = styled(Loader2)`
  animation: ${spin} 0.8s linear infinite;
`;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
const phNoRegex = /^[1-9]\d{9}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;

const AddAdmin = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phNo: "",
    password: "",
    confirmPassword: "",
    role: "SPX_ADMIN",
    userLoginId: userId,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!usernameRegex.test(formData.userName)) newErrors.userName = "3–15 chars, letters/numbers/_ only";
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";
    if (!phNoRegex.test(formData.phNo)) newErrors.phNo = "Enter valid 10-digit number";
    if (!passwordRegex.test(formData.password)) newErrors.password = "Min 8 chars, upper, lower, number & special char";
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");

    try {
      const res = await fetch("https://localhost:8443/sphinx/api/user/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.message || "Signup failed");
        return;
      }
      navigate("/");
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageWrap>

        <HeroBar>
          <HeroIconRing>
            <ShieldPlus size={24} strokeWidth={1.8} />
          </HeroIconRing>
          <div>
            <HeroTitle>Add Admin</HeroTitle>
            <HeroSub>Create a new administrator account</HeroSub>
          </div>
        </HeroBar>

        <Card>
          <CardHeader>
            <ShieldPlus size={15} color="#059669" />
            <CardTitle>Admin Details</CardTitle>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit}>

              {apiError && (
                <ApiErrorBox>
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  {apiError}
                </ApiErrorBox>
              )}

              <FormGrid>

                <FieldWrap>
                  <FieldLabel htmlFor="firstName">
                    <User size={13} /> First Name <RedStar>*</RedStar>
                  </FieldLabel>
                  <StyledInput id="firstName" onChange={handleChange} placeholder="e.g. vijay" />
                  {errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
                </FieldWrap>

                <FieldWrap>
                  <FieldLabel htmlFor="lastName">
                    <User size={13} /> Last Name <RedStar>*</RedStar>
                  </FieldLabel>
                  <StyledInput id="lastName" onChange={handleChange} placeholder="e.g. kumar" />
                  {errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
                </FieldWrap>

                <FieldWrap>
                  <FieldLabel htmlFor="userName">
                    <AtSign size={13} /> Username <RedStar>*</RedStar>
                  </FieldLabel>
                  <StyledInput id="userName" onChange={handleChange} placeholder="e.g. vijay_admin" />
                  {errors.userName && <ErrorText>{errors.userName}</ErrorText>}
                </FieldWrap>

                <FieldWrap>
                  <FieldLabel htmlFor="phNo">
                    <Phone size={13} /> Phone Number <RedStar>*</RedStar>
                  </FieldLabel>
                  <StyledInput id="phNo" onChange={handleChange} placeholder="e.g. 9876543210" />
                  {errors.phNo && <ErrorText>{errors.phNo}</ErrorText>}
                </FieldWrap>

                <FullSpan>
                  <FieldWrap>
                    <FieldLabel htmlFor="email">
                      <Mail size={13} /> Email Address <RedStar>*</RedStar>
                    </FieldLabel>
                    <StyledInput type="email" id="email" onChange={handleChange} placeholder="e.g. vijay@gmail.com" />
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                  </FieldWrap>
                </FullSpan>

                <FieldWrap>
                  <FieldLabel htmlFor="password">
                    <Lock size={13} /> Password <RedStar>*</RedStar>
                  </FieldLabel>
                  <PasswordWrap>
                    <PasswordInput
                      type={showPassword ? "text" : "password"}
                      id="password"
                      onChange={handleChange}
                      placeholder="Min 8 chars"
                    />
                    <ToggleBtn type="button" onClick={() => setShowPassword((p) => !p)}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </ToggleBtn>
                  </PasswordWrap>
                  {errors.password && <ErrorText>{errors.password}</ErrorText>}
                </FieldWrap>

                <FieldWrap>
                  <FieldLabel htmlFor="confirmPassword">
                    <Lock size={13} /> Confirm Password <RedStar>*</RedStar>
                  </FieldLabel>
                  <PasswordWrap>
                    <PasswordInput
                      type={showConfirm ? "text" : "password"}
                      id="confirmPassword"
                      onChange={handleChange}
                      placeholder="Re-enter password"
                    />
                    <ToggleBtn type="button" onClick={() => setShowConfirm((p) => !p)}>
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </ToggleBtn>
                  </PasswordWrap>
                  {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
                </FieldWrap>

              </FormGrid>

              <FormFooter>
                <SubmitBtn type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <SpinIcon size={15} /> Adding...
                    </>
                  ) : (
                    <>
                      <ChevronRight size={16} /> Add Admin
                    </>
                  )}
                </SubmitBtn>
              </FormFooter>

            </form>
          </CardBody>
        </Card>

      </PageWrap>
    </Layout>
  );
};

export default AddAdmin;