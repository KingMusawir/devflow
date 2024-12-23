import { IAccount } from '@/database/account.model';
import { IUser } from '@/database/user.model';
import { fetchHandler } from '@/lib/handlers/fetch';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = {
  users: {
    getAll: () => fetchHandler(`${API_URL}/users`),

    getOne: (id: string) => fetchHandler(`${API_URL}/users/${id}`),

    getUserByEmail: (email: string) =>
      fetchHandler(`${API_URL}/users/email/`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    create: (userData: Partial<IUser>) =>
      fetchHandler(`${API_URL}/users`, {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    update: (id: string, userData: Partial<IUser>) =>
      fetchHandler(`${API_URL}/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),

    delete: (id: string) =>
      fetchHandler(`${API_URL}/users/${id}`, {
        method: 'DELETE',
      }),
  },

  account: {
    getAll: () => fetchHandler(`${API_URL}/account`),

    getOne: (id: string) => fetchHandler(`${API_URL}/account/${id}`),

    getAccountByProvider: (providerAccountId: string) =>
      fetchHandler(`${API_URL}/account/provider/`, {
        method: 'POST',
        body: JSON.stringify({ providerAccountId }),
      }),

    create: (accountData: Partial<IAccount>) =>
      fetchHandler(`${API_URL}/account`, {
        method: 'POST',
        body: JSON.stringify(accountData),
      }),

    update: (id: string, accountData: Partial<IAccount>) =>
      fetchHandler(`${API_URL}/account/${id}`, {
        method: 'PUT',
        body: JSON.stringify(accountData),
      }),

    delete: (id: string) =>
      fetchHandler(`${API_URL}/account/${id}`, {
        method: 'DELETE',
      }),
  },
};
