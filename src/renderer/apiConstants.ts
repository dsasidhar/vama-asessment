export const APP_CHECK_TOKEN = '12345';
export const COUNTRY_CODE = 'US';

const isDevServer = true;

const host = isDevServer ? 'localhost:3000' : 'vapi-dev.vama.com';
const protocol = isDevServer ? 'http' : 'https';
const webSocketProtocol = isDevServer ? 'ws' : 'wss';

export const apiUrl = `${protocol}://${host}`;
export const signInUrl = `${apiUrl}/signin_sms`;

export const webSocketUrl = `${webSocketProtocol}://${host}`;

export const ChannelID = '06c0206c-71b5-11ed-afa2-acde48001122';

/**
 * This is a flag to turn off all API calls.
 * This is useful for testing the UI screens.
 */
export const makeNoAPICalls = false;
