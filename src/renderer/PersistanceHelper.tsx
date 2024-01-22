import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import {
  activeChatHistory$,
  contactList$,
  getMockContacts,
  userAuthDetails$,
} from './appState';

export default function PersistanceHelper() {
  const [userAuthDetails, setUserAuthDetails] =
    useRecoilState(userAuthDetails$);

  const [activeChatHistory, setActiveChatHistory] =
    useRecoilState(activeChatHistory$);

  const setContactList = useSetRecoilState(contactList$);

  useEffect(() => {
    window.electron.ipcRenderer.getData('userAuthDetails').then((data) => {
      if (data && data.token && data.accountId && data.tokenExpiresAt) {
        setUserAuthDetails(data);
        setContactList(getMockContacts(data.accountId));
      }
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.getData('activeChatHistory').then((data) => {
      if (data && data.length > 0) {
        setActiveChatHistory(data);
      }
    });
  }, []);

  useEffect(() => {
    if (userAuthDetails) {
      window.electron.ipcRenderer
        .storeData('userAuthDetails', userAuthDetails)
        .then(() => {
          console.log('userAuthDetails stored');
        });
    }
  }, [userAuthDetails]);

  useEffect(() => {
    if (activeChatHistory) {
      window.electron.ipcRenderer
        .storeData('activeChatHistory', activeChatHistory)
        .then(() => {
          console.log('activeChatHistory stored');
        });
    }
  }, [activeChatHistory]);

  return null;
}
