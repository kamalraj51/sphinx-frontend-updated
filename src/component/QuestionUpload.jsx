import React, { useState } from "react";

import Layout from "./Layout";
import { downloadTemplate } from "../database/ExcelTemplate";
import {
  InnerContainer,
  Error,
  InputContainer,
  Input,
  OuterContainer,
  CancelButton,
} from "../styles/QuestionUploadStyle";
import { Button } from "../styles/CreateExam.style";
import { useSelector } from "react-redux";

const QuestionUpload = ({ handlePop }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.auth.user);

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
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
     formData.append("userLoginId", userId);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      let data;
      try {
        data = await response.json();
        console.log("data", data);
      } catch {
        throw new Error("Invalid JSON response from server");
      }

      console.log("Response:", data);

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network errors: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <OuterContainer>
      <InnerContainer>
        <CancelButton
          style={{ display: "block", marginLeft: "auto", width: "60px" }}
          onClick={handlePop}
        >
          X
        </CancelButton>
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>
            <strong>Error :</strong> {error}
          </div>
        )}
        <h2>Upload Questions from Excel</h2>

        <InputContainer>
          <Input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            disabled={loading}
            style={{
              border: "1px solid black",
              padding: "10px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          />
        </InputContainer>
        <div>
          <Button onClick={handleUpload} disabled={!file || loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>

          <Button
            nClick={downloadTemplate}
            type="button"
            style={{ marginLeft: "10px" }}
          >
            Download Template
          </Button>
        </div>

        {result && (
          <div style={{ marginTop: "20px", color: "green" }}>
            <h3>Upload Result</h3>

            <p>Message: question uploaded success</p>

            {result.errors && result.errors.length > 0 && (
              <div style={{}}>
                <h4>Errors ({result.errorCount || result.errors.length}):</h4>
                <ul>
                  {result.errors.map((err, index) => (
                    <li key={index}>
                      Row {err.row}: {err.error}
                    </li>
                  ))}
                  <p>erorr</p>
                </ul>
              </div>
            )}
          </div>
        )}
      </InnerContainer>
    </OuterContainer>
  );

  return handlePop ? content : <Layout>{content}</Layout>;
};

export default QuestionUpload;
