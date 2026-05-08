import React, { useEffect, useState } from 'react';
import { ContainerModal, FormRow, HeadingDiv, ModalContent } from '../styles/UpdateModel.style';
import { FaEdit, FaTimes } from 'react-icons/fa';
import { Button, Input } from '../styles/AvailableExamStyle';

const UpdateModalExam = ({ isOpen, onClose, topics, onUpdate }) => {
  const [percentage, setpercentage] = useState("");

  useEffect(() => {
    if (topics && topics.topicPassPercentage !== undefined) {
      setpercentage(topics.topicPassPercentage);
    }
  }, [topics]);

  if (!isOpen) return null;

  return (
    <ContainerModal>
      <ModalContent>
        <HeadingDiv>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <FaEdit />
            <p>Update Topic</p>
          </div>
          <FaTimes onClick={onClose} />
        </HeadingDiv>

        <FormRow>
          <Input
            placeholder="edit percentage"
            value={percentage}
            onChange={(e) => setpercentage(e.target.value)}
          />

          <Button
            onClick={() => {
              onUpdate(percentage);
              onClose();
            }}
          >
            Update
          </Button>
        </FormRow>
      </ModalContent>
    </ContainerModal>
  );
};

export default UpdateModalExam;