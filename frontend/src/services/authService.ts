import api from '@/lib/axios.ts';

//prettier ignore
export const authService = {
  signUp: async (username: string, email: string, password: string) => {
    const res = await api.post(
      '/auth/signup',
      { username, email, password },
      { withCredentials: true }
    );

    return res.data;
  },

  signIn: async (identifier: string, password: string) => {
    const res = await api.post(
      '/auth/signin', 
      { identifier, password }, 
      { withCredentials: true }
    );

    return res.data; //access token
  },

  signOut: async () => {
    return await api.post(
      '/auth/signout',
      {},
      { withCredentials: true }
    );
  },

  fetchMe: async () => {
    const res= await api.get(
      '/users/me', 
      { withCredentials: true }
    );
    return res.data.user;
  },

  refresh: async () => {
    const res = await api.post(
      '/auth/refresh', 
      { withCredentials: true }
    );
    return res.data.accessToken;
  }
};
