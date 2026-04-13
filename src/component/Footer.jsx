import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const FooterContainer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: ${({ theme }) => theme.colors?.surface || '#ffffff'};
  border-top: 1px solid rgba(255, 255, 255, 2);
  margin-top: auto;

  @media(max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
`;

const QuickLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  
  a {
    color: ${({ theme }) => theme.colors?.textSecondary || '#666'};
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
      color: ${({ theme }) => theme.colors?.primary || '#4f46e5'};
    }
  }
`;

const Copyright = styled.div`
  color: ${({ theme }) => theme.colors?.textSecondary || '#666'};
  font-size: 14px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <QuickLinks>

        <NavLink to="/adminhome">Home</NavLink>

      </QuickLinks>
      <Copyright>
        © 2026 Sphinx — All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
