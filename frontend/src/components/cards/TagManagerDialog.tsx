import { useEffect, useState } from 'react';
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

export const TagManagerDialog = () => {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<tagService.Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadTags();
    }
  }, [open]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await tagService.getUserTags();
      setTags(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Gặp lỗi khi tải nhãn dán');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Bạn có chắc muốn xóa Tag này? Các thẻ đang dùng tag này sẽ không bị xóa, chỉ mất liên kết.'
      )
    )
      return;
    try {
      await tagService.deleteTag(id);
      setTags(tags.filter((t) => t.id !== id));
      toast.success('Xóa nhãn dán thành công');
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi xóa nhãn dán');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editValue.trim()) return;
    try {
      const updated = await tagService.updateTag(id, editValue.trim().toLowerCase());
      setTags(tags.map((t) => (t.id === id ? { ...t, tagName: updated.tagName } : t)));
      setEditingId(null);
      toast.success('Cập nhật nhãn dán thành công');
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi cập nhật nhãn dán');
    }
  };

  const filteredTags = tags.filter((t) =>
    t.tagName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 h-10 px-4">
          <Tag className="h-4 w-4" />
          <span className="hidden md:inline">Quản lý Tags</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Quản lý nhãn dán</DialogTitle>
        </DialogHeader>

        <div className="flex items-center border rounded-md px-3 mt-4">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input
            className="border-0 shadow-none focus-visible:ring-0 px-0"
            placeholder="Tìm kiếm nhãn dán..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-2">
          {loading ? (
            <div className="text-center text-muted-foreground py-4">Đang tải...</div>
          ) : filteredTags.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">Không có nhãn dán nào</div>
          ) : (
            filteredTags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md border border-transparent hover:border-border transition-colors"
              >
                {editingId === tag.id ? (
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
                        {tag.cardCount} thẻ
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1 shrink-0">
                  {editingId === tag.id ? (
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
                        onClick={() => handleDelete(tag.id)}
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
