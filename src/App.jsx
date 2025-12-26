import { Routes, Route } from "react-router-dom";
import HomePage from './components/home/HomePage.jsx';
import Register from './auth/register.jsx';
import Entry from "./pages/Entry_page.jsx";
import Otp from './auth/otp.jsx';
import CreatePassword from './auth/create-password.jsx';
import Login from './auth/login.jsx';
import WelcomeIzhaar from "./components/user/onboardpages/welcome.jsx";
import UserProfile from "./components/user/Profile/profile.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/entry" element={<Entry/>} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/create-password" element={<CreatePassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/welcome" element={<WelcomeIzhaar />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
}

export default App;