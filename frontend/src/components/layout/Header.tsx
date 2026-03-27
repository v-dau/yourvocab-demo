import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Sun, Moon, Globe, User, LogOut, Settings, BookOpen } from 'lucide-react';

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
  userAvatar?: string;
  onLogout?: () => void;
  onThemeToggle?: () => void;
  currentTheme?: 'light' | 'dark';
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn = false,
  username = 'User',
  userAvatar = '',
  onLogout = () => {},
  onThemeToggle = () => {},
  currentTheme = 'light',
}) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'vi'>('vi');

  const handleLogout = () => {
    onLogout();
    navigate('/signin');
  };

  const handleLanguageChange = (lang: 'en' | 'vi') => {
    setLanguage(lang);
    // TODO: Implement language change logic
    console.log(`Language changed to: ${lang}`);
  };

  return (
    <header className="bg-transparent border-b border-border">
      <div className="flex justify-between items-center py-4 px-10">
        {/* Left Section - Navigation */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Yourvocab</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/cards"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Cards
            </Link>
            <Link
              to="/review"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
            >
              Spaced Repetition Review
            </Link>
          </nav>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="h-9 w-9"
            title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
          >
            {currentTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-medium">{language.toUpperCase()}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => handleLanguageChange('en')}
                className="cursor-pointer"
              >
                <span>English (en)</span>
                {language === 'en' && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange('vi')}
                className="cursor-pointer"
              >
                <span>Tiếng Việt (vi)</span>
                {language === 'vi' && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Section */}
          {!isLoggedIn ? (
            // Login Button
            <Link to="/signin">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Login</span>
              </Button>
            </Link>
          ) : (
            // User Dropdown Menu
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar} alt={username} />
                    <AvatarFallback className="text-xs font-semibold">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline text-foreground">
                    {username}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => navigate('/settings')}
                  className="cursor-pointer gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
