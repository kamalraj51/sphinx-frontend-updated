import styled from "styled-components";

export const ContainerExamTD = styled.div`

padding: 10px 15px;

`

export const H2 = styled.h2`
 margin-bottom:10px;

`

export const ContentETD = styled.div`
display:flex;
padding:12px 16px;
margin-bottom:8px;
justify-content:space-around;
background-color: ${({ theme }) => theme.colors?.surface || '#fff'};
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`
export const P = styled.p`
font-size:20px;
color:${({ theme }) => theme.colors.surface};
@media(max-width:768px){
font-size:16px;
}

`

export const NavLink2 = styled.a`
    text-decoration:none;
    &:hover{
        color:grey;
        cursor:pointer;
    }
`

export const ContentQuesHead = styled.div`
  display: flex;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors?.primary || '#4f46e5'};
  color: white;
  border-radius: 8px;
  align-items: center;
  width:100%;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;
export const ContentQues = styled.div`
  display: flex;
  padding: 10px 16px;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors?.surface || '#ffffff'};
  border-radius: 8px;
  align-items: center;
  width:100%;
  justify-content:space-between;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.05);
  }
`;
// Define column widths for proper alignment
export const Para = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors?.textPrimary || '#333'};
  margin: 0; /* remove default margin */

  &:nth-child(1) {
    width: 5%; /* SNO */
    text-align: center;
  }
  &:nth-child(2) {
    width: 6%; /* Question Name */
    text-align: left;
    padding-left: 10px;
  }
  &:nth-child(3) {
    width: 15%; /* type */
    text-align: left;
  }
  &:nth-child(4) {
    width: 30%; /* action buttons */
    text-align: center;
    display: flex;
    justify-content: space-around;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    &:nth-child(2) {
      width: 45%;
    }
    &:nth-child(3) {
      width: 20%;
    }
    &:nth-child(4) {
      width: 35%;
    }
  }
`;

export const Button = styled.button`
display: block;
  margin-left: auto;
  padding:10px 10px;
  background-color:${({ theme }) => theme.colors.success};
  border-radius:10px;
  color:${({ theme }) => theme.colors.surface};
  font-size:18px;
  border:none;
  transition:0.5s linear;
   &:hover{
        background:grey;
        cursor:pointer;
    }
`

