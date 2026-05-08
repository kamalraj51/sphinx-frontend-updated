import React, { useEffect, useState } from "react";
import {
  AvailableContainer,
  HeadingTable,
  H2,
  H2Sub,
  TableWrapper,
  StyledTable,
  THead,
  TBody,
  TR,
  TH,
  TD,
  DescriptionCell,
  BadgePill,
  ActionBtn,
  BtnGroup,
  EmptyState,
} from "../styles/AvailableExamStyle";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Edit as EditIcon, Trash2, UserPlus, ClipboardList } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import Pagination from "./Pagination";
import ExamUpdateModal from "../pages/ExamUpdate";
import styled, { keyframes } from "styled-components";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const PageWrap = styled.div`
  font-family: 'Sora', 'DM Sans', 'Segoe UI', sans-serif;
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
  position: relative;
  z-index: 1;
`;

const HeroDot = styled.span`
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #34d399;
  display: inline-block;
`;

const TableCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.10), 0 1px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  margin-bottom: 20px;
  animation: ${fadeUp} 0.45s ease both;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THeadStyled = styled.thead`
  background: #f0fdf4;
  border-bottom: 2px solid #d1fae5;
`;

const THStyled = styled.th`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #059669;
  padding: 13px 16px;
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  white-space: nowrap;
`;

const TBodyStyled = styled.tbody``;

const TRStyled = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.18s ease;
  animation: ${slideIn} 0.3s ease both;
  animation-delay: ${({ $index }) => ($index || 0) * 0.04}s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f0fdf4;
  }
`;

const TDStyled = styled.td`
  padding: 14px 16px;
  font-size: 13.5px;
  color: #1e293b;
  vertical-align: middle;
`;

const SerialNum = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
  display: block;
  text-align: center;
`;

const DescText = styled.td`
  padding: 14px 16px;
  font-size: 13px;
  color: #64748b;
  max-width: 220px;
  vertical-align: middle;
  line-height: 1.5;
`;

const ExamNameBtn = styled.button`
  border: none;
  cursor: pointer;
  background: none;
  color: #059669;
  font-weight: 700;
  font-size: 14px;
  text-align: left;
  padding: 0;
  font-family: inherit;
  line-height: 1.4;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.18s;

  &:hover {
    text-decoration-color: #059669;
  }
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  white-space: nowrap;

  ${({ $color }) =>
    $color === "indigo" &&
    `background: #eef2ff; border: 1px solid #c7d2fe; color: #4f46e5;`}

  ${({ $color }) =>
    $color === "slate" &&
    `background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569;`}

  ${({ $color }) =>
    $color === "emerald" &&
    `background: #ecfdf5; border: 1px solid #a7f3d0; color: #059669;`}
`;

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;

  &:active {
    transform: scale(0.95);
  }
`;

const EditBtn = styled(IconBtn)`
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  box-shadow: 0 3px 8px rgba(16,185,129,0.28);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(16,185,129,0.4);
  }
`;

const DeleteBtn = styled(IconBtn)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  box-shadow: 0 3px 8px rgba(239,68,68,0.22);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(239,68,68,0.35);
  }
`;

const AssignBtn = styled(IconBtn)`
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #fff;
  box-shadow: 0 3px 8px rgba(99,102,241,0.22);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(99,102,241,0.35);
  }
