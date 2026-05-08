import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../reducer/authSlice";
import Header from "../component/Header";
import styled, { keyframes } from "styled-components";
import {
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const PageWrap = styled.div`
  font-family: "Sora", "DM Sans", "Segoe UI", sans-serif;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const CenterWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  width: 100%;
  max-width: 420px;
  animation: ${fadeUp} 0.45s ease both;
`;

const HeroBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px 32px 24px;
  background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -70px;
    right: -70px;
    width: 240px;
    height: 240px;
    background: radial-gradient(
      circle,
      rgba(16, 185, 129, 0.18) 0%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
  }
  &::after {
    content: "";
    position: absolute;
    bottom: -50px;
    left: -40px;
    width: 180px;
    height: 180px;
    background: radial-gradient(
      circle,
      rgba(52, 211, 153, 0.12) 0%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
  }
`;

const HeroIconRing = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: rgba(16, 185, 129, 0.2);
  border: 1.5px solid rgba(52, 211, 153, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #34d399;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  color: #fff;
  font-size: 20px;
  font-weight: 900;
  margin: 0;
  letter-spacing: 3px;
  position: relative;
  z-index: 1;
`;

const HeroSub = styled.p`
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  margin: 0;
  font-weight: 500;
  position: relative;
  z-index: 1;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-bottom: 2px solid #d1fae5;
  background: #f0fdf4;
`;

const CardTitle = styled.h2`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #059669;
  margin: 0;
`;

const CardBody = styled.div`
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
`;

const FieldLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #64748b;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13.5px;
  color: #1e293b;
  font-family: inherit;
  background: #f8fafc;
  transition:
    border-color 0.18s,
    box-shadow 0.18s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
    background: #fff;
  }
  &::placeholder {
    color: #94a3b8;
  }
`;

const PasswordWrap = styled.div`
  position: relative;
`;

const PasswordInput = styled(StyledInput)`
  padding-right: 44px;
`;

const ToggleBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.15s;

  &:hover {
    color: #10b981;
  }
`;

const ErrorText = styled.p`
  font-size: 11.5px;
  color: #ef4444;
  margin: 0;
  font-weight: 600;
`;

const ApiErrorBox = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 13px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 12.5px;
  font-weight: 600;
`;

const SubmitBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  background: ${({ disabled }) =>
    disabled
      ? "linear-gradient(135deg, #a7f3d0, #6ee7b7)"
      : "linear-gradient(135deg, #10b981, #059669)"};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  box-shadow: ${({ disabled }) =>
    disabled ? "none" : "0 3px 8px rgba(16,185,129,0.28)"};
  transition: all 0.18s ease;
  margin-top: 2px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }
  &:active:not(:disabled) {
    transform: scale(0.97);
  }
`;

const SpinIcon = styled(Loader2)`
  animation: ${spin} 0.8s linear infinite;
`;

const UserSignin = () => {
  const [formData, setFormData] = useState({ userLoginId: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleForm = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
    setApiError("");
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.userLoginId)
      newErrors.userLoginId = "Username should not be blank";
    if (!formData.password) newErrors.password = "Password should not be blank";
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
          headers: { "content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        setApiError(data.errorMessage || "Invalid credentials");
        return;
      }

      dispatch(
        login({ userLoginId: formData.userLoginId, role: data.result.role }),
      );

      if (data.role === "SPX_ADMIN") {
        navigate("/admin-home", {
          state: { userLoginId: formData.userLoginId },
        });
      } else if (data.role === "SPX_EXAMINEE") {
        navigate("/userdashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <Header />
      <CenterWrap>
        <Card>
          <HeroBar>
            <HeroTitle>SPHINX</HeroTitle>
            <HeroSub>Sign in to your account to continue</HeroSub>
          </HeroBar>

          <CardHeader>
            <LogIn size={13} color="#059669" />
            <CardTitle>Account sign in</CardTitle>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit}>
              {apiError && (
                <ApiErrorBox>
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  {apiError}
                </ApiErrorBox>
              )}

              <FieldWrap>
                <FieldLabel htmlFor="userLoginId">Username</FieldLabel>
                <StyledInput
                  id="userLoginId"
                  placeholder="Enter your username"
                  value={formData.userLoginId}
                  onChange={handleForm}
                />
                {errors.userLoginId && (
                  <ErrorText>{errors.userLoginId}</ErrorText>
                )}
              </FieldWrap>

              <FieldWrap>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordWrap>
                  <PasswordInput
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    onChange={handleForm}
                  />
                  <ToggleBtn
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </ToggleBtn>
                </PasswordWrap>
                {errors.password && <ErrorText>{errors.password}</ErrorText>}
              </FieldWrap>

              <SubmitBtn type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <SpinIcon size={15} /> Signing In...
                  </>
                ) : (
                  <>
                    <LogIn size={15} /> Sign In
                  </>
                )}
              </SubmitBtn>
            </form>
          </CardBody>
        </Card>
      </CenterWrap>
    </PageWrap>
  );
};

export default UserSignin;