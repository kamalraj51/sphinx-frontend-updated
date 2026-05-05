import React, { useState, useEffect } from "react";
import { toggle } from "../reducer/apiReduce";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ExamTDetails from "./ExamTDetails";
import { toast } from "sonner";
import styled, { keyframes } from "styled-components";
import { Layers, PlusCircle, ExternalLink } from "lucide-react";

/* ═══════════════════════════════════════════
   ANIMATIONS
═══════════════════════════════════════════ */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ═══════════════════════════════════════════
   PAGE WRAP
═══════════════════════════════════════════ */
const PageWrap = styled.div`
  font-family: 'Sora', 'DM Sans', 'Segoe UI', sans-serif;
  padding-bottom: 60px;
`;

/* ═══════════════════════════════════════════
   HERO BAR
═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   FORM CARD
═══════════════════════════════════════════ */
const FormCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.10), 0 1px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  margin-bottom: 28px;
  animation: ${fadeUp} 0.45s ease both;
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

const FormCardBody = styled.form`
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
  min-width: 180px;
`;

const StyledLabel = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  letter-spacing: 0.2px;
`;

const StyledSelect = styled.select`
  padding: 11px 16px;
  border-radius: 12px;
  border: 1.5px solid #d1fae5;
  background: #f9fffe;
  font-size: 14px;
  font-family: inherit;
  color: #1e293b;
  outline: none;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
  }
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

const CreateLink = styled.p`
  text-align: center;
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
  width: 100%;

  a {
    color: #059669;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: text-decoration-color 0.18s;
    &:hover { text-decoration-color: #059669; }
  }
`;

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
const ExamTopic = () => {
  const apiRefresh = useSelector((state) => state.api.value);
  const [topics, setTopics] = useState([]);
  const { examId } = useParams();
  console.log(examId);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user);

  let [data, setData] = useState({
    examTopicName: "",
    topicId: "",
    examId: examId,
    topicPassPercentage: "",
  });

  let handleinput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  let handledata = async (e) => {
    e.preventDefault();
    console.log(examId + " inside api call");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      let response = await fetch(
        "https://localhost:8443/sphinx/api/exam/examtopicdetails",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Something went wrong");
        console.log("API error:", result);
        return;
      }
      toast.success("Topic added successfully");
      dispatch(toggle());
    } catch (err) {
      console.log("catch :topic add ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTopics = async () => {
      console.log(data.topicId);
      try {
        const res = await fetch(
          `https://localhost:8443/sphinx/api/topic/gettopics?userLoginId=${encodeURIComponent(userId)}`
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log(data);
        setTopics(data.topic || []);
      } catch (err) {
        console.error("Error fetching topics:", err);
        console.log(err);
      }
    };
    fetchTopics();
  }, [apiRefresh]);

  return (
    <PageWrap>
      {/* ── Hero Bar ── */}
      <HeroBar>
        <HeroLeft>
          <HeroIconRing>
            <Layers size={24} />
          </HeroIconRing>
          <div>
            <HeroTitle>Exam Topic Setup</HeroTitle>
            <HeroBadge>
              <HeroDot />
              Assign Topics to Exam
            </HeroBadge>
          </div>
        </HeroLeft>
      </HeroBar>

      {/* ── Add Topic Form Card ── */}
      <FormCard>
        <FormCardHeader>Add Topic to Exam</FormCardHeader>

        <FormCardBody onSubmit={handledata}>
          <FieldGroup>
            <StyledLabel>Select Topic</StyledLabel>
            <StyledSelect name="topicId" value={data.topicId} onChange={handleinput}>
              <option value="">-- Select Topic --</option>
              {topics.map((topic) => (
                <option key={topic.topicId} value={topic.topicId}>
                  {topic.topicName}
                </option>
              ))}
            </StyledSelect>
          </FieldGroup>

          <FieldGroup>
            <StyledLabel htmlFor="topicPassPercentage">Question Percentage</StyledLabel>
            <StyledInput
              type="text"
              name="topicPassPercentage"
              value={data.topicPassPercentage}
              onChange={handleinput}
              placeholder="e.g. 75"
            />
          </FieldGroup>

          <SubmitBtn type="submit" disabled={loading}>
            <PlusCircle size={16} />
            {loading ? "Submitting..." : "Add Topic"}
          </SubmitBtn>

          <CreateLink>
            Create new topic?{" "}
            <a onClick={() => navigate("/topic-master")}>
              <ExternalLink size={13} /> Create topic
            </a>
          </CreateLink>
        </FormCardBody>
      </FormCard>

      {/* ── Exam Topics List ── */}
      <ExamTDetails examId={examId} />
    </PageWrap>
  );
};

export default ExamTopic;
