import React, { useEffect, useState } from 'react'
import { Button, ContainerModal, FormRow, HeadingDiv, Input, ModalContent, Title } from '../styles/UpdateModel.style'
import { FaEdit, FaTimes } from 'react-icons/fa'

const UpdateModal = ({ isOpen, onClose, topics, onUpdate }) => {

  if (!isOpen) return null;
  const [name, setName] = useState("");

  useEffect(() => {
    if (topics) {
      setName(topics.topicName);
    }
  }, [topics]);

  return (
    <ContainerModal>
      <ModalContent>
        <HeadingDiv>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <FaEdit style={{ height: '20px' }} />
            <p>Update Topic</p>
          </div>
          <FaTimes style={{ height: '20px', cursor: 'pointer' }} onClick={onClose} />
        </HeadingDiv>

        <FormRow>
          <Input
            placeholder="edit topic"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button onClick={() => {
            onUpdate(topics.topicId, name)
            onClose()
          }}>
            Update
          </Button>
        </FormRow>

      </ModalContent>
    </ContainerModal>
  )
}

export default UpdateModal