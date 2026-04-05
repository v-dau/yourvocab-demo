import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card as CardComponent } from '@/components/cards/Card';
import { useReviewStore } from '@/stores/reviewStore';
import { Smile } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import type { Card as CardType } from '@/types/card';
import { CardDetailsModal } from '@/components/cards/CardDetailsModal';

const ReviewPage = () => {
  const { t } = useTranslation();
  const { setTotalDue, decrementTotalDue } = useReviewStore();

  const [cardsGrouped, setCardsGrouped] = useState<Record<number, CardType[]>>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const fetchDueReviews = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/reviews/due');
      if (res.data.success) {
        setCardsGrouped(res.data.data);
        setTotalDue(res.data.total);
      }
    } catch (error) {
      console.error('Failed to fetch due reviews:', error);
      toast.error(t('review_page.toast_error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDueReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinishReview = async (cardId: string, currentStep: number) => {
    try {
      const res = await api.post(`/reviews/${cardId}/finish`);
      if (res.data.success) {
        toast.success(t('review_page.toast_success'));

        setCardsGrouped((prev) => {
          const newGroup = { ...prev };
          if (newGroup[currentStep]) {
            newGroup[currentStep] = newGroup[currentStep].filter((c) => c.id !== cardId);
          }
          return newGroup;
        });

        decrementTotalDue();
      }
    } catch (error) {
      console.error('Failed to finish review:', error);
      toast.error(t('review_page.toast_error'));
    }
  };

  const tabsInfo = [
    { index: 0, label: t('review_page.tabs.today') },
    { index: 1, label: t('review_page.tabs.day_1') },
    { index: 2, label: t('review_page.tabs.day_3') },
    { index: 3, label: t('review_page.tabs.day_7') },
    { index: 4, label: t('review_page.tabs.day_14') },
    { index: 5, label: t('review_page.tabs.day_30') },
  ];

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t('review_page.title')}</h1>
          <p className="text-muted-foreground">{t('review_page.subtitle')}</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="flex w-full overflow-x-auto h-auto p-1.5 mb-8 gap-2 bg-background/80 backdrop-blur border shadow-sm rounded-xl justify-start lg:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {tabsInfo.map((tab) => {
                const count = cardsGrouped[tab.index]?.length || 0;
                return (
                  <TabsTrigger
                    key={tab.index}
                    value={tab.index.toString()}
                    className="py-2 px-4 whitespace-nowrap min-w-fit data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-colors rounded-lg"
                  >
                    {tab.label}
                    {count > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        {count}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {tabsInfo.map((tab) => {
              const cards = cardsGrouped[tab.index] || [];

              return (
                <TabsContent key={tab.index} value={tab.index.toString()}>
                  {cards.length === 0 ? (
                    <Card className="p-12 border-dashed flex flex-col items-center justify-center text-center">
                      <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <Smile className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">
                        {t('review_page.empty_title')}
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        {t('review_page.empty_desc')}
                      </p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:gap-6">
                      {cards.map((card) => (
                        <CardComponent
                          key={card.id}
                          card={card}
                          showActions={true}
                          isReviewMode={true}
                          stepIndex={tab.index}
                          onFinishReview={(id) => handleFinishReview(id, tab.index)}
                          onView={(c) => setSelectedCard(c)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>

      {selectedCard && (
        <CardDetailsModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
};

export default ReviewPage;
