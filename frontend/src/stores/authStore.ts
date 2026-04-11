import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/store';
import i18n from '@/i18n';

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

      toast.success(
        i18n.t('auth.success.signup', 'Đăng ký thành công! Đang chuyển sang trang đăng nhập')
      );
      return { success: true };
    } catch (error: unknown) {
      console.error(error);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any;
      const backendError = axiosError?.response?.data;
      const backendMessage = backendError?.message || '';

      let errorMessage = backendMessage || i18n.t('auth.error.signup', 'Đăng ký không thành công');

      if (backendError?.code === 'USERNAME_IN_USE') {
        errorMessage = i18n.t('auth.error.username_in_use', 'Tên đăng nhập đã được sử dụng');
      } else if (backendError?.code === 'EMAIL_IN_USE') {
        errorMessage = i18n.t('auth.error.email_in_use', 'Email đã được sử dụng');
      }

      toast.error(errorMessage);
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (identifier, password) => {
    set({ loading: true });
    try {
      const { accessToken } = await authService.signIn(identifier, password);

      get().setAccessToken(accessToken); //update accessToken's value in the authStore

      await get().fetchMe();

      toast.success(
        i18n.t('auth.success.signin', 'Đăng nhập thành công, chúc bạn một ngày học tập chăm chỉ!')
      );
      return { success: true };
    } catch (error: unknown) {
      console.error(error);

      // Custom text based on backend error message
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any;
      const backendError = axiosError?.response?.data;
      const backendMessage = backendError?.message || '';

      console.log('Login Error: ', backendError);

      if (backendError?.code === 'USER_BANNED') {
        // Return banned details instead of throwing so form can handle it silently
        return { success: false, banned: true, details: backendError.details };
      }

      let errorMessage =
        backendMessage || i18n.t('auth.error.signin', 'Đăng nhập không thành công!');
      if (backendError?.code === 'USER_NOT_FOUND') {
        errorMessage = i18n.t(
          'auth.error.user_not_found',
          'Tài khoản hoặc email chưa được đăng ký'
        );
      } else if (backendError?.code === 'WRONG_PASSWORD') {
        errorMessage = i18n.t('auth.error.wrong_password', 'Sai tài khoản hoặc mật khẩu!');
      }

      toast.error(errorMessage);

      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await authService.signOut();
      get().clearState();
      toast.success(i18n.t('auth.success.signout', 'Đăng xuất thành công!'));
    } catch (error) {
      console.error(error);
      toast.error(i18n.t('auth.error.signout', 'Lỗi xảy ra khi đăng xuất. Hãy thử lại!'));
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
        toast.error(
          i18n.t('auth.error.fetch_user', 'Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại')
        );
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
        toast.error(
          i18n.t(
            'auth.error.session_expired',
            'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!'
          )
        );
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
