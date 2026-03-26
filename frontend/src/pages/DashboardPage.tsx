import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { BookOpen, RotateCw, Settings, LogOut } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-background p-6 bg-gradient-blue">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-2">
            Xin chào, {user?.username || 'Người dùng'}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Bắt đầu hành trình học các từ vựng mới hôm nay
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-2">Tổng thẻ</p>
                <p className="text-3xl font-bold text-foreground">0</p>
              </div>
              <BookOpen className="h-12 w-12 text-primary opacity-20" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">Thẻ từ vựng của bạn</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-2">Cần ôn tập</p>
                <p className="text-3xl font-bold text-foreground">0</p>
              </div>
              <RotateCw className="h-12 w-12 text-orange-500 opacity-20" />
            </div>
            <p className="text-sm text-muted-foreground mt-4">Từ sắp đến hạn ôn tập</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-2">Streaks</p>
                <p className="text-3xl font-bold text-foreground">0</p>
              </div>
              <span className="text-4xl">🔥</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">Ngày liên tiếp học tập</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Hành động nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/cards/create')}
              className="h-auto py-4 px-6 flex items-center justify-start gap-4"
            >
              <BookOpen className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">Tạo thẻ mới</p>
                <p className="text-sm opacity-90">Thêm từ vựng mới vào kho của bạn</p>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/cards')}
              variant="outline"
              className="h-auto py-4 px-6 flex items-center justify-start gap-4"
            >
              <span className="text-2xl">📚</span>
              <div className="text-left">
                <p className="font-semibold">Xem danh sách</p>
                <p className="text-sm opacity-90">Quản lý tất cả thẻ từ vựng</p>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/review')}
              variant="outline"
              className="h-auto py-4 px-6 flex items-center justify-start gap-4"
            >
              <RotateCw className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">Ôn tập</p>
                <p className="text-sm opacity-90">Ôn tập từ vựng bằng Spaced Repetition</p>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/settings')}
              variant="outline"
              className="h-auto py-4 px-6 flex items-center justify-start gap-4"
            >
              <Settings className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">Cài đặt</p>
                <p className="text-sm opacity-90">Quản lý tài khoản và tùy chọn</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Hoạt động gần đây</h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Chưa có hoạt động nào gần đây</p>
            <Button onClick={() => navigate('/cards/create')}>Tạo thẻ đầu tiên</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
