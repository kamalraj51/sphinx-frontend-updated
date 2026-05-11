import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { Users, ChevronRight } from "lucide-react";
import Layout from "../component/Layout";

/* ── Animations — same as AddTopic ─────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
`;

/* ── Page ───────────────────────────────────────────── */
const PageWrap = styled.div`
  font-family: "Sora", "DM Sans", "Segoe UI", sans-serif;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/* ── Hero — exact green gradient from AddTopic ──────── */
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
    background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%);
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

/* exact copy of AddTopic's HeroIconRing */
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
  font-family: "Sora", "DM Sans", "Segoe UI", sans-serif;
`;

/* exact copy of AddTopic's HeroBadge */
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

/* count badge on the right of hero */
const CountBadge = styled.div`
  background: rgba(52, 211, 153, 0.15);
  border: 1.5px solid rgba(52, 211, 153, 0.35);
  color: #34d399;
  border-radius: 14px;
  padding: 10px 26px;
  font-weight: 800;
  font-size: 26px;
  font-family: "Sora", sans-serif;
  position: relative;
  z-index: 1;
  letter-spacing: -0.5px;
`;

const LoadingDot = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  animation: ${pulse} 1.2s ease infinite;
  animation-delay: ${({ $d }) => $d}s;
  margin: 0 2px;
`;

/* ── Card — exact green style from AddTopic's FormCard ─ */
const Card = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), 0 1px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeUp} 0.45s ease both;
  font-family: "Sora", "DM Sans", "Segoe UI", sans-serif;
`;

/* exact copy of AddTopic's FormCardHeader */
const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #f0fdf4;
  border-bottom: 2px solid #d1fae5;
`;

const CardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CardTitle = styled.h2`
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #059669;
  margin: 0;
`;

/* count pill matching green */
const CardCount = styled.span`
  background: #d1fae5;
  color: #059669;
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 700;
`;

const CardBody = styled.div`
  padding: 8px 0;
`;

/* ── User Row ───────────────────────────────────────── */
const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 24px;
  cursor: pointer;
  border-bottom: 1px solid #f0fdf4;
  transition: background 0.18s ease;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => $i * 0.04}s;

  &:last-child { border-bottom: none; }
  &:hover { background: #f0fdf4; }
  &:hover .row-arrow {
    opacity: 1;
    transform: translateX(4px);
  }
`;

const avatarPalette = [
  ["#6366f1", "#818cf8"],
  ["#ec4899", "#f472b6"],
  ["#10b981", "#34d399"],
  ["#f59e0b", "#fbbf24"],
  ["#3b82f6", "#60a5fa"],
  ["#8b5cf6", "#a78bfa"],
];

const Avatar = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: ${({ $g }) => $g};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  font-family: "Sora", sans-serif;
  flex-shrink: 0;
  box-shadow: 0 2px 8px ${({ $sh }) => $sh};
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.p`
  margin: 0;
  color: #1e293b;
  font-weight: 700;
  font-size: 14.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserIdText = styled.p`
  margin: 2px 0 0;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
`;

const UserEmail = styled.p`
  margin: 2px 0 0;
  color: #cbd5e1;
  font-size: 11px;
`;

/* role tag in green to match AddTopic theme */
const RoleTag = styled.span`
  background: #d1fae5;
  color: #059669;
  border: 1px solid #a7f3d0;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
`;

const RowArrow = styled.span`
  color: #10b981;
  opacity: 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
`;

/* ── Skeleton ───────────────────────────────────────── */
const SkeletonRow = styled.div`
  height: 74px;
  margin: 6px 16px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f0fdf4 25%, #d1fae5 50%, #f0fdf4 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

/* ── Empty ──────────────────────────────────────────── */
const EmptyWrap = styled.div`
  text-align: center;
  padding: 64px 0;
  color: #94a3b8;
  font-size: 15px;
  font-weight: 500;
`;

/* ═══════════════════════════════════════════════════
   COMPONENT — logic 100% identical to original
═══════════════════════════════════════════════════ */
const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user);

  const handleUser = async () => {
    try {
      const res = await fetch(
        "https://localhost:8443/sphinx/api/user/getAllPartyUsers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ createdByUserLogin: userId }),
        },
      );
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setUsers(data.allUser || []);
    } catch {
      console.log("Retrying...");
      setTimeout(handleUser, 1000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleUser();
  }, []);

  return (
    <Layout>
      <PageWrap>
        {/* ── Hero ── */}
        <HeroBar>
          <HeroLeft>
            <HeroIconRing>
              <Users size={24} />
            </HeroIconRing>
            <div>
              <HeroTitle>All Users</HeroTitle>
              <HeroBadge>
                <HeroDot />
                {loading ? (
                  <>
                    Loading&nbsp;
                    <LoadingDot $d={0} />
                    <LoadingDot $d={0.2} />
                    <LoadingDot $d={0.4} />
                  </>
                ) : (
                  `${users.length} registered user${users.length !== 1 ? "s" : ""}`
                )}
              </HeroBadge>
            </div>
          </HeroLeft>
          {!loading && <CountBadge>{users.length}</CountBadge>}
        </HeroBar>

        {/* ── List Card ── */}
        <Card>
          <CardHeader>
            <CardHeaderLeft>
              <Users size={15} color="#059669" />
              <CardTitle>User Directory</CardTitle>
            </CardHeaderLeft>
            {!loading && users.length > 0 && (
              <CardCount>{users.length} users</CardCount>
            )}
          </CardHeader>

          <CardBody>
            {loading ? (
              [1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)
            ) : users.length === 0 ? (
              <EmptyWrap>
                <div style={{ fontSize: 44, marginBottom: 12 }}>👤</div>
                No users found
              </EmptyWrap>
            ) : (
              users.map((user, idx) => {
                const [c1, c2] =
                  avatarPalette[
                    (user.userLoginId || "").length % avatarPalette.length
                  ];
                const initials = (user.name || user.userLoginId || "U")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <UserRow
                    key={user.userLoginId || idx}
                    $i={idx}
                    onClick={() =>
                      navigate(
                        `/user-exam-details/${encodeURIComponent(user.userLoginId)}/${encodeURIComponent(user.userName)}`,
                      )
                    }
                  >
                    <Avatar
                      $g={`linear-gradient(135deg,${c1},${c2})`}
                      $sh={`${c1}44`}
                    >
                      {initials}
                    </Avatar>

                    <UserInfo>
                      <UserName>{user.userName || "—"}</UserName>
                      <UserIdText>{user.userLoginId}</UserIdText>
                      {user.email && <UserEmail>{user.email}</UserEmail>}
                    </UserInfo>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {user.role && <RoleTag>{user.role}</RoleTag>}
                      <RowArrow className="row-arrow">
                        <ChevronRight size={18} />
                      </RowArrow>
                    </div>
                  </UserRow>
                );
              })
            )}
          </CardBody>
        </Card>
      </PageWrap>
    </Layout>
  );
};

export default AllUser;
