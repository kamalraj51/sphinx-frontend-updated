import { useLocation } from "react-router-dom";
import {
  Form,
  Input,
  Option,
  Select,
  Button,
} from "../styles/AvailableExamStyle";
import Layout from "../component/Layout";
import Assign from "../component/Assign";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RegisterError } from "../styles/SignupStyle";
import {
  ActionWrapper,
  Attempt,
  Cell,
  CellPrimary,
  HeaderRow,
  Outer,
  Row,
  Section,
  Title,
} from "../styles/Assign.style";
import { ButtonSecondary } from "../styles/AvailableExamStyle";
import { List } from "../styles/Assign.style";
import Assignexamtempoaryupdate from "../component/Assignexamtempoaryupdate";
import ConfirmModal from "../component/ConfirmModal";
const UsersList = () => {
  const location = useLocation();
  const examId = location.state?.examId;

  const [user, setUser] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [alreadyAssignedUsers, setAlreadyAssignedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    examId: examId,
    partyId: "",
    noOfAttempts: "0",
    allowedAttempts: "",
    timeoutDays: "",
    userLoginId: "",
  });
  const [errors, setErrors] = useState({});

  const numberRegex = /^[0-9]+$/;

  useEffect(() => {
    if (examId) {
      setFormData((prev) => ({
        ...prev,
        examId,
      }));
    }
  }, [examId]);
  // useEffect(()=>{
  //     getAll()
  //     getAllAssignedUsers()
  // },[examId])

  const handleUser = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/getAllUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            examId: formData.examId,
            servicetype: "not assiggned",
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
      // getAllAssignedUsers()
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
      const selectedUser = user.find((u) => u.partyId === value);

      if (selectedUser) {
        setFormData((prev) => ({
          ...prev,
          partyId: selectedUser.partyId,
          userLoginId: selectedUser.userLoginId,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      // toast.error("retrying")
    }
  };

  if (!assignedUsers) {
    return <p>No users assigned</p>;
  }

  const getAll = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/getPartyExam",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
  const handleDeleteExam = async (item) => {
    console.log("hai inside delete");
    try {
      const res = await fetch(
        "https://localhost:8443/sphinx/api/user/deleteExamRelationship",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            examId,
            partyId: deleteData.partyId,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        console.log("hii");

        toast.success(data.success);
        getAll(); // refresh
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

  return (
    <Layout>
      <Form onSubmit={handleSubmit}>
        <Select onChange={handleform} name="partyId">
          <Option value="">select user</Option>
          {user.map((item) => (
            <Option value={item.partyId} key={item.partyId}>
              {item.userLoginId}
            </Option>
          ))}
        </Select>
        <label>allowed Attempts</label>
        <Input
          type="text"
          name="allowedAttempts"
          onChange={handleform}
          placeholder="allowed attempts"
        />
        {errors.allowedAttempts && (
          <RegisterError>{errors.allowedAttempts}</RegisterError>
        )}
        <label>timeout days</label>
        <Input
          type="text"
          name="timeoutDays"
          onChange={handleform}
          placeholder="timeout days"
        />
        {errors.timeoutDays && (
          <RegisterError>{errors.timeoutDays}</RegisterError>
        )}

        <Button type="submit">Assign</Button>
      </Form>
      <Outer>
        <Title>Assign</Title>

        <HeaderRow>
          <p>User Name</p>
          <p>Allowed Attempts</p>
          <p>Time Out Days</p>
        </HeaderRow>

        {alreadyAssignedUsers.length === 0 ? (
          <p>No assigned users found</p>
        ) : (
          alreadyAssignedUsers.map((item) => (
            <Row key={item.partyId}>
              <CellPrimary onClick={() => setSelectedUser(item)}>
                <strong>{item.userLoginId}</strong>
                {item.partyId}
              </CellPrimary>

              <Cell>{item.allowedAttempts}</Cell>

              <Cell>{item.timeoutDays}</Cell>

              <Button onClick={() => handleModalDelete(item)}>Delete</Button>
            </Row>
          ))
        )}
        {selectedUser && (
          <Assignexamtempoaryupdate
            item={selectedUser}
            onClose={() => {
              (setSelectedUser(null), getAll());
            }}
          />
        )}
      </Outer>

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
