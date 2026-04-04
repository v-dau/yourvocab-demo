import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BookOpen,
  LogOut,
  Settings,
  LayoutDashboard,
  FileText,
  RotateCw,
  ChevronLeft,
  Sun,
  Moon,
  Globe,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import * as cardService from '@/services/cardService';
import { useReviewStore } from '@/stores/reviewStore';
import React from 'react';

interface DesktopSidebarProps {
  isLoggedIn?: boolean;
  username?: string;
  userAvatar?: string;
  onLogout?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  onThemeToggle?: () => void;
  currentTheme?: 'light' | 'dark';
  currentLanguage?: 'en' | 'vi';
  onLanguageChange?: (lang: 'en' | 'vi') => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  isLoggedIn = false,
  username = 'User',
  userAvatar = '',
  onLogout = () => {},
  isCollapsed = false,
  onToggleCollapse = () => {},
  onThemeToggle = () => {},
  currentTheme = 'light',
  currentLanguage = 'vi',
  onLanguageChange = () => {},
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/signin');
  };

  const [trashCount, setTrashCount] = useState(0);
  const location = useLocation();
  const { totalDue, fetchTotalDue } = useReviewStore();

  const fetchTrashCount = React.useCallback(() => {
    if (isLoggedIn) {
      cardService
        .getTrashCards()
        .then((cards) => setTrashCount(cards.length))
        .catch((err) => console.error(err));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchTrashCount();
    if (isLoggedIn) {
      fetchTotalDue();
    }

    // Listen for custom event to update trash count immediately
    const handleTrashUpdate = () => fetchTrashCount();
    window.addEventListener('trash-updated', handleTrashUpdate);

    // Listen for review updates (e.g. creating/restoring cards)
    const handleReviewUpdate = () => fetchTotalDue();
    window.addEventListener('review-updated', handleReviewUpdate);

    return () => {
      window.removeEventListener('trash-updated', handleTrashUpdate);
      window.removeEventListener('review-updated', handleReviewUpdate);
    };
  }, [isLoggedIn, location.pathname, fetchTotalDue, fetchTrashCount]); // Re-fetch when route changes as well

  const navItems = [
    { icon: LayoutDashboard, label: t('sidebar.dashboard'), path: '/dashboard' },
    { icon: FileText, label: t('sidebar.cards'), path: '/cards' },
    {
      icon: RotateCw,
      label: t('sidebar.review'),
      path: '/review',
      badge: totalDue > 0 ? totalDue : null,
    },
    {
      icon: Trash2,
      label: t('sidebar.trash'),
      path: '/trash',
      badge: trashCount > 0 ? trashCount : null,
    },
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ease-in-out fixed left-0 top-0',
        isCollapsed ? 'z-40 w-20' : 'z-50 w-64'
      )}
    >
      {/* Header Section - Logo & Toggle */}
      <div className="flex items-center justify-between p-4">
        {isCollapsed ? (
          <div className="w-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleCollapse?.(!isCollapsed)}
              className="h-10 w-10"
              title="Expand sidebar"
            >
              <ChevronLeft
                className={cn('h-6 w-6 transition-transform', isCollapsed && 'rotate-180')}
              />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleCollapse?.(!isCollapsed)}
              className="h-10 w-10"
              title="Collapse sidebar"
            >
              <ChevronLeft
                className={cn('h-6 w-6 transition-transform', isCollapsed && 'rotate-180')}
              />
            </Button>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <BookOpen className="h-6 w-6 text-primary shrink-0" />
              <span className="text-lg font-bold text-foreground">Yourvocab</span>
            </Link>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative',
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="relative">
                <Icon className="h-5 w-5 shrink-0" />
                {isCollapsed && item.badge !== undefined && item.badge !== null && (
                  <span
                    className={cn(
                      'absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                      item.path === '/trash'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200'
                        : 'bg-primary text-background'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              {!isCollapsed && item.badge !== undefined && item.badge !== null && (
                <span
                  className={cn(
                    'ml-auto text-xs font-semibold px-2 py-0.5 rounded-full',
                    item.path === '/trash'
                      ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200'
                      : 'bg-primary/10 text-primary'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme & Language Section */}
      <div className="p-3 flex flex-col gap-2 border-t border-b border-gray-400 dark:border-border">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onThemeToggle}
          className={cn('justify-start gap-3 h-9', isCollapsed && 'justify-center')}
          title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
        >
          {currentTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          {!isCollapsed && <span className="text-xs font-medium">{t('sidebar.theme')}</span>}
        </Button>

        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn('justify-start gap-3 h-9', isCollapsed && 'justify-center')}
            >
              <Globe className="h-4 w-4" />
              {!isCollapsed && (
                <span className="text-xs font-medium">{currentLanguage.toUpperCase()}</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={() => onLanguageChange('en')} className="cursor-pointer">
              <span>{t('sidebar.english')}</span>
              {currentLanguage === 'en' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLanguageChange('vi')} className="cursor-pointer">
              <span>{t('sidebar.vietnamese')}</span>
              {currentLanguage === 'vi' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* User Section */}
      <div className="p-4 flex flex-col gap-3">
        {!isLoggedIn ? (
          <Link to="/signin" className="w-full">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <span className="text-xs font-medium">Login</span>
            </Button>
          </Link>
        ) : (
          <>
            {/* User Info */}
            {!isCollapsed && (
              <div className="flex items-center gap-3 p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={userAvatar} alt={username} />
                  <AvatarFallback className="text-xs font-semibold">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{username}</p>
                  <p className="text-xs text-muted-foreground">Logged In</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="flex justify-center">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userAvatar} alt={username} />
                  <AvatarFallback className="text-xs font-semibold">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Settings & Logout Buttons */}
            <Button
              variant="outline"
              className={cn(
                'gap-2 justify-start font-medium transition-all duration-200',
                'hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-700',
                'h-11'
              )}
              onClick={() => navigate('/profile-settings')}
              title={isCollapsed ? t('header.settings') : undefined}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{t('header.settings')}</span>}
            </Button>

            <Button
              variant="destructive"
              className={cn('gap-2 justify-start font-medium transition-all duration-200', 'h-11')}
              onClick={handleLogout}
              title={isCollapsed ? t('header.logout') : undefined}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{t('header.logout')}</span>}
            </Button>
          </>
        )}
      </div>
    </aside>
  );
};
