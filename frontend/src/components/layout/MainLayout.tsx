import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { DesktopSidebar } from './DesktopSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
  username?: string;
  userAvatar?: string;
  onLogout?: () => void;
  onThemeToggle?: () => void;
  currentTheme?: 'light' | 'dark';
}

/**
 * MainLayout Component
 * Wraps page content with Header, Desktop Sidebar, and other layout elements
 */
export function MainLayout({
  children,
  isLoggedIn = false,
  username = 'User',
  userAvatar,
  onLogout,
  onThemeToggle,
  currentTheme = 'light',
}: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <Header
        isLoggedIn={isLoggedIn}
        username={username}
        userAvatar={userAvatar}
        onLogout={onLogout}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={setSidebarCollapsed}
      />

      {/* Desktop Sidebar */}
      <DesktopSidebar
        isLoggedIn={isLoggedIn}
        username={username}
        userAvatar={userAvatar}
        onLogout={onLogout}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
        onThemeToggle={onThemeToggle}
        currentTheme={currentTheme}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <main className="container mx-auto py-0">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
