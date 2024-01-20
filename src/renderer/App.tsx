import './App.scss';

import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import ChatScreen from './chat-screen/ChatScreen';
import SignUp from './signup/signup';
import UserDetails from './user-details/UserDetails';
import Verify from './verify/verify';

export default function App() {
  return (
    <RecoilRoot>
      <Router initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/user-details" element={<UserDetails />} />
          <Route path="/chat-screen" element={<ChatScreen />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}
