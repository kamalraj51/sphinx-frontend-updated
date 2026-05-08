import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { Users, ChevronRight } from "lucide-react";
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
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%);
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
      rgba(99, 102, 241, 0.22) 0%,
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
  border-radius: 16px;
  background: rgba(99, 102, 241, 0.22);
  border: 1.5px solid rgba(165, 180, 252, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a5b4fc;
  flex-shrink: 0;
`;

const HeroTitle = styled.h1`
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.4px;
  position: relative;
  z-index: 1;
`;

const HeroSub = styled.p`
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  margin: 2px 0 0;
  font-weight: 500;
  position: relative;
  z-index: 1;
`;

const CountBadge = styled.div`
  background: rgba(165, 180, 252, 0.18);
  border: 1.5px solid rgba(165, 180, 252, 0.35);
  color: #c7d2fe;
  border-radius: 12px;
  padding: 8px 22px;
  font-weight: 800;
  font-size: 22px;
  font-family: "Sora", sans-serif;
  position: relative;
  z-index: 1;
  letter-spacing: -0.5px;
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
  animation-delay: 0.05s;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
  border-bottom: 2px solid #e0e7ff;
  background: #eef2ff;
`;

const CardTitle = styled.h2`
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #4338ca;
  margin: 0;
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
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.18s ease;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => $i * 0.04}s;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #eef2ff;
  }
  &:hover .row-arrow {
    opacity: 1;
    transform: translateX(3px);
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
`;

const UserName = styled.p`
  margin: 0;
  color: #1e293b;
  font-weight: 700;
  font-size: 14.5px;
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
const RoleTag = styled.span`
  background: #eef2ff;
  color: #6366f1;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
const RowArrow = styled.span`
  color: #6366f1;
  opacity: 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
`;

/* ── Skeleton ───────────────────────────────────────── */
const SkeletonRow = styled.div`
  height: 74px;
  margin: 4px 16px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
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

/* ── Main ───────────────────────────────────────────── */
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
        {/* Hero */}
        <HeroBar>
          <HeroLeft>
            <HeroIconRing>
              <Users size={24} strokeWidth={1.8} />
            </HeroIconRing>
            <div>
              <HeroTitle>All Users</HeroTitle>
              <HeroSub>
                {loading
                  ? "Loading users…"
                  : `${users.length} registered user${users.length !== 1 ? "s" : ""}`}
              </HeroSub>
            </div>
          </HeroLeft>
          {!loading && <CountBadge>{users.length}</CountBadge>}
        </HeroBar>

        {/* List Card */}
        <Card>
          <CardHeader>
            <Users size={15} color="#4338ca" />
            <CardTitle>User Directory</CardTitle>
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
                        `/user-exam-details/${encodeURIComponent(user.userLoginId)}/${encodeURIComponent(user.name || user.userLoginId)}`,
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

                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
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
