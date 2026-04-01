import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { TagCreatableSelect } from '@/components/ui/TagCreatableSelect';
import type { TagOption } from '@/components/ui/TagCreatableSelect';
import { GenerateAIDialog } from '@/components/cards/GenerateAIDialog';
import * as cardService from '@/services/cardService';
import * as tagService from '@/services/tagService';
import { toast } from 'sonner';
import type { CreateCardInput } from '@/types/card';

// Zod schema for card validation
const cardSchema = z.object({
  word: z.string().min(1, 'Word is required'),
  meaning: z.string().min(1, 'Meaning is required'),
  partOfSpeech: z.string().optional(),
  definition: z.string().optional(),
  ipa: z.string().optional(),
  example: z.string().optional(),
  level: z.string().optional(),
  popularity: z.coerce.number().min(0).max(5).optional(),
  synonyms: z.string().optional(),
  antonyms: z.string().optional(),
  nearSynonyms: z.string().optional(),
  tags: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        __isNew__: z.boolean().optional(),
      })
    )
    .optional(),
});

type CardFormValues = z.infer<typeof cardSchema>;

const CreateEditCardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isEdit = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      word: '',
      meaning: '',
      partOfSpeech: '',
      definition: '',
      ipa: '',
      example: '',
      level: '',
      popularity: 0,
      synonyms: '',
      antonyms: '',
      nearSynonyms: '',
      tags: [],
    },
  });

  // Fetch tags for dropdown
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await tagService.getUserTags();
        const formattedOptions = tags.map((tag) => ({
          value: tag.id,
          label: tag.tagName, // Backend returns property as tagName
        }));
        setTagOptions(formattedOptions);
      } catch (error) {
        console.error('Failed to fetch tags', error);
      }
    };
    fetchTags();
  }, []);

  // Fetch existing card data if Edit mode
  useEffect(() => {
    const fetchCard = async () => {
      if (!isEdit || !id) return;
      try {
        setIsLoading(true);
        const card = await cardService.getCardById(id);

        let formattedTags: TagOption[] = [];
        if (card.tags && Array.isArray(card.tags)) {
          formattedTags = card.tags.map(
            (t: { id: string; tagName?: string; tag_name?: string }) => ({
              value: t.id,
              label: t.tagName || t.tag_name || 'Tag',
            })
          );
        }

        reset({
          word: card.word || '',
          meaning: card.meaning || '',
          partOfSpeech: card.partOfSpeech || '',
          definition: card.definition || '',
          ipa: card.ipa || '',
          example: card.example || '',
          level: card.level ?? '',
          popularity: card.popularity ?? 0,
          synonyms: card.synonyms || '',
          antonyms: card.antonyms || '',
          nearSynonyms: card.nearSynonyms || '',
          tags: formattedTags,
        });
      } catch (error) {
        console.error('Failed to fetch card:', error);
        toast.error(t('create_edit_page.error_load'));
        navigate('/cards');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCard();
  }, [id, isEdit, navigate, t, reset]);

  const onSubmit = async (data: CardFormValues) => {
    try {
      setIsLoading(true);

      // Convert tags array to an array of values (UUIDs or new plain text)
      const tagsPayload = data.tags ? data.tags.map((tag) => tag.value.toLowerCase().trim()) : [];

      const cardInput = {
        word: data.word,
        meaning: data.meaning,
        partOfSpeech: data.partOfSpeech,
        definition: data.definition,
        ipa: data.ipa,
        example: data.example,
        level: data.level as CreateCardInput['level'],
        popularity: data.popularity as CreateCardInput['popularity'],
        synonyms: data.synonyms,
        antonyms: data.antonyms,
        nearSynonyms: data.nearSynonyms,
        tags: tagsPayload,
      } as CreateCardInput;

      if (isEdit && id) {
        await cardService.updateCard(id, cardInput);
        toast.success(t('create_edit_page.success_update'));
      } else {
        await cardService.createCard(cardInput);
        toast.success(t('create_edit_page.success_create'));
      }
      navigate('/cards');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(t('create_edit_page.error_submit'));
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
            {isEdit ? t('create_edit_page.title_edit') : t('create_edit_page.title_create')}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? t('create_edit_page.desc_edit', { id }) : t('create_edit_page.desc_create')}
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-semibold">
                {t('create_edit_page.basic_info', 'Thông tin cơ bản')}
              </h2>
              <GenerateAIDialog
                initialWord={watch('word')}
                onSuccess={(data) => {
                  Object.keys(data).forEach((key) => {
                    let formKey = key;
                    if (key === 'part_of_speech') formKey = 'partOfSpeech';
                    if (key === 'near_synonyms') formKey = 'nearSynonyms';

                    // Only set value if it exists in the form schema
                    if (formKey in cardSchema.shape) {
                      setValue(formKey as keyof CardFormValues, data[key], {
                        shouldValidate: true,
                      });
                    }
                  });
                  // If AI suggests a word, make sure to update it too
                  if (data.word) setValue('word', data.word, { shouldValidate: true });
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="word">{t('create_edit_page.word')}</Label>
                <Input
                  id="word"
                  placeholder={t('create_edit_page.word_placeholder')}
                  {...register('word')}
                  className={errors.word ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.word && <span className="text-sm text-red-500">{errors.word.message}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipa">{t('create_edit_page.ipa')}</Label>
                <Input
                  id="ipa"
                  placeholder={t('create_edit_page.ipa_placeholder')}
                  {...register('ipa')}
                />
              </div>
            </div>

            {/* Meaning & Part of Speech */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meaning">{t('create_edit_page.meaning')}</Label>
                <Input
                  id="meaning"
                  placeholder={t('create_edit_page.meaning_placeholder')}
                  {...register('meaning')}
                  className={errors.meaning ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.meaning && (
                  <span className="text-sm text-red-500">{errors.meaning.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="partOfSpeech">{t('create_edit_page.part_of_speech')}</Label>
                <select
                  id="partOfSpeech"
                  {...register('partOfSpeech')}
                  className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-zinc-950 px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-foreground"
                >
                  <option value="">{t('create_edit_page.select_pos', 'N/A')}</option>
                  <option value="noun">{t('create_edit_page.pos_noun', 'Danh từ (Noun)')}</option>
                  <option value="verb">{t('create_edit_page.pos_verb', 'Động từ (Verb)')}</option>
                  <option value="adjective">
                    {t('create_edit_page.pos_adj', 'Tính từ (Adjective)')}
                  </option>
                  <option value="adverb">
                    {t('create_edit_page.pos_adv', 'Trạng từ (Adverb)')}
                  </option>
                  <option value="pronoun">
                    {t('create_edit_page.pos_pronoun', 'Đại từ (Pronoun)')}
                  </option>
                  <option value="preposition">
                    {t('create_edit_page.pos_prep', 'Giới từ (Preposition)')}
                  </option>
                  <option value="conjunction">
                    {t('create_edit_page.pos_conj', 'Liên từ (Conjunction)')}
                  </option>
                  <option value="interjection">
                    {t('create_edit_page.pos_interj', 'Thán từ (Interjection)')}
                  </option>
                </select>
              </div>
            </div>

            {/* Definition & Example */}
            <div className="space-y-2">
              <Label htmlFor="definition">{t('create_edit_page.definition')}</Label>
              <textarea
                id="definition"
                placeholder={t('create_edit_page.definition_placeholder')}
                {...register('definition')}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-foreground bg-background min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="example">{t('create_edit_page.example')}</Label>
              <textarea
                id="example"
                placeholder={t('create_edit_page.example_placeholder')}
                {...register('example')}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-foreground bg-background min-h-24"
              />
            </div>

            {/* Synonyms & Antonyms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="synonyms">{t('create_edit_page.synonyms')}</Label>
                <Input
                  id="synonyms"
                  placeholder={t('create_edit_page.synonyms_placeholder')}
                  {...register('synonyms')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="antonyms">{t('create_edit_page.antonyms')}</Label>
                <Input
                  id="antonyms"
                  placeholder={t('create_edit_page.antonyms_placeholder')}
                  {...register('antonyms')}
                />
              </div>
            </div>

            {/* Level & Popularity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">{t('create_edit_page.level')}</Label>
                <select
                  id="level"
                  {...register('level')}
                  className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-zinc-950 px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-foreground"
                >
                  <option value="">N/A</option>
                  <option value="A1">
                    A1 - {t('create_edit_page.level_a1', 'Beginner (Sơ cấp)')}
                  </option>
                  <option value="A2">
                    A2 - {t('create_edit_page.level_a2', 'Elementary (Sơ trung cấp)')}
                  </option>
                  <option value="B1">
                    B1 - {t('create_edit_page.level_b1', 'Intermediate (Trung cấp)')}
                  </option>
                  <option value="B2">
                    B2 - {t('create_edit_page.level_b2', 'Upper Intermediate (Thượng trung cấp)')}
                  </option>
                  <option value="C1">
                    C1 - {t('create_edit_page.level_c1', 'Advanced (Cao cấp)')}
                  </option>
                  <option value="C2">
                    C2 - {t('create_edit_page.level_c2', 'Mastery (Thành thạo)')}
                  </option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="popularity">{t('create_edit_page.popularity')}</Label>
                <select
                  id="popularity"
                  {...register('popularity')}
                  className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-zinc-950 px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-foreground"
                >
                  <option value="0">0 - N/A</option>
                  <option value="1">{t('create_edit_page.pop_1')}</option>
                  <option value="2">{t('create_edit_page.pop_2')}</option>
                  <option value="3">{t('create_edit_page.pop_3')}</option>
                  <option value="4">{t('create_edit_page.pop_4')}</option>
                  <option value="5">{t('create_edit_page.pop_5')}</option>
                </select>
              </div>
            </div>

            {/* Tags Multiple Select */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagCreatableSelect
                    value={field.value as TagOption[]}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    options={tagOptions}
                    error={!!errors.tags}
                  />
                )}
              />
              {errors.tags && <span className="text-sm text-red-500">{errors.tags.message}</span>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading
                  ? t('create_edit_page.processing')
                  : isEdit
                    ? t('create_edit_page.save_changes')
                    : t('create_edit_page.create_card')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
                disabled={isLoading}
              >
                {t('create_edit_page.cancel')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateEditCardPage;
