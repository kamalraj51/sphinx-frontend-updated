import React from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  background: ${({ theme, active }) => active ? (theme.colors?.primary || '#4f46e5') : 'transparent'};
  color: ${({ theme, active }) => active ? '#fff' : (theme.colors?.textPrimary || '#333')};
  border: 1px solid ${({ theme, active }) => active ? (theme.colors?.primary || '#4f46e5') : (theme.colors?.border || '#e5e7eb')};
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover:not(:disabled) {
    background: ${({ theme, active }) => active ? (theme.colors?.primary || '#4f46e5') : 'rgba(0,0,0,0.05)'};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PaginationInfo = styled.span`
  color: ${({ theme }) => theme.colors?.textSecondary || '#666'};
  font-size: 14px;
`;

const Pagination = ({ currentPage, totalItems, itemsPerPage = 10, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  return (
    <PaginationContainer>
      <PageButton 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} /> Prev
      </PageButton>
      <PaginationInfo>
        Page {currentPage} of {totalPages}
      </PaginationInfo>
      <PageButton 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        Next <ChevronRight size={16} />
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;
