import React, { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import styled, { keyframes } from 'styled-components'
import { ClipboardPlus, FileText, Hash, Clock, BarChart2, ChevronRight } from 'lucide-react'

/* ═══════════════════════════════════════════
   ANIMATIONS
═══════════════════════════════════════════ */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ═══════════════════════════════════════════
   PAGE WRAP
═══════════════════════════════════════════ */
const PageWrap = styled.div`
  font-family: 'Sora', 'DM Sans', 'Segoe UI', sans-serif;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

/* ═══════════════════════════════════════════
   HERO BAR
═══════════════════════════════════════════ */
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
`
const HeroIconRing = styled.div`
  width: 52px; height: 52px; border-radius: 16px;
  background: rgba(16,185,129,0.2);
  border: 1.5px solid rgba(52,211,153,0.35);
  display: flex; align-items: center; justify-content: center;
  color: #34d399; flex-shrink: 0;
  position: relative; z-index: 1;
`
const HeroTitle = styled.h1`
  color: #fff; font-size: 20px; font-weight: 800;
  margin: 0; letter-spacing: -0.4px;
  position: relative; z-index: 1;
`
const HeroSub = styled.p`
  color: rgba(255,255,255,0.6); font-size: 13px;
  margin: 2px 0 0; font-weight: 500;
  position: relative; z-index: 1;
`

/* ═══════════════════════════════════════════
   CARD
═══════════════════════════════════════════ */
const Card = styled.div`
  background: #fff; border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.10), 0 1px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  animation: ${fadeUp} 0.45s ease both;
  animation-delay: 0.05s;
`
const CardHeader = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 16px 24px;
  border-bottom: 2px solid #d1fae5;
  background: #f0fdf4;
`
const CardTitle = styled.h2`
  font-size: 13px; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.8px;
  color: #059669; margin: 0;
`
const CardBody = styled.div`
  padding: 28px 32px;
`

/* ═══════════════════════════════════════════
   FORM GRID
═══════════════════════════════════════════ */
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`
const FullSpan = styled.div`
  grid-column: 1 / -1;
`

/* ═══════════════════════════════════════════
   FIELD
═══════════════════════════════════════════ */
const FieldWrap = styled.div`
  display: flex; flex-direction: column; gap: 6px;
`
const FieldLabel = styled.label`
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.6px;
  color: #64748b;
  display: flex; align-items: center; gap: 6px;

  svg { color: #10b981; }
`
const RedStar = styled.span`
  color: #ef4444; font-size: 13px; line-height: 1;
`
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
`
const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  font-size: 13.5px; color: #1e293b;
  font-family: inherit; background: #f8fafc;
  transition: border-color 0.18s, box-shadow 0.18s;
  box-sizing: border-box;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none; border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
    background: #fff;
  }
  &::placeholder { color: #94a3b8; }
`
const ErrorText = styled.p`
  font-size: 11.5px; color: #ef4444; margin: 0; font-weight: 600;
`
const ApiErrorText = styled.p`
  font-size: 13px; color: #ef4444; font-weight: 600;
  background: #fef2f2; border: 1px solid #fecaca;
  border-radius: 10px; padding: 10px 14px; margin: 0;
  display: ${({ $show }) => ($show ? 'block' : 'none')};
`

/* ═══════════════════════════════════════════
   FOOTER / SUBMIT
═══════════════════════════════════════════ */
const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`
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
`

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
const CreateExamform = () => {
  const userId = useSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [msg, setMsg] = useState('')
  const [errors, setErrors] = useState({})

  let [formData, setFormData] = useState({
    userLoginId: userId,
    examName: '',
    description: '',
    noOfQuestions: '',
    duration: '',
    passPercentage: ''
  })

  const durationRegex = /^(1[0-9]|[2-9][0-9]|\d{3,})$/
  const noOfQuestionRegex = /^[1-9]\d*$/
  const passPercentageRegex = /^(100|[1-9][0-9]?)$/

  let handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  let handleCreate = async (e) => {
    e.preventDefault()
    let flag = true
    const err = {}

    if (formData.examName.trim() === '') {
      err.examName = 'Assessment name is mandatory'; flag = false
    }
    if (!durationRegex.test(formData.duration) && formData.duration) {
      err.duration = 'Enter a duration of at least 10 minutes'; flag = false
    } else if (formData.duration === '') {
      err.duration = 'Duration is mandatory'; flag = false
    }
    if (!noOfQuestionRegex.test(formData.noOfQuestions) && formData.noOfQuestions) {
      err.noOfQuestions = 'Enter no. of questions of at least 1'; flag = false
    } else if (formData.noOfQuestions === '') {
      err.noOfQuestions = 'No. of questions is mandatory'; flag = false
    }
    if (!passPercentageRegex.test(formData.passPercentage) && formData.passPercentage) {
      err.passPercentage = 'Enter pass percentage of at least 1'; flag = false
    } else if (formData.passPercentage === '') {
      err.passPercentage = 'Pass percentage is mandatory'; flag = false
    }
    if (formData.description.trim() === '') {
      err.description = 'Description is mandatory'; flag = false
    }

    if (!flag) { setErrors(err); return }

    const response = await fetch('https://localhost:8443/sphinx/api/exam/createexam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    const data = await response.json()
    if (response.ok) {
      const examId = data.examId
      navigate(`/exam-create-topic/${examId}`)
    } else {
      setMsg(data.error)
    }
  }

  return (
    <PageWrap>

      {/* ── Hero Bar ── */}
      <HeroBar>
        <HeroIconRing>
          <ClipboardPlus size={24} strokeWidth={1.8} />
        </HeroIconRing>
        <div>
          <HeroTitle>Create Assessment</HeroTitle>
          <HeroSub>Fill in the details to set up a new exam</HeroSub>
        </div>
      </HeroBar>

      {/* ── Form Card ── */}
      <Card>
        <CardHeader>
          <FileText size={15} color="#059669" />
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>

        <CardBody>
          <ApiErrorText $show={!!msg}>{msg}</ApiErrorText>

          <form onSubmit={handleCreate}>
            <FormGrid>

              {/* Assessment Name — full width */}
              <FullSpan>
                <FieldWrap>
                  <FieldLabel>
                    <FileText size={13} />
                    Assessment Name <RedStar>*</RedStar>
                  </FieldLabel>
                  <StyledInput
                    type="text"
                    name="examName"
                    onChange={handleChange}
                    placeholder="e.g. JavaScript Fundamentals"
                  />
                  {errors.examName && <ErrorText>{errors.examName}</ErrorText>}
                </FieldWrap>
              </FullSpan>

              {/* Description — full width */}
              <FullSpan>
                <FieldWrap>
                  <FieldLabel>
                    <FileText size={13} />
                    Description <RedStar>*</RedStar>
                  </FieldLabel>
                  <StyledTextarea
                    name="description"
                    onChange={handleChange}
                    placeholder="Brief description of what this assessment covers..."
                  />
                  {errors.description && <ErrorText>{errors.description}</ErrorText>}
                </FieldWrap>
              </FullSpan>

              {/* No. of Questions */}
              <FieldWrap>
                <FieldLabel>
                  <Hash size={13} />
                  No. of Questions <RedStar>*</RedStar>
                </FieldLabel>
                <StyledInput
                  type="text"
                  name="noOfQuestions"
                  onChange={handleChange}
                  placeholder="e.g. 20"
                />
                {errors.noOfQuestions && <ErrorText>{errors.noOfQuestions}</ErrorText>}
              </FieldWrap>

              {/* Duration */}
              <FieldWrap>
                <FieldLabel>
                  <Clock size={13} />
                  Duration <span style={{ fontWeight: 500, textTransform: 'none', fontSize: '11px', color: '#94a3b8' }}>(minutes)</span> <RedStar>*</RedStar>
                </FieldLabel>
                <StyledInput
                  type="text"
                  name="duration"
                  onChange={handleChange}
                  placeholder="e.g. 60"
                />
                {errors.duration && <ErrorText>{errors.duration}</ErrorText>}
              </FieldWrap>

              {/* Pass Percentage */}
              <FieldWrap>
                <FieldLabel>
                  <BarChart2 size={13} />
                  Pass Percentage <span style={{ fontWeight: 500, textTransform: 'none', fontSize: '11px', color: '#94a3b8' }}>(%)</span> <RedStar>*</RedStar>
                </FieldLabel>
                <StyledInput
                  type="text"
                  name="passPercentage"
                  onChange={handleChange}
                  placeholder="e.g. 60"
                />
                {errors.passPercentage && <ErrorText>{errors.passPercentage}</ErrorText>}
              </FieldWrap>

            </FormGrid>

            <FormFooter>
              <SubmitBtn type="submit">
                Create Assessment
                <ChevronRight size={16} />
              </SubmitBtn>
            </FormFooter>
          </form>
        </CardBody>
      </Card>

    </PageWrap>
  )
}

export default CreateExamform
