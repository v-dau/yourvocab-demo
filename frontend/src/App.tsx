import { BrowserRouter, Route, Routes } from 'react-router';
import { useState, useEffect } from 'react';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import CardsPage from './pages/CardsPage';
import CreateEditCardPage from './pages/CreateEditCardPage';
import ReviewPage from './pages/ReviewPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import FeedbackPage from './pages/FeedbackPage';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { DisplayModeProvider } from './stores/displayModeStore';
import { MainLayout } from './components/layout';
import { useAuthStore } from './stores/authStore';
import api from './lib/axios';

function App() {
  const { user, signOut } = useAuthStore();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    if (user) {
      api
        .get('/users/me/settings')
        .then((res) => {
          const fetchedTheme = res.data?.settings?.theme_preference || 'light';
          const fetchedLanguage = res.data?.settings?.language || 'vi';

          setTheme(fetchedTheme);
          setLanguage(fetchedLanguage);

          if (fetchedTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        })
        .catch((err) => console.error('Failed to load user settings', err));
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
  };

  const handleLanguageChange = async (newLang: 'en' | 'vi') => {
    setLanguage(newLang);
    if (user) {
      try {
        await api.patch('/users/me/settings', { language: newLang });
      } catch (err) {
        console.error('Failed to sync language', err);
      }
    }
  };

  const handleThemeToggle = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (user) {
      try {
        await api.patch('/users/me/settings', { theme_preference: newTheme });
      } catch (err) {
        console.error('Failed to sync theme', err);
      }
    }
  };
  return (
    <>
      <Toaster richColors />
      <DisplayModeProvider>
        <BrowserRouter>
          <Routes>
            {/*public routes*/}
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/*protected routes*/}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={
                  <MainLayout
                    isLoggedIn={!!user}
                    username={user?.username || 'User'}
                    userAvatar={user?.avatar_url || ''}
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
                    currentLanguage={language}
                    onLanguageChange={handleLanguageChange}
                  >
                    <DashboardPage />
                  </MainLayout>
                }
              />
              <Route
                path="/cards"
                element={
                  <MainLayout
                    isLoggedIn={!!user}
                    username={user?.username || 'User'}
                    userAvatar={user?.avatar_url || ''}
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
                    currentLanguage={language}
                    onLanguageChange={handleLanguageChange}
                  >
                    <CardsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/cards/create"
                element={
                  <MainLayout
                    isLoggedIn={!!user}
                    username={user?.username || 'User'}
                    userAvatar={user?.avatar_url || ''}
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
                    currentLanguage={language}
                    onLanguageChange={handleLanguageChange}
                  >
                    <CreateEditCardPage />
                  </MainLayout>
                }
              />
              <Route
                path="/cards/edit/:id"
                element={
                  <MainLayout
                    isLoggedIn={!!user}
                    username={user?.username || 'User'}
                    userAvatar={user?.avatar_url || ''}
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
                    currentLanguage={language}
                    onLanguageChange={handleLanguageChange}
                  >
                    <CreateEditCardPage />
                  </MainLayout>
                }
              />
              <Route
                path="/review"
                element={
                  <MainLayout
                    isLoggedIn={!!user}
                    username={user?.username || 'User'}
                    userAvatar={user?.avatar_url || ''}
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
                    currentLanguage={language}
                    onLanguageChange={handleLanguageChange}
                  >
                    <ReviewPage />
                  </MainLayout>
                }
              />
              <Route
                path="/profile-settings"
                element={
                  <MainLayout
                    isLoggedIn={!!user}
                    username={user?.username || 'User'}
                    userAvatar={user?.avatar_url || ''}
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
                    currentLanguage={language}
                    onLanguageChange={handleLanguageChange}
                  >
                    <ProfileSettingsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/feedbacks"
                element={
                  <MainLayout
                    isLoggedIn={!!user}
                    username={user?.username || 'User'}
                    userAvatar={user?.avatar_url || ''}
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
                    currentLanguage={language}
                    onLanguageChange={handleLanguageChange}
                  >
                    <FeedbackPage />
                  </MainLayout>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </DisplayModeProvider>
    </>
  );
}

export default App;
