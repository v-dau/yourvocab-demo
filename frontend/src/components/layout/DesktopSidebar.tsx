import React, { useState } from 'react';
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
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface DesktopSidebarProps {
  isLoggedIn?: boolean;
  username?: string;
  userAvatar?: string;
  onLogout?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  onThemeToggle?: () => void;
  currentTheme?: 'light' | 'dark';
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
}) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'vi'>('vi');

  const handleLanguageChange = (lang: 'en' | 'vi') => {
    setLanguage(lang);
    console.log(`Language changed to: ${lang}`);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/signin');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Cards', path: '/cards' },
    { icon: RotateCw, label: 'Review', path: '/review' },
  ];

  const location = useLocation();

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
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Theme & Language Section */}
      <div className="p-3 flex flex-col gap-2 border-t border-border">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onThemeToggle}
          className={cn('justify-start gap-3 h-9', isCollapsed && 'justify-center')}
          title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
        >
          {currentTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          {!isCollapsed && <span className="text-xs font-medium">Theme</span>}
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
                <span className="text-xs font-medium">{language.toUpperCase()}</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="cursor-pointer">
              <span>English</span>
              {language === 'en' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange('vi')} className="cursor-pointer">
              <span>Tiếng Việt</span>
              {language === 'vi' && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Divider */}
      <Separator className="mx-2" />

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
              onClick={() => navigate('/settings')}
              title={isCollapsed ? 'Settings' : undefined}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Settings</span>}
            </Button>

            <Button
              variant="destructive"
              className={cn('gap-2 justify-start font-medium transition-all duration-200', 'h-11')}
              onClick={handleLogout}
              title={isCollapsed ? 'Logout' : undefined}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          </>
        )}
      </div>
    </aside>
  );
};
