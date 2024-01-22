import './App.scss';

import {
  MemoryRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { userAuthDetails$ } from './appState';
import ChatScreen from './chat-screen/ChatScreen';
import PersistanceHelper from './PersistanceHelper';
import SignUp from './signup/signup';
import UserDetails from './user-details/UserDetails';
import Verify from './verify/verify';

export default function App() {
  const userAuthDetails = useRecoilValue(userAuthDetails$);
  const initialRoute = userAuthDetails.token ? '/chat-screen' : '/';
  return (
    <>
      <PersistanceHelper />
      <Router initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/verify" element={<Verify />} />
          <Route path="/user-details" element={<UserDetails />} />
          <Route path="/chat-screen" element={<ChatScreen />} />
          <Route path="/" element={<SignUp />} />
        </Routes>
        {userAuthDetails.token && <Navigate to="/chat-screen" />}
      </Router>
    </>
  );
}
