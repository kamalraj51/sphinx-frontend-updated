import React, { useState } from "react";
import { toast } from "sonner";
import styled, { keyframes } from "styled-components";
import { X, RefreshCw } from "lucide-react";

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
  font-family: 'Sora', 'DM Sans', 'Segoe UI', sans-serif;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18), 0 4px 16px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
  animation: ${slideUp} 0.28s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px 16px;
  background: linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 160px; height: 160px;
    background: radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
`;

const ModalTitleWrap = styled.div`
  display: flex; align-items: center; gap: 12px;
  position: relative; z-index: 1;
`;

const ModalIconRing = styled.div`
  width: 38px; height: 38px; border-radius: 11px;
  background: rgba(16,185,129,0.2);
  border: 1.5px solid rgba(52,211,153,0.35);
  display: flex; align-items: center; justify-content: center;
  color: #34d399; flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  color: #fff; font-size: 16px; font-weight: 800;
  margin: 0; letter-spacing: -0.3px;
`;

const CloseBtn = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 8px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  color: #fff; cursor: pointer;
  transition: background 0.18s;
  position: relative; z-index: 1;

  &:hover { background: rgba(255,255,255,0.22); }

  &:active { transform: scale(0.95); }
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldWrap = styled.div`
  display: flex; flex-direction: column; gap: 5px;
`;

const FieldLabel = styled.label`
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.6px;
  color: #64748b;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  font-size: 13.5px; color: #1e293b;
  font-family: inherit; background: #f8fafc;
  transition: border-color 0.18s, box-shadow 0.18s;
  box-sizing: border-box;

  &:focus {
    outline: none; border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16,185,129,0.12);
    background: #fff;
  }

  &::placeholder { color: #94a3b8; }
`;

const ModalFooter = styled.div`
  padding: 0 24px 24px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const CancelBtn = styled.button`
  padding: 10px 18px;
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  background: #fff; color: #64748b;
  font-size: 13.5px; font-weight: 600; font-family: inherit;
  cursor: pointer; transition: all 0.18s;

  &:hover { background: #f8fafc; border-color: #cbd5e1; }

  &:active { transform: scale(0.97); }
`;

const UpdateBtn = styled.button`
  display: flex; align-items: center; gap: 7px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff; border: none; border-radius: 10px;
  font-size: 13.5px; font-weight: 700; font-family: inherit;
  cursor: pointer; box-shadow: 0 3px 8px rgba(16,185,129,0.28);
  transition: all 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(16,185,129,0.4);
  }

  &:active { transform: scale(0.97); }
`;

const Assignexamtempoaryupdate = ({ item, onClose }) => {
  const [form, setForm] = useState({
    examId: item.examId,
    partyId: item.partyId,
    noOfAttempts: item.noOfAttempts,
    allowedAttempts: item.allowedAttempts,
    timeoutDays: item.timeoutDays,
  });

  const update = async (e) => {
    e.preventDefault();

    const response = await fetch(
      "https://localhost:8443/sphinx/api/user/asssignTempoaryUpdate",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    const msg = await response.json();

    if (response.ok) {
      toast.success(msg.success);
      onClose();
    } else {
      toast.error(msg.error);
    }
  };

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Overlay>
      <ModalBox>
        <ModalHeader>
          <ModalTitleWrap>
            <ModalIconRing>
              <RefreshCw size={17} strokeWidth={2} />
            </ModalIconRing>

            <ModalTitle>Update Assignment</ModalTitle>
          </ModalTitleWrap>

          <CloseBtn onClick={onClose} title="Close">
            <X size={15} />
          </CloseBtn>
        </ModalHeader>

        <form onSubmit={update}>
          <ModalBody>
            <FieldWrap>
              <FieldLabel>Allowed Attempts</FieldLabel>

              <StyledInput
                value={form.allowedAttempts}
                name="allowedAttempts"
                onChange={handleForm}
                placeholder="e.g. 3"
              />
            </FieldWrap>

            <FieldWrap>
              <FieldLabel>Timeout Days</FieldLabel>

              <StyledInput
                value={form.timeoutDays}
                name="timeoutDays"
                onChange={handleForm}
                placeholder="e.g. 30"
              />
            </FieldWrap>
          </ModalBody>

          <ModalFooter>
            <CancelBtn type="button" onClick={onClose}>
              Cancel
            </CancelBtn>

            <UpdateBtn type="submit">
              <RefreshCw size={14} />
              Update
            </UpdateBtn>
          </ModalFooter>
        </form>
      </ModalBox>
    </Overlay>
  );
};

export default Assignexamtempoaryupdate;