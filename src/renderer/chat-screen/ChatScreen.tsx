import './styles.scss';

import log from 'electron-log/renderer';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import {
  addItemsToActiveChatHistory,
  changeLoadingState,
  connectionStatusUpdater,
  userAuthDetails$,
} from '../appState';
import SocketManager from '../SocketManager';
import ChatDetail from './ChatDetail';
import ChatList from './ChatList';

export default function ChatScreen() {
  const userAuthDetails = useRecoilValue(userAuthDetails$);
  const chatListUpdater = addItemsToActiveChatHistory();
  const statusUpdater = connectionStatusUpdater();
  const loadingUpdater = changeLoadingState();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userAuthDetails.token) {
      log.error('No token found, redirecting to sign up page');
      navigate('/');
    }
    SocketManager.getInstance(userAuthDetails.token)
      .connect()
      .stateUpdaters(chatListUpdater, statusUpdater, loadingUpdater);
    return () => {
      SocketManager.getInstance().disconnect();
    };
  }, [userAuthDetails.token]);

  return (
    <div className="chat-screen">
      <ChatList />
      <ChatDetail />
    </div>
  );
}
