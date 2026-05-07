import React, { useEffect, useState } from "react";
import {
  TopicContainer,
  FormContainer,
  TopicField,
  TopicLabel,
  TopicButton,
  TopicInput,
  ApiError,
  TopicError,
} from "../styles/AddTopicStyle";
import Topics from "./Topics";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../reducer/apiReduce";
import { RedSpan } from "../styles/FontsStyle";
import { toast } from "sonner";
import styled, { keyframes } from "styled-components";
import { PlusCircle, Layers, ArrowLeft } from "lucide-react";
import { BackBtn } from "../pages/ExamUpdate";
import { useNavigate } from "react-router-dom";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const HeroBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px 32px;
  background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%);
  border-radius: 16px;
  margin-bottom: 24px;
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

const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
  z-index: 1;
`;

const HeroIconRing = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(16, 185, 129, 0.2);
  border: 1.5px solid rgba(52, 211, 153, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #34d399;
  flex-shrink: 0;
`;

const HeroTitle = styled.h1`
  color: #ffffff;
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 5px;
  letter-spacing: -0.4px;
  font-family: 'Sora', 'DM Sans', 'Segoe UI', sans-serif;
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.3px;
`;

const HeroDot = styled.span`
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #34d399;
  display: inline-block;
`;

const FormCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.10), 0 1px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  margin-bottom: 28px;
  animation: ${fadeUp} 0.45s ease both;
  font-family: 'Sora', 'DM Sans', 'Segoe UI', sans-serif;
`;

const FormCardHeader = styled.div`
  padding: 16px 24px;
  background: #f0fdf4;
  border-bottom: 2px solid #d1fae5;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #059669;
`;

const FormCardBody = styled.div`
  padding: 24px;
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
  min-width: 220px;
`;

const StyledLabel = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  letter-spacing: 0.2px;
`;

const StyledInput = styled.input`
  padding: 11px 16px;
  border-radius: 12px;
  border: 1.5px solid #d1fae5;
  background: #f9fffe;
  font-size: 14px;
  font-family: inherit;
  color: #1e293b;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
  }

  &::placeholder { color: #94a3b8; }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
`;

const ApiErrorBanner = styled.div`
  margin: 0 24px 0;
  padding: 10px 16px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 13px;
  font-weight: 500;
`;

const SubmitBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 3px 12px rgba(16,185,129,0.3);
  white-space: nowrap;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16,185,129,0.4);
  }
  &:active { transform: scale(0.97); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

const PageWrap = styled.div`
  font-family: 'Sora', 'DM Sans', 'Segoe UI', sans-serif;
  padding-bottom: 60px;
`;

const AddTopic = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user);
  const [topicName, setTopicName] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSucess] = useState("");

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setTopicName(e.target.value);
    if (error) setError("");
  };

  const validate = () => {
    if (!topicName.trim()) {
      setError("Topic name cannot be empty");
      setLoading(false);
      return false;
    }
    if (topicName.length < 1) {
      setError("Topic must be at least 1 characters");
      setLoading(false);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSucess("");
    if (!validate()) return;

    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/topic/createtopic",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicName, userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error);
        return;
      }

      toast.success(data.successMessage);
      setTopicName("");
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      dispatch(toggle());
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <HeroBar>
        <HeroLeft>
          <HeroIconRing>
            <Layers size={24} />
          </HeroIconRing>

          <div>
            <HeroTitle>Topic Management</HeroTitle>

            <HeroBadge>
              <HeroDot />
              Add &amp; Manage Topics
            </HeroBadge>
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

      <FormCard>
        <FormCardHeader>New Topic</FormCardHeader>

        {apiError && <ApiErrorBanner>{apiError}</ApiErrorBanner>}

        <FormCardBody as="form" onSubmit={handleSubmit}>
          <FieldGroup>
            <StyledLabel htmlFor="topicName">
              Enter the Topic <RedSpan>*</RedSpan>
            </StyledLabel>

            <StyledInput
              type="text"
              id="topicName"
              value={topicName}
              onChange={handleChange}
              placeholder="e.g. Data Structures"
            />

            {error && <ErrorText>{error}</ErrorText>}
          </FieldGroup>

          <SubmitBtn type="submit" disabled={loading}>
            <PlusCircle size={16} />
            {loading ? "Creating..." : "Create Topic"}
          </SubmitBtn>
        </FormCardBody>
      </FormCard>

      <Topics />
    </PageWrap>
  );
};

export default AddTopic;