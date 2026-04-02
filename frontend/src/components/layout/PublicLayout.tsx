import React from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BookOpen, Moon, Sun, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Footer } from './Footer';

interface PublicLayoutProps {
  children: ReactNode;
  onThemeToggle: () => void;
  currentTheme: 'light' | 'dark';
  currentLanguage: 'en' | 'vi';
  onLanguageChange: (lang: 'en' | 'vi') => void;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  onThemeToggle,
  currentTheme,
  currentLanguage,
  onLanguageChange,
}) => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col w-full relative bg-background">
      {/* Header */}
      <header className="relative z-10 bg-transparent backdrop-blur-sm">
        <div className="flex justify-between items-center py-4 px-6 md:px-10">
          <Link
            to="/signin"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">Yourvocab</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onThemeToggle}
              title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
            >
              {currentTheme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase hidden sm:inline-block">
                    {currentLanguage}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onLanguageChange('en')} className="cursor-pointer">
                  <span>{t('sidebar.english', 'English')}</span>
                  {currentLanguage === 'en' && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLanguageChange('vi')} className="cursor-pointer">
                  <span>{t('sidebar.vietnamese', 'Tiếng Việt')}</span>
                  {currentLanguage === 'vi' && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 ml-2">
              {location.pathname !== '/signin' && (
                <Link to="/signin">
                  <Button variant="ghost" size="sm">
                    {t('common.signin', 'Sign In')}
                  </Button>
                </Link>
              )}
              {location.pathname !== '/signup' && (
                <Link to="/signup">
                  <Button size="sm">{t('common.signup', 'Sign Up')}</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full items-center justify-center relative">
        {children}
      </main>

      {/* Footer */}
      <div className="z-10 bg-background w-full">
        <Footer />
      </div>
    </div>
  );
};
