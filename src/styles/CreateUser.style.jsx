import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

export const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
`;

export const FormGroup = styled.div`
  margin-bottom: 18px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
  color: #444;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #4f7cff;
    box-shadow: 0 0 0 2px rgba(79, 124, 255, 0.15);
  }
`;
// background: linear-gradient(90deg, #4f7cff, #6a8dff);
export const Button = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background:green;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;
export const Form = styled.form`
`
export const Card = styled.p`

color: #2e7d32;
  background-color: #e8f5e9;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #4caf50;
  font-weight: 500;
`;