import styled from "styled-components";

export const TopicContainer = styled.div`
padding:10px;

`



export const TopicHeading = styled.h2`
text-align:center;
margin-bottom:10px;

`
export const TopicContent = styled.div`
display:flex;
justify-content:space-between;
padding:15px 5px;
background-color:${({ theme }) => theme.colors.primary};


margin-bottom:5px;
 border-top-right-radius: 10px;
border-bottom-left-radius: 10px;
@media(max-width:500px){
flex-direction:column;
gap:10px;
}
`


export const TopicName = styled.span`
font-size:16px;

 border-top-left-radius: 10px;
border-bottom-right-radius: 10px;

color:black;
padding:10px 10px; 
 outline: #f59e0b;


`
// box-shadow: 5px 5px 5px ${({ theme }) => theme.colors.secondary};
export const Button = styled.button`
  background: ${({ theme }) => theme.colors.secondary};
  padding:5px;
  color: black;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: 1s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.textPrimary};
    
    color:white;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }


`
export const Buttons = styled.div`
display:flex;
gap:10px;
`
export const H1 = styled.h1`
  text-align:center;
  margin-top:10px;
  color:${({ theme }) => theme.colors.error}
`
export const QuesButtons = styled.div`
display:flex;
gap:10px;
margin-left:0;
`


