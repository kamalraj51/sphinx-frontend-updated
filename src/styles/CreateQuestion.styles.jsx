import styled from "styled-components";

export const QuestionContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const QuestionWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

export const QuestionTitle = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 5px;
`;

export const QuestionSubtitle = styled.p`
  text-align: center;
  color: #777;
  margin-bottom: 25px;
`;

export const QuestionForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const QuestionField = styled.div`
  display: flex;
  flex-direction: column;
`;

export const QuestionLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #444;
`;

export const QuestionInput = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  transition: 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 5px rgba(102, 126, 234, 0.4);
  }
`;

export const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

export const CreateQuesButton = styled.button`
  margin-top: 10px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const QuestionFooter = styled.div`
  text-align: center;
  margin-top: 15px;

  a {
    text-decoration: none;
    color: #667eea;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ApiError = styled.div`
  background: #ffe5e5;
  color: #d8000c;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

export const SectionTitle = styled.h3`
  margin-top: 15px;
  margin-bottom: 5px;
  color: #555;
`;