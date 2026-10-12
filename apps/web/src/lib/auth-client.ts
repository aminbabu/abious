import { createAuthClient } from 'better-auth/solid';
import { getApiBaseUrl } from './api';

export const authClient = createAuthClient({
  baseURL: getApiBaseUrl(),
  fetchOptions: {
    credentials: 'include',
  },
});

