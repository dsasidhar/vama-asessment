import './style.scss';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { userPhoneNumber$ } from '../appState';
import SignUpBanner from '../SignUpBanner';

export default function SignUp() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const setUserPhoneNumber = useSetRecoilState(userPhoneNumber$);
  const navigate = useNavigate();
  useEffect(() => {
    if (
      phoneNumber.length > 0 &&
      phoneNumber.length === 10 &&
      !Number.isNaN(Number(phoneNumber))
    ) {
      setError('');
    } else {
      setError('Please enter a valid phone number');
    }
  }, [phoneNumber]);
  const handleNext = () => {
    setUserPhoneNumber(`1${phoneNumber}`);
    navigate('/verify');
  };
  return (
    <div className="signup-container">
      <SignUpBanner />
      <p> What&apos;s your phone number?</p>
      <div className="phone-number-input">
        <div className="country-code">+1</div>
        <input
          className="phone-number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          type="tel"
          placeholder="Phone Number"
        />
      </div>
      <p className="error-message">{error} </p>
      <button
        disabled={error !== ''}
        onClick={handleNext}
        className="next"
        type="button"
      >
        Next
      </button>
    </div>
  );
}
