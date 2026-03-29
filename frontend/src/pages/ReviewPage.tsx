import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const ReviewPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background p-6 bg-gradient-blue">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t('review_page.title')}</h1>
          <p className="text-muted-foreground">
            {t('review_page.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-primary mb-2">0</div>
            <p className="text-muted-foreground mb-4">{t('review_page.words_to_review')}</p>
            <Button onClick={() => navigate('/cards')} variant="outline" className="w-full">
              {t('review_page.view_list')}
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-primary mb-2">0</div>
            <p className="text-muted-foreground mb-4">{t('review_page.words_learned')}</p>
            <Button disabled variant="outline" className="w-full">
              {t('review_page.no_stats')}
            </Button>
          </Card>
        </div>

        <Card className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Tinh năng ôn tập khoảng cách sẽ sớm có. Vui lòng quay lại sau!
            </p>
            <Button onClick={() => navigate('/cards')}>{t('review_page.back_to_cards')}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReviewPage;
