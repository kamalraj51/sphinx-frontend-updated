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
import { HeroBadge } from "./TopicsShow";

const AvailableExam = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [examData, setExamData]         = useState([]);
  const [currentPage, setCurrentPage]   = useState(1);
  const [modalOpen, setModalOpen]       = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExam, setSelectedExam]   = useState(null);

  const userId  = useSelector((state) => state.auth.user);
  const message = location.state?.message;

  /* ── Fetch all exams ───────────────────────────────────────── */
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

  /* ── Delete handlers ───────────────────────────────────────── */
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

      if (!response.ok) { toast.error("Failed to delete the exam"); return; }

      setExamData((prev) => {
        const updated = prev.filter((item) => item.examId !== itemToDelete);
        if (updated.length <= (currentPage - 1) * 10 && currentPage > 1) {
          setCurrentPage((p) => p - 1);
        }
        return updated;
      });

      toast.success("Exam deleted successfully");
    } catch {
      toast.error("Network error. Could not delete exam.");
    }
  };

  /* ── Edit modal handlers ───────────────────────────────────── */
  const handleEditClick = (exam) => {
    setSelectedExam(exam);
    setEditModalOpen(true);
  };

  // Called by ExamUpdateModal after a successful save — updates list in-place
  const handleUpdateSuccess = (updatedExam) => {
    setExamData((prev) =>
      prev.map((item) =>
        item.examId === updatedExam.examId ? { ...item, ...updatedExam } : item
      )
    );
  };

  /* ── Effects ───────────────────────────────────────────────── */
  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [message, navigate, location.pathname]);

  useEffect(() => {
    if (userId) getAllExam();
  }, [userId]);

  /* ── Pagination ────────────────────────────────────────────── */
  const handlePageChange = (page) => setCurrentPage(page);

  const paginatedData = examData.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  return (
    <AvailableContainer>
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
        <ClipboardList size={28} strokeWidth={1.8} style={{ opacity: 0.9 }} />
        <H2>Available Assessments</H2>
        </div>
        <HeroBadge style={{border: "1px solid rgba(34, 248, 176, 0.3)"}}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
                  {examData.length} Assessment Available
          
        </HeroBadge>
      </HeadingTable>

      <TableWrapper>
        {paginatedData.length === 0 ? (
          <EmptyState>No assessments available.</EmptyState>
        ) : (
          <StyledTable>
            <THead>
              <TR>
                <TH style={{ width: "50px" }}>S.NO</TH>
                <TH style={{ textAlign: "start" }}>Assessment Name</TH>
                <TH style={{ textAlign: "start" }}>Description</TH>
                <TH style={{ textAlign: "center" }}>Questions</TH>
                <TH style={{ textAlign: "center" }}>Duration</TH>
                <TH style={{ textAlign: "center" }}>Pass %</TH>
                <TH style={{ textAlign: "center" }}>Actions</TH>
              </TR>
            </THead>
            <TBody>
              {paginatedData.map((data, index) => {
                if (!data) return null;
                return (
                  <TR key={data.examId}>
                    <TD
                      style={{
                        color: "var(--text-muted)",
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      {(currentPage - 1) * 10 + index + 1}
                    </TD>

                    <TD>
                      <button
                        onClick={() =>
                          navigate("/examupdate", { state: { examData: data } })
                        }
                        style={{
                          border: "none",
                          cursor: "pointer",
                          background: "none",
                          color: "blue",
                          fontWeight: 700,
                          fontSize: "14px",
                          textAlign: "left",
                          padding: 0,
                          fontFamily: "inherit",
                          lineHeight: 1.4,
                        }}
                      >
                        {data.examName}
                      </button>
                    </TD>

                    <DescriptionCell>{data.description}</DescriptionCell>

                    <TD style={{ textAlign: "center" }}>
                      <BadgePill $color="indigo">{data.noOfQuestions}</BadgePill>
                    </TD>

                    <TD style={{ textAlign: "center" }}>
                      <BadgePill $color="slate">{data.duration}</BadgePill>
                    </TD>

                    <TD style={{ textAlign: "center" }}>
                      <BadgePill $color="emerald">{data.passPercentage}%</BadgePill>
                    </TD>

                    <TD>
                      <BtnGroup>
                        {/* ✅ Opens modal popup instead of navigating */}
                        <ActionBtn
                          $variant="edit"
                          title="Edit Exam"
                          onClick={() => handleEditClick(data)}
                        >
                          <EditIcon size={15} />
                        </ActionBtn>

                        <ActionBtn
                          $variant="delete"
                          title="Delete Exam"
                          onClick={() => handleDeleteClick(data.examId)}
                        >
                          <Trash2 size={15} />
                        </ActionBtn>

                        <ActionBtn
                          $variant="assign"
                          title="Assign User"
                          onClick={() =>
                            navigate("/get-user", {
                              state: { examId: data.examId },
                            })
                          }
                        >
                          <UserPlus size={15} />
                        </ActionBtn>
                      </BtnGroup>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </StyledTable>
        )}
      </TableWrapper>

      <Pagination
        currentPage={currentPage}
        totalItems={examData.length}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />

      {/* Delete confirm modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleExamDelete}
        title="Delete Exam"
        message="Are you sure you want to delete this exam?"
      />

      {/* Edit popup modal — renders on top of the current page */}
      {editModalOpen && selectedExam && (
        <ExamUpdateModal
          examData={selectedExam}
          onClose={() => { setEditModalOpen(false); setSelectedExam(null); }}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </AvailableContainer>
  );
};

export default AvailableExam;
