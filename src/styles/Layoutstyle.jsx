import styled from "styled-components";

export const MainContainer = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 70px);
  color: black;
  background-color: ${({ theme }) => theme.colors?.background || '#f3f4f6'};
`;

export const LayoutContainer = styled.div`
  background-color: transparent;
  padding: 40px;
  margin: 0 auto;
  max-width: 1280px;
  width: 100%;
  flex: 1;
`;
