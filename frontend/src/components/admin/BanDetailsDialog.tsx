import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getBanInfo, unbanUser } from '@/services/adminService';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface BanData {
  id: number;
  duration: number | null;
  status: number;
  reason: string;
  user_id: string;
  created_at: string;
  modified_at: string;
}

interface BanDetailsDialogProps {
  user: { id: string; username: string } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function BanDetailsDialog({ user, onClose, onSuccess }: BanDetailsDialogProps) {
  const { t } = useTranslation();
  const [banData, setBanData] = useState<BanData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnbanning, setIsUnbanning] = useState(false);
  const [showConfirmUnban, setShowConfirmUnban] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      setShowConfirmUnban(false);
      getBanInfo(user.id)
        .then((res) => {
          if (res.success) {
            setBanData(res.data);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(t('admin.fetch_ban_error', 'Không thể lấy thông tin ban'));
        })
        .finally(() => setIsLoading(false));
    }
  }, [user, t]);

  const handleUnban = async () => {
    if (!user) return;
    if (!showConfirmUnban) {
      setShowConfirmUnban(true);
      return;
    }

    setIsUnbanning(true);
    try {
      await unbanUser(user.id);
      toast.success(t('admin.unban_success', 'Ä£ má»Ÿ khÃ³a tÃi khoáº£n'));
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error(error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any;
      const msg = axiosError.response?.data?.message || t('admin.unban_fail', 'Mở khóa thất bại');
      toast.error(msg);
    } finally {
      setIsUnbanning(false);
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive font-bold">
            {t('admin.ban_details_title', 'Chi tiết lệnh khóa')}
          </DialogTitle>
          <DialogDescription>
            {t('admin.ban_details_desc', 'Thông tin khóa của người dùng {{username}}', {
              username: user?.username,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4 min-h-[150px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !banData ? (
            <div className="text-center text-muted-foreground py-8">
              {t('admin.no_active_ban', 'Không tìm thấy lệnh khóa hợp lệ')}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="bg-muted/30 p-4 rounded-md border flex flex-col gap-3">
                <p>
                  <span className="font-semibold text-muted-foreground min-w-[120px] inline-block">
                    {t('admin.ban_start', 'Ngày bắt đầu:')}
                  </span>
                  <span className="font-medium">
                    {banData.created_at
                      ? format(new Date(banData.created_at), 'dd/MM/yyyy HH:mm')
                      : ''}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-muted-foreground min-w-[120px] inline-block">
                    {t('admin.ban_duration', 'Thời hạn:')}
                  </span>
                  <span className="font-medium text-destructive">
                    {banData.duration
                      ? t('admin.hours_template', '{{hours}} giờ', { hours: banData.duration })
                      : t('admin.duration_permanent', 'Vĩnh viễn')}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-muted-foreground min-w-[120px] inline-block align-top">
                    {t('admin.ban_reason', 'Lý do:')}
                  </span>
                  <span className="inline-block flex-1">{banData.reason}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-2 items-center">
          {showConfirmUnban && (
            <span className="text-sm text-destructive font-medium mr-auto animate-in fade-in zoom-in duration-200">
              {t('admin.confirm_unban_sure', 'Báº¡n cháº¯c cháº¯n má»Ÿ khÃ³a khÃ´ng?')}
            </span>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (showConfirmUnban) setShowConfirmUnban(false);
              else onClose();
            }}
            disabled={isUnbanning}
          >
            {t('admin.close', 'Ä³ng')}
          </Button>
          <Button
            type="button"
            variant={showConfirmUnban ? 'destructive' : 'default'}
            onClick={handleUnban}
            disabled={isUnbanning || isLoading || !banData}
          >
            {isUnbanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {showConfirmUnban
              ? t('admin.confirm', 'XÃ¡c nháºn')
              : t('admin.unban_btn', 'Má»Ÿ khÃ³a tÃ i khoáº£n')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
