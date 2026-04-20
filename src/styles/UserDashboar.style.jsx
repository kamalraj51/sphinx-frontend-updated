import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.div`
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
`;

export const Card = styled.div`
  background: #ffffff;
  padding: 20px;
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: #2c3e50;
`;

export const ExamId = styled.p`
  font-size: 12px;
  color: #888;
`;

export const Description = styled.p`
  margin: 10px 0;
  color: #555;
`;

export const Attempts = styled.p`
  font-weight: bold;
  color: #3498db;
`;
export const ActionRow = styled.div`
   display: flex;
   justify-content: flex-end;
 `;
export const StyledLink = styled(NavLink)`
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: #3498db;
  border-radius: 6px;
  text-decoration: none;
  transition: 0.2s;

  &:hover {
    background: #2c80b4;
  }

  &.active {
    background: #1f5f8b;
  }
`;

// import styled from "styled-components";
// import { NavLink } from "react-router-dom";

// export const Container = styled.div`
//   padding: 20px;
//   background: #f5f7fa;
//   min-height: 100vh;

//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
//   gap: 16px;
// `;

// export const Card = styled.div`
//   background: #ffffff;
//   padding: 14px;
//   border-radius: 10px;
//   box-shadow: 0 2px 6px rgba(0,0,0,0.06);
//   transition: 0.2s ease;

//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;

//   &:hover {
//     transform: translateY(-3px);
//   }
// `;

// export const Title = styled.h3`
//   margin: 0;
//   font-size: 15px;
//   color: #2c3e50;
// `;

// export const ExamId = styled.p`
//   font-size: 11px;
//   color: #aaa;
//   margin-bottom: 4px;
// `;

// export const Description = styled.p`
//   font-size: 13px;
//   color: #666;
//   margin: 6px 0;
// `;

// export const Attempts = styled.p`
//   font-size: 13px;
//   font-weight: 500;
//   color: #3498db;
// `;

// export const ActionRow = styled.div`
//   display: flex;
//   justify-content: flex-end;
// `;

// export const StyledLink = styled(NavLink)`
//   padding: 6px 12px;
//   font-size: 13px;
//   font-weight: 500;
//   color: #fff;
//   background: #3498db;
//   border-radius: 6px;
//   text-decoration: none;
//   transition: 0.2s;

//   &:hover {
//     background: #2c80b4;
//   }

//   &.active {
//     background: #1f5f8b;
//   }
// `;