import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
  /\/+$/,
  '',
);

export const api = axios.create({ baseURL });

export function getErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) {
      return message.join(' ');
    }
    if (typeof message === 'string') {
      return message;
    }
    if (!error.response) {
      return `The catalog API could not be reached at ${baseURL}. Check that the NestJS server is running.`;
    }
  }

  return 'Something went wrong while loading the catalog. Please try again.';
}
