import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/store';

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null, //stores user information including role
  loading: false, //used to track the state when calling api

  //reset state function
  clearState: () => {
    set({
      accessToken: null,
      user: null,
      loading: false,
    });
  },

  signUp: async (username, email, password, language, theme) => {
    try {
      set({ loading: true });

      //call api at service layer
      await authService.signUp(username, email, password, language, theme);

      toast.success('Đăng ký thành công! Đang chuyển sang trang đăng nhập');
    } catch (error) {
      console.error(error);
      toast.error('Đăng ký không thành công');
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (identifier, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.signIn(identifier, password);

      get().setAccessToken(accessToken); //update accessToken's value in the authStore

      await get().fetchMe();

      toast.success('Đăng nhập thành công, chúc bạn một ngày học tập chăm chỉ!');
      return true;
    } catch (error: unknown) {
      console.error(error);

      // Custom text based on backend error message
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any;
      const backendMessage = axiosError?.response?.data?.message || '';

      toast.error(backendMessage || 'Đăng nhập không thành công!');

      return false;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await authService.signOut();
      get().clearState();
      toast.success('Đăng xuất thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Lỗi xảy ra khi đăng xuất. Hãy thử lại!');
      set({ loading: false });
    }
  },

  fetchMe: async (silent = false) => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();

      set({ user });
    } catch (error) {
      console.error(error);
      set({ user: null, accessToken: null });
      if (!silent) {
        toast.error('Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại');
      }
    } finally {
      set({ loading: false });
    }
  },

  refresh: async (silent = false) => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get(); //get store members
      const accessToken = await authService.refresh();

      setAccessToken(accessToken);

      if (!user) {
        await fetchMe(silent);
      }
    } catch (error) {
      console.error(error);
      if (!silent) {
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
      }
      get().clearState(); //delete all current login information
    } finally {
      set({ loading: false });
      //loading:
      //1. prevent content flicker: keep the UI in a loading state while fetching user data,
      //instead of briefly showing the "not logged in" state before switching to "logged in".
      //2. block UI interactions: disable buttons/forms to avoid conflicting requests
      //while the system processes background authentication.
      //3. provide feedback: display a spinner or progress indicator to inform users that loading is in progress.
    }
  },

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  setUser: (user) => {
    set({ user });
  },
}));
