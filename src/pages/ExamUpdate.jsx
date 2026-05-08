import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../component/Layout";
import styled, { keyframes } from "styled-components";
import {
  ClipboardEdit,
  FileText,
  Hash,
  Clock,
  BarChart2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

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
  justify-content: space-between;
  padding: 20px 32px;
  background: linear-gradient(135deg, #064e3b, #065f46, #047857);
  border-radius: 16px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(16,185,129,0.18), transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  z-index: 1;
`;

const HeroIconRing = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(16,185,129,0.2);
  border: 1.5px solid rgba(52,211,153,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #34d399;
`;

const HeroTitle = styled.h1`
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  margin: 0;
`;

const HeroSub = styled.p`
  color: rgba(255,255,255,0.6);
  font-size: 13px;
  margin: 2px 0 0;
`;

export const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.12);
  color: #fff;
  cursor: pointer;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.10);
  animation: ${fadeUp} 0.45s ease both;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
  border-bottom: 2px solid #d1fae5;
  background: #f0fdf4;
`;

const CardTitle = styled.h2`
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  color: #059669;
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
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;

  svg { color: #10b981; }
`;

const StyledInput = styled.input`
  padding: 11px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
    background: #fff;
  }
`;

const StyledTextarea = styled.textarea`
  padding: 11px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
    background: #fff;
  }
`;

const ErrorText = styled.p`
  font-size: 11px;
  color: #ef4444;
`;

const SubmitBtn = styled.button`
  margin-top: 20px;
  padding: 11px 28px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border-radius: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const ExamUpdate = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [data, setData] = useState(state?.examData || {});
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = {};
    if (!data.examName) err.examName = "Required";
    if (!data.description) err.description = "Required";

    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    await fetch("https://localhost:8443/sphinx/api/exam/examUpdate", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    navigate("/admin-home");
  };

  return (
    <Layout>
      <PageWrap>

        <HeroBar>
          <HeroLeft>
            <HeroIconRing>
              <ClipboardEdit size={24} />
            </HeroIconRing>
            <div>
              <HeroTitle>Update Assessment</HeroTitle>
              <HeroSub>Edit your exam details</HeroSub>
            </div>
          </HeroLeft>

          <BackBtn onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </BackBtn>
        </HeroBar>

        <Card>
          <CardHeader>
            <FileText size={15} color="#059669" />
            <CardTitle>Assessment Details</CardTitle>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit}>
              <FormGrid>

                <FullSpan>
                  <FieldWrap>
                    <FieldLabel>
                      <FileText size={13} /> Name
                    </FieldLabel>
                    <StyledInput
                      name="examName"
                      value={data.examName || ""}
                      onChange={handleChange}
                    />
                    {errors.examName && <ErrorText>{errors.examName}</ErrorText>}
                  </FieldWrap>
                </FullSpan>

                <FullSpan>
                  <FieldWrap>
                    <FieldLabel>
                      <FileText size={13} /> Description
                    </FieldLabel>
                    <StyledTextarea
                      name="description"
                      value={data.description || ""}
                      onChange={handleChange}
                    />
                    {errors.description && <ErrorText>{errors.description}</ErrorText>}
                  </FieldWrap>
                </FullSpan>

                <FieldWrap>
                  <FieldLabel><Hash size={13}/> Questions</FieldLabel>
                  <StyledInput name="noOfQuestions" value={data.noOfQuestions || ""} onChange={handleChange}/>
                </FieldWrap>

                <FieldWrap>
                  <FieldLabel><Clock size={13}/> Duration</FieldLabel>
                  <StyledInput name="duration" value={data.duration || ""} onChange={handleChange}/>
                </FieldWrap>

                <FieldWrap>
                  <FieldLabel><BarChart2 size={13}/> Pass %</FieldLabel>
                  <StyledInput name="passPercentage" value={data.passPercentage || ""} onChange={handleChange}/>
                </FieldWrap>

              </FormGrid>
<div style={{display:"flex", columnGap:"10px"}}>
               <SubmitBtn type="submit">
                Cancel
              </SubmitBtn>
              <SubmitBtn type="submit">
                Save Changes <ChevronRight size={16}/>
              </SubmitBtn>
              </div>
            </form>
          </CardBody>
        </Card>

      </PageWrap>
    </Layout>
  );
};

export default ExamUpdate;