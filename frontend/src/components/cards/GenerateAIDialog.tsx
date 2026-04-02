import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

interface GenerateAIDialogProps {
  initialWord: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (data: any) => void;
}

export function GenerateAIDialog({ initialWord, onSuccess }: GenerateAIDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState(initialWord || '');
  const [isLoading, setIsLoading] = useState(false);
  const [quota, setQuota] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const response = await api.get('/cards/ai-quota');
        if (response.data?.remaining_quota !== undefined) {
          setQuota(response.data.remaining_quota);
        }
      } catch (error) {
        console.error('Failed to fetch AI quota', error);
      }
    };
    fetchQuota();
  }, []);

  // Update internal state when dialog opens and initialWord changes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setWord(initialWord || '');
    }
  };

  const handleGenerate = async () => {
    if (!word.trim()) {
      toast.error(t('ai_generate.error_empty_word', 'Vui lòng nhập từ vựng.'));
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/cards/generate-ai', { word: word.trim() });

      const { remaining_quota, data } = response.data;
      setQuota(remaining_quota);

      onSuccess(data);
      setOpen(false);
      toast.success(t('ai_generate.toast_success_desc', { quota: remaining_quota }));
    } catch (error) {
      console.error('AI Generate Error:', error);
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMsg =
        axiosError.response?.status === 402 ||
        axiosError.response?.status === 403 ||
        axiosError.response?.status === 429
          ? axiosError.response?.data?.message || t('ai_generate.toast_error_general')
          : t('ai_generate.toast_error_general');
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div className="flex items-center gap-2">
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="gap-2 relative border-0 bg-transparent hover:bg-transparent z-0 overflow-visible"
            title={t('ai_generate.button_tooltip')}
          >
            <div className="absolute inset-[-2px] -z-10 bg-gradient-to-r from-fuchsia-500 via-blue-500 to-cyan-500 rounded-md" />
            <div className="absolute inset-0 -z-10 bg-background rounded-[calc(var(--radius)-1px)]" />

            <svg width="0" height="0" className="absolute">
              <linearGradient id="rainbow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d946ef" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </svg>
            <Sparkles
              className="w-4 h-4"
              style={{ stroke: 'url(#rainbow-grad)', fill: 'url(#rainbow-grad)', fillOpacity: 0.2 }}
            />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-blue-500 to-cyan-500 font-semibold">
              {t('ai_generate.button_tooltip')}
            </span>
          </Button>
        </DialogTrigger>
        {quota !== null && (
          <span
            className="text-sm text-muted-foreground cursor-help hover:text-foreground transition-colors"
            title={t('ai_generate.quota_refresh_tooltip')}
          >
            {quota}/10
          </span>
        )}
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {t('ai_generate.dialog_title')}
          </DialogTitle>
          <DialogDescription className="sr-only">{t('ai_generate.dialog_desc')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">{t('ai_generate.dialog_desc')}</p>
            <Input
              id="ai-word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder={t('ai_generate.input_placeholder')}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading || !word.trim()} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('ai_generate.btn_loading')}
              </>
            ) : (
              t('ai_generate.btn_generate')
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
