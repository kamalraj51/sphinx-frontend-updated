import { useLocation } from "react-router-dom";
import Layout from "../component/Layout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Assignexamtempoaryupdate from "../component/Assignexamtempoaryupdate";
import ConfirmModal from "../component/ConfirmModal";
import styled, { keyframes } from "styled-components";
import { UserPlus, Users, CheckCircle2, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

/* ═══════════════════════════════════════════
   ANIMATIONS
═══════════════════════════════════════════ */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

/* ═══════════════════════════════════════════
   PAGE WRAP
═══════════════════════════════════════════ */
const PageWrap = styled.div`
  font-family: "Sora", "DM Sans", "Segoe UI", sans-serif;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/* ═══════════════════════════════════════════
   HERO BAR
═══════════════════════════════════════════ */
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
      rgba(16, 185, 129, 0.18) 0%,
      transparent 70%
    );
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
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.4px;
`;
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
  position: relative;
  z-index: 1;
`;
const HeroDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
  display: inline-block;
`;

/* ═══════════════════════════════════════════
   CARD
═══════════════════════════════════════════ */
const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.1),
    0 1px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeUp} 0.45s ease both;
  animation-delay: ${({ $delay }) => $delay || "0s"};
`;
const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
  border-bottom: 2px solid #d1fae5;
  background: #f0fdf4;
`;
const CardTitle = styled.h2`
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #059669;
  margin: 0;
`;
const CardBody = styled.div`
  padding: 20px 24px;
`;

/* ═══════════════════════════════════════════
   ASSIGN FORM
═══════════════════════════════════════════ */
const AssignGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr auto;
  gap: 12px;
  align-items: start;
  @media (max-width: 860px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;
const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const FieldLabel = styled.label`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #64748b;
`;
const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 32px 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13.5px;
  color: #1e293b;
  font-family: inherit;
  background: #f8fafc;
  cursor: pointer;
  transition:
    border-color 0.18s,
    box-shadow 0.18s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
    background-color: #fff;
  }
`;
const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13.5px;
  color: #1e293b;
  font-family: inherit;
  background: #f8fafc;
  transition:
    border-color 0.18s,
    box-shadow 0.18s;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
    background: #fff;
  }
  &::placeholder {
    color: #94a3b8;
  }
`;
const ErrorText = styled.p`
  font-size: 11.5px;
  color: #ef4444;
  margin: 0;
  font-weight: 600;
`;
const AssignSubmitBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(16, 185, 129, 0.28);
  transition: all 0.18s ease;
  white-space: nowrap;
  align-self: flex-end;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(16, 185, 129, 0.4);
  }
  &:active {
    transform: scale(0.97);
  }
`;

/* ═══════════════════════════════════════════
   STATS STRIP
═══════════════════════════════════════════ */
const StatsStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #fafbff;
  flex-wrap: wrap;
  gap: 10px;
`;
const StatItem = styled.div`
  font-size: 12.5px;
  color: #64748b;
  font-weight: 500;
  strong {
    color: #1e293b;
    font-weight: 800;
  }
`;

/* ═══════════════════════════════════════════
   TABLE
═══════════════════════════════════════════ */
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const THeadStyled = styled.thead`
  background: #f0fdf4;
  border-bottom: 2px solid #d1fae5;
`;
const THStyled = styled.th`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #059669;
  padding: 13px 16px;
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  white-space: nowrap;
`;
const TRStyled = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.18s ease;
  animation: ${slideIn} 0.3s ease both;
  animation-delay: ${({ $index }) => ($index || 0) * 0.04}s;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f0fdf4;
  }
`;
const TDStyled = styled.td`
  padding: 14px 16px;
  font-size: 13.5px;
  color: #1e293b;
  vertical-align: middle;
`;
const UserNameBtn = styled.button`
  border: none;
  cursor: pointer;
  background: none;
  color: #059669;
  font-weight: 700;
  font-size: 14px;
  text-align: left;
  padding: 0;
  font-family: inherit;
  line-height: 1.4;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color 0.18s;
  &:hover {
    text-decoration-color: #059669;
  }
`;
const UserSubText = styled.span`
  display: block;
  font-size: 11.5px;
  color: #94a3b8;
  font-weight: 400;
  margin-top: 2px;
