import React, { use, useEffect, useState } from "react";
import {
  Button,
  ContainerExamTD,
  ContentETD,
  H2,
  NotAvail,
  P,
} from "../styles/ExamTDetails.style";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { toggle } from "../reducer/apiReduce";
import UpdateModalExam from "./UpdateModalExam";

const ExamTDetails = (props) => {
  const [examTopics, setExamTopics] = useState([]);
  let { examId } = useParams();
  const [sumbit, setSubmit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDetails, setDeleteDetails] = useState();
  const [UpdateModal, setUpdateModal] = useState(false);
  const [updateContent, setUpdateContent] = useState();

  if (!examId) {
    examId = props.examId;
  }
  const apiRefresh = useSelector((state) => state.api.value);
  const dispatch = useDispatch();

  const handleDelete = (topic, exam) => {
    setModalOpen(true);
    setDeleteDetails({ topicId: topic, examId: exam });
  };

  const handleUpdate = (topic, exam, percent) => {
    setUpdateModal(true);
    setUpdateContent({
      topicId: topic,
      examId: exam,
      topicPassPercentage: percent,
    });
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(
          `https://localhost:8443/sphinx/api/exam/examtopicbyid?examId=${examId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ examId }),
        },
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateContent),
        },
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
      const updatedPayload = {
        ...updateContent,
        topicPassPercentage: newPercentage,
      };

      setUpdateContent(updatedPayload);

      const response = await fetch(
        "https://localhost:8443/sphinx/api/exam/examtopicUpdate",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPayload || {}),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(result.successMessage);
      dispatch(toggle()); // refresh list
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <ContainerExamTD>
        <H2>Exam Topics</H2>
        <ContentETD>
          <P>SNO.</P>
          <P>TopicName</P>
          <P>Percentage</P>
        </ContentETD>

        {examTopics.length === 0 ? (
          <NotAvail>No topic available</NotAvail>
        ) : (
          examTopics.map((topic, i) => {
            return (
              <ContentETD key={i}>
                <P>{i + 1}</P>
                <P
                  title="Edit Topic"
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() =>
                    handleUpdate(
                      topic.topicId,
                      examId,
                      topic.topicPassPercentage,
                    )
                  }
                >
                  {topic.topicName}
                </P>
                <P>{topic.topicPassPercentage}</P>
                <p
                  onClick={() => {
                    setModalOpen(true);
                    handleDelete(topic.topicId, examId);
                  }}
                >
                  <button>
                    {" "}
                    <Trash2 size={16} />
                  </button>
                </p>
              </ContentETD>
            );
          })
        )}

        <Button
          disabled={sumbit}
          onClick={() => {
            loadExam();
          }}
        >
          {sumbit ? "Submitting.." : "Load Question"}
        </Button>
      </ContainerExamTD>
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
