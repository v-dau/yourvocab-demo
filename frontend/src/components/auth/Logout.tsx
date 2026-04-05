import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/authStore';

const Logout = () => {
  const { signOut } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut();

      // Khôi phục settings từ localStorage về lại cho ứng dụng sau khi đăng xuất
      const localTheme = localStorage.getItem('vite-ui-theme') || 'system';
      const localLang = localStorage.getItem('i18nextLng') || 'en';

      // Áp dụng language lại cho local
      localStorage.setItem('i18nextLng', localLang);

      // Áp dụng theme
      if (localTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(systemTheme);
      } else {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(localTheme);
      }

      // Force refresh page để clear cache và sync lại i18n
      window.location.href = '/signin';
    } catch (error) {
      console.error(error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
