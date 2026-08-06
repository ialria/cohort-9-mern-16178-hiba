import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout.jsx";
import LoginForm from "./pages/Auth/LoginForm.jsx";
import SignupForm from "./pages/Auth/SingupForm.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ProfileView from "./pages/Dashboard/views/ProfileView.jsx";
import NoteView from "./pages/Dashboard/views/NoteView.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import AllNotesView from "./pages/Dashboard/views/main_content/AllNotesView.jsx";
import FavouriteView from "./pages/Dashboard/views/main_content/FavouriteView.jsx";
import TrashView from "./pages/Dashboard/views/main_content/TrashView.jsx";
import RecentView from "./pages/Dashboard/views/main_content/RecentView.jsx";
import EditProfile from "./pages/Dashboard/views/EditProfile.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginForm />
          </AuthLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthLayout>
            <SignupForm />
          </AuthLayout>
        }
      />
      <Route path="/forgot_password" element={<ForgotPassword />} />
      {/* <Route path="/termsOfService" element={<TermsOfService />} />
      <Route path="/privacyPolicy" element={<PrivacyPolicy />} /> */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<AllNotesView />} />
          <Route path="favorites" element={<FavouriteView />} />
          <Route path="recent" element={<RecentView />} />
          <Route path="trash" element={<TrashView />} />
        </Route>
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/notes/:noteId" element={<NoteView />} />
        <Route path="/edit_profile" element={<EditProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
