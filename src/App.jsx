import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";

import UserSignin from "./pages/UserSiginin";
import AddAdmin from "./pages/AddAdmin";
import UserPromote from "./pages/UserPromote";
import CreateQuestion from "./pages/CreateQuestion";
import Getalluser from "./database/Getalluser";
import CreateExam from "./pages/CreateExam";
import Home from "./pages/Home";
import TopicMaster from "./pages/TopicMaster";
import ExamTopic from "./component/ExamTopic";
import UpdateQuestion from "./pages/UpdateQuestion";
import QuestionUpload from "./component/QuestionUpload";
import ShowQuestion from "./component/ShowQuestion";
import NoPage from "./pages/NoPage";
import CreateExamTopics from "./pages/CreateExamTopics";
import UsersList from "./pages/UsersList";
import EditExam from "./component/EditExam";
import TopicsShow from "./component/TopicsShow";
import CreateUser from "./pages/CreateUser";
import ExamUpdate from "./pages/ExamUpdate";

import ExamTDetails from "./component/ExamTDetails";
import Header from "./component/Header";

import Userdashboard from "./Dashboard/Userdashboard";
import ExamAttend from "./pages/ExamAttend";
import UserAttendAssessment from "./user/UserAttendAssessment";
import Result from "./pages/Result";
import Admindashboard from "./Dashboard/Admindashboard";
import ExamReport from "./user/ExamReport";
import ResultPage from "./user/ResultPage";
import AllUsers from "./user/AllUsers";
import UserExamDetails from "./user/UserExamDetails";
import CompletedExam, { CompletedExamList } from "./user/CompletedExam";
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  if (isAuthenticated && role === "SPX_ADMIN") {
    return <Navigate to="/admin-home" replace />;
  } else if (isAuthenticated && role === "SPX_EXAMINEE") {
    return <Navigate to="/userdashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <UserSignin />
              </PublicRoute>
            }
          />
          <Route
            path="/usersignin"
            element={
              <PublicRoute>
                <UserSignin />
              </PublicRoute>
            }
          />

          <Route
            path="/admin-home"
            element={
              <ProtectedRoute>
                <Admindashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-admin"
            element={
              <ProtectedRoute>
                <AddAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userpromote"
            element={
              <ProtectedRoute>
                <UserPromote />
              </ProtectedRoute>
            }
          />
          <Route
            path="/getalluser"
            element={
              <ProtectedRoute>
                <Getalluser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-user"
            element={
              <ProtectedRoute>
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/creat-exam"
            element={
              <ProtectedRoute>
                <CreateExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/examtopic"
            element={
              <ProtectedRoute>
                <ExamTopic />
              </ProtectedRoute>
            }
          />
          <Route
            path="/show-all-topic"
            element={
              <ProtectedRoute>
                <TopicsShow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-question/:quesId"
            element={
              <ProtectedRoute>
                <UpdateQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-exam/:examId"
            element={
              <ProtectedRoute>
                <CreateExamTopics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/topic-master"
            element={
              <ProtectedRoute>
                <TopicMaster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/get-user"
            element={
              <ProtectedRoute>
                <UsersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/get-user/:exmaId"
            element={
              <ProtectedRoute>
                <UsersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <QuestionUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/show-question/:topicID/:tname"
            element={
              <ProtectedRoute>
                <ShowQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-question/:topicID/:tname"
            element={
              <ProtectedRoute>
                <CreateQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam-create-topic/:examId"
            element={
              <ProtectedRoute>
                <CreateExamTopics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam-update"
            element={
              <ProtectedRoute>
                <ExamUpdate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <AllUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-exam-details/:userId/:userName"
            element={
              <ProtectedRoute>
                <UserExamDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/completed-exams/:userId/:userName"
            element={
              <ProtectedRoute>
                <CompletedExamList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam-result/:examId/:userId/:examName"
            element={
              <ProtectedRoute>
                <CompletedExam />
              </ProtectedRoute>
            }
          />

          <Route
            path="/userdashboard"
            element={
              <ProtectedRoute>
                <Userdashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam-attend/:examId/:duration"
            element={
              <ProtectedRoute>
                <ExamAttend />
              </ProtectedRoute>
            }
          />
          <Route
            path="/examresult/:examId/:userId/:skipped"
            element={
              <ProtectedRoute>
                <Result />
              </ProtectedRoute>
            }
          />

          <Route
            path="/examreport/:userId"
            element={
              <ProtectedRoute>
                <ExamReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result/:examId/:userId"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />

          <Route path="/*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
