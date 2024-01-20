import './styles.scss';

import ChatDetail from './ChatDetail';
import ChatList from './ChatList';

export default function ChatScreen() {
  return (
    <div className="chat-screen">
      <ChatList />
      <ChatDetail />
    </div>
  );
}
