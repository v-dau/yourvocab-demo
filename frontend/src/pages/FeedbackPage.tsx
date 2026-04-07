import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { submitFeedback, getUserFeedbacks } from '@/services/feedbackService';
import { toast } from 'sonner';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SendIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';

interface FeedbackData {
  id: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

const FeedbackPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'en' ? enUS : vi;

  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const data = await getUserFeedbacks();
      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error(t('feedbacks.invalid_input'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitFeedback(title, content);
      if (res.success) {
        toast.success(t('feedbacks.success_msg'));
        setTitle('');
        setContent('');
        fetchFeedbacks(); // Refresh list
      }
    } catch (error) {
      console.error(error);
      toast.error(t('feedbacks.error_msg'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t('feedbacks.title')}</h1>
        <p className="text-muted-foreground">{t('feedbacks.subtitle')}</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t('feedbacks.form_title')}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('feedbacks.form_title_placeholder')}
              disabled={isSubmitting}
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('feedbacks.form_content_placeholder')}
              className="min-h-[120px]"
              disabled={isSubmitting}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              <SendIcon className="h-4 w-4 mr-2" />
              {isSubmitting ? t('admin_users.loading') : t('feedbacks.submit_btn')}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* History */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{t('feedbacks.history_title')}</h2>
        {isLoading ? (
          <p className="text-muted-foreground">{t('admin_users.loading')}</p>
        ) : feedbacks.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground border-dashed">
            {t('feedbacks.empty')}
          </Card>
        ) : (
          <div className="grid gap-4">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{feedback.title}</CardTitle>
                      <CardDescription>
                        {format(new Date(feedback.created_at), 'PPpp', { locale: dateLocale })}
                      </CardDescription>
                    </div>
                    {feedback.is_read ? (
                      <Badge
                        variant="secondary"
                        className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      >
                        {t('feedbacks.status_read')}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">{t('feedbacks.status_unread')}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 line-clamp-3 whitespace-pre-wrap">
                    {feedback.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
