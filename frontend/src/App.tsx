import { BrowserRouter, Route, Routes } from 'react-router';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CardsPage from './pages/CardsPage';
import { DisplayModeProvider } from './stores/displayModeStore';

function App() {
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
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/cards" element={<CardsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DisplayModeProvider>
    </>
  );
}

export default App;
