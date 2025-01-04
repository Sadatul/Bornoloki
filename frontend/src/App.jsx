import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TextEditor from "./pages/TextEditor";
import AuthLayout from "./components/Auth/AuthLayout";
import LoginForm from "./components/Auth/LoginForm";
import PrivateRoute from "./components/Auth/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SearchProvider } from "./contexts/SearchContext";
import { DocumentProvider } from "./contexts/DocumentContext";
import AppLayout from "./components/AppLayout";
import ChatBot from "./pages/Chatbot";
import { ChatProvider } from "./contexts/ChatContext";
import ProfilePage from "./pages/ProfilePage";
import ContributePage from "./pages/ContributePage";
import AdminReview from "./pages/AdminReview";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <SearchProvider>
            <DocumentProvider>
              <ChatProvider>
                <Routes>
                  <Route
                    path="/admin/review"
                    element={
                      <PrivateRoute>
                        <AppLayout>
                          <AdminReview />
                        </AppLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <PrivateRoute>
                        <AppLayout>
                          <ChatBot />
                        </AppLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile/:userId"
                    element={
                      <PrivateRoute>
                        <AppLayout>
                          <ProfilePage />
                        </AppLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <AppLayout>
                          <ProfilePage />
                        </AppLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/editor"
                    element={<Navigate to="/editor/new" replace />}
                  />
                  <Route
                    path="/editor/:id"
                    element={
                      <PrivateRoute>
                        <AppLayout>
                          <TextEditor />
                        </AppLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/contribute"
                    element={
                      <PrivateRoute>
                        <AppLayout>
                          <ContributePage />
                        </AppLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <AuthLayout>
                        <LoginForm />
                      </AuthLayout>
                    }
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/editor/new" replace />}
                  />
                </Routes>
              </ChatProvider>
            </DocumentProvider>
          </SearchProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}
