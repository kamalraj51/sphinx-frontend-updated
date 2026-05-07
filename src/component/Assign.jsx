import React, { useEffect, useState } from "react";
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
import AlreadyExam from "./AlreadyExam";
import { toast } from "sonner";

const Assign = ({ examId, assignedUsers }) => {
  console.log(examId);

  const [assign, setAssign] = useState([]);

  useEffect(() => {
    setAssign(assignedUsers || []);
  }, [assignedUsers]);

  const lastSubmit = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/saveexamrelationship",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ allData: assign }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.success);
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (!assignedUsers) {
    return <p>No users assigned</p>;
  }

  return (
    <>
      <Outer>
        <Title>Assign</Title>

        <HeaderRow>
          <p>User Name</p>
          <p>AllowedAttempts</p>
          <p>NoOfAttempts</p>
          <p>TimeOutDays</p>
        </HeaderRow>

        {assign.length === 0 ? (
          <p>No assigned users found</p>
        ) : (
          assign.map((item) => (
            <Row key={item.partyId}>
              <CellPrimary>{item.userLoginId}</CellPrimary>

              <Cell>{item.allowedAttempts}</Cell>

              <Attempt danger={item.noOfAttempts > item.allowedAttempts}>
                {item.noOfAttempts}
              </Attempt>

              <Cell>{item.timeoutDays}</Cell>
            </Row>
          ))
        )}

        <ActionWrapper>
          <ButtonSecondary onClick={lastSubmit}>Submit All</ButtonSecondary>
        </ActionWrapper>
      </Outer>

      <Section>
        <AlreadyExam examId={examId} />
      </Section>
    </>
  );
};

export default Assign;