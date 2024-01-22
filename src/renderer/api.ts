import { APP_CHECK_TOKEN, COUNTRY_CODE, signInUrl } from './apiConstants';
import { SignInAPIResponse } from './types';

export default async function signIn(
  phoneNumber: string,
  code: string,
): Promise<SignInAPIResponse> {
  const response = await fetch(`${signInUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone_number: `+${phoneNumber}`,
      country_code: COUNTRY_CODE,
      verify_code: code,
      app_check_token: APP_CHECK_TOKEN,
      device_id: '12345',
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json() as Promise<SignInAPIResponse>;
}
