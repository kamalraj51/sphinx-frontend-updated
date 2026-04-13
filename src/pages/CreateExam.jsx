import React from "react";
import { Container } from "../styles/CreateExam.style";
import CreateExamform from "../component/CreateExamform";
import ExamTopic from "../component/ExamTopic";
import Layout from "../component/Layout";
import ExamTDetails from "../component/ExamTDetails";

const CreateExam = () => {
  return (
    <>
      <Layout>
          
          <CreateExamform />
        
       
      </Layout>
    </>
  );
};

export default CreateExam;
