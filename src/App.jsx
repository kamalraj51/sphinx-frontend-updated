import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import UserSignin from "./pages/UserSiginin";
import { Toaster } from "sonner";
import AddAdmin from "./pages/AddAdmin";
import TestLogin from "./pages/TestLogin";
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
import SimpleCollapse from "./pages/TestLogin";
import ExamUpdate from "./pages/ExamUpdate";
import Userdashboar from "./Dashboard/Userdashboard";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserSignin />} />
          <Route path="/usersignin" element={<UserSignin />} />

          <Route path="/addadmin" element={<ProtectedRoute><AddAdmin /></ProtectedRoute>} />

          <Route path="/CreateUser" element={<CreateUser />} />

          <Route
            path="/adminhome"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test"
            element={
              <ProtectedRoute>
                <TestLogin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userdashboard"
            element={
              <ProtectedRoute>
                <Userdashboar />
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
            path="/createxam"
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
            path="/showalltopic"
            element={
              <ProtectedRoute>
                <TopicsShow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updatequestion/:quesId"
            element={
              <ProtectedRoute>
                <UpdateQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editexam/:examId"
            element={
              <ProtectedRoute>
                <EditExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/topicmaster"
            element={
              <ProtectedRoute>
                <TopicMaster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/getuser"
            element={
              <ProtectedRoute>
                <UsersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/getuser/:exmaId"
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
            path="/showquestion/:topicID"
            element={
              <ProtectedRoute>
                <ShowQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addquestion/:topicID"
            element={
              <ProtectedRoute>
                <CreateQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/examcreatetopic/:examID"
            element={
              <ProtectedRoute>
                <CreateExamTopics />
              </ProtectedRoute>
            }
          />
          <Route path="/test" element={<SimpleCollapse />} />

          <Route
            path="/examupdate"
            element={
              <ProtectedRoute>
                <ExamUpdate />
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
