import styled from "styled-components";

export const ContainerExamTD = styled.div`
  padding: 20px;
`;

export const H2 = styled.h2`
  margin-bottom: 15px;
`;

export const ContentETD = styled.div`
  display: grid;
  /* 4 columns: Index, Name (flexible), Percentage, Action */
  grid-template-columns: 40px 1fr 100px 40px; 
  align-items: center;
  gap: 12px;

  padding: 16px;
  margin-bottom: 12px;

  background-color: ${({ theme }) => theme.colors?.surface || '#fff'};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#eee'};
  
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors?.primary || '#007bff'};
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }

  /* Target the text elements */
  p {
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.colors?.text || '#333'};
    font-weight: 500;
  }

  /* Style for the index number */
  .index {
    color: ${({ theme }) => theme.colors?.textSecondary || '#888'};
    font-size: 12px;
  }

  /* Style for the button */
  button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #ff4d4f; /* Danger color */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
      background: #fff1f0;
    }
  }
`;

export const P = styled.p`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors?.textPrimary};

  &:nth-child(1) {
    text-align: center;
  }

  &:nth-child(2) {
    text-align: left;
    padding-left: 10px;
  }

  &:nth-child(3) {
    text-align: center;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const Button = styled.button`
  display: block;
  margin-left: auto;
  margin-top: 15px;

  padding: 10px 16px;
  font-size: 16px;

  background-color: ${({ theme }) => theme.colors?.success};
  color: white;

  border: none;
  border-radius: 8px;

  cursor: pointer;

  transition: 0.3s ease;

  &:hover {
    background: grey;
  }

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;








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


export const NotAvail=styled.h2`
  font-size:20px;
  text-align:center;
  color:${({ theme }) => theme.colors?.error}
`



