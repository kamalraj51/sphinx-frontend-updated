import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { toast } from "react-toastify";
import {
  ClipboardList,
  CheckCircle,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Layout from "../component/Layout";

/* ── Animations ─────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

/* ── Page ───────────────────────────────────────────── */
const PageWrap = styled.div`
  font-family: "Sora", "DM Sans", "Segoe UI", sans-serif;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/* ── Hero ───────────────────────────────────────────── */
const HeroBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 32px;
  background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%);
  border-radius: 16px;
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
      rgba(16, 185, 129, 0.2) 0%,
      transparent 70%
    );
    border-radius: 50%;
    pointer-events: none;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
`;

const HeroIconRing = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.22);
  border: 1.5px solid rgba(52, 211, 153, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #34d399;
  flex-shrink: 0;
  font-weight: 800;
  font-size: 18px;
  font-family: "Sora", sans-serif;
`;

const HeroTitle = styled.h1`
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.4px;
`;

const HeroSub = styled.p`
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  margin: 2px 0 0;
  font-weight: 500;
`;

export const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.1);
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  font-family: "Sora", "DM Sans", sans-serif;
  cursor: pointer;
  transition: all 0.18s ease;
  position: relative;
  z-index: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
    transform: translateX(-2px);
  }
`;

/* ── Stats Row ──────────────────────────────────────── */
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  animation: ${fadeUp} 0.45s ease both;
  animation-delay: 0.08s;
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 20px 20px 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-top: 3px solid ${({ $color }) => $color};
`;

const StatValue = styled.span`
  font-size: 30px;
  font-weight: 800;
  font-family: "Sora", sans-serif;
  color: ${({ $color }) => $color};
  letter-spacing: -1px;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* ── Card ───────────────────────────────────────────── */
const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.1),
    0 1px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeUp} 0.45s ease both;
  animation-delay: ${({ $delay }) => $delay || "0.1s"};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 2px solid ${({ $border }) => $border || "#e0e7ff"};
  background: ${({ $bg }) => $bg || "#eef2ff"};
`;

const CardTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CardTitle = styled.h2`
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${({ $color }) => $color || "#4338ca"};
  margin: 0;
`;

const CompletedBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  background: linear-gradient(135deg, #059669, #10b981);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  font-family: "Sora", "DM Sans", sans-serif;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(16, 185, 129, 0.28);
  transition: all 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }
`;

const CountPill = styled.span`
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  padding: 1px 9px;
  font-size: 12px;
  font-weight: 800;
`;

const CardBody = styled.div`
  padding: 8px 0;
`;

/* ── Exam Row ───────────────────────────────────────── */
const statusMap = {
  assigned: { bg: "#eff6ff", text: "#3b82f6", dot: "#3b82f6" },
  pending: { bg: "#fffbeb", text: "#f59e0b", dot: "#f59e0b" },
  completed: { bg: "#f0fdf4", text: "#10b981", dot: "#10b981" },
  inprogress: { bg: "#faf5ff", text: "#8b5cf6", dot: "#8b5cf6" },
};

const ExamRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 24px;
  border-bottom: 1px solid #f1f5f9;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition: background 0.18s ease;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => $i * 0.04}s;

  &:last-child {
    border-bottom: none;
  }
  ${({ $clickable }) =>
    $clickable &&
    `
    &:hover { background: #f0fdf4; }
    &:hover .exam-arrow { opacity: 1; transform: translateX(3px); }
  `}
`;

const ExamIconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

const ExamInfo = styled.div`
  flex: 1;
`;

const ExamName = styled.p`
  margin: 0;
  color: #1e293b;
  font-weight: 700;
  font-size: 14px;
`;

const ExamMeta = styled.p`
  margin: 3px 0 0;
  color: #94a3b8;
  font-size: 12px;
`;

const ExamRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
`;

const StatusBadge = styled.span`
  background: ${({ $bg }) => $bg};
  color: ${({ $text }) => $text};
  border-radius: 20px;
  padding: 3px 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  gap: 5px;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ $dot }) => $dot};
    flex-shrink: 0;
  }
`;

const ViewLabel = styled.span`
  font-size: 11px;
  color: #10b981;
  font-weight: 700;
`;

const ExamArrow = styled.span`
  opacity: 0;
  color: #10b981;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
`;

