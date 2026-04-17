import styled from "styled-components";

export const  HeaderMain = styled.div`
  height: 70px;
  width: 100%;
  padding: 0px 40px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  position: sticky;
  top: 0;
  z-index: 1000;

  background-color: ${({ theme }) => theme.colors.surface || theme.colors.background};
  backdrop-filter: ${({ theme }) => theme.colors.blur || "blur(12px)"};
  -webkit-backdrop-filter: ${({ theme }) => theme.colors.blur || "blur(12px)"};
  border-bottom: ${({ theme }) => theme.colors.glassBorder || `1px solid ${theme.colors.border}`};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
`;

export const Logo = styled.div`
  h2 {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 800;
    font-size: 1.5rem;
    letter-spacing: 1px;
    background: ${({ theme }) => theme.colors.gradientAction || theme.colors.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const Menu = styled.div`
  display: flex;
  gap: 30px;

  a {
    color: ${({ theme }) => theme.colors.textPrimary};
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    padding: 10px 0;
    position: relative;
    transition: color 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 3px;
      background: ${({ theme }) => theme.colors.gradientAction || theme.colors.primary};
      transition: width 0.3s ease;
      border-radius: 2px;
    }

    &.active, &:hover {
      color: ${({ theme }) => theme.colors.primary};
      &::after {
        width: 100%;
      }
    }
  }
     

  @media (max-width: 845px) {
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;

    display: flex;
    flex-direction: column;   
    align-items: center;

    background-color: ${({ theme }) => theme.colors.surface || theme.colors.background};
    backdrop-filter: blur(16px);
    border-bottom: ${({ theme }) => theme.colors.glassBorder || "none"};

    max-height: ${({ $isOpen }) => ($isOpen ? "500px" : "0px")};
    overflow: hidden;
    padding: ${({ $isOpen }) => ($isOpen ? "20px 0" : "0")};

    transition: all 0.3s ease-in-out;
  }
`;

export const MenuToggle = styled.div`
  display: none;
  font-size: 26px;
  color: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  z-index: 1000;

  @media (max-width: 845px) {
    color:${({ theme }) => theme.colors.textPrimary};
    display: block;
  }
`;