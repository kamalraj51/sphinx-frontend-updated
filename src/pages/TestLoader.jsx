import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Loader = styled.div`
  width: 48px;
  height: 48px;
  border: 5px solid #fff;
  border-bottom-color: #ff3d00;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: ${rotate} 1s linear infinite;
`;

const TestLoader = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div>
      {loading ? <Loader /> : "Upload"}
      <button onClick={setLoading(!loading)}></button>
    </div>
  );
};

export default TestLoader;
