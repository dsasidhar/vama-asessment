import { set } from 'lodash';
import { throttle } from 'lodash/fp';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import defaultProfileAvatar from '../../../assets/avatar.png';
import doubleCheckIcon from '../../../assets/check-doble.png';
import logout from '../../../assets/logout.png';
import sendMessageIcon from '../../../assets/send_btn.png';
import {
  activeChatHistory$,
  activeConnectionStatus$,
  addItemsToActiveChatHistory,
  contactList$,
  loadingStatus$,
  selectedContactIndex$,
  userAuthDetails$,
} from '../appState';
import SocketManager from '../SocketManager';

export default function ChatDetail() {
  const contactList = useRecoilValue(contactList$);
  const selectedContact = useRecoilValue(selectedContactIndex$);
  const contact = contactList[selectedContact];
  const [activeChatHistory, setActiveChatHistory] =
    useRecoilState(activeChatHistory$);
  const navigate = useNavigate();
  const currentPage = useRef(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const firstMessageInListRef = useRef<HTMLDivElement>(null);
  const isLoading = useRecoilValue(loadingStatus$);
  const currentInViewItem = useRef<HTMLDivElement | null>(null);

  const [newChatMessage, setNewChatMessage] = useState('');

  const [userAuthDetails, setUserAuthDetails] =
    useRecoilState(userAuthDetails$);

  const connectionStatus = useRecoilValue(activeConnectionStatus$);

  const observer = useRef<IntersectionObserver>();
  const messagesTopRef = useRef(null);
  const handleAddItemToChat = addItemsToActiveChatHistory();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const lastMessageRef = useRef(
    activeChatHistory[activeChatHistory.length - 1],
  );

  const startObserving = () => {
    console.log('start observing', !!messagesTopRef.current);
    if (!messagesTopRef.current) return;
    observer.current?.observe(messagesTopRef.current);
  };

  useEffect(() => {
    if (selectedContact !== -1) {
      scrollToBottom();
    }
  }, [selectedContact]);

  useEffect(() => {
    console.log(
      'activeChatHistory changed',
      activeChatHistory,
      lastMessageRef.current,
    );
    const lastMessage = activeChatHistory[activeChatHistory.length - 1];
    if (lastMessage?.id !== lastMessageRef.current?.id) {
      scrollToBottom();
      lastMessageRef.current = lastMessage;
    } else if (currentInViewItem.current) {
      currentInViewItem.current?.scrollIntoView();
      currentInViewItem.current = null;
    }
    startObserving();
  }, [activeChatHistory, selectedContact]);

  useEffect(() => {
    if (connectionStatus === 'connected') {
      SocketManager.getInstance().fetchChatHistory(0);
    }
  }, [connectionStatus]);

  useEffect(() => {
    const fetchWithDebounce = throttle(1000, () => {
      console.log('doing the actual fetch');
      SocketManager.getInstance().fetchChatHistory(currentPage.current + 1);
      currentPage.current += 1;
    });
    observer.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          // When the top of activeChatHistory is visible, make a new API call
          console.log('fetching more');
          if (currentPage.current !== -1 && messagesTopRef.current) {
            console.log('unobserving');
            currentObserver.unobserve(messagesTopRef.current);
            currentInViewItem.current = firstMessageInListRef.current;
          }
          fetchWithDebounce();
        }
      },
      { threshold: 1 },
    );
    const currentObserver = observer.current;
    startObserving();

    return () => {
      if (messagesTopRef.current)
        currentObserver.unobserve(messagesTopRef.current);
    };
  }, []);

  const handleLogout = () => {
    setUserAuthDetails({
      token: '',
      accountId: '',
      tokenExpiresAt: '',
    });
    setActiveChatHistory([]);
    navigate('/');
  };

  const handleSendMessage = () => {
    if (!newChatMessage) return;
    SocketManager.getInstance().sendMessage(newChatMessage);
    setNewChatMessage('');
    handleAddItemToChat([
      {
        id: uuidv4(),
        message: newChatMessage,
        sender: userAuthDetails.accountId,
        timeStamp: new Date().toISOString(),
      },
    ]);
  };

  if (!contact) {
    return <div className="chat-detail" />;
  }
  return (
    <div className="chat-detail">
      <div className="chat-detail-header">
        <div className="chat-detail-header-avatar">
          <img alt="profile" src={defaultProfileAvatar} />
        </div>
        <div className="chat-detail-header-name">
          {contact.firstName} {contact.lastName}
          <div className="chat-phone-number">
            +{contact.id?.split('+')?.[1]}
          </div>
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
          <div ref={messagesTopRef}></div>
          {/** Add a loading indicator */}
          {isLoading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              Loading...
            </div>
          )}
          {activeChatHistory.map((message, index) => (
            <div
              key={message.id}
              ref={index === 0 ? firstMessageInListRef : null}
              className={`chat-detail-body-message ${
                message.sender === contact.id ? 'received' : 'sent'
              }`}
            >
              <div className="">{message.message}</div>
              <div className="timestamp">
                {new Date(message.timeStamp).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
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

          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="chat-detail-footer">
        <textarea
          value={newChatMessage}
          onChange={(e) => setNewChatMessage(e.target.value)}
          className="chat-detail-footer-input"
          placeholder="Message"
        />
        <button
          onClick={handleSendMessage}
          type="button"
          className="chat-detail-footer-button"
        >
          <img alt="send" src={sendMessageIcon} />
        </button>
      </div>
    </div>
  );
}
