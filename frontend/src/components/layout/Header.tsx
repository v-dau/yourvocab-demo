import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { User, LogOut, Settings, BookOpen } from 'lucide-react';
import { MobileSidebar } from './MobileSidebar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
  userAvatar?: string;
  onLogout?: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: (collapsed: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn = false,
  username = 'User',
  userAvatar = '',
  onLogout = () => {},
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const handleLogout = () => {
    onLogout();
    navigate('/signin');
  };

  // Check if current path matches nav item
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="relative bg-transparent">
      <div className="flex justify-between items-center py-4 px-6 md:px-10">
        {/* Left Section - Mobile Sidebar Trigger + Logo */}
        <div className="flex items-center gap-3 md:gap-6 flex-1 md:flex-none">
          {/* Mobile Sidebar Trigger */}
          <MobileSidebar
            isLoggedIn={isLoggedIn}
            username={username}
            userAvatar={userAvatar}
            onLogout={onLogout}
          />

          {/* Header toggle removed per request - sidebar controls toggle now */}

          {/* Logo - visible on desktop */}
          <Link
            to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
            className="hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity ml-16"
          >
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">Yourvocab</span>
          </Link>
        </div>

        {/* Navigation Links (Desktop Only) */}
        <nav className="hidden md:flex items-center gap-8">
          {user?.role === 'admin' ? (
            <>
              <Link
                to="/admin/dashboard"
                className={cn(
                  'transition-colors text-sm font-medium',
                  isActive('/admin/dashboard')
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t('sidebar.dashboard', { defaultValue: 'Tổng quan' })}
              </Link>
              <Link
                to="/admin/users"
                className={cn(
                  'transition-colors text-sm font-medium',
                  isActive('/admin/users')
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t('admin.users_management', { defaultValue: 'Quản lý người dùng' })}
              </Link>
              <Link
                to="/admin/feedbacks"
                className={cn(
                  'transition-colors text-sm font-medium',
                  isActive('/admin/feedbacks')
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t('admin.manage_feedbacks', { defaultValue: 'Danh sách phản hồi' })}
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={cn(
                  'transition-colors text-sm font-medium',
                  isActive('/dashboard')
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t('sidebar.dashboard')}
              </Link>
              <Link
                to="/cards"
                className={cn(
                  'transition-colors text-sm font-medium',
                  isActive('/cards')
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t('sidebar.cards')}
              </Link>
              <Link
                to="/review"
                className={cn(
                  'transition-colors text-sm font-medium',
                  isActive('/review')
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t('sidebar.review')}
              </Link>
            </>
          )}
        </nav>

        {/* Right Section - User */}
        <div className="flex items-center gap-4">
          {/* User Section */}
          {!isLoggedIn ? (
            // Login Button
            <Link to="/signin">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">Login</span>
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
                  onClick={() => navigate('/profile-settings')}
                  className="cursor-pointer gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>{t('header.settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('header.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
