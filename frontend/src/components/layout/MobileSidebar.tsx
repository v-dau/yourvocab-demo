import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, BookOpen, LogOut, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import * as cardService from '@/services/cardService';

interface MobileSidebarProps {
  isLoggedIn?: boolean;
  username?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isLoggedIn = false,
  username = 'User',
  userAvatar = '',
  onLogout = () => {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [trashCount, setTrashCount] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      cardService
        .getTrashCards()
        .then((cards) => {
          setTrashCount(cards.length);
        })
        .catch((err) => console.error(err));
    }
  }, [isLoggedIn, location.pathname]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/signin');
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex md:hidden items-center gap-3 hover:opacity-80 transition-opacity">
          <Menu className="h-5 w-5" />
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">Yourvocab</span>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col gap-8 h-full overflow-y-auto pt-10 p-0 w-full max-w-sm"
      >
        {/* Header */}
        <SheetHeader className="px-6 mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Yourvocab</span>
          </div>
        </SheetHeader>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-4 px-6">
          <button
            onClick={() => handleNavigate('/dashboard')}
            className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavigate('/cards')}
            className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
          >
            Cards
          </button>
          <button
            onClick={() => handleNavigate('/review')}
            className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
          >
            Spaced Repetition
          </button>
          <button
            onClick={() => handleNavigate('/trash')}
            className="flex items-center justify-between text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
          >
            <div className="flex items-center gap-2">
              <span>Thùng rác</span>
            </div>
            {trashCount > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {trashCount}
              </span>
            )}
          </button>
        </nav>

        {/* Divider */}
        <Separator className="mx-6" />

        {/* User Section */}
        <div className="px-6 flex-1">
          {!isLoggedIn ? (
            <Link to="/signin" onClick={() => setOpen(false)}>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <span className="text-sm font-medium">Login</span>
              </Button>
            </Link>
          ) : (
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userAvatar} alt={username} />
                  <AvatarFallback className="text-xs font-semibold">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{username}</p>
                  <p className="text-xs text-muted-foreground">Logged In</p>
                </div>
              </div>

              {/* Settings Button */}
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 justify-start font-medium h-11"
                onClick={() => handleNavigate('/profile-settings')}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Button>

              {/* Logout Button */}
              <Button
                variant="destructive"
                size="lg"
                className="w-full gap-2 justify-start font-medium h-11"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
