import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/authStore';

const SettingsPage = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update settings
    console.log('Settings updated:', formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 bg-gradient-blue">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Cài đặt</h1>
          <p className="text-muted-foreground">Quản lý tài khoản và cài đặt cá nhân của bạn</p>
        </div>

        {/* Profile Settings */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Thông tin cá nhân</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Tên người dùng</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Nhập tên người dùng"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Nhập email"
              />
            </div>

            <div className="flex gap-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
              ) : (
                <>
                  <Button type="submit">Lưu thay đổi</Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Hủy
                  </Button>
                </>
              )}
            </div>
          </form>
        </Card>

        {/* Password Settings */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Bảo mật</h2>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Xác nhận mật khẩu mới"
              />
            </div>

            <Button type="submit">Cập nhật mật khẩu</Button>
          </form>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Tùy chọn</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Thông báo email</p>
                <p className="text-sm text-muted-foreground">Nhận thông báo về các bài học mới</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Chế độ tối</p>
                <p className="text-sm text-muted-foreground">Sử dụng chế độ tối mặc định</p>
              </div>
              <input type="checkbox" className="w-4 h-4" />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dữ liệu công khai</p>
                <p className="text-sm text-muted-foreground">Cho phép chia sẻ thống kê học tập</p>
              </div>
              <input type="checkbox" className="w-4 h-4" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
