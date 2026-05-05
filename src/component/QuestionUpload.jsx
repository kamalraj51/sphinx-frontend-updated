import React, { useState } from "react";
import Layout from "./Layout";
import { downloadTemplate } from "../database/ExcelTemplate";
import styled, { keyframes } from "styled-components";
import {
  Upload,
  FileSpreadsheet,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

/* ═══════════════════════════════════════════
   ANIMATIONS
═══════════════════════════════════════════ */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

/* ═══════════════════════════════════════════
   OVERLAY
═══════════════════════════════════════════ */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
`;

/* ═══════════════════════════════════════════
   PAGE WRAP (standalone mode)
═══════════════════════════════════════════ */
const PageWrap = styled.div`
  font-family: 'Sora', 'DM Sans', 'Segoe UI', sans-serif;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/* ═══════════════════════════════════════════
   MODAL CARD
═══════════════════════════════════════════ */
const ModalCard = styled.div`
  font-family: 'Sora', 'DM Sans', 'Segoe UI', sans-serif;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  width: 100%;
  max-width: 520px;
  animation: ${fadeUp} 0.35s ease both;
`;

/* ═══════════════════════════════════════════
   HERO BAR
═══════════════════════════════════════════ */
const HeroBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
`;
const HeroLeft = styled.div`
  display: flex; align-items: center; gap: 14px;
  position: relative; z-index: 1;
`;
const HeroIconRing = styled.div`
  width: 46px; height: 46px; border-radius: 14px;
  background: rgba(16,185,129,0.2);
  border: 1.5px solid rgba(52,211,153,0.35);
  display: flex; align-items: center; justify-content: center;
  color: #34d399; flex-shrink: 0;
`;
const HeroTitle = styled.h1`
  color: #fff; font-size: 17px; font-weight: 800;
  margin: 0; letter-spacing: -0.3px;
`;
const HeroSub = styled.p`
  color: rgba(255,255,255,0.6); font-size: 12px;
  margin: 2px 0 0; font-weight: 500;
`;
const CloseBtn = styled.button`
  position: relative; z-index: 1;
  width: 34px; height: 34px; border-radius: 10px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.18s;
  flex-shrink: 0;

  &:hover {
    background: rgba(255,255,255,0.22);
    transform: scale(1.05);
  }
`;

/* ═══════════════════════════════════════════
   CARD HEADER
═══════════════════════════════════════════ */
const CardHeader = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 14px 24px;
  border-bottom: 2px solid #d1fae5;
  background: #f0fdf4;
`;
const CardTitle = styled.h2`
  font-size: 12px; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.8px;
  color: #059669; margin: 0;
`;

/* ═══════════════════════════════════════════
   CARD BODY
═══════════════════════════════════════════ */
const CardBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

/* ═══════════════════════════════════════════
   FILE DROP ZONE
═══════════════════════════════════════════ */
const DropZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px 20px;
  border: 2px dashed ${({ $hasFile }) => ($hasFile ? '#10b981' : '#cbd5e1')};
  border-radius: 14px;
  background: ${({ $hasFile }) => ($hasFile ? '#f0fdf4' : '#f8fafc')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #10b981;
    background: #f0fdf4;
  }
`;
const DropIcon = styled.div`
  width: 48px; height: 48px; border-radius: 14px;
  background: ${({ $hasFile }) => ($hasFile ? 'rgba(16,185,129,0.15)' : '#e2e8f0')};
  display: flex; align-items: center; justify-content: center;
  color: ${({ $hasFile }) => ($hasFile ? '#10b981' : '#94a3b8')};
  transition: all 0.2s;
`;
const DropText = styled.p`
  font-size: 13px; font-weight: 700;
  color: ${({ $hasFile }) => ($hasFile ? '#059669' : '#475569')};
  margin: 0; text-align: center;
`;
const DropHint = styled.p`
  font-size: 11px; color: #94a3b8; margin: 0; text-align: center;
`;
const HiddenInput = styled.input`
  display: none;
`;

/* ═══════════════════════════════════════════
   ALERT BOXES
═══════════════════════════════════════════ */
const AlertBox = styled.div`
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 13px; font-weight: 600;
  background: ${({ $type }) => $type === 'error' ? '#fef2f2' : '#f0fdf4'};
  border: 1px solid ${({ $type }) => $type === 'error' ? '#fecaca' : '#bbf7d0'};
  color: ${({ $type }) => $type === 'error' ? '#dc2626' : '#059669'};
`;

/* ═══════════════════════════════════════════
   ERROR LIST
═══════════════════════════════════════════ */
const ErrorList = styled.ul`
  margin: 0; padding: 0 0 0 16px;
  display: flex; flex-direction: column; gap: 4px;
`;
const ErrorItem = styled.li`
  font-size: 12px; color: #b91c1c; font-weight: 500;
`;
const ErrorListCard = styled.div`
  border: 1px solid #fecaca; border-radius: 12px;
  background: #fff5f5; overflow: hidden;
`;
const ErrorListHeader = styled.div`
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
  background: #fee2e2; border-bottom: 1px solid #fecaca;
  font-size: 12px; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.6px;
  color: #dc2626;
`;
const ErrorListBody = styled.div`
  padding: 12px 14px;
`;

/* ═══════════════════════════════════════════
   BUTTON ROW
═══════════════════════════════════════════ */
const BtnRow = styled.div`
  display: flex; gap: 10px;
`;
const UploadBtn = styled.button`
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 11px 20px;
  background: ${({ disabled }) => disabled
    ? 'linear-gradient(135deg, #a7f3d0, #6ee7b7)'
    : 'linear-gradient(135deg, #10b981, #059669)'};
  color: #fff; border: none; border-radius: 10px;
  font-size: 13.5px; font-weight: 700; font-family: inherit;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  box-shadow: ${({ disabled }) => disabled ? 'none' : '0 3px 8px rgba(16,185,129,0.28)'};
  transition: all 0.18s ease;
  opacity: ${({ disabled }) => disabled ? 0.7 : 1};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16,185,129,0.4);
  }
  &:active:not(:disabled) { transform: scale(0.97); }
