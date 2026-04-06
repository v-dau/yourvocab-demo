import { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, Edit2, Trash2, Check, X, Search } from 'lucide-react';
import * as tagService from '@/services/tagService';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const TagManagerDialog = ({ onTagsChange }: { onTagsChange?: () => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<tagService.Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  const loadTags = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tagService.getUserTags();
      setTags(data || []);
    } catch (error) {
      console.error(error);
      toast.error(t('tag.load_error', 'Gặp lỗi khi tải nhãn dán'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (open) {
      loadTags();
    }
  }, [open, loadTags]);

  const handleDelete = async (id: string) => {
    try {
      await tagService.deleteTag(id);
      setTags(tags.filter((t) => t.id !== id));
      setDeletingId(null);
      toast.success(t('tag.delete_success', 'Xóa nhãn dán thành công'));
      if (onTagsChange) onTagsChange();
    } catch (error) {
      console.error(error);
      toast.error(t('tag.delete_error', 'Lỗi khi xóa nhãn dán'));
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editValue.trim()) return;
    try {
      const updated = await tagService.updateTag(id, editValue.trim().toLowerCase());
      setTags(tags.map((t) => (t.id === id ? { ...t, tagName: updated.tagName } : t)));
      setEditingId(null);
      toast.success(t('tag.update_success', 'Cập nhật nhãn dán thành công'));
      if (onTagsChange) onTagsChange();
    } catch (error) {
      console.error(error);
      toast.error(t('tag.update_error', 'Lỗi khi cập nhật nhãn dán'));
    }
  };

  const filteredTags = tags.filter((t) =>
    t.tagName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 h-8 px-4">
          <Tag className="h-4 w-4" />
          <span className="hidden md:inline">{t('tag.btn', 'Nhãn')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('tag.manager_title', 'Quản lý nhãn dán')}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center border rounded-md px-3 mt-4">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input
            className="border-0 shadow-none focus-visible:ring-0 px-0"
            placeholder={t('tag.search_placeholder', 'Tìm kiếm nhãn dán...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-2">
          {loading ? (
            <div className="text-center text-muted-foreground py-4">
              {t('tag.loading', 'Đang tải...')}
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              {t('tag.no_tags', 'Không có nhãn dán nào')}
            </div>
          ) : (
            filteredTags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md border border-transparent hover:border-border transition-colors"
              >
                {deletingId === tag.id ? (
                  <div className="flex-1 mr-2">
                    <div className="font-medium text-destructive text-sm">
                      {t('tag.confirm_delete_short', 'Xóa nhãn này?')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                      {t(
                        'tag.delete_confirm',
                        'Bạn có chắc chắn? Các thẻ liên kết sẽ không bị xóa.'
                      )}
                    </div>
                  </div>
                ) : editingId === tag.id ? (
                  <div className="flex-1 flex items-center gap-2 mr-2">
                    <Input
                      className="h-8 lowercase"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate(tag.id)}
                    />
                  </div>
                ) : (
                  <div className="flex-1 truncate mr-2 font-medium">
                    #{tag.tagName}
                    {tag.cardCount !== undefined && tag.cardCount > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                        {t('tag.card_count', '{{count}} thẻ', { count: tag.cardCount })}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 shrink-0">
                  {deletingId === tag.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-muted-foreground"
                        onClick={() => setDeletingId(null)}
                      >
                        {t('common.cancel', 'Hủy')}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 px-2"
                        onClick={() => handleDelete(tag.id)}
                      >
                        {t('tag.delete_btn', 'Xóa')}
                      </Button>
                    </>
                  ) : editingId === tag.id ? (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                        onClick={() => handleUpdate(tag.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => {
                          setEditingId(tag.id);
                          setEditValue(tag.tagName);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeletingId(tag.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
