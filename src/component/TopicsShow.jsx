import React, { useEffect, useState } from "react";
import {
  Button,
  Buttons,
  H1,
  TopicContainer,
  TopicContent,
  TopicHeading,
  TopicName,
} from "../styles/TopicsStyle";
import { ContentQues, Para } from "../styles/ExamTDetails.style";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import QuestionUpload from "./QuestionUpload";
import Pagination from "./Pagination";
import { toast } from "sonner";
import { FileQuestion, PlusCircle, UploadCloud } from "lucide-react";
import { H2, HeadingTable } from "../styles/AvailableExamStyle";

const TopicsShow = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const apiRefresh = useSelector((state) => state.api.value);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(
          "https://localhost:8443/sphinx/api/topic/gettopics",
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setTopics(data.topic || []);
      } catch (err) {
        console.error("Error fetching topics:", err);
      }
    };
    fetchTopics();
  }, [apiRefresh]);

  const [popup, setPopup] = useState(false);
  const handlePop = () => {
    setPopup(!popup);
  };

  const paginatedTopics = topics.slice(
    (currentPage - 1) * 10,
    currentPage * 10,
  );

  return (
    <Layout>
      <TopicContainer>
        <HeadingTable>
          <H2>Select Topic Based Question</H2>
        </HeadingTable>
        <Buttons style={{ marginBottom: "20px" }}>
          <Button
            title="Upload Questions"
            onClick={() => handlePop()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#f59e0b",
            }}
          >
            <UploadCloud size={18} /> Upload Question
          </Button>
        </Buttons>

        {popup && <QuestionUpload handlePop={handlePop} />}

        {topics.length === 0 ? (
          <H1>No Topic Available</H1>
        ) : (
          paginatedTopics.map((topic, index) => {
            return (
              <ContentQues key={topic.topicId}>
                <Para>{(currentPage - 1) * 10 + index + 1}</Para>
                <Para style={{ flex: 1, textAlign: "left" }}>
                  {topic.topicName}
                </Para>
                <Buttons
                  style={{
                    width: "30%",
                    justifyContent: "flex-end",
                    display: "flex",
                  }}
                >
                  <Button
                    title="Show Questions"
                    disabled={loading}
                    onClick={() =>
                      navigate(
                        `/show-question/${topic.topicId}/${topic.topicName}`,
                      )
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FileQuestion size={16} /> Show Question
                  </Button>
                </Buttons>
              </ContentQues>
            );
          })
        )}

        <Pagination
          currentPage={currentPage}
          totalItems={topics.length}
          itemsPerPage={10}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </TopicContainer>
    </Layout>
  );
};

export default TopicsShow;
