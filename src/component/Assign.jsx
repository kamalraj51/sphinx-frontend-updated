import React, { useEffect, useState } from 'react';
import { Outer, Row } from '../styles/Assign.style';
import { ButtonSecondary } from '../styles/AvailableExamStyle';
import AlreadyExam from './AlreadyExam';

const Assign = ({ examId }) => {
  const [data, setData] = useState([]);

  // GET USERS
  const getAll = async () => {
    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/user/getAllUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            examId,
            servicetype: "assigned"
          })
        }
      );

      if (response.ok) {
        const value = await response.json();
        setData(value.allUser || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (examId) getAll();
  }, [examId]);

  // SUBMIT ALL
  const lastSubmit = async () => {
    const response = await fetch(
      "https://localhost:8443/sphinx/api/user/saveexamrelationship",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ allData: data })
      }
    );

    if (response.ok) {
      console.log("successfully created");

      // ✅ FIX: refresh UI after submit
      getAll();
    }
  };

  return (
  <>
    <Outer>
      <Row>
        <p>UserLoginId</p>
        <p>AllowedAttempts</p>
        <p>NoOfAttempts</p>
      </Row>

      {data.map((item) => (
        <Row key={item.partyId}>
          <p>{item.userLoginId}</p>
          <p>{item.allowedAttempts}</p>
          <p>{item.noOfAttempts}</p>
        </Row>
      ))}

      <ButtonSecondary onClick={lastSubmit}>
        submit all
      </ButtonSecondary>
    </Outer>
     <AlreadyExam examId={examId} />
  </>
  );
};

export default Assign;