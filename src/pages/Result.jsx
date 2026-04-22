import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styled from "styled-components";

const Container = styled.div`
  padding: 30px;
  text-align: center;
`;

const Card = styled.div`
  max-width: 500px;
  margin: auto;
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Score = styled.h1`
  color: ${(p) => (p.pass ? "#28a745" : "#dc3545")};
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
`;

const Result = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const result = state?.result;

  if (!result) {
    return <h3>No result data</h3>;
  }
  const getResult = async () => {
    const response = await fetch(
      "https://localhost:8443/sphinx/api/user/exam-result",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: examId, partyId: partyId }),
      },
    );
    const data = await response.json();
    if (response.ok) {
        
    } else {
      toast.error("not updated result pls wait");
    }
  };

  useEffect(() => {
    getResult();
  }, []);

  return (
    <Container>
      <Card>
        <h2>Exam Result</h2>

        <Score pass={result.pass}>{result.pass ? "PASS ✅" : "FAIL ❌"}</Score>

        <p>
          <b>Total Questions:</b> {result.total}
        </p>
        <p>
          <b>Correct:</b> {result.correct}
        </p>
        <p>
          <b>Wrong:</b> {result.wrong}
        </p>
        <p>
          <b>Unanswered:</b> {result.unanswered}
        </p>
        <p>
          <b>Score:</b> {result.score}%
        </p>

        <Button onClick={() => navigate("/")}>Go Home</Button>
      </Card>
    </Container>
  );
};

export default Result;
