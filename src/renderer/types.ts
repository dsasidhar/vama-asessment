export type SignInAPIResponse = {
  id: string;
  error?: {
    message: string;
    code: number;
  };
  data?: {
    token: string;
    account_id: string;
    token_expires_at: string;
  };
};