`;
const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  white-space: nowrap;
  ${({ $color }) =>
    $color === "indigo" &&
    `background:#eef2ff;border:1px solid #c7d2fe;color:#4f46e5;`}
  ${({ $color }) =>
    $color === "slate" &&
    `background:#f1f5f9;border:1px solid #cbd5e1;color:#475569;`}
`;

/* ═══════════════════════════════════════════
   ICON BUTTONS
═══════════════════════════════════════════ */
const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;
  &:active {
    transform: scale(0.95);
  }
`;
const DeleteBtn = styled(IconBtn)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  box-shadow: 0 3px 8px rgba(239, 68, 68, 0.22);
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(239, 68, 68, 0.35);
  }
`;

/* ═══════════════════════════════════════════
   EMPTY STATE
═══════════════════════════════════════════ */
const EmptyState = styled.div`
  padding: 48px 32px;
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

/* ═══════════════════════════════════════════
   COMPONENT — EXACT ORIGINAL LOGIC
═══════════════════════════════════════════ */
const UsersList = () => {
  const location = useLocation();
  const examId = location.state?.examId;
    const userId = useSelector((state) => state.auth.user);

  const [user, setUser] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [alreadyAssignedUsers, setAlreadyAssignedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    examId: examId,
    partyId: "",
    noOfAttempts: "0",
    allowedAttempts: "3",
    timeoutDays: "10",
    userLoginId: "",
  });
  const [errors, setErrors] = useState({});

  const numberRegex = /^[0-9]+$/;

  useEffect(() => {
    if (examId) {
      setFormData((prev) => ({ ...prev, examId }));
    }
  }, [examId]);

  const handleUser = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/getAllUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examId: formData.examId,
            servicetype: "not assiggned",
            createdByUserLogin: userId,
          }),
        },
      );
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setUser(data.allUser || []);
    } catch (err) {
      console.log("Retrying...");
      setTimeout(handleUser, 1000);
    }
  };

  useEffect(() => {
    if (formData.examId) {
      handleUser();
      getAll();
    }
  }, [formData.examId]);

  const [deleteData, setDeleteData] = useState({});
  const handleModalDelete = (data) => {
    setModalOpen(true);
    setDeleteData(data);
  };

  const handleform = (e) => {
    const { name, value } = e.target;
    if (name === "partyId") {
      const found = user.find((u) => u.partyId === value);
      if (found) {
        setFormData((prev) => ({
          ...prev,
          partyId: found.partyId,
          userLoginId: found.userLoginId,
        }));
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let err = {};
    let flag = true;
    if (!formData.allowedAttempts) {
      err.allowedAttempts = "Allowed attempts is mandatory";
      flag = false;
    } else if (!numberRegex.test(formData.allowedAttempts)) {
      err.allowedAttempts = "Must be a valid number";
      flag = false;
    }
    if (!formData.timeoutDays) {
      err.timeoutDays = "Timeout days is mandatory";
      flag = false;
    } else if (!numberRegex.test(formData.timeoutDays)) {
      err.timeoutDays = "Must be a valid number";
      flag = false;
    }
    if (!flag) {
      setErrors(err);
      return;
    }
    setErrors({});
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/partyExamCreate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      if (response.ok) {
        const data = await response.json();
        console.log("veera");
        toast.success(data.success);
        handleUser();
        getAll();
      } else {
        console.log("RESPONSE => ", response);
        toast.error(data.error || "Failed to Load Data!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!assignedUsers) return <p>No users assigned</p>;

  const getAll = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/getPartyExam",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId: examId }),
        },
      );
      if (response.ok) {
        const value = await response.json();
        setAlreadyAssignedUsers(value.allData || []);
      } else {
        setAlreadyAssignedUsers([]);
      }
    } catch (err) {
      console.error(err);
      setAlreadyAssignedUsers([]);
    }
  };

  const handleDeleteExam = async () => {
    console.log("hai inside delete");
    try {
      const res = await fetch(
        "https://localhost:8443/sphinx/api/user/deleteExamRelationship",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ examId, partyId: deleteData.partyId }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        console.log("hii");
        toast.success(data.success);
        getAll();
        handleUser();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setModalOpen(false);
    }
  };

  /* ─── JSX ─── */
  return (
    <Layout>
      <PageWrap>
        {/* ── Hero Bar ── */}
        <HeroBar>
          <HeroLeft>
            <HeroIconRing>
              <Users size={24} strokeWidth={1.8} />
            </HeroIconRing>
            <div>
              <HeroTitle>Assign Users to Assessment</HeroTitle>
            </div>
          </HeroLeft>
          <HeroBadge>
            <HeroDot />
            {alreadyAssignedUsers.length} Assigned
          </HeroBadge>
        </HeroBar>

        {/* ── Assign Form Card ── */}
        <Card $delay="0.05s">
          <CardHeader>
            <UserPlus size={15} color="#059669" />
            <CardTitle>Assign New User</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <AssignGrid>
                <FieldWrap>
                  <FieldLabel>Select User</FieldLabel>
                  <StyledSelect onChange={handleform} name="partyId">
                    <option value="">select user</option>
                    {user.map((item) => (
                      <option value={item.partyId} key={item.partyId}>
                        {item.userLoginId}
                      </option>
                    ))}
                  </StyledSelect>
                </FieldWrap>

                <FieldWrap>
                  <FieldLabel>Allowed Attempts</FieldLabel>
                  <StyledInput
                    type="text"
                    name="allowedAttempts"
                    value={formData.allowedAttempts}
                    onChange={handleform}
                    placeholder="e.g. 3"
                  />
                  {errors.allowedAttempts && (
                    <ErrorText>{errors.allowedAttempts}</ErrorText>
                  )}
                </FieldWrap>

                <FieldWrap>
                  <FieldLabel>Timeout Days</FieldLabel>
                  <StyledInput
                    type="text"
                    name="timeoutDays"
                    value={formData.timeoutDays}
                    onChange={handleform}
                    placeholder="e.g. 10"
                  />
                  {errors.timeoutDays && (
                    <ErrorText>{errors.timeoutDays}</ErrorText>
                  )}
                </FieldWrap>

                <FieldWrap>
                  <FieldLabel style={{ visibility: "hidden" }}>_</FieldLabel>
                  <AssignSubmitBtn type="submit">
                    <UserPlus size={15} />
                    Assign
                  </AssignSubmitBtn>
                </FieldWrap>
              </AssignGrid>
            </form>
          </CardBody>
        </Card>

        {/* ── Assigned Users Table ── */}
        <Card $delay="0.10s">
          <CardHeader>
            <CheckCircle2 size={15} color="#059669" />
            <CardTitle>Assigned Users</CardTitle>
          </CardHeader>

          <StatsStrip>
            <StatItem>
              <strong>{alreadyAssignedUsers.length}</strong> user
              {alreadyAssignedUsers.length !== 1 ? "s" : ""} assigned
            </StatItem>
          </StatsStrip>

          {alreadyAssignedUsers.length === 0 ? (
            <EmptyState>
              <Users size={44} style={{ opacity: 0.22 }} />
              <span>No assigned users found.</span>
            </EmptyState>
          ) : (
            <Table>
              <THeadStyled>
                <tr>
                  <THStyled>User Name</THStyled>
                  <THStyled $center>Allowed Attempts</THStyled>
                  <THStyled $center>Timeout Days</THStyled>
                  <THStyled $center>Action</THStyled>
                </tr>
              </THeadStyled>
              <tbody>
                {alreadyAssignedUsers.map((item, index) => (
                  <TRStyled key={item.partyId} $index={index}>
                    <TDStyled>
                      <UserNameBtn onClick={() => setSelectedUser(item)}>
                        {item.userLoginId}
                        <UserSubText>{item.partyId}</UserSubText>
                      </UserNameBtn>
                    </TDStyled>
                    <TDStyled style={{ textAlign: "center" }}>
                      <Pill $color="indigo">{item.allowedAttempts}</Pill>
                    </TDStyled>
                    <TDStyled style={{ textAlign: "center" }}>
                      <Pill $color="slate">{item.timeoutDays}d</Pill>
                    </TDStyled>
                    <TDStyled style={{ textAlign: "center" }}>
                      <DeleteBtn
                        title="Delete"
                        onClick={() => handleModalDelete(item)}
                      >
                        <Trash2 size={15} />
                      </DeleteBtn>
                    </TDStyled>
                  </TRStyled>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
        {selectedUser && (
          <Assignexamtempoaryupdate
            item={selectedUser}
            onClose={() => {
              setSelectedUser(null);
              getAll();
            }}
          />
        )}
      </PageWrap>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteExam}
        title="Delete Exam"
        message="Are you sure you want to delete this exam?"
      />
    </Layout>
  );
};

export default UsersList;
