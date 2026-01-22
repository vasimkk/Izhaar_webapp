import { Routes, Route } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute.jsx';
import HomePage from './components/home/HomePage.jsx';
import Register from './auth/register.jsx';
import Entry from "./pages/Entry_page.jsx";
import Login from './auth/login.jsx';
import WelcomeIzhaar from "./components/user/onboardpages/welcome.jsx";
import UserProfile from "./components/user/Profile/profile.jsx";
import UnifiedDashboard from "./components/user/Dashboard/UnifiedDashboard.jsx";
import LetterIzhaarLanding from "./components/user/LetterIzhaar/LetterIzhaarLanding.jsx";
import SongIzhaarInfo from "./components/user/SongIzhaar/song-izhaar-info.jsx";
import OfflineIzhaar from "./components/user/IzhaarTypes/offline-izhaar.jsx";
import ReceiverForLetter from "./components/user/Receivers/ReceiverForLetter.jsx";
import WritePromptScreen from "./components/user/LetterIzhaar/WritePromptScreen.jsx";
// import TemplateScreen from "./components/user/LetterIzhaar/TemplateScreen.jsx";
import FinalLetterScreen from "./components/user/LetterIzhaar/FinalLetterScreen.jsx";
import PaymentSubscription from "./components/user/LetterIzhaar/PaymentSubscription.jsx";
import PaymentForOfflineLetter from "./components/user/IzhaarTypes/PaymentForOfflineLetter.jsx";
import PaymentSongSubscription from "./components/user/SongIzhaar/PaymentSongSubscription.jsx";
import IzhaarTracker from "./components/user/IzhaarTracker/izhaar-tracker.jsx";
import IzhaarNotification from "./components/user/notifications/izhaar-notification.jsx";
import IzhaarNotificationDetail from "./components/user/notifications/IzhaarNotificationDetail.jsx";
import SongCreateForm from "./components/user/SongIzhaar/song-create-form.jsx";
import SongPreview from "./components/user/SongIzhaar/SongPreview.jsx";
import SelectTemplate from "./components/user/onboardpages/select-template.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import AdminHome from "./components/Admin/AdminHome.jsx";
import ForgotPassword from "./auth/forgot-password.jsx";
import ResetPassword from "./auth/reset-password.jsx";
import ChatInterface from "./components/user/Chatbox/chat-interface.jsx";
import Magazine from "./components/user/Magazines/Magazine.jsx";
import Gifts from "./components/user/Gifts.jsx";
import ProfileView from "./components/user/Profile/profile-view.jsx";
import Security from "./components/user/Profile/Security.jsx";
import TypeOfIzhaar from "./components/user/IzhaarTypes/type-of-izhaar.jsx";
import WatchParty from "./components/user/WatchParty/WatchParty.jsx";
import Quiz from "./components/user/Quiz/Quiz.jsx";
import Reels from "./components/user/Reels/Reels.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
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
          <IzhaarNotification/>
        </PrivateRoute>
      } />
      <Route path="/user/notifictions/IzhaarNotificationDetail" element={
        <PrivateRoute>
          <IzhaarNotificationDetail />
        </PrivateRoute>
      } />
      <Route path="/user/confession" element={
        <PrivateRoute>
          <TypeOfIzhaar/>
        </PrivateRoute>
      } />
      <Route path="/user/profile" element={
        <PrivateRoute>
          <ProfileView/>
        </PrivateRoute>
      } />
      <Route path="/user/security" element={
        <PrivateRoute>
          <Security/>
        </PrivateRoute>
      } />
      <Route path="/user/chat-interface" element={
        <PrivateRoute>
          <ChatInterface />
        </PrivateRoute>
      } />
      <Route path="/user/song" element={
        <PrivateRoute>
          <SongIzhaarInfo />
        </PrivateRoute>
      } />
      <Route path="/user/offline-izhaar" element={
        <PrivateRoute>
          <OfflineIzhaar/>
        </PrivateRoute>
      } />
      <Route path="/user/letter-izhaar" element={
        <PrivateRoute>
          <LetterIzhaarLanding/>
        </PrivateRoute>
      } />
      <Route path="/user/receiver" element={
        <PrivateRoute>
          <ReceiverForLetter/>
        </PrivateRoute>
      } />

      <Route path="/user/letter-izhaar/write-prompt" element={
        <PrivateRoute>
          <WritePromptScreen />
        </PrivateRoute>
      } />
      {/* <Route path="/user/LetterIzhaar/TemplateScreen" element={
        <PrivateRoute>
          <TemplateScreen/>
        </PrivateRoute>
      } /> */}
      <Route path="/user/LetterIzhaar/final" element={
        <PrivateRoute>
          <FinalLetterScreen/>
        </PrivateRoute>
      } />
      <Route path="/user/letter/payment-subscription" element={
        <PrivateRoute>
          <PaymentSubscription />
        </PrivateRoute>
      } />
      <Route path="/user/letter/payment-subscription/offline" element={
        <PrivateRoute>
          <PaymentForOfflineLetter />
        </PrivateRoute>
      } />
      <Route path="/user/song/payment-subscription" element={
        <PrivateRoute>
          <PaymentSongSubscription />
        </PrivateRoute>
      } />
      <Route path="/user/izhaar_tracker" element={
        <PrivateRoute>
          <IzhaarTracker />
        </PrivateRoute>
      } />
      <Route path="/user/watch-party" element={
        <PrivateRoute>
          <WatchParty />
        </PrivateRoute>
      } />
      <Route path="/user/quiz" element={
        <PrivateRoute>
          <Quiz />
        </PrivateRoute>
      } />
      <Route path="/user/reels" element={
        <PrivateRoute>
          <Reels />
        </PrivateRoute>
      } />
      <Route path="/user/song/create" element={
        <PrivateRoute>
          <SongCreateForm />
        </PrivateRoute>
      } />
      <Route path="/user/song/preview" element={
        <PrivateRoute>
          <SongPreview />
        </PrivateRoute>
      } />
      <Route path="/user/select-template" element={
        <PrivateRoute>
          <SelectTemplate />
        </PrivateRoute>
      } />
      <Route path="/magazine" element={<Magazine />} />
       <Route path="/gifts" element={<Gifts />} />

    </Routes>
  );
}

export default App;