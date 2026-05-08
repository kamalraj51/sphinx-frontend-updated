import React from 'react';
import styled from 'styled-components';
import { X, Trash2 } from 'lucide-react';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  position: relative;
`;

const Title = styled.h3`
  margin-top: 0;
  color: ${({ theme }) => theme.colors?.error || '#e3342f'};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors?.textPrimary || '#333'};
  margin-bottom: 24px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const CancelIconBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors?.textSecondary || '#666'};
  padding: 4px;
  border-radius: 50%;
  display: flex;

  &:hover {
    background: rgba(0,0,0,0.05);
  }
`;

const CancelBtn = styled.button`
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors?.border || '#ddd'};
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors?.textPrimary || '#333'};
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: rgba(0,0,0,0.05);
  }
`;

const ConfirmBtn = styled.button`
  padding: 8px 16px;
  border: none;
  background: ${({ theme }) => theme.colors?.error || '#e3342f'};
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    opacity: 0.9;
  }
`;

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContent>
        <CancelIconBtn onClick={onClose} aria-label="Cancel">
          <X size={20} />
        </CancelIconBtn>

        <Title>
          <Trash2 size={24} /> {title || "Confirm Delete"}
        </Title>

        <Message>
          {message || "Are you sure you want to delete this item? This action cannot be undone."}
        </Message>

        <ActionButtons>
          <CancelBtn onClick={onClose}>
            <X size={16} /> Cancel
          </CancelBtn>

          <ConfirmBtn onClick={onConfirm}>
            <Trash2 size={16} /> Delete
          </ConfirmBtn>
        </ActionButtons>
      </ModalContent>
    </Overlay>
  );
};

export default ConfirmModal;