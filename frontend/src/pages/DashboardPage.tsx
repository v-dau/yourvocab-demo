import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import {
  Library,
  BookOpen,
  Trophy,
  PenTool,
  Sparkles,
  Tags,
  RotateCw,
  Settings,
} from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import type { DashboardStats } from '@/services/dashboardService';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const stats = await dashboardService.getStats();
        setData(stats);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(t('dashboard.fetch_error', 'Không thể tải dữ liệu thống kê'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [t]);

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Welcome Section */}
        <div>
          <h1 className="text-5xl font-bold text-foreground mb-2">
            {t('dashboard.welcome', 'Xin chào, {{username}}! 👋', {
              username: user?.username || 'Người dùng',
            })}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('dashboard.subtitle', 'Chào mừng bạn quay lại với bảng điều khiển.')}
          </p>
        </div>

        {error && <div className="p-4 bg-red-100/10 text-red-500 rounded-lg">{error}</div>}

        {/* Summary Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-xl"></div>
            ))}
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard.total_cards', 'Tổng số thẻ')}
                </CardTitle>
                <Library className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{data.totalCards}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard.learning_cards', 'Đang ôn tập')}
                </CardTitle>
                <BookOpen className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {data.reviewStats.learning}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard.mastered_cards', 'Đã tinh thông')}
                </CardTitle>
                <Trophy className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {data.reviewStats.completed}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard.practice_sentences', 'Câu luyện tập')}
                </CardTitle>
                <PenTool className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {data.practiceStats.totalSentences}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('dashboard.upon_total_cards', 'trên tổng số {{count}} thẻ', {
                    count: data.practiceStats.totalCardsPracticed,
                  })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard.ai_generations', 'AI Đã tạo')}
                </CardTitle>
                <Sparkles className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{data.aiUsage}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('dashboard.ai_turns', 'lượt')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('dashboard.total_tags', 'Nhãn dán (Tags)')}
                </CardTitle>
                <Tags className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{data.totalTags}</div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Charts */}
        {!isLoading && data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.chart_part_of_speech', 'Thống kê Từ loại')}</CardTitle>
              </CardHeader>
              <CardContent className="h-80 min-h-[320px] w-full">
                {data.cardsByPartOfSpeech.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minHeight={320} minWidth={100}>
                    <BarChart
                      data={data.cardsByPartOfSpeech}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px' }}
                        formatter={(value, _name, props) => [value, props.payload.name]}
                        labelStyle={{ display: 'none' }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-center px-4">
                    {t('dashboard.no_data_yet', 'Chưa có dữ liệu, hãy bắt đầu tạo thẻ từ vựng nào')}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.chart_levels', 'Thống kê Cấp độ CEFR')}</CardTitle>
              </CardHeader>
              <CardContent className="h-80 min-h-[320px] w-full">
                {data.cardsByLevel.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minHeight={320} minWidth={100}>
                    <PieChart>
                      <Pie
                        data={data.cardsByLevel}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${((percent || 0) * 100).toFixed(0)}%`
                        }
                      >
                        {data.cardsByLevel.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-center px-4">
                    {t('dashboard.no_data_yet', 'Chưa có dữ liệu, hãy bắt đầu tạo thẻ từ vựng nào')}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions (Kept entirely intact from old design) */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            {t('dashboard_page.quick_actions', 'Hành động nhanh')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/cards/create')}
              className="h-auto py-4 px-6 flex items-center justify-start gap-4"
            >
              <BookOpen className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">
                  {t('dashboard_page.create_new_card', 'Tạo thẻ mới')}
                </p>
                <p className="text-sm opacity-90">
                  {t('dashboard_page.add_new_vocab', 'Thêm từ vựng mới vào bộ sưu tập')}
                </p>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/cards')}
              variant="outline"
              className="h-auto py-4 px-6 flex items-center justify-start gap-4"
            >
              <span className="text-2xl">📚</span>
              <div className="text-left">
                <p className="font-semibold">{t('dashboard_page.view_list', 'Xem danh sách')}</p>
                <p className="text-sm opacity-90">
                  {t('dashboard_page.manage_all_cards', 'Quản lý tất cả thẻ của bạn')}
                </p>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/review')}
              variant="outline"
              className="h-auto py-4 px-6 flex items-center justify-start gap-4"
            >
              <RotateCw className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">{t('dashboard_page.review_action', 'Ôn tập')}</p>
                <p className="text-sm opacity-90">
                  {t('dashboard_page.review_desc', 'Ôn từ vựng bằng Spaced Repetition')}
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
                <p className="font-semibold">{t('dashboard_page.settings_action', 'Cài đặt')}</p>
                <p className="text-sm opacity-90">
                  {t('dashboard_page.manage_account', 'Quản lý tài khoản')}
                </p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
