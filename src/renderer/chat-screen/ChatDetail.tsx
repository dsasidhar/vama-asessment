import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import defaultProfileAvatar from '../../../assets/avatar.png';
import doubleCheckIcon from '../../../assets/check-doble.png';
import logout from '../../../assets/logout.png';
import sendMessageIcon from '../../../assets/send_btn.png';
import {
  activeChatHistory$,
  contactList$,
  selectedContactIndex$,
} from '../appState';

export default function ChatDetail() {
  const contactList = useRecoilValue(contactList$);
  const selectedContact = useRecoilValue(selectedContactIndex$);
  const contact = contactList[selectedContact];
  const activeChatHistory = useRecoilValue(activeChatHistory$);
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/');
  };
  if (!contact) {
    return null;
  }
  return (
    <div className="chat-detail">
      <div className="chat-detail-header">
        <div className="chat-detail-header-avatar">
          <img alt="profile" src={defaultProfileAvatar} />
        </div>
        <div className="chat-detail-header-name">
          {contact.firstName} {contact.lastName}
        </div>
        <button className="logout" type="button" onClick={handleLogout}>
          <img
            alt="logout"
            title="logout"
            width={20}
            height={20}
            src={logout}
          />
        </button>
      </div>
      <div className="chat-detail-body">
        <div className="chat-detail-body-messages">
          {activeChatHistory.map((message) => (
            <div
              key={message.id}
              className={`chat-detail-body-message ${
                message.sender === contact.id ? 'received' : 'sent'
              }`}
            >
              <div className="">{message.message}</div>
              <div className="timestamp">
                10:35 PM
                {message.sender !== contact.id ? (
                  <img
                    className="sent-n-received"
                    alt="sent"
                    src={doubleCheckIcon}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-detail-footer">
        <textarea className="chat-detail-footer-input" placeholder="Message" />
        <button type="button" className="chat-detail-footer-button">
          <img alt="send" src={sendMessageIcon} />
        </button>
      </div>
    </div>
  );
}
