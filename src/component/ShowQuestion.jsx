import React, { useEffect, useState } from "react";
import {
  ContainerExamTD,
  ContentQues,
  H2,
  ContentQuesHead,
  Para,
} from "../styles/ExamTDetails.style";
import { Buttons, Button, QuesButtons } from "../styles/TopicsStyle";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toggle } from "../reducer/apiReduce";
import Layout from "./Layout";
import { toast } from "sonner";
import ConfirmModal from "./ConfirmModal";
import Pagination from "./Pagination";
import { ArrowLeft, Edit as EditIcon, Trash2 } from "lucide-react";
import styled, { keyframes } from "styled-components";
import {
  FileQuestion,
  PlusCircle,
  UploadCloud,
  Layers,
  BookMarked,
  ChevronRight,
} from "lucide-react";
import { BackBtn } from "../pages/ExamUpdate";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const PageWrap = styled.div`
  min-height: 100vh;
  font-family: "Sora", "DM Sans", "Segoe UI", sans-serif;
  padding-bottom: 60px;
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
    content: "";
    position: absolute;
    top: -60px;
    right: -60px;
    width: 260px;
    height: 260px;
    background: radial-gradient(
      circle,
      rgba(16, 185, 129, 0.18) 0%,
      transparent 70%
    );
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

const HeroTitleGroup = styled.div``;

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
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
  display: inline-block;
`;

const CreateBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: 12px;
  border: 1.5px solid rgba(245, 158, 11, 0.4);
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 1;

  &:hover {
    background: rgba(245, 158, 11, 0.2);
    border-color: rgba(245, 158, 11, 0.7);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.25);
  }
  &:active {
    transform: scale(0.97);
  }
`;

const ContentArea = styled.div`
  position: relative;
  z-index: 2;
  animation: ${fadeUp} 0.45s ease both;
`;

const TableCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.1),
    0 1px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 20px;
`;

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
  strong {
    color: #1e293b;
    font-weight: 800;
  }
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
  flex-wrap: wrap;
  gap: 10px;
`;

const SelectWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  font-weight: 600;
  color: #475569;
`;

const Checkbox = styled.input`
  width: 17px;
  height: 17px;
  cursor: pointer;
  accent-color: #10b981;
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 48px 52px 1fr 170px 110px;
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

const QuesRow = styled.div`
  display: grid;
  grid-template-columns: 48px 52px 1fr 170px 110px;
  align-items: center;
  padding: 15px 24px;
  border-bottom: 1px solid #f1f5f9;
  gap: 10px;
  transition: background 0.18s ease;
  animation: ${slideIn} 0.3s ease both;
  animation-delay: ${({ $index }) => $index * 0.04}s;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f0fdf4;
  }
`;

const RowIndex = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
  text-align: center;
`;

const QuestionText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.5;
`;

const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 999px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #059669;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  &:active {
    transform: scale(0.95);
  }
`;

const EditBtn = styled(IconBtn)`
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }
`;

const DeleteBtn = styled(IconBtn)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  box-shadow: 0 3px 10px rgba(239, 68, 68, 0.25);
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
  }
`;

const BulkDeleteBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s ease;
  box-shadow: 0 3px 10px rgba(239, 68, 68, 0.25);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35);
  }
  &:active {
    transform: scale(0.97);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  padding: 64px 32px;
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  svg {
    opacity: 0.3;
  }
`;

