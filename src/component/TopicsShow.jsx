import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import QuestionUpload from "./QuestionUpload";
import Pagination from "./Pagination";
import { FileQuestion, UploadCloud, BookMarked, Layers, ChevronRight, ArrowLeft } from "lucide-react";
import { HeadingTable } from "../styles/AvailableExamStyle";
import { BackBtn } from "../pages/ExamUpdate";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  50%       { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const PageWrap = styled.div`
  min-height: 100vh;
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
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
`;

const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const HeroIconRing = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(16, 185, 129, 0.2);
  border: 1.5px solid rgba(52, 211, 153, 0.4);
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

export const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(52, 211, 153, 0.35);
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

const UploadBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: 12px;
  border: 1.5px solid rgba(245, 158, 11, 0.45);
  background: rgba(245, 158, 11, 0.12);
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
    background: rgba(245, 158, 11, 0.22);
    border-color: rgba(245, 158, 11, 0.7);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.25);
  }
  &:active { transform: scale(0.97); }
`;

const ContentArea = styled.div`
  position: relative;
  z-index: 2;
  padding: 0 32px;
  animation: ${fadeUp} 0.45s ease both;
`;

const TableCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.10), 0 1px 6px rgba(0,0,0,0.05);
  overflow: hidden;
  max-width: 960px;
  margin: 0 auto;
`;

const StatsStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #fafbff;
`;

const StatItem = styled.div`
  font-size: 12.5px;
  color: #64748b;
  font-weight: 500;
  strong { color: #1e293b; font-weight: 800; }
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 160px;
  padding: 14px 24px;
  background: #f0fdf4;
  border-bottom: 2px solid #d1fae5;
`;

const HeadCell = styled.span`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #059669;
  &:last-child { text-align: center; }
`;

const TopicRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 160px;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
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
`;

const TopicInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TopicIconDot = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border: 1px solid #a7f3d0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  flex-shrink: 0;
`;

const TopicLabel = styled.span`
  font-size: 14.5px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
`;

const ShowBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s ease;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
  white-space: nowrap;
  margin: 0 auto;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(16, 185, 129, 0.45);
  }
  &:active { transform: scale(0.97); }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
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
  svg { opacity: 0.3; }
`;

const TopicsShow = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [popup, setPopup] = useState(false);
  const navigate = useNavigate();
  const apiRefresh = useSelector((state) => state.api.value);
  const userId = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch(
          `https://localhost:8443/sphinx/api/topic/gettopics?userLoginId=${encodeURIComponent(userId)}`
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

  const paginatedTopics = topics.slice((currentPage - 1) * 10, currentPage * 10);
  const startIndex = (currentPage - 1) * 10;

  return (
    <Layout>
      <PageWrap>
        <HeroBar>
          <HeroInner>
            <HeroLeft>
              <HeroIconRing>
                <Layers size={24} />
              </HeroIconRing>
              <HeroTitleGroup>
                <HeroTitle>Topic Based Questions</HeroTitle>
                <HeroBadge>
                  <HeroDot />
                  {topics.length} Topics Available
                </HeroBadge>
              </HeroTitleGroup>
            </HeroLeft>
          </HeroInner>
<div style={{display:"flex", gap:"20px"}}>
          <UploadBtn onClick={() => setPopup(!popup)}>
            <UploadCloud size={17} />
            Upload Questions
          </UploadBtn>
              <BackBtn
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    <ArrowLeft size={14} /> Back
                  </BackBtn>
                  </div>
        </HeroBar>

        {popup && <QuestionUpload handlePop={() => setPopup(false)} />}

        <ContentArea>
          <TableCard>
            <StatsStrip>
              <StatItem>
                Showing <strong>{paginatedTopics.length}</strong> of <strong>{topics.length}</strong> topics
              </StatItem>
              <StatItem>
                Page <strong>{currentPage}</strong> of <strong>{Math.max(1, Math.ceil(topics.length / 10))}</strong>
              </StatItem>
            </StatsStrip>

            <TableHead>
              <HeadCell>S.No</HeadCell>
              <HeadCell>Topic Name</HeadCell>
              <HeadCell style={{ textAlign: "center" }}>Action</HeadCell>
            </TableHead>

            {topics.length === 0 ? (
              <EmptyState>
                <BookMarked size={48} />
                <span>No topics available yet.</span>
              </EmptyState>
            ) : (
              paginatedTopics.map((topic, index) => (
                <TopicRow key={topic.topicId} $index={index}>
                  <RowIndex>{startIndex + index + 1}</RowIndex>

                  <TopicInfo>
                    <TopicIconDot>
                      <BookMarked size={16} />
                    </TopicIconDot>
                    <TopicLabel>{topic.topicName}</TopicLabel>
                  </TopicInfo>

                  <ShowBtn
                    disabled={loading}
                    onClick={() =>
                      navigate(`/show-question/${topic.topicId}/${topic.topicName}`)
                    }
                  >
                    <FileQuestion size={14} />
                    Questions
                    <ChevronRight size={13} />
                  </ShowBtn>
                </TopicRow>
              ))
            )}
          </TableCard>

          <div style={{ maxWidth: 960, margin: "20px auto 0" }}>
            <Pagination
              currentPage={currentPage}
              totalItems={topics.length}
              itemsPerPage={10}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </div>
        </ContentArea>
      </PageWrap>
    </Layout>
  );
};

export default TopicsShow;