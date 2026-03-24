import Logout from '@/components/auth/Logout';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

const DashboardPage = () => {
  const user = useAuthStore((s) => s.user);

  const handleOnClick = async () => {
    try {
      await api.get('/users/test', { withCredentials: true });
      toast.success('ok');
    } catch (error) {
      console.error(error);
      toast.error('that bai');
    }
  };

  return (
    <div>
      {user?.username}
      <Logout></Logout>

      <Button onClick={handleOnClick}></Button>
    </div>
  );
};

export default DashboardPage;
