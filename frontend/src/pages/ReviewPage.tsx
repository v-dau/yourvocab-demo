import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router';

const ReviewPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6 bg-gradient-blue">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Ôn tập khoảng cách</h1>
          <p className="text-muted-foreground">
            Sử dụng phương pháp Spaced Repetition để ôn tập từ vựng một cách hiệu quả
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-primary mb-2">0</div>
            <p className="text-muted-foreground mb-4">Từ cần ôn tập hôm nay</p>
            <Button onClick={() => navigate('/cards')} variant="outline" className="w-full">
              Xem danh sách
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-primary mb-2">0</div>
            <p className="text-muted-foreground mb-4">Từ đã học</p>
            <Button disabled variant="outline" className="w-full">
              Chưa có thống kê
            </Button>
          </Card>
        </div>

        <Card className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Tinh năng ôn tập khoảng cách sẽ sớm có. Vui lòng quay lại sau!
            </p>
            <Button onClick={() => navigate('/cards')}>Quay lại danh sách thẻ</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReviewPage;