const ShowQuestion = () => {
  const { topicID, tname } = useParams();
  const dispatch = useDispatch();
  const [questions, setquestions] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const refreshapi = useSelector((state) => state.api.value);
  const userId = useSelector((state) => state.auth.user);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://localhost:8443/sphinx/api/question/get-ques-by-topic",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topicId: topicID, userLoginId: userId }),
          },
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const res = await response.json();
        setquestions(res.questionList || []);
      } catch (err) {
        console.error(err, "fetching questions");
      }
    };
    fetchQuestions();
  }, [refreshapi, topicID]);

  const handleDeleteClick = (identifier) => {
    setItemToDelete(identifier);
    setModalOpen(true);
  };

  const performDelete = async (quesId) => {
    const response = await fetch(
      `https://localhost:8443/sphinx/api/question/delete-question`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: quesId }),
      },
    );
    if (!response.ok) throw new Error("Failed to delete question");
  };

  const executeDelete = async () => {
    setModalOpen(false);
    setLoading(true);
    try {
      if (itemToDelete === "bulk") {
        for (const id of selectedIds) await performDelete(id);
        toast.success("Selected questions deleted successfully");
        setSelectedIds([]);
      } else {
        await performDelete(itemToDelete);
        toast.success("Question deleted successfully");
        setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete));
      }

      const remaining =
        questions.length - (itemToDelete === "bulk" ? selectedIds.length : 1);

      const newTotalPages = Math.ceil(remaining / 10);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

      dispatch(toggle());
    } catch (err) {
      toast.error(err.message || "Failed to delete question(s)");
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = (quesId) => navigate(`/update-question/${quesId}`);

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectIdsAllPage();
    else setSelectedIds([]);
  };

  const handleSelectOne = (e, quesId) => {
    if (e.target.checked) setSelectedIds((prev) => [...prev, quesId]);
    else setSelectedIds((prev) => prev.filter((id) => id !== quesId));
  };

  const paginatedQuestions = questions.slice(
    (currentPage - 1) * 10,
    currentPage * 10,
  );

  const setSelectIdsAllPage = () =>
    setSelectedIds(paginatedQuestions.map((q) => q.questionId));

  const allSelectedOnPage =
    paginatedQuestions.length > 0 &&
    paginatedQuestions.every((q) => selectedIds.includes(q.questionId));

  return (
    <Layout>
      <PageWrap>
        <HeroBar>
          <HeroLeft>
            <HeroIconRing>
              <FileQuestion size={24} />
            </HeroIconRing>
            <HeroTitleGroup>
              <HeroTitle>Topic: {tname}</HeroTitle>
              <HeroBadge>
                <HeroDot />
                {questions.length} Questions Available
              </HeroBadge>
            </HeroTitleGroup>
          </HeroLeft>
          <div style={{ display: "flex", gap: "20px" }}>
            <CreateBtn
              onClick={() => navigate(`/create-question/${topicID}/${tname}`)}
            >
              <PlusCircle size={17} />
              Create Question
            </CreateBtn>
            <BackBtn
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowLeft size={14} /> Back
            </BackBtn>
          </div>
        </HeroBar>

        <ContentArea>
          <TableCard>
            <StatsStrip>
              <StatItem>
                Showing <strong>{paginatedQuestions.length}</strong> of{" "}
                <strong>{questions.length}</strong> questions
              </StatItem>
              <StatItem>
                Page <strong>{currentPage}</strong> of{" "}
                <strong>{Math.max(1, Math.ceil(questions.length / 10))}</strong>
              </StatItem>
            </StatsStrip>

            {questions.length > 0 && (
              <Toolbar>
                <SelectWrap>
                  <Checkbox
                    type="checkbox"
                    checked={allSelectedOnPage}
                    onChange={handleSelectAll}
                  />
                  <span>Select All on Page</span>
                </SelectWrap>

                {selectedIds.length > 0 && (
                  <BulkDeleteBtn
                    disabled={loading}
                    onClick={() => handleDeleteClick("bulk")}
                  >
                    <Trash2 size={15} />
                    Delete Selected ({selectedIds.length})
                  </BulkDeleteBtn>
                )}
              </Toolbar>
            )}

            <TableHead>
              <HeadCell></HeadCell>
              <HeadCell>S.No</HeadCell>
              <HeadCell>Question Details</HeadCell>
              <HeadCell>Question Type</HeadCell>
              <HeadCell style={{ textAlign: "center" }}>Action</HeadCell>
            </TableHead>

            {questions.length === 0 ? (
              <EmptyState>
                <FileQuestion size={48} />
                <span>No questions available yet.</span>
              </EmptyState>
            ) : (
              paginatedQuestions.map((ques, i) => {
                const isSelected = selectedIds.includes(ques.questionId);

                return (
                  <QuesRow key={ques.questionId || i} $index={i}>
                    <Checkbox
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(e, ques.questionId)}
                    />
                    <RowIndex>{(currentPage - 1) * 10 + i + 1}</RowIndex>
                    <QuestionText>{ques.questionDetail}</QuestionText>
                    <TypeBadge>{ques.questionTypeId}</TypeBadge>
                    <ActionGroup>
                      <EditBtn
                        disabled={loading}
                        onClick={() => updateQuestion(ques.questionId)}
                      >
                        <EditIcon size={15} />
                      </EditBtn>
                      <DeleteBtn
                        disabled={loading}
                        onClick={() => handleDeleteClick(ques.questionId)}
                      >
                        <Trash2 size={15} />
                      </DeleteBtn>
                    </ActionGroup>
                  </QuesRow>
                );
              })
            )}
          </TableCard>

          <Pagination
            currentPage={currentPage}
            totalItems={questions.length}
            itemsPerPage={10}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </ContentArea>

        <ConfirmModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={executeDelete}
          title={
            itemToDelete === "bulk"
              ? "Bulk Delete Questions"
              : "Delete Question"
          }
          message={
            itemToDelete === "bulk"
              ? `Are you sure you want to delete ${selectedIds.length} questions?`
              : "Are you sure you want to delete this question? This action cannot be undone."
          }
        />
      </PageWrap>
    </Layout>
  );
};

export default ShowQuestion;
