import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Container = styled.div`
  width: 60%;
  margin: 40px auto;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;

export const Row = styled.div`
  display: flex;
  align-items: center;        
  justify-content: space-between; 
  padding: 12px 16px;
  margin-bottom: 10px;
  background: white;
  border-radius: 8px;
`;

export const Name = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
`;

export const NavLink2 = styled(NavLink)`
  text-decoration: none;
  padding: 6px 12px;
  background: #4f46e5;
  color: white;
  border-radius: 6px;
  font-size: 14px;

  &:hover {
    background: #4338ca;
  }
`;
export const Select=styled.select`

`
export const Option=styled.option`
`
export const Form=styled.form`
`
