import React, { useEffect, useState } from "react";
import {
  AvailableContainer,
  AvailableTable,
  ExamRow,
  ExamHeaderRow,
  ExamCol,
  ButtonDiv,
  Delete,
  Edit,
  H2,
  HeadingTable,
  TableWrapper,
} from "../styles/AvailableExamStyle";
import { Button } from "../styles/CreateExam.style";
import { useLocation, useNavigate } from "react-router-dom";
import { toggle } from "../reducer/apiReduce";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Edit as EditIcon, RefreshCw, Trash2, UserPlus } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import Pagination from "./Pagination";
//  <RefreshCw size={16} />
const AvailableExam = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examData, setExamData] = useState([]);
  const apiRefresh = useSelector((state) => state.api.value);
  const location = useLocation();


  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const getAllExam = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/exam/getexam",
        {
          method: "GET",
        },
      );
      const allData = await response.json();
      setExamData(allData.data.data || []);
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ examId: itemToDelete }),
        },
      );

      if (!response.ok) {
        toast.error("Failed to delete the exam");
        return;
      } else {
        toast.success("Exam deleted successfully");
        dispatch(toggle());
      }

      // Fix pagination if deleting last item on current page
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      toast.error("Network error. Could not delete exam.");
    }
  };
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, []);

  useEffect(() => {
    getAllExam();
  }, [apiRefresh]);

  const handlePageChange = (page) => setCurrentPage(page);

  const paginatedData = examData.slice(
    (currentPage - 1) * 10,
    currentPage * 10,
  );

  return (
    <AvailableContainer>
      <HeadingTable>
        <H2>Available Assessment</H2>
      </HeadingTable>
      <TableWrapper>
        <AvailableTable>
          <ExamHeaderRow>
            <ExamCol>Sl.No</ExamCol>
            <ExamCol>Exam Name</ExamCol>
            <ExamCol>Description</ExamCol>
            <ExamCol>No of Questions</ExamCol>
            <ExamCol>Duration</ExamCol>
            <ExamCol>Pass %</ExamCol>
            <ExamCol>Edit Topic</ExamCol>
            <ExamCol>Delete the Exam</ExamCol>
            <ExamCol>Assign user</ExamCol>
          </ExamHeaderRow>

          {examData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
              No exam available
            </div>
          ) : (
            paginatedData.map((data, index) => (
              <ExamRow key={index}>
                <ExamCol>{(currentPage - 1) * 10 + index + 1}</ExamCol>
                <ExamCol title={data.examName}><button title="Edit Exam"
                  onClick={() =>
                    navigate("/examupdate", { state: { examData: data } })
                  }
                  style={{ border: "none", cursor: "pointer", color: "blue" }}
                >{data.examName}</button></ExamCol>
                <ExamCol title={data.description}>{data.description}</ExamCol>
                <ExamCol>{data.noOfQuestions}</ExamCol>
                <ExamCol>{data.duration}</ExamCol>
                <ExamCol>{data.passPercentage}</ExamCol>

                <ExamCol>
                  <ButtonDiv style={{ display: "flex", gap: "1px" }}>
                    <Edit
                      title="Edit Topic"
                      onClick={() => navigate(`/editexam/${data.examId}`)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <EditIcon size={16} />
                    </Edit>

                  </ButtonDiv>
                </ExamCol>

                <ExamCol>
                  <Delete
                    title="Delete Exam"
                    onClick={() => handleDeleteClick(data.examId)}
                    style={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <Trash2 size={16} />
                  </Delete>
                </ExamCol>
                <ExamCol>
                  <Button
                    title="Assign User"
                    onClick={() =>
                      navigate("/getuser", { state: { examId: data.examId } })
                    }
                    style={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <UserPlus size={16} />
                  </Button>
                </ExamCol>
              </ExamRow>
            ))
          )}
        </AvailableTable>
      </TableWrapper>

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
        title="Delete Exam"
        message="Are you sure you want to delete this exam? This action cannot be undone."
      />
    </AvailableContainer>
  );
};

export default AvailableExam;
