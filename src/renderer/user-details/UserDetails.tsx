import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { userFirstName$, userLastName$ } from '../appState';
import SignUpBanner from '../SignUpBanner';

export default function UserDetails() {
  const [firstName, setFirstName] = useRecoilState(userFirstName$);
  const [lastName, setLastName] = useRecoilState(userLastName$);
  const navigate = useNavigate();
  const handleNext = () => {
    navigate('/chat-screen');
  };
  return (
    <div className="signup-container">
      <SignUpBanner />
      <p> What&apos;s your Full Name?</p>
      <input
        type="text"
        onChange={(e) => setFirstName(e.target.value)}
        value={firstName}
        placeholder="First Name"
      />
      <input
        type="text"
        onChange={(e) => setLastName(e.target.value)}
        value={lastName}
        placeholder="Last Name"
      />
      <button
        disabled={firstName.length === 0 || lastName.length === 0}
        onClick={handleNext}
        type="button"
        className="next w-100"
      >
        Next
      </button>
    </div>
  );
}
