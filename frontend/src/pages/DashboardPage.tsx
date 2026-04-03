import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { BookOpen, RotateCw, Settings } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-2">
            Xin chào, {user?.username || 'Người dùng'}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">{t('dashboard_page.subtitle')}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-2">{t('dashboard_page.total_cards')}</p>
                <p className="text-3xl font-bold text-foreground">0</p>
              </div>
              <BookOpen className="h-12 w-12 text-primary opacity-20" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {t('dashboard_page.your_vocab_cards')}
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-2">{t('dashboard_page.needs_review')}</p>
                <p className="text-3xl font-bold text-foreground">0</p>
              </div>
              <RotateCw className="h-12 w-12 text-orange-500 opacity-20" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {t('dashboard_page.due_for_review')}
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-2">{t('dashboard_page.streaks')}</p>
                <p className="text-3xl font-bold text-foreground">0</p>
              </div>
              <span className="text-4xl">🔥</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">{t('dashboard_page.days_streak')}</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            {t('dashboard_page.quick_actions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/cards/create')}
              className="h-auto py-4 px-6 flex items-center justify-start gap-4"
            >
              <BookOpen className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">{t('dashboard_page.create_new_card')}</p>
                <p className="text-sm opacity-90">{t('dashboard_page.add_new_vocab')}</p>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/cards')}
              variant="outline"
              className="h-auto py-4 px-6 flex items-center justify-start gap-4"
            >
              <span className="text-2xl">📚</span>
              <div className="text-left">
                <p className="font-semibold">{t('dashboard_page.view_list')}</p>
                <p className="text-sm opacity-90">{t('dashboard_page.manage_all_cards')}</p>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/review')}
              variant="outline"
              className="h-auto py-4 px-6 flex items-center justify-start gap-4"
            >
              <RotateCw className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">{t('dashboard_page.review_action')}</p>
                <p className="text-sm opacity-90">
                  {t('dashboard_page.review_action')} từ vựng bằng Spaced Repetition
                </p>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/profile-settings')}
              variant="outline"
              className="h-auto py-4 px-6 flex items-center justify-start gap-4"
            >
              <Settings className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">{t('dashboard_page.settings_action')}</p>
                <p className="text-sm opacity-90">{t('dashboard_page.manage_account')}</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            {t('dashboard_page.recent_activity')}
          </h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{t('dashboard_page.no_recent_activity')}</p>
            <Button onClick={() => navigate('/cards/create')}>
              {t('dashboard_page.create_first_card')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