`;

const BtnGroupWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

const EmptyStateStyled = styled.div`
  padding: 64px 32px;
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const AvailableExam = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [examData, setExamData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const userId = useSelector((state) => state.auth.user);
  const message = location.state?.message;

  const getAllExam = async () => {
    try {
      const response = await fetch(
        `https://localhost:8443/sphinx/api/exam/get-exam?userLoginId=${encodeURIComponent(userId)}`
      );

      const allData = await response.json();

      setExamData((allData?.data?.data || []).filter(Boolean));
    } catch (err) {
      console.error("Failed to fetch exams:", err);
    }
  };

  const handleDeleteClick = (examId) => {
    setItemToDelete(examId);
    setModalOpen(true);
  };

  const handleExamDelete = async () => {
    if (!itemToDelete) return;

    setModalOpen(false);

    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/exam/examDelete",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId: itemToDelete, userLoginId: userId }),
        }
      );

      if (!response.ok) {
        toast.error("Failed to delete the assessment");
        return;
      }

      setExamData((prev) => {
        const updated = prev.filter((item) => item.examId !== itemToDelete);

        if (updated.length <= (currentPage - 1) * 10 && currentPage > 1) {
          setCurrentPage((p) => p - 1);
        }

        return updated;
      });

      toast.success("Assessment deleted successfully");
    } catch {
      toast.error("Network error. Could not delete assessment.");
    }
  };

  const handleEditClick = (exam) => {
    setSelectedExam(exam);
    setEditModalOpen(true);
  };

  const handleUpdateSuccess = (updatedExam) => {
    setExamData((prev) =>
      prev.map((item) =>
        item.examId === updatedExam.examId ? { ...item, ...updatedExam } : item
      )
    );
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [message, navigate, location.pathname]);

  useEffect(() => {
    if (userId) getAllExam();
  }, [userId]);

  const handlePageChange = (page) => setCurrentPage(page);

  const paginatedData = examData.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  return (
    <PageWrap>
      <HeroBar>
        <HeroLeft>
          <HeroIconRing>
            <ClipboardList size={24} strokeWidth={1.8} />
          </HeroIconRing>

          <div>
            <HeroTitle>Available Assessments</HeroTitle>
          </div>
        </HeroLeft>

        <HeroBadge>
          <HeroDot />
          {examData.length} Assessment
          {examData.length !== 1 ? "s" : ""} Available
        </HeroBadge>
      </HeroBar>

      <TableCard>
        <StatsStrip>
          <StatItem>
            Showing <strong>{paginatedData.length}</strong> of{" "}
            <strong>{examData.length}</strong> assessments
          </StatItem>

          <StatItem>
            Page <strong>{currentPage}</strong> of{" "}
            <strong>{Math.max(1, Math.ceil(examData.length / 10))}</strong>
          </StatItem>
        </StatsStrip>

        {paginatedData.length === 0 ? (
          <EmptyStateStyled>
            <ClipboardList size={48} style={{ opacity: 0.25 }} />
            <span>No assessments available.</span>
          </EmptyStateStyled>
        ) : (
          <Table>
            <THeadStyled>
              <tr>
                <THStyled style={{ width: 52, textAlign: "center" }}>
                  S.No
                </THStyled>

                <THStyled>Assessment Name</THStyled>

                <THStyled>Description</THStyled>

                <THStyled $center>Questions</THStyled>

                <THStyled $center>Duration</THStyled>

                <THStyled $center>Pass %</THStyled>

                <THStyled $center>Actions</THStyled>
              </tr>
            </THeadStyled>

            <TBodyStyled>
              {paginatedData.map((data, index) => {
                if (!data) return null;

                return (
                  <TRStyled key={data.examId} $index={index}>
                    <TDStyled>
                      <SerialNum>
                        {(currentPage - 1) * 10 + index + 1}
                      </SerialNum>
                    </TDStyled>

                    <TDStyled>
                      <ExamNameBtn
                        title="Edit Exam"
                        onClick={() =>
                          navigate("/exam-update", {
                            state: { examData: data },
                          })
                        }
                      >
                        {data.examName}
                      </ExamNameBtn>
                    </TDStyled>

                    <DescText>{data.description}</DescText>

                    <TDStyled style={{ textAlign: "center" }}>
                      <Pill $color="indigo">{data.noOfQuestions}</Pill>
                    </TDStyled>

                    <TDStyled style={{ textAlign: "center" }}>
                      <Pill $color="slate">{data.duration}</Pill>
                    </TDStyled>

                    <TDStyled style={{ textAlign: "center" }}>
                      <Pill $color="emerald">
                        {data.passPercentage}%
                      </Pill>
                    </TDStyled>

                    <TDStyled>
                      <BtnGroupWrap>
                        <EditBtn
                          title="Edit Topics"
                          onClick={() =>
                            navigate(`/edit-exam/${data.examId}`)
                          }
                        >
                          <EditIcon size={15} />
                        </EditBtn>

                        <DeleteBtn
                          title="Delete Assessment"
                          onClick={() =>
                            handleDeleteClick(data.examId)
                          }
                        >
                          <Trash2 size={15} />
                        </DeleteBtn>

                        <AssignBtn
                          title="Assign User"
                          onClick={() =>
                            navigate("/get-user", {
                              state: { examId: data.examId },
                            })
                          }
                        >
                          <UserPlus size={15} />
                        </AssignBtn>
                      </BtnGroupWrap>
                    </TDStyled>
                  </TRStyled>
                );
              })}
            </TBodyStyled>
          </Table>
        )}
      </TableCard>

      <Pagination
        currentPage={currentPage}
        totalItems={examData.length}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleExamDelete}
        title="Delete Assessment"
        message="Are you sure you want to delete this exam?"
      />

      {editModalOpen && selectedExam && (
        <ExamUpdateModal
          examData={selectedExam}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedExam(null);
          }}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </PageWrap>
  );
};

export default AvailableExam;