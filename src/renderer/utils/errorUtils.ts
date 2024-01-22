export default function enforceErrorType(error: any): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(error);
}
