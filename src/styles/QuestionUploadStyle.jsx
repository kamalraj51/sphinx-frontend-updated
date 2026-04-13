import styled from "styled-components";

export const OuterContainer = styled.div`
  min-height: 100vh;
  width:100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  z-index: 1000
`
export const Error = styled.div`
  color: red;
`;

export const InnerContainer = styled.div`
  maxwidth: 600px;
  margin: auto;
  border: 2.5px solid black;
  padding: 50px;
  border-radius: 30px;
  box-shadow: 5px 5px 20px black;
  display:flex;
  flex-direction:column;
  gap:30px;
  background-color:white;
`;


export const CancelButton = styled.button `
padding: 12px;
  background-color: ${({ theme }) => theme.colors.error};
  };
  color: ${({ theme }) => theme.colors.surface};
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    opacity: 0.85;
  }
`;
export const InputContainer = styled.div`
`;

export const Input = styled.input`
width:100%;

  
`