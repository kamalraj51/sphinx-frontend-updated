import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../component/Layout";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import styled, { keyframes } from "styled-components";
import { UserPlus, User, Mail, AtSign, Shield, ChevronRight, ArrowLeft } from "lucide-react";
import { HeroLeft } from "../component/AddTopic";
import { BackBtn } from "./ExamUpdate";


const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
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
  justify-content:space-between;
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

const StyledSelect = styled.select`
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  font-size: 13.5px; color: #1e293b;
  font-family: inherit; background: #f8fafc;
  transition: border-color 0.18s, box-shadow 0.18s;
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;

  &:focus {
    outline: none; border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
    background: #fff;
  }
`;

const ErrorText = styled.p`
  font-size: 11.5px; color: #ef4444; margin: 0; font-weight: 600;
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

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16,185,129,0.4);
  }
  &:active { transform: scale(0.97); }
`;

const CreateUser = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [show, setShow] = useState(false);
 
 

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

  const setValue = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};

    if (!data.firstName) err.firstName = "First name is mandatory";
    else if (!firstNameRegex.test(data.firstName)) err.firstName = "First name should be valid";

    if (!data.lastName) err.lastName = "Last name is mandatory";
    else if (!lastNameRegex.test(data.lastName)) err.lastName = "Last name should be valid";

    if (!data.email) err.email = "Email is mandatory";
    else if (!emailRegex.test(data.email)) err.email = "Email should be valid";

    if (!data.userName) err.userName = "Username is mandatory";
    else if (!userNameRegex.test(data.userName)) err.userName = "Username should be valid";

    setErrors(err);
    if (Object.keys(err).length > 0) return;

    try {
      const response = await fetch("https://localhost:8443/sphinx/api/user/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.success);
        setData({ firstName: "", lastName: "", email: "", role: "SPX_EXAMINEE", userName: "", userLoginId: userId });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Layout>
      <PageWrap>

        <HeroBar>
          <HeroLeft>
          <HeroIconRing>
            <UserPlus size={24} strokeWidth={1.8} />
          </HeroIconRing>
          <div>
            <HeroTitle>Add User</HeroTitle>
            <HeroSub>Fill in the details to create a new user account</HeroSub>
          </div>
          </HeroLeft>
          <BackBtn
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft size={14} /> Back
        </BackBtn>
        </HeroBar>

        <Card>
          <CardHeader>
            <User size={15} color="#059669" />
            <CardTitle>User Details</CardTitle>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit}>
              <FormGrid>

                <FieldWrap>
                  <FieldLabel>
                    <User size={13} />
                    First Name <RedStar>*</RedStar>
                  </FieldLabel>
                  <StyledInput
                    name="firstName"
                    value={data.firstName}
                    onChange={setValue}
                    placeholder="e.g. vijay"
                  />
                  {errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
                </FieldWrap>

                <FieldWrap>
                  <FieldLabel>
                    <User size={13} />
                    Last Name <RedStar>*</RedStar>
                  </FieldLabel>
                  <StyledInput
                    name="lastName"
                    value={data.lastName}
                    onChange={setValue}
                    placeholder="e.g. kumar"
                  />
                  {errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
                </FieldWrap>

                <FieldWrap>
                  <FieldLabel>
                    <AtSign size={13} />
                    Username <RedStar>*</RedStar>
                  </FieldLabel>
                  <StyledInput
                    name="userName"
                    value={data.userName}
                    onChange={setValue}
                    placeholder="e.g. vijay1"
                  />
                  {errors.userName && <ErrorText>{errors.userName}</ErrorText>}
                </FieldWrap>

                <FieldWrap>
                  <FieldLabel>
                    <Mail size={13} />
                    Email Address <RedStar>*</RedStar>
                  </FieldLabel>
                  <StyledInput
                    name="email"
                    value={data.email}
                    onChange={setValue}
                    placeholder="e.g. vijay@gmail.com"
                  />
                  {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </FieldWrap>

              </FormGrid>

              <FormFooter>
                <SubmitBtn type="submit">
                  Add User
                  <ChevronRight size={16} />
                </SubmitBtn>
              </FormFooter>
            </form>
          </CardBody>
        </Card>

      </PageWrap>
    </Layout>
  );
};

export default CreateUser;