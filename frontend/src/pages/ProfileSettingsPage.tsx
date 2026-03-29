/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/axios';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { t } from 'i18next';

const ProfileSettingsPage = () => {
  const navigate = useNavigate();
  const { user, setUser, signOut } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Email Dialog State
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Password Dialog State
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Handlers
  const handleLogout = async () => {
    await signOut();
    navigate('/signin');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setIsUploadingAvatar(true);
    try {
      const res = await api.patch('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser({ ...user!, avatar_url: res.data.avatar_url });
      toast.success('Cập nhật ảnh đại diện thành công');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đổi ảnh');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error('Email không đúng định dạng');
      return;
    }

    setIsUpdatingEmail(true);
    try {
      const res = await api.patch('/users/me/email', { newEmail });
      setUser({ ...user!, email: res.data.user.email });
      toast.success('Cập nhật email thành công');
      setIsEmailDialogOpen(false);
      setNewEmail('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('profile_settings.error_change_email'));
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword.trim() || !newPassword.trim()) {
      toast.error(t('profile_settings.error_empty_fields'));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(`${t('profile_settings.new_password')} must be at least 8 characters`);
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await api.patch('/users/me/password', { oldPassword, newPassword });
      toast.success(`${t('profile_settings.sidebar_change_password')} (Success)`);
      setIsPasswordDialogOpen(false);
      setOldPassword('');
      setNewPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('profile_settings.error_change_password'));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">
        {t('profile_settings.title_main')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              {t('profile_settings.actions')}
            </h2>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/feedbacks')}
              >
                {t('profile_settings.submit_feedback')}
              </Button>
              <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                {t('profile_settings.logout')}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              {t('profile_settings.sync_settings')}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">{t('profile_settings.sync_desc')}</p>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              {t('profile_settings.personal_profile')}
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar_url || ''} alt={user?.username} />
                <AvatarFallback className="text-2xl">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <Button onClick={() => fileInputRef.current?.click()} disabled={isUploadingAvatar}>
                  {isUploadingAvatar
                    ? t('profile_settings.uploading')
                    : t('profile_settings.change_avatar')}
                </Button>
                <p className="text-xs text-muted-foreground">{t('profile_settings.avatar_hint')}</p>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <Separator className="mb-6" />

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="username">{t('profile_settings.username')}</Label>
                <Input id="username" value={user?.username || ''} disabled readOnly />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              {t('profile_settings.account_security')}
            </h2>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                <div className="grid gap-2 flex-1 w-full">
                  <Label htmlFor="email">{t('profile_settings.email')}</Label>
                  <Input id="email" value={user?.email || ''} disabled readOnly />
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setIsEmailDialogOpen(true)}
                  className="w-full sm:w-auto"
                >
                  {t('profile_settings.change_email')}
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    {t('profile_settings.sidebar_change_password')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('profile_settings.sidebar_change_password')}{' '}
                    {t('profile_settings.security_desc_suffix')}
                  </p>
                </div>
                <Button variant="secondary" onClick={() => setIsPasswordDialogOpen(true)}>
                  {t('profile_settings.sidebar_change_password')}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* DIALOGS */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile_settings.update_email_title')}</DialogTitle>
            <DialogDescription>{t('profile_settings.update_email_desc')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-email">{t('profile_settings.new_email')}</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="example@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEmailDialogOpen(false)}>
              {t('profile_settings.cancel')}
            </Button>
            <Button onClick={handleUpdateEmail} disabled={isUpdatingEmail}>
              {isUpdatingEmail ? t('profile_settings.saving') : t('profile_settings.save_changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile_settings.change_password_dialog_title')}</DialogTitle>
            <DialogDescription>
              {t('profile_settings.change_password_dialog_desc')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="old-pw">{t('profile_settings.old_password')}</Label>
              <Input
                id="old-pw"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-pw">{t('profile_settings.new_password')}</Label>
              <Input
                id="new-pw"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsPasswordDialogOpen(false)}>
              {t('profile_settings.cancel')}
            </Button>
            <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword}>
              {isUpdatingPassword
                ? t('profile_settings.saving')
                : t('profile_settings.save_changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettingsPage;
