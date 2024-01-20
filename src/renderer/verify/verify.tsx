import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { userPhoneNumber$ } from '../appState';
import SignUpBanner from '../SignUpBanner';

function formatPhoneNumber(phoneNumber: string) {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}`;
  }
  return null;
}
const noAPICalls = true;
export default function Verify() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const phoneNumber = useRecoilValue(userPhoneNumber$);
  const navigate = useNavigate();
  const makeAPICall = async () => {
    if (noAPICalls) {
      navigate('/user-details');
      return;
    }
    const response = await fetch(`https://vapi-dev.vama.com/signin_sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: `+${phoneNumber}`,
        country_code: 'US',
        verify_code: code,
        app_check_token: 'app_check_token',
      }),
    });
    const data = await response.json();
    if (data.error) {
      setError(data.error.message);
    } else {
      setError('');
    }
    console.log('api response', data);
  };
  useEffect(() => {
    if (code.length > 0 && code.length === 4 && !Number.isNaN(Number(code))) {
      setError('');
    } else {
      setError('Please enter a valid verification code');
    }
  }, [code]);
  return (
    <div className="signup-container">
      <SignUpBanner />
      <p> {formatPhoneNumber(phoneNumber)}</p>
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
        onClick={makeAPICall}
        className="next"
        type="button"
      >
        Next
      </button>
    </div>
  );
}
