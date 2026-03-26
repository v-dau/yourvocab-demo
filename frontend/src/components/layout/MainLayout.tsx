import React, { useState } from 'react';
import { Header } from './Header';

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
 * Wraps page content with Header and other layout elements
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
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        username={username}
        userAvatar={userAvatar}
        onLogout={onLogout}
        onThemeToggle={onThemeToggle}
        currentTheme={currentTheme}
      />
      <main className="flex-1 container mx-auto py-6">{children}</main>
    </div>
  );
}

export default MainLayout;
