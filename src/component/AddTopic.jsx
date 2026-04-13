import React, { useEffect, useState } from "react";
import {
  TopicContainer,
  FormContainer,
  TopicField,
  TopicLabel,
  TopicButton,
  TopicInput,
  ApiError,
  TopicError,
} from "../styles/AddTopicStyle";
import Topics from "./Topics";
import { useDispatch } from "react-redux";
import { toggle } from "../reducer/apiReduce";
import { HeadingTable, H2 } from "../styles/AvailableExamStyle";


const AddTopic = () => {
  const [topicName, setTopicName] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSucess] = useState("");

  const dispatch = useDispatch()
  const handleChange = (e) => {
    setTopicName(e.target.value);
    if (error) {
      setError("");
    }
  };

  const validate = () => {
    if (!topicName.trim()) {
      setError("Topic name cannot be empty");
      setLoading(false);
      return false;
    }
    if (topicName.length < 1) {
      setError("Topic must be at least 1 characters");
      setLoading(false);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setSucess("");

    if (!validate()) return;

    try {
      const response = await fetch(
        "https://localhost:8443/sphinx/api/topic/createtopic",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topicName }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        setApiError(data.message || "Failed to add topic");
        return;
      }
      setSucess("topic added successfully");
    } catch (err) {
      setApiError("Network error . please try again. ");
    } finally {
      dispatch(toggle())
      setLoading(false);

    }
  };

  return (
    <>
      <HeadingTable>
        <H2>Add Topics</H2>
      </HeadingTable>
      <TopicContainer>
        {/* <H2>Add Topic</H2> */}
        {apiError && <ApiError>{apiError}</ApiError>}
        <FormContainer onSubmit={handleSubmit}>
          <TopicField>
            <TopicLabel>Enter the Topic</TopicLabel>
            <TopicInput
              type="text"
              id="topicName"
              value={topicName}
              onChange={handleChange}
            ></TopicInput>
            {error && <TopicError>{error}</TopicError>}
          </TopicField>
          <TopicButton type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </TopicButton>
          {success && <p style={{ color: "green" }}>{success}</p>}
        </FormContainer>
      </TopicContainer>

      <Topics ></Topics>
    </>
  );
};

export default AddTopic;
