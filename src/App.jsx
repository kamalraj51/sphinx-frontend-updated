import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";

// Pages & Components
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
import Userdashboar from "./Dashboard/Userdashboard";

// 1. Protected Route: Only allows logged-in users
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // // If no children provided, fallback to admin home
  // if (!children) {
  //   console.log("first home");

  //   return <Navigate to="/adminhome" replace />;
  // }

  return children;
};

// 2. Public Route: Prevents logged-in users from seeing the Login page
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/adminhome" replace />;
  }

  return children;
};

const App = () => {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* Public Routes (Redirect to /adminhome if already logged in) */}
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

          <Route path="/Create-User" element={<CreateUser />} />

          {/* Protected Routes (Require Authentication) */}
          <Route
            path="/adminhome"
            element={
              <ProtectedRoute>
                <Home />
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
                <EditExam />
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
            path="/examupdate"
            element={
              <ProtectedRoute>
                <ExamUpdate />
              </ProtectedRoute>
            }
          />

          {/* Fallback for 404 */}
          <Route path="/*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
