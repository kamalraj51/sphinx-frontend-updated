import React from "react";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export const NavigateContainer = styled.div`
display:"inline"
`;

export const NavWrapper = styled.div`
 padding: 3px, 
 border-radius: 50%, 
 border: 3px solid black,
 background-color:red,

`;


function NaviButton() {
      const navigate = useNavigate();
  return (
    <>
      <NavigateContainer>
        <button style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
          <div 
          title="Back Page"
            style={{
              padding: "3px",
              borderRadius: "50%",
              border: "2px solid black",
            }}
          >
            <ArrowBigLeft />
          </div>
        </button>
{/* 
        <button
          style={{ margin: "0 0 0 15px", cursor: "pointer" }}
          onClick={() => navigate(1)}
          title="Forword Page"
        >
          <div
            style={{
                
              padding: "3px",
              borderRadius: "50%",
              border: "2px solid black",
            }}
          >
            <ArrowBigRight />
          </div>
        </button> */}
      </NavigateContainer>
    </>
  );
}

export default NaviButton;