/* ── Skeleton ───────────────────────────────────────── */
const SkeletonRow = styled.div`
  height: 68px;
  margin: 4px 16px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

const EmptyWrap = styled.div`
  text-align: center;
  padding: 56px 0;
  color: #94a3b8;
  font-size: 15px;
  font-weight: 500;
`;

/* ── Main ───────────────────────────────────────────── */
const UserExamDetails = () => {
  const { userId, userName } = useParams();
  const decodedUserId = decodeURIComponent(userId);
  const decodedUserName = decodeURIComponent(userName);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getExamData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://localhost:8443/sphinx/api/user/getAssignUserExam",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userLoginId: decodedUserId }),
        },
      );
      const value = await res.json();
      if (res.ok) setData(value.userExam || []);
      else toast.error(value.error);
    } catch {
      toast.error("Failed to load exams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExamData();
  }, [decodedUserId]);

  const completedCount = data.filter(
    (e) => (e.status || "").toLowerCase() === "completed",
  ).length;

  const initials = decodedUserName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Layout>
      <PageWrap>
        {/* Hero */}
        <HeroBar>
          <HeroLeft>
            <HeroIconRing>{initials}</HeroIconRing>
            <div>
              <HeroTitle>{decodedUserName}</HeroTitle>
              <HeroSub>{decodedUserId}</HeroSub>
            </div>
          </HeroLeft>
          <BackBtn onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </BackBtn>
        </HeroBar>

        {/* Stats */}
        <StatsRow>
          {[
            { label: "Total Exams", value: data.length, color: "#6366f1" },
           
          
          ].map((s) => (
            <StatCard key={s.label} $color={s.color}>
              <StatValue $color={s.color}>{loading ? "—" : s.value}</StatValue>
              <StatLabel>{s.label}</StatLabel>
            </StatCard>
          ))}
        </StatsRow>

        {/* Exam List Card */}
        <Card $delay="0.12s">
          <CardHeader $border="#d1fae5" $bg="#f0fdf4">
            <CardTitleWrap>
              <ClipboardList size={15} color="#059669" />
              <CardTitle $color="#059669">All Assigned Exams</CardTitle>
            </CardTitleWrap>

            <CompletedBtn
              onClick={() =>
                navigate(
                  `/completed-exams/${encodeURIComponent(decodedUserId)}/${encodeURIComponent(decodedUserName)}`,
                )
              }
            >
              <CheckCircle size={15} />
              Completed Assessments
              {completedCount > 0 && <CountPill>{completedCount}</CountPill>}
            </CompletedBtn>
          </CardHeader>

          <CardBody>
            {loading ? (
              [1, 2, 3].map((i) => <SkeletonRow key={i} />)
            ) : data.length === 0 ? (
              <EmptyWrap>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
                No exams assigned yet
              </EmptyWrap>
            ) : (
              data.map((exam, idx) => {
                const status = (exam.status || "assigned").toLowerCase();
                const sc = statusMap[status] || statusMap.assigned;
                const isDone = status === "completed";

                return (
                  <ExamRow
                    key={exam.examId || idx}
                    $i={idx}
                    $clickable={isDone}
                    onClick={
                      isDone
                        ? () =>
                            navigate(
                              `/exam-result/${encodeURIComponent(exam.examId)}/${encodeURIComponent(decodedUserId)}/${encodeURIComponent(exam.examName || exam.examId)}`,
                            )
                        : undefined
                    }
                  >
                    <ExamIconBox>📝</ExamIconBox>

                    <ExamInfo>
                      <ExamName>{exam.examName || exam.examId}</ExamName>
                      {exam.assignedDate && (
                        <ExamMeta>Assigned: {exam.assignedDate}</ExamMeta>
                      )}
                      {exam.dueDate && <ExamMeta>Due: {exam.dueDate}</ExamMeta>}
                    </ExamInfo>

                    <ExamRight>
                      <StatusBadge $bg={sc.bg} $text={sc.text} $dot={sc.dot}>
                        {exam.status || "Assigned"}
                      </StatusBadge>
                      {isDone && <ViewLabel>View Result →</ViewLabel>}
                    </ExamRight>

                    {isDone && (
                      <ExamArrow className="exam-arrow">
                        <ChevronRight size={17} />
                      </ExamArrow>
                    )}
                  </ExamRow>
                );
              })
            )}
          </CardBody>
        </Card>
      </PageWrap>
    </Layout>
  );
};

export default UserExamDetails;