`;
const TemplateBtn = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 11px 18px;
  background: #f8fafc;
  color: #475569; border: 1.5px solid #e2e8f0; border-radius: 10px;
  font-size: 13px; font-weight: 700; font-family: inherit;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: #f0fdf4; border-color: #10b981; color: #059669;
    transform: translateY(-1px);
  }
  &:active { transform: scale(0.97); }
`;
const SpinIcon = styled(Loader2)`
  animation: ${spin} 0.8s linear infinite;
`;

/* ═══════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════ */
const QuestionUpload = ({ handlePop }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = "https://localhost:8443/sphinx/api/question/upload";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      if (!fileName.endsWith(".xlsx")) {
        setError('Please select an Excel file ".xlsx"');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) { setError("Please select a file first"); return; }
    setLoading(true); setError(null); setResult(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(API_URL, { method: "POST", body: formData, credentials: "include" });
      let data;
      try { data = await response.json(); } catch { throw new Error("Invalid JSON response from server"); }
      if (response.ok) { setResult(data); }
      else { setError(data.message || "Upload failed"); }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <ModalCard>
      {/* ── Hero Bar ── */}
      <HeroBar>
        <HeroLeft>
          <HeroIconRing>
            <Upload size={22} strokeWidth={1.8} />
          </HeroIconRing>
          <div>
            <HeroTitle>Upload Questions</HeroTitle>
            <HeroSub>Import questions from an Excel file</HeroSub>
          </div>
        </HeroLeft>
        {handlePop && (
          <CloseBtn onClick={handlePop}>
            <X size={16} />
          </CloseBtn>
        )}
      </HeroBar>

      {/* ── Section Header ── */}
      <CardHeader>
        <FileSpreadsheet size={14} color="#059669" />
        <CardTitle>File Upload</CardTitle>
      </CardHeader>

      <CardBody>
        {/* Error Alert */}
        {error && (
          <AlertBox $type="error">
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </AlertBox>
        )}

        {/* Success Alert */}
        {result && (
          <AlertBox $type="success">
            <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Questions uploaded successfully!</span>
          </AlertBox>
        )}

        {/* Drop Zone */}
        <DropZone $hasFile={!!file}>
          <HiddenInput
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            disabled={loading}
          />
          <DropIcon $hasFile={!!file}>
            <FileSpreadsheet size={24} strokeWidth={1.6} />
          </DropIcon>
          <DropText $hasFile={!!file}>
            {file ? file.name : "Click to select an Excel file"}
          </DropText>
          <DropHint>
            {file ? `${(file.size / 1024).toFixed(1)} KB · .xlsx` : "Only .xlsx files are supported"}
          </DropHint>
        </DropZone>

        {/* Error List from result */}
        {result?.errors?.length > 0 && (
          <ErrorListCard>
            <ErrorListHeader>
              <AlertCircle size={13} />
              Row Errors ({result.errorCount || result.errors.length})
            </ErrorListHeader>
            <ErrorListBody>
              <ErrorList>
                {result.errors.map((err, index) => (
                  <ErrorItem key={index}>
                    Row {err.row}: {err.error}
                  </ErrorItem>
                ))}
              </ErrorList>
            </ErrorListBody>
          </ErrorListCard>
        )}

        {/* Buttons */}
        <BtnRow>
          <UploadBtn onClick={handleUpload} disabled={!file || loading}>
            {loading
              ? <><SpinIcon size={15} /> Uploading...</>
              : <><Upload size={15} /> Upload</>
            }
          </UploadBtn>
          <TemplateBtn onClick={downloadTemplate} type="button">
            <Download size={14} />
            Template
          </TemplateBtn>
        </BtnRow>
      </CardBody>
    </ModalCard>
  );

  return handlePop
    ? <Overlay>{content}</Overlay>
    : <Layout><PageWrap>{content}</PageWrap></Layout>;
};

export default QuestionUpload;