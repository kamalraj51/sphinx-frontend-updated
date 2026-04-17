

import React, { useEffect, useState } from 'react'
import {
  AvailableContainer, AvailableTable, ExamRow, ExamHeaderRow,
  ExamCol, ButtonDiv, Delete, Edit, H2, HeadingTable, TableWrapper
} from '../styles/AvailableExamStyle'
import { Button } from '../styles/CreateExam.style'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Edit as EditIcon, RefreshCw, Trash2, UserPlus } from 'lucide-react'
import ConfirmModal from './ConfirmModal'
import Pagination from './Pagination'

const AvailableExam = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [examData, setExamData] = useState([])
  const userId = useSelector((state) => state.auth.user)

  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

 
  const getAllExam = async () => {
    try {
      const response = await fetch("https://localhost:8443/sphinx/api/exam/getexam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userLoginId: userId })
      })

      const allData = await response.json()

   
      setExamData((allData?.data?.data || []).filter(item => item))

    } catch (err) {
      console.error("Failed to fetch exams:", err)
    }
  }

  //  Delete click
  const handleDeleteClick = (examId) => {
    setItemToDelete(examId)
    setModalOpen(true)
  }


  const handleExamDelete = async () => {
    if (!itemToDelete) return

    setModalOpen(false)

    try {
      const response = await fetch("https://localhost:8443/sphinx/api/exam/examDelete", {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ examId: itemToDelete,userLoginId:userId }),
      })

      if (!response.ok) {
        toast.error("Failed to delete the exam")
        return
      }

    
      setExamData(prev => {
        const updated = prev.filter(item => item.examId !== itemToDelete)

        if ((updated.length <= (currentPage - 1) * 10) && currentPage > 1) {
          setCurrentPage(prevPage => prevPage - 1)
        }

        return updated
      })

      toast.success("Exam deleted successfully")

    } catch (err) {
      toast.error("Network error. Could not delete exam.")
    }
  }

 
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state])

  //  Initial load
  useEffect(() => {
    getAllExam()
  }, [])

  const handlePageChange = (page) => setCurrentPage(page)

  const paginatedData = (examData || [])
    .slice((currentPage - 1) * 10, currentPage * 10)

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
            <ExamCol>No of Question</ExamCol>
            <ExamCol>Duration</ExamCol>
            <ExamCol>Pass %</ExamCol>
            <ExamCol>Edit Exam</ExamCol>
            <ExamCol>Delete the Exam</ExamCol>
            <ExamCol>Assign user</ExamCol>
          </ExamHeaderRow>

          {paginatedData.map((data, index) => {
            if (!data) return null //  safety

            return (
              <ExamRow key={data.examId}>
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
                      onClick={() => navigate(`/edit-exam/${data.examId}`)}
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
                  <Delete onClick={() => handleDeleteClick(data.examId)}>
                    <Trash2 size={16} />
                  </Delete>
                </ExamCol>

                <ExamCol>

                  <Button
                    title="Assign User"
                    onClick={() =>
                      navigate("/get-user", { state: { examId: data.examId } })
                    }
                    style={{ display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <UserPlus size={16} />
                  </Button>
                </ExamCol>
              </ExamRow>
            )
          })}
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
        message="Are you sure you want to delete this exam?"
      />
    </AvailableContainer>
  )
}

export default AvailableExam

