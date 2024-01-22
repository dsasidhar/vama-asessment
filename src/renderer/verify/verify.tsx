import log from 'electron-log/renderer';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import signIn from '../api';
import { makeNoAPICalls } from '../apiConstants';
import {
  addItemsToActiveChatHistory,
  contactList$,
  getMockContacts,
  userAuthDetails$,
  userPhoneNumber$,
} from '../appState';
import SignUpBanner from '../SignUpBanner';
import SocketManager from '../SocketManager';
import enforceErrorType from '../utils/errorUtils';
import formatPhoneNumberForDisplay from '../utils/phoneUtils';

export default function Verify() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const phoneNumber = useRecoilValue(userPhoneNumber$);
  const setUserAuthDetails = useSetRecoilState(userAuthDetails$);
  const setContactList = useSetRecoilState(contactList$);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signInWithAPI = async () => {
    if (makeNoAPICalls) {
      navigate('/user-details');
      return;
    }
    setLoading(true);
    try {
      const response = await signIn(phoneNumber, code);
      log.info('Sign in data:', response);
      if (response.error) {
        setError(response.error.message);
        throw new Error(response.error.message);
      }
      if (response.data === undefined) {
        setError('Invalid code');
        throw new Error('Invalid code');
      }
      const {
        token,
        account_id: accountId,
        token_expires_at: tokenExpiresAt,
      } = response.data;
      if (token === undefined) {
        setError('Invalid code');
        throw new Error('Invalid code');
      }
      setError('');
      setUserAuthDetails({
        token,
        accountId,
        tokenExpiresAt,
      });

      setContactList(getMockContacts(accountId));
      navigate('/user-details');
    } catch (inputError) {
      const err = enforceErrorType(inputError);
      log.error('Fetch error:', err);
      setError(
        'message' in err ? (err.message as string) : 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  // input validation
  useEffect(() => {
    if (code.length > 0 && code.length === 5 && !Number.isNaN(Number(code))) {
      setError('');
    } else {
      setError('Please enter a valid verification code');
    }
  }, [code]);

  return (
    <div className="signup-container">
      <SignUpBanner />
      <p> {formatPhoneNumberForDisplay(phoneNumber)}</p>
      <p className="hint-text">We have sent you an SMS with the code</p>

      <input
        type="text"
        onChange={(e) => setCode(e.target.value)}
        value={code}
        placeholder="Code"
      />
      <p className="error-message">{error} </p>
      <button
        disabled={error !== ''}
        onClick={signInWithAPI}
        className="next"
        type="button"
      >
        {loading ? 'Loading...' : 'Next'}
      </button>
    </div>
  );
}
