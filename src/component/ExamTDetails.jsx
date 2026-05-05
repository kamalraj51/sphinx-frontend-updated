import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Trash2, EditIcon, BookMarked, Zap } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { toggle } from "../reducer/apiReduce";
import UpdateModalExam from "./UpdateModalExam";
import styled, { keyframes } from "styled-components";

/* ═══════════════════════════════════════════
   ANIMATIONS
═══════════════════════════════════════════ */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

/* ═══════════════════════════════════════════
   LAYOUT
═══════════════════════════════════════════ */
const Wrap = styled.div`
  font-family: 'Sora', 'DM Sans', 'Segoe UI', sans-serif;
  animation: ${fadeUp} 0.45s ease both;
  margin-top: 24px;
`;

/* ═══════════════════════════════════════════
   SECTION LABEL
═══════════════════════════════════════════ */
const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #059669;
  margin-bottom: 12px;
  padding-left: 2px;
`;

/* ═══════════════════════════════════════════
   TABLE CARD
═══════════════════════════════════════════ */
const TableCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.10), 0 1px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  margin-bottom: 20px;
`;

/* Stats strip */
const StatsStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #fafbff;
  flex-wrap: wrap;
  gap: 10px;
`;

const StatItem = styled.div`
  font-size: 12.5px;
  color: #64748b;
  font-weight: 500;
  strong { color: #1e293b; font-weight: 800; }
`;

/* Table header */
const TableHead = styled.div`
  display: grid;
  grid-template-columns: 52px 1fr 130px 80px;
  padding: 13px 24px;
  background: #f0fdf4;
  border-bottom: 2px solid #d1fae5;
  align-items: center;
  gap: 10px;
`;

const HeadCell = styled.span`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #059669;
`;

/* Topic row */
const TopicRow = styled.div`
  display: grid;
  grid-template-columns: 52px 1fr 130px 80px;
  align-items: center;
  padding: 15px 24px;
  border-bottom: 1px solid #f1f5f9;
  gap: 10px;
  transition: background 0.18s ease;
  animation: ${slideIn} 0.3s ease both;
  animation-delay: ${({ $index }) => $index * 0.04}s;

  &:last-child { border-bottom: none; }
  &:hover { background: #f0fdf4; }
`;

const RowIndex = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
  text-align: center;
`;

const TopicInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TopicIconDot = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border: 1px solid #a7f3d0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  flex-shrink: 0;
`;

const TopicNameBtn = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #059669;
  cursor: pointer;
  line-height: 1.3;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.18s;
  &:hover { text-decoration-color: #059669; }
`;

const PercentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border-radius: 999px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #059669;
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
`;

/* Action */
const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;
  box-shadow: 0 3px 10px rgba(239,68,68,0.25);
  margin: 0 auto;

  &:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(239,68,68,0.35); }
  &:active { transform: scale(0.95); }
`;

/* Empty state */
const EmptyState = styled.div`
  padding: 64px 32px;
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  svg { opacity: 0.3; }
`;

/* Load Question button */
const LoadBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
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
  margin-top: 16px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16,185,129,0.4);
  }
  &:active { transform: scale(0.97); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
const ExamTDetails = (props) => {
  const [examTopics, setExamTopics] = useState([]);
  let { examId } = useParams();
  const [sumbit, setSubmit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDetails, setDeleteDetails] = useState();
  const [UpdateModal, setUpdateModal] = useState(false);
  const [updateContent, setUpdateContent] = useState();

  if (!examId) examId = props.examId;

  const apiRefresh = useSelector((state) => state.api.value);
  const dispatch = useDispatch();

  const handleDelete = (topic, exam) => {
    setModalOpen(true);
    setDeleteDetails({ topicId: topic, examId: exam });
  };

  const handleUpdate = (topic, exam, percent) => {
    setUpdateModal(true);
    setUpdateContent({ topicId: topic, examId: exam, topicPassPercentage: percent });
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(
          `https://localhost:8443/sphinx/api/exam/examtopicbyid?examId=${examId}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const res = await response.json();
        console.log(res.topic);
        setExamTopics(res.topic || []);
      } catch (err) {
        console.log(err, "fetching");
      }
    };
    fetchTopics();
  }, [apiRefresh]);

  const loadExam = async () => {
    try {
      setSubmit(true);
      const response = await fetch(
        `https://localhost:8443/sphinx/api/question/generate-Exam-Questions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.log("failed to generate question");
        toast.error(data.error);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(data.message);
    } catch (err) {
      console.log(err);
    } finally {
      setSubmit(false);
    }
  };

  const deleteExamTopic = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/exam/examtopicDelete",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deleteDetails),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.successMessage || "delete failed");
        return;
      }
      toast.success(result.successMessage);
      dispatch(toggle());
    } catch (err) {
      console.error("API Error:", err);
      toast.error("A network error occurred");
    } finally {
      setModalOpen(false);
    }
  };

  const updateExamTopic = async (newPercentage) => {
    try {
      const updatedPayload = { ...updateContent, topicPassPercentage: newPercentage };
      setUpdateContent(updatedPayload);
      const response = await fetch(
        "https://localhost:8443/sphinx/api/exam/examtopicUpdate",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPayload || {}),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.successMessage);
      dispatch(toggle());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Wrap>
        <SectionLabel>Exam Topics</SectionLabel>

        <TableCard>
          {/* Stats strip */}
          <StatsStrip>
            <StatItem>
              <strong>{examTopics.length}</strong> topic{examTopics.length !== 1 ? "s" : ""} assigned
            </StatItem>
          </StatsStrip>

          {/* Table header */}
          <TableHead>
            <HeadCell>S.No</HeadCell>
            <HeadCell>Topic Name</HeadCell>
            <HeadCell>Pass %</HeadCell>
            <HeadCell style={{ textAlign: "center" }}>Action</HeadCell>
          </TableHead>

          {/* Rows */}
          {examTopics.length === 0 ? (
            <EmptyState>
              <BookMarked size={48} />
              <span>No topics assigned yet.</span>
            </EmptyState>
          ) : (
            examTopics.map((topic, i) => (
              <TopicRow key={i} $index={i}>
                <RowIndex>{i + 1}</RowIndex>

                <TopicInfo>
                  <TopicIconDot>
                    <BookMarked size={15} />
                  </TopicIconDot>
                  <TopicNameBtn
                    title="Edit Topic"
                    onClick={() => handleUpdate(topic.topicId, examId, topic.topicPassPercentage)}
                  >
                    {topic.topicName}
                  </TopicNameBtn>
                </TopicInfo>

                <PercentBadge>{topic.topicPassPercentage}%</PercentBadge>

                <DeleteBtn
                  onClick={() => {
                    setModalOpen(true);
                    handleDelete(topic.topicId, examId);
                  }}
                >
                  <Trash2 size={15} />
                </DeleteBtn>
              </TopicRow>
            ))
          )}
        </TableCard>

        <LoadBtn disabled={sumbit} onClick={loadExam}>
          <Zap size={16} />
          {sumbit ? "Submitting..." : "Load Question"}
        </LoadBtn>
      </Wrap>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={deleteExamTopic}
        title="Delete Exam"
        message="Are you sure you want to delete this exam? This action cannot be undone."
      />
      <UpdateModalExam
        isOpen={UpdateModal}
        onClose={() => setUpdateModal(false)}
        topics={updateContent}
        onUpdate={updateExamTopic}
      />
    </>
  );
};

export default ExamTDetails;
