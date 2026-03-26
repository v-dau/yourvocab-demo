import { BrowserRouter, Route, Routes } from 'react-router';
import { useState } from 'react';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import CardsPage from './pages/CardsPage';
import CreateEditCardPage from './pages/CreateEditCardPage';
import ReviewPage from './pages/ReviewPage';
import SettingsPage from './pages/SettingsPage';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { DisplayModeProvider } from './stores/displayModeStore';
import { MainLayout } from './components/layout';
import { useAuthStore } from './stores/authStore';

function App() {
  const { user, signOut } = useAuthStore();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleLogout = async () => {
    await signOut();
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
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
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
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
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
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
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
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
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
                  >
                    <ReviewPage />
                  </MainLayout>
                }
              />
              <Route
                path="/settings"
                element={
                  <MainLayout
                    isLoggedIn={!!user}
                    username={user?.username || 'User'}
                    onLogout={handleLogout}
                    onThemeToggle={handleThemeToggle}
                    currentTheme={theme}
                  >
                    <SettingsPage />
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
