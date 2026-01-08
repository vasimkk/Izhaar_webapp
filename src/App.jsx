import { Routes, Route } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute.jsx';
import HomePage from './components/home/HomePage.jsx';
import Register from './auth/register.jsx';
import Entry from "./pages/Entry_page.jsx";
import Otp from './auth/otp.jsx';
import CreatePassword from './auth/create-password.jsx';
import Login from './auth/login.jsx';
import WelcomeIzhaar from "./components/user/onboardpages/welcome.jsx";
import UserProfile from "./components/user/Profile/profile.jsx";
import UnifiedDashboard from "./components/user/UnifiedDashboard.jsx";
import UserLayoutScreen from "./components/user/UserLayoutScreen.jsx";
import LetterIzhaarLanding from "./components/user/LetterIzhaar/LetterIzhaarLanding.jsx";
import SongIzhaarInfo from "./components/user/SongIzhaar/song-izhaar-info.jsx";
import OfflineIzhaar from "./components/user/IzhaarTypes/offline-izhaar.jsx";
import ReceiverForLetter from "./components/user/Receivers/ReceiverForLetter.jsx";
import WritePromptScreen from "./components/user/LetterIzhaar/WritePromptScreen.jsx";
import TemplateScreen from "./components/user/LetterIzhaar/TemplateScreen.jsx";
import FinalLetterScreen from "./components/user/LetterIzhaar/FinalLetterScreen.jsx";
import PaymentSubscription from "./components/user/LetterIzhaar/PaymentSubscription.jsx";
import PaymentForOfflineLetter from "./components/user/IzhaarTypes/PaymentForOfflineLetter.jsx";
import PaymentSongSubscription from "./components/user/SongIzhaar/PaymentSongSubscription.jsx";
import IzhaarTracker from "./components/user/IzhaarTracker/izhaar-tracker.jsx";
import IzhaarNotification from "./components/user/notifications/izhaar-notification.jsx";
import IzhaarNotificationDetail from "./components/user/notifications/IzhaarNotificationDetail.jsx";
import SongCreateForm from "./components/user/SongIzhaar/song-create-form.jsx";
import SelectTemplate from "./components/user/onboardpages/select-template.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import AdminHome from "./components/Admin/AdminHome.jsx";
import ForgotPassword from "./auth/forgot-password.jsx";
import ResetPassword from "./auth/reset-password.jsx";
import ChatInterface from "./components/user/chat-interface.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/create-password" element={<CreatePassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/welcome" element={<WelcomeIzhaar />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/admin/dashboard" element={<AdminHome />} />
      <Route path="/forgot-password" element={< ForgotPassword />} />
      <Route path="/reset-password" element={< ResetPassword />} />

      <Route
  path="/entry"
  element={
    <GuestRoute>
      <Entry />
    </GuestRoute>
  }
/>

      <Route path="/user/dashboard" element={
        <PrivateRoute>
          <UnifiedDashboard />
        </PrivateRoute>
      } />
      <Route path="/user/notifications" element={
        <PrivateRoute>
          <UserLayoutScreen component={IzhaarNotification} />
        </PrivateRoute>
      } />
     <Route path="/user/notifictions/IzhaarNotificationDetail" element={
        <PrivateRoute>
          <UserLayoutScreen component={IzhaarNotificationDetail} />
        </PrivateRoute>
      } />
      <Route path="/user/confession" element={
        <PrivateRoute>
          <UnifiedDashboard />
        </PrivateRoute>
      } />
      <Route path="/user/profile" element={
        <PrivateRoute>
          <UnifiedDashboard />
        </PrivateRoute>
      } />
      <Route path="/user/chat-interface" element={
        <PrivateRoute>
        <ChatInterface/>
        </PrivateRoute>
      } />
      <Route path="/user/song" element={
        <PrivateRoute>
          <UserLayoutScreen component={SongIzhaarInfo} />
        </PrivateRoute>
      } />
      <Route path="/user/offline-izhaar" element={
        <PrivateRoute>
          <UserLayoutScreen component={OfflineIzhaar} />
        </PrivateRoute>
      } />
      <Route path="/user/letter-izhaar" element={
        <PrivateRoute>
          <UserLayoutScreen component={LetterIzhaarLanding} />
        </PrivateRoute>
      } />
      <Route path="/user/receiver" element={
        <PrivateRoute>
          <UserLayoutScreen component={ReceiverForLetter} />
        </PrivateRoute>
      } />
      
      <Route path="/user/letter-izhaar/write-prompt" element={
        <PrivateRoute>
          <UserLayoutScreen component={WritePromptScreen} />
        </PrivateRoute>
      } />
      <Route path="/user/LetterIzhaar/TemplateScreen" element={
        <PrivateRoute>
          <UserLayoutScreen component={TemplateScreen}/>
        </PrivateRoute>
      } />
      <Route path="/user/LetterIzhaar/final" element={
        <PrivateRoute>
          <UserLayoutScreen component={FinalLetterScreen}/>
        </PrivateRoute>
      } />
      <Route path="/user/letter/payment-subscription" element={
        <PrivateRoute>
          <UserLayoutScreen component={PaymentSubscription} />
        </PrivateRoute>
      } />
      <Route path="/user/letter/payment-subscription/offline" element={
        <PrivateRoute>
          <UserLayoutScreen component={PaymentForOfflineLetter}/>
        </PrivateRoute>
      } />
      <Route path="/user/song/payment-subscription" element={
        <PrivateRoute>
          <UserLayoutScreen component={PaymentSongSubscription} />
        </PrivateRoute>
      } />
      <Route path="/user/izhaar_tracker" element={
        <PrivateRoute>
          <UserLayoutScreen component={IzhaarTracker}/>
        </PrivateRoute>
      } />
      <Route path="/user/song/create" element={
        <PrivateRoute>
          <UserLayoutScreen component={SongCreateForm} />
        </PrivateRoute>
      } />
      <Route path="/user/select-template" element={
        <PrivateRoute>
          <SelectTemplate/>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;