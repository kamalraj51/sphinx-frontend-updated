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
import { Edit as EditIcon, Trash2 } from "lucide-react";
import styled from "styled-components";
import { FileQuestion, PlusCircle, UploadCloud } from "lucide-react";
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SelectWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors?.textPrimary || '#333'};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors?.error || '#e3342f'};
`;

const ShowQuestion = () => {
  const { topicID } = useParams();
  const dispatch = useDispatch();
  const [questions, setquestions] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const refreshapi = useSelector((state) => state.api.value);

  // Pagination & selection & modal state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // 'bulk' or id

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://localhost:8443/sphinx/api/question/getquesbytopic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicId: topicID }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
    const response = await fetch(`https://localhost:8443/sphinx/api/question/deletequestion`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: quesId }),
    });
    if (!response.ok) throw new Error("Failed to delete question");
  };

  const executeDelete = async () => {
    setModalOpen(false);
    setLoading(true);

    try {
      if (itemToDelete === 'bulk') {
        for (const id of selectedIds) {
          await performDelete(id);
        }
        toast.success("Selected questions deleted successfully");
        setSelectedIds([]);
      } else {
        await performDelete(itemToDelete);
        toast.success("Question deleted successfully");
        setSelectedIds(prev => prev.filter(id => id !== itemToDelete));
      }

      const remaining = questions.length - (itemToDelete === 'bulk' ? selectedIds.length : 1);
      const newTotalPages = Math.ceil(remaining / 10);
      if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages);

      dispatch(toggle());
    } catch (err) {
      toast.error(err.message || "Failed to delete question(s)");
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = (quesId) => {
    navigate(`/updatequestion/${quesId}`);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectIdsAllPage();
    else setSelectedIds([]);
  };

  const handleSelectOne = (e, quesId) => {
    if (e.target.checked) setSelectedIds(prev => [...prev, quesId]);
    else setSelectedIds(prev => prev.filter(id => id !== quesId));
  };

  const paginatedQuestions = questions.slice((currentPage - 1) * 10, currentPage * 10);

  const setSelectIdsAllPage = () => {
    setSelectedIds(paginatedQuestions.map(q => q.questionId));
  }

  const allSelectedOnPage = paginatedQuestions.length > 0 && paginatedQuestions.every(q => selectedIds.includes(q.questionId));

  return (
    <Layout>
      <ContainerExamTD>
        <H2>Questions</H2>
        <Buttons style={{ marginBottom: "20px" }}>
          <Button
            title="Create Question"
            onClick={() => navigate(`/addquestion/${topicID}`)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f59e0b' }}
          >
            <PlusCircle size={18} /> Create Question
          </Button>
        </Buttons>
        {questions.length > 0 && (
          <TopBar>
            <SelectWrap>
              <Checkbox type="checkbox" checked={allSelectedOnPage} onChange={handleSelectAll} />
              <span>Select All</span>
            </SelectWrap>
            {selectedIds.length > 0 && (
              <Button title="Delete Selected" style={{ backgroundColor: '#e3342f', display: 'flex', alignItems: 'center', gap: '4px' }} disabled={loading} onClick={() => handleDeleteClick('bulk')}>
                <Trash2 size={16} /> Delete Selected ({selectedIds.length})
              </Button>
            )}
          </TopBar>
        )}

        {questions.length === 0
          ? <p>No question available</p>
          : paginatedQuestions.map((ques, i) => {
            const isSelected = selectedIds.includes(ques.questionId);
            return (
              <ContentQues key={ques.questionId || i} style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleSelectOne(e, ques.questionId)}
                  style={{ marginRight: '15px' }}
                />
                <Para>{(currentPage - 1) * 10 + i + 1}</Para>
                <Para style={{ flex: 1 }}>{ques.questionDetail}</Para>
                <Para>{ques.questionTypeId}</Para>
                <QuesButtons>
                  <Button
                    title="Update Question"
                    disabled={loading}
                    onClick={() => updateQuestion(ques.questionId)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <EditIcon size={16} /> {loading ? "..." : ""}
                  </Button>
                  <Button
                    title="Delete Question"
                    disabled={loading}
                    onClick={() => handleDeleteClick(ques.questionId)}
                    style={{ backgroundColor: '#e3342f', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={16} /> {loading ? "..." : ""}
                  </Button>
                </QuesButtons>
              </ContentQues>
            );
          })}

        <Pagination
          currentPage={currentPage}
          totalItems={questions.length}
          itemsPerPage={10}
          onPageChange={(p) => setCurrentPage(p)}
        />

        <ConfirmModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={executeDelete}
          title={itemToDelete === 'bulk' ? "Bulk Delete Questions" : "Delete Question"}
          message={itemToDelete === 'bulk' ? `Are you sure you want to delete ${selectedIds.length} questions?` : "Are you sure you want to delete this question? This action cannot be undone."}
        />
      </ContainerExamTD>
    </Layout>
  );
};

export default ShowQuestion;
