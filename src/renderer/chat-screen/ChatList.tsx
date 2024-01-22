import { useRecoilState, useRecoilValue } from 'recoil';

import defaultProfileAvatar from '../../../assets/avatar.png';
import newChatIcon from '../../../assets/new_chat.png';
import {
  activeChatHistory$,
  contactList$,
  selectedContactIndex$,
} from '../appState';

export default function ChatList() {
  const contactList = useRecoilValue(contactList$);
  const activeChatHistory = useRecoilValue(activeChatHistory$);
  const [selectedContactIndex, setSelectedContact] = useRecoilState(
    selectedContactIndex$,
  );
  const selectContactForDetailView = (index: number) => {
    setSelectedContact(index);
  };
  return (
    <div className="chat-list">
      <div className="list">
        {contactList.map((contact, index) => (
          <div
            key={contact.id}
            role="button"
            onClick={() => selectContactForDetailView(index)}
            className={`chat-item ${
              selectedContactIndex === index ? 'selected' : ''
            }`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                selectContactForDetailView(index);
              }
            }}
          >
            <div className="profile-image">
              <img alt="profile" src={defaultProfileAvatar} />
            </div>
            <div className="chat-info">
              <div className="chat-info-header">
                <span className="chat-info-header-name">
                  {contact.firstName} {contact.lastName}
                </span>
                <span className="chat-info-header-time">
                  {activeChatHistory.length > 0
                    ? new Date(
                        activeChatHistory[
                          activeChatHistory.length - 1
                        ].timeStamp,
                      ).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })
                    : ''}
                </span>
              </div>
              <div className="chat-info-body">
                <div className="chat-info-body-message">
                  {activeChatHistory.length > 0
                    ? activeChatHistory[activeChatHistory.length - 1].message
                    : ''}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="new-chat">
        <img className="animated-button" alt="new-chat" src={newChatIcon} />
      </div>
    </div>
  );
}
