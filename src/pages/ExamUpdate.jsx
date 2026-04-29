import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../component/Layout";
import styled, { keyframes } from "styled-components";
import {
  ClipboardEdit,
  BookOpen,
  Hash,
  Clock,
  BarChart2,
  AlignLeft,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { HeadingTable } from "../styles/AvailableExamStyle";

/* ── Animations ─────────────────────────────────────────────── */
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

/* ── Page Shell ─────────────────────────────────────────────── */
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f0f4ff;
  display: flex;
  flex-direction: column;
  font-family: "DM Sans", "Segoe UI", sans-serif;
`;

/* ── Hero Banner ─────────────────────────────────────────────*/
const HeroBanner = styled.div`
  background: linear-gradient(135deg, #3730a3 0%, #4f46e5 50%, #7c3aed 100%);
  padding: 36px 40px 56px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 40px;
    background: #f0f4ff;
    clip-path: ellipse(55% 100% at 50% 100%);
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        circle at 80% 20%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 55%
      ),
      radial-gradient(
        circle at 15% 80%,
        rgba(124, 58, 237, 0.4) 0%,
        transparent 40%
      );
    pointer-events: none;
  }
`;

const BannerInner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BannerIcon = styled.div`
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  backdrop-filter: blur(8px);
`;

const BannerText = styled.div`
  text-align: start;
`;

const BannerTitle = styled.h1`
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 4px;
  letter-spacing: -0.4px;
`;

const BannerSub = styled.p`
  color: rgba(255, 255, 255, 0.68);
  font-size: 13px;
  margin: 0;
`;

const BackBtn = styled.button`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  backdrop-filter: blur(8px);
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
  }
`;

/* ── Card ────────────────────────────────────────────────────*/
const CardArea = styled.div`
  padding: 0 32px 48px;

  position: relative;
  z-index: 2;
  animation: ${fadeSlideUp} 0.4s ease both;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow:
    0 8px 40px rgba(79, 70, 229, 0.13),
    0 2px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  max-width: 680px;
  margin: 0 auto;
`;

const CardHeader = styled.div`
  padding: 24px 28px 20px;
  border-bottom: 1px solid #eef2ff;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CardHeaderDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
`;

const CardHeaderTitle = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const CardBody = styled.div`
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

/* ── Form Fields ────────────────────────────────────────────── */
const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const LabelIcon = styled.span`
  display: inline-flex;
  align-items: center;
  color: #4f46e5;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const inputStyle = `
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: #f8faff;
  font-size: 14.5px;
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  color: #1e293b;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.10);
  }

  &::placeholder {
    color: #94a3b8;
    font-size: 14px;
  }
`;

const StyledInput = styled.input`
  ${inputStyle}
`;

const StyledTextarea = styled.textarea`
  ${inputStyle}
  min-height: 120px;
  resize: vertical;
  line-height: 1.65;
`;

/* Two-col row for Duration + Pass % */
const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SuffixWrap = styled.div`
  position: relative;

  input {
    padding-right: 48px;
  }
`;

const Suffix = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 700;
  color: #7c3aed;
  pointer-events: none;
`;

const ErrorMsg = styled.p`
  margin: 0;
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: "⚠";
    font-size: 11px;
  }
`;

/* ── Divider ─────────────────────────────────────────────── */
const Divider = styled.div`
  height: 1px;
  background: #eef2ff;
  margin: 4px 0;
`;

/* ── Submit Button ───────────────────────────────────────── */
const CardFooter = styled.div`
  padding: 20px 28px 28px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const CancelBtn = styled.button`
  padding: 12px 22px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: transparent;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #334155;
  }
`;

const SubmitBtn = styled.button`
  padding: 12px 32px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  background-size: 200% auto;
  color: #fff;
  font-size: 14.5px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.4);
  transition:
    transform 0.15s,
    box-shadow 0.18s,
    opacity 0.18s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(79, 70, 229, 0.48);
    animation: ${shimmer} 1.5s linear infinite;
  }

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

/* ─────────────────────────────────────────────────────────── */

