import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, EyeIcon, ChevronLeft, ChevronRight, CheckIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { getAdminFeedbacks, markFeedbackRead } from '@/services/adminService';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';

interface AdminFeedbackData {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  username: string;
  avatar_url: string | null;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
}

const AdminFeedbacksPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'en' ? enUS : vi;

  const [feedbacks, setFeedbacks] = useState<AdminFeedbackData[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({ total: 0, page: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterRead, setFilterRead] = useState<string>('all');

  const [selectedFeedback, setSelectedFeedback] = useState<AdminFeedbackData | null>(null);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminFeedbacks({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        sortBy,
        filterRead,
      });
      if (data && data.success) {
        setFeedbacks(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch admin feedbacks', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, debouncedSearch, sortBy, filterRead]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, sortBy, filterRead]);

  const handleMarkAsRead = async () => {
    if (!selectedFeedback) return;

    try {
      const res = await markFeedbackRead(selectedFeedback.id);
      if (res.success) {
        toast.success(t('admin_feedbacks.mark_read_success'));

        // Optimistic update
        setFeedbacks((prev) =>
          prev.map((f) => (f.id === selectedFeedback.id ? { ...f, is_read: true } : f))
        );
        setSelectedFeedback({ ...selectedFeedback, is_read: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t('admin_feedbacks.title')}</h1>
        <p className="text-muted-foreground">{t('admin_feedbacks.subtitle')}</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('admin_feedbacks.search_placeholder')}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t('admin_feedbacks.sort_newest')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('admin_feedbacks.sort_newest')}</SelectItem>
              <SelectItem value="oldest">{t('admin_feedbacks.sort_oldest')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRead} onValueChange={(val) => setFilterRead(val)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t('admin_feedbacks.filter_all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin_feedbacks.filter_all')}</SelectItem>
              <SelectItem value="unread">{t('admin_feedbacks.filter_unread')}</SelectItem>
              <SelectItem value="read">{t('admin_feedbacks.filter_read')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin_feedbacks.table.user')}</TableHead>
              <TableHead className="w-1/3">{t('admin_feedbacks.table.title')}</TableHead>
              <TableHead>{t('admin_feedbacks.table.date')}</TableHead>
              <TableHead>{t('admin_feedbacks.table.status')}</TableHead>
              <TableHead className="text-right">{t('admin_feedbacks.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  {t('admin_users.loading')}
                </TableCell>
              </TableRow>
            ) : feedbacks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  {t('admin_feedbacks.empty')}
                </TableCell>
              </TableRow>
            ) : (
              feedbacks.map((item) => (
                <TableRow key={item.id} className={!item.is_read ? 'bg-muted/30 font-medium' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.avatar_url || ''} alt={item.username || ''} />
                        <AvatarFallback className="uppercase text-xs">
                          {(item.username || 'U').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{item.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.title}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {format(new Date(item.created_at), 'PP p', { locale: dateLocale })}
                  </TableCell>
                  <TableCell>
                    {item.is_read ? (
                      <Badge
                        variant="secondary"
                        className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      >
                        {t('feedbacks.status_read')}
                      </Badge>
                    ) : (
                      <Badge variant="destructive">{t('feedbacks.status_unread')}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedFeedback(item)}>
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && feedbacks.length > 0 && (
        <div className="flex items-center justify-between px-2 pt-4">
          <p className="text-sm text-muted-foreground">
            {t('admin_users.pagination.showing')} {(pagination.page - 1) * pagination.limit + 1}{' '}
            {t('admin_users.pagination.to')}{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
            {t('admin_users.pagination.of')} {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium px-2">
              {t('admin_users.pagination.page')} {pagination.page} {t('admin_users.pagination.of')}{' '}
              {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={selectedFeedback !== null}
        onOpenChange={(open) => !open && setSelectedFeedback(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between pr-6">
                  <DialogTitle className="text-2xl">{selectedFeedback.title}</DialogTitle>
                  {selectedFeedback.is_read ? (
                    <Badge variant="secondary">{t('feedbacks.status_read')}</Badge>
                  ) : (
                    <Badge variant="destructive">{t('feedbacks.status_unread')}</Badge>
                  )}
                </div>
                <DialogDescription className="flex items-center gap-2 mt-2">
                  <span>
                    {t('admin_feedbacks.dialog.sender')}{' '}
                    <strong className="text-foreground">{selectedFeedback.username}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    {format(new Date(selectedFeedback.created_at), 'PPpp', { locale: dateLocale })}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 my-2 border-y">
                <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed max-h-[50vh] overflow-y-auto pr-2">
                  {selectedFeedback.content}
                </div>
              </div>

              <DialogFooter className="sm:justify-between items-center mt-2">
                {!selectedFeedback.is_read ? (
                  <Button onClick={handleMarkAsRead} className="gap-2">
                    <CheckIcon className="h-4 w-4" />
                    {t('admin_feedbacks.dialog.btn_mark_read')}
                  </Button>
                ) : (
                  <div /> // Spacer to keep Close button on the right
                )}
                <Button variant="outline" onClick={() => setSelectedFeedback(null)}>
                  {t('admin_feedbacks.dialog.btn_close')}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFeedbacksPage;
