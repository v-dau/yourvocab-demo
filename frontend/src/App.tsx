import { BrowserRouter, Route, Routes } from 'react-router';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import CardsPage from './pages/CardsPage';
import CreateEditCardPage from './pages/CreateEditCardPage';
import ReviewPage from './pages/ReviewPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import FeedbackPage from './pages/FeedbackPage';
import TrashPage from './pages/TrashPage';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { DisplayModeProvider } from './stores/displayModeStore';
import { MainLayout } from './components/layout';
import { PublicLayout } from './components/layout/PublicLayout';
import { useAuthStore } from './stores/authStore';
import api from './lib/axios';

function App() {
  const { user, signOut } = useAuthStore();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme_preference') as 'light' | 'dark') || 'light';
  });
  const [language, setLanguage] = useState<'vi' | 'en'>(() => {
    return (localStorage.getItem('language_preference') as 'vi' | 'en') || 'vi';
  });
  const { i18n } = useTranslation();

  useEffect(() => {
    // Apply local storage preferences immediately for unauthenticated users or before DB loads
    i18n.changeLanguage(language);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (user) {
      api
        .get('/users/me/settings')
        .then((res) => {
          const fetchedTheme = res.data?.settings?.theme_preference || 'light';
          const fetchedLanguage = res.data?.settings?.language || 'vi';

          setTheme(fetchedTheme);
          setLanguage(fetchedLanguage);
          i18n.changeLanguage(fetchedLanguage);

          if (fetchedTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        })
        .catch((err) => console.error('Failed to load user settings', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, i18n]);

  const handleLogout = async () => {
    await signOut();
  };

  const handleLanguageChange = async (newLang: 'en' | 'vi') => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);

    if (!user) {
      localStorage.setItem('language_preference', newLang);
    } else {
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

    if (!user) {
      localStorage.setItem('theme_preference', newTheme);
    } else {
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
            <Route
              path="/signin"
              element={
                <PublicLayout
                  onThemeToggle={handleThemeToggle}
                  currentTheme={theme}
                  currentLanguage={language}
                  onLanguageChange={handleLanguageChange}
                >
                  <SignInPage />
                </PublicLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicLayout
                  onThemeToggle={handleThemeToggle}
                  currentTheme={theme}
                  currentLanguage={language}
                  onLanguageChange={handleLanguageChange}
                >
                  <SignUpPage />
                </PublicLayout>
              }
            />

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
                path="/trash"
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
                    <TrashPage />
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
