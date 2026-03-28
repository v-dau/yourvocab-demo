import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import * as cardService from '@/services/cardService';
import { toast } from 'sonner';
import type { CreateCardInput } from '@/types/card';

const CreateEditCardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    word: '',
    meaning: '',
    partOfSpeech: '',
    definition: '',
    ipa: '',
    example: '',
    level: 'B1',
    popularity: 3,
    synonyms: '',
    antonyms: '',
    nearSynonyms: '',
  });

  useEffect(() => {
    const fetchCard = async () => {
      if (!isEdit || !id) return;
      try {
        setIsLoading(true);
        const card = await cardService.getCardById(id);
        setFormData({
          word: card.word || '',
          meaning: card.meaning || '',
          partOfSpeech: card.partOfSpeech || '',
          definition: card.definition || '',
          ipa: card.ipa || '',
          example: card.example || '',
          level: card.level || 'B1',
          popularity: card.popularity || 3,
          synonyms: card.synonyms || '',
          antonyms: card.antonyms || '',
          nearSynonyms: card.nearSynonyms || '',
        });
      } catch (error) {
        console.error('Failed to fetch card:', error);
        toast.error('Failed to load card details.');
        navigate('/cards');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCard();
  }, [id, isEdit, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'popularity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const cardInput = {
        ...formData,
        level: formData.level as any,
        popularity: formData.popularity as any,
      } as CreateCardInput;

      if (isEdit && id) {
        await cardService.updateCard(id, cardInput);
        toast.success('Card updated successfully');
      } else {
        await cardService.createCard(cardInput);
        toast.success('Card created successfully');
      }
      navigate('/cards');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/cards');
  };

  return (
    <div className="min-h-screen bg-background p-6 bg-gradient-blue">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {isEdit ? 'Chỉnh sửa thẻ từ' : 'Tạo thẻ từ mới'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit
              ? `Chỉnh sửa thẻ từ với ID: ${id}`
              : 'Tạo một thẻ từ vựng mới để bổ sung vào kho của bạn'}
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="word">Từ vựng</Label>
                <Input
                  id="word"
                  name="word"
                  value={formData.word}
                  onChange={handleChange}
                  placeholder="Nhập từ vựng"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipa">Phát âm (IPA)</Label>
                <Input
                  id="ipa"
                  name="ipa"
                  value={formData.ipa}
                  onChange={handleChange}
                  placeholder="Nhập IPA"
                />
              </div>
            </div>

            {/* Meaning & Part of Speech */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meaning">Nghĩa (Tiếng Việt)</Label>
                <Input
                  id="meaning"
                  name="meaning"
                  value={formData.meaning}
                  onChange={handleChange}
                  placeholder="Nhập nghĩa tiếng Việt"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partOfSpeech">Phần từ (Part of Speech)</Label>
                <select
                  id="partOfSpeech"
                  name="partOfSpeech"
                  value={formData.partOfSpeech}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                >
                  <option value="">Chọn phần từ</option>
                  <option value="Noun">Danh từ (Noun)</option>
                  <option value="Verb">Động từ (Verb)</option>
                  <option value="Adjective">Tính từ (Adjective)</option>
                  <option value="Adverb">Trạng từ (Adverb)</option>
                  <option value="Pronoun">Đại từ (Pronoun)</option>
                  <option value="Preposition">Giới từ (Preposition)</option>
                  <option value="Conjunction">Liên từ (Conjunction)</option>
                  <option value="Interjection">Thán từ (Interjection)</option>
                </select>
              </div>
            </div>

            {/* Definition & Example */}
            <div className="space-y-2">
              <Label htmlFor="definition">Định nghĩa (Tiếng Anh)</Label>
              <textarea
                id="definition"
                name="definition"
                value={formData.definition}
                onChange={handleChange}
                placeholder="Nhập định nghĩa tiếng Anh"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="example">Ví dụ</Label>
              <textarea
                id="example"
                name="example"
                value={formData.example}
                onChange={handleChange}
                placeholder="Nhập ví dụ về cách sử dụng từ"
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground min-h-24"
              />
            </div>

            {/* Synonyms & Antonyms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="synonyms">Từ đồng nghĩa</Label>
                <Input
                  id="synonyms"
                  name="synonyms"
                  value={formData.synonyms}
                  onChange={handleChange}
                  placeholder="Nhập các từ đồng nghĩa (cách nhau bằng dấu phẩy)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="antonyms">Từ trái nghĩa</Label>
                <Input
                  id="antonyms"
                  name="antonyms"
                  value={formData.antonyms}
                  onChange={handleChange}
                  placeholder="Nhập các từ trái nghĩa (cách nhau bằng dấu phẩy)"
                />
              </div>
            </div>

            {/* Level & Popularity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Cấp độ</Label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                >
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Mastery</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="popularity">Độ phổ biến (1-5)</Label>
                <select
                  id="popularity"
                  name="popularity"
                  value={formData.popularity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                >
                  <option value="1">1 - Rất hiếm</option>
                  <option value="2">2 - Hiếm</option>
                  <option value="3">3 - Bình thường</option>
                  <option value="4">4 - Phổ biến</option>
                  <option value="5">5 - Rất phổ biến</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : isEdit ? 'Lưu thay đổi' : 'Tạo thẻ'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Hủy
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateEditCardPage;
