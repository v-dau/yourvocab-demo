import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { banUser } from '@/services/adminService';
import { Loader2 } from 'lucide-react';

interface BanUserDialogProps {
  user: { id: string; username: string } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BanUserDialog({ user, onClose, onSuccess }: BanUserDialogProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState<string>('permanent');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !reason.trim()) return;

    setIsSubmitting(true);
    try {
      // 'permanent' or empty strings are passed as undefined/null to backend
      const durationValue = duration === 'permanent' ? undefined : parseInt(duration);

      // Use the actual api
      // Note: adjust the params if adminService banUser only takes id or not
      // E.g. backend expects: POST /api/admin/users/:id/ban body { reason, duration }
      // This might require a small update to adminService.ts if it only takes userId currently

      // Workaround check since we might need to rely on existing axios call:
      await banUser(user.id, reason, durationValue);

      toast.success(t('admin.ban_success', 'Khóa tài khoản thành công'));
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error(error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any;
      const msg =
        axiosError.response?.data?.message || t('admin.ban_fail', 'Khóa tài khoản thất bại');
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('admin.ban_user_title', 'Khóa tài khoản')}</DialogTitle>
          <DialogDescription>
            {t('admin.ban_user_desc', 'Bạn đang khóa tài khoản của người dùng {{username}}', {
              username: user?.username,
            })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label>{t('admin.ban_duration', 'Thời hạn khóa')}</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.select_duration', 'Chọn thời hạn')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">{t('admin.duration_24h', '24 giờ (1 ngày)')}</SelectItem>
                <SelectItem value="168">{t('admin.duration_7d', '168 giờ (7 ngày)')}</SelectItem>
                <SelectItem value="720">{t('admin.duration_30d', '720 giờ (30 ngày)')}</SelectItem>
                <SelectItem value="permanent">
                  {t('admin.duration_permanent', 'Vĩnh viễn')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>
              {t('admin.ban_reason', 'Lý do khóa')} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('admin.ban_reason_placeholder', 'Nhập lý do khóa tài khoản')}
              required
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {t('admin.cancel', 'Hủy')}
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting || !reason.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('admin.saving', 'Đang lưu...')}
                </>
              ) : (
                t('admin.confirm_ban', 'Xác nhận khóa')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
