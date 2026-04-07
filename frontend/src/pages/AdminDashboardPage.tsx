import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Database, CheckCircle, PenTool, Tags, Sparkles } from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface AdminStats {
  users: {
    total: number;
    new: number;
  };
  cards: {
    total: number;
    completed: number;
  };
  engagement: {
    totalSentences: number;
    totalTags: number;
    totalAiUsage: number;
  };
}

const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // GET data via axios. axios wraps response body in res.data
        const response = await axiosInstance.get('/admin/stats');

        // According to context: { data: { users: {...}, ... } }
        // -> So actual stats object is response.data.data
        const result = response.data.data || response.data;
        setStats(result);
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
        setError(t('admin_dashboard.fetch_error', 'Có lỗi xảy ra khi tải số liệu hệ thống'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [t]);

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('admin_dashboard.title', 'Tổng quan Hệ thống')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('admin_dashboard.description', 'Số liệu thống kê toàn bộ hoạt động của ứng dụng')}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-100/10 text-red-500 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-xl"></div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Users Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('admin_dashboard.users_total', 'Người dùng')}
                </CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.users.total}</div>
                <p className="text-xs mt-2 text-green-500">
                  {t('admin_dashboard.users_new', '+{{count}} người dùng mới trong 3 ngày qua', {
                    count: stats.users.new,
                  })}
                </p>
              </CardContent>
            </Card>

            {/* Total Cards Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('admin_dashboard.cards_total', 'Tổng số thẻ')}
                </CardTitle>
                <Database className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.cards.total}</div>
              </CardContent>
            </Card>

            {/* Completed Cards Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('admin_dashboard.cards_completed', 'Thẻ đã hoàn thành')}
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.cards.completed}</div>
              </CardContent>
            </Card>

            {/* Practice Sentences Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('admin_dashboard.engagement_sentences', 'Câu luyện tập')}
                </CardTitle>
                <PenTool className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {stats.engagement.totalSentences}
                </div>
              </CardContent>
            </Card>

            {/* Tags Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('admin_dashboard.engagement_tags', 'Nhãn (Tags)')}
                </CardTitle>
                <Tags className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {stats.engagement.totalTags}
                </div>
              </CardContent>
            </Card>

            {/* AI Usage Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('admin_dashboard.engagement_ai', 'Lượt dùng AI')}
                </CardTitle>
                <Sparkles className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {stats.engagement.totalAiUsage}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
