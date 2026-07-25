import {Routes, Route, Navigate} from 'react-router-dom'
import AuthLayout from "./components/AuthLayout.jsx";
import LoginForm from "./pages/login_form.jsx";
import SignupForm from "./pages/singup_form.jsx";
function App() {
  return (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthLayout><LoginForm /></AuthLayout>} />
      <Route path="/signup" element={<AuthLayout><SignupForm /></AuthLayout>} />
    </Routes>
  );
}


export default App;