const ExamUpdate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { examData } = location.state || {};

  const [data, setData] = useState(examData || {});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const durationRegex = /^(1[0-9]|[2-9][0-9]|\d{3,})$/;
  const noOfQuestionRegex = /^[1-9]\d*$/;
  const passPercentageRegex = /^(100|[1-9][0-9]?)$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    let flag = true;

    if (!data.examName?.trim()) {
      err.examName = "Exam name is mandatory";
      flag = false;
    }
    if (!data.duration) {
      err.duration = "Duration is mandatory";
      flag = false;
    } else if (!durationRegex.test(data.duration)) {
      err.duration = "Minimum 10 minutes required";
      flag = false;
    }
    if (!data.noOfQuestions) {
      err.noOfQuestions = "No. of questions is mandatory";
      flag = false;
    } else if (!noOfQuestionRegex.test(data.noOfQuestions)) {
      err.noOfQuestions = "Enter a valid number";
      flag = false;
    }
    if (!data.passPercentage) {
      err.passPercentage = "Pass percentage is mandatory";
      flag = false;
    } else if (!passPercentageRegex.test(data.passPercentage)) {
      err.passPercentage = "Enter a value between 1 and 100";
      flag = false;
    }
    if (!data.description?.trim()) {
      err.description = "Description is mandatory";
      flag = false;
    }

    if (!flag) {
      setErrors(err);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/exam/examUpdate",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      if (response.ok) {
        navigate("/adminhome", {
          state: { message: "Assessment updated successfully!" },
        });
      }
    } catch {
      console.error("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* ── Hero ── */}
      <HeadingTable
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
         <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gridColumnGap:"10px"
                  }}
                >
          <BannerIcon>
            <ClipboardEdit size={24} />
          </BannerIcon>

          <BannerText>
            <BannerTitle>Update Assessment</BannerTitle>
            <BannerSub>Edit the details below and save your changes</BannerSub>
          </BannerText>
        </div>
        <div>
          <BackBtn onClick={() => navigate(-1)}>
            <ArrowLeft size={15} /> Back
          </BackBtn>
        </div>
      </HeadingTable>

      {/* ── Card ── */}
      <CardArea>
        <Card>
          <CardHeader>
            <CardHeaderDot />
            <CardHeaderTitle>Assessment Details</CardHeaderTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardBody>
              {/* Exam Name */}
              <FieldGroup>
                <LabelRow>
                  <LabelIcon>
                    <BookOpen size={14} />
                  </LabelIcon>
                  <Label>Assessment Name</Label>
                </LabelRow>
                <StyledInput
                  type="text"
                  name="examName"
                  value={data.examName || ""}
                  onChange={handleChange}
                  placeholder="Enter exam name"
                />
                {errors.examName && <ErrorMsg>{errors.examName}</ErrorMsg>}
              </FieldGroup>

              {/* Description */}
              <FieldGroup>
                <LabelRow>
                  <LabelIcon>
                    <AlignLeft size={14} />
                  </LabelIcon>
                  <Label>Description</Label>
                </LabelRow>
                <StyledTextarea
                  name="description"
                  value={data.description || ""}
                  onChange={handleChange}
                  placeholder="Describe what this assessment covers…"
                />
                {errors.description && (
                  <ErrorMsg>{errors.description}</ErrorMsg>
                )}
              </FieldGroup>

              <Divider />

              {/* No of Questions */}
              <FieldGroup>
                <LabelRow>
                  <LabelIcon>
                    <Hash size={14} />
                  </LabelIcon>
                  <Label>No. of Questions</Label>
                </LabelRow>
                <StyledInput
                  type="text"
                  name="noOfQuestions"
                  value={data.noOfQuestions || ""}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                />
                {errors.noOfQuestions && (
                  <ErrorMsg>{errors.noOfQuestions}</ErrorMsg>
                )}
              </FieldGroup>

              {/* Duration + Pass % side by side */}
              <TwoCol>
                <FieldGroup>
                  <LabelRow>
                    <LabelIcon>
                      <Clock size={14} />
                    </LabelIcon>
                    <Label>Duration</Label>
                  </LabelRow>
                  <SuffixWrap>
                    <StyledInput
                      type="text"
                      name="duration"
                      value={data.duration || ""}
                      onChange={handleChange}
                      placeholder="e.g. 30"
                    />
                    <Suffix>min</Suffix>
                  </SuffixWrap>
                  {errors.duration && <ErrorMsg>{errors.duration}</ErrorMsg>}
                </FieldGroup>

                <FieldGroup>
                  <LabelRow>
                    <LabelIcon>
                      <BarChart2 size={14} />
                    </LabelIcon>
                    <Label>Pass Percentage</Label>
                  </LabelRow>
                  <SuffixWrap>
                    <StyledInput
                      type="text"
                      name="passPercentage"
                      value={data.passPercentage || ""}
                      onChange={handleChange}
                      placeholder="e.g. 60"
                    />
                    <Suffix>%</Suffix>
                  </SuffixWrap>
                  {errors.passPercentage && (
                    <ErrorMsg>{errors.passPercentage}</ErrorMsg>
                  )}
                </FieldGroup>
              </TwoCol>
            </CardBody>

            <CardFooter>
              <CancelBtn type="button" onClick={() => navigate(-1)}>
                Cancel
              </CancelBtn>
              <SubmitBtn type="submit" disabled={loading}>
                {/* <CheckCircle2 size={16} /> */}
                {loading ? "Saving…" : "Save Changes"}
              </SubmitBtn>
            </CardFooter>
          </form>
        </Card>
      </CardArea>
    </Layout>
  );
};

export default ExamUpdate;
