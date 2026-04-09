import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';










import {
  Search,
  Layers,
  CheckCircle,
  PenTool,
  BanIcon,
  UnlockIcon,
  ChevronLeft,
  ChevronRight,
  Tag,
  Bot,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { getAdminUsers, banUser, unbanUser, changeUserPassword } from '@/services/adminService';

import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserData {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  is_banned: boolean;
  total_cards: number;
  completed_cards: number;
  total_sentences: number;
  total_tags: number;
  total_ai_usages: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
}

const getResetPwdSchema = (t: TFunction) =>
  z.object({
    newPassword: z.string().min(8, t('auth.val_password_min', 'Mật khẩu phải có ít nhất 8 kí tự')),
    confirmNewPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: t('auth.val_password_match', 'Mật khẩu xác nhận không khớp'),
    path: ['confirmNewPassword'],
  });

type ResetPwdFormValues = z.infer<ReturnType<typeof getResetPwdSchema>>;

const AdminUsersPage: React.FC = () => {
  const { t } = useTranslation();

  const [users, setUsers] = useState<UserData[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({ total: 0, page: 1, limit: 10 });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);

  const resetPwdSchema = React.useMemo(() => getResetPwdSchema(t), [t]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ResetPwdFormValues>({ resolver: zodResolver(resetPwdSchema) });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterBanned, setFilterBanned] = useState<boolean>(false);

  const [resetPwdUserId, setResetPwdUserId] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const onSubmitResetPwd = async (data: ResetPwdFormValues) => {
    const yes = window.confirm(t('admin.confirm_new_password', 'Xác nhận thay đổi mật khẩu?'));
    if (!yes) return;

    if (resetPwdUserId) {
      setIsResetting(true);
      try {
        await changeUserPassword(resetPwdUserId, data.newPassword);
        alert(t('admin.reset_password_success', 'Đặt lại mật khẩu thành công'));
        setResetPwdUserId(null);
        reset();
      } catch (e) {
        console.error(e);
        alert(t('admin.reset_password_fail', 'Đặt lại mật khẩu thất bại'));
      } finally {
        setIsResetting(false);
      }
    }
  };

  const openResetPwdDialog = (id: string) => {
    setResetPwdUserId(id);
    reset();
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        sortBy,
        filterBanned,
      });
      if (data && data.success) {
        setUsers(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch admin users', error);
    } finally {
      setIsLoading(false);
    }
  };

  // When filters or sorting or page changes
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, debouncedSearch, sortBy, filterBanned]);

  // Reset to page 1 on search, filter, sort changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, sortBy, filterBanned]);

  const handleToggleBan = async (userId: string, currentlyBanned: boolean) => {
    // Placeholder
    console.log(`Toggle ban for user ${userId} (current: ${currentlyBanned})`);
    try {
      if (currentlyBanned) {
        await unbanUser(userId);
      } else {
        await banUser(userId);
      }
      // Optimistically update
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_banned: !currentlyBanned } : u))
      );
    } catch (error) {
      console.error('Failed to toggle user ban status', error);
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNextPage = () => {
    if (pagination.page < totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{t('admin_users.title')}</h1>
        <p className="text-muted-foreground">{t('admin_users.subtitle')}</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('admin_users.search_placeholder')}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t('admin_users.sort_newest')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('admin_users.sort_newest')}</SelectItem>
              <SelectItem value="oldest">{t('admin_users.sort_oldest')}</SelectItem>
              <SelectItem value="a-z">{t('admin_users.sort_az')}</SelectItem>
              <SelectItem value="z-a">{t('admin_users.sort_za')}</SelectItem>
              <SelectItem value="most_cards">{t('admin_users.sort_most_cards')}</SelectItem>
              <SelectItem value="least_cards">{t('admin_users.sort_least_cards')}</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2 border rounded-md px-3 py-2 shrink-0">
            <Switch id="filter-banned" checked={filterBanned} onCheckedChange={setFilterBanned} />
            <Label
              htmlFor="filter-banned"
              className="text-sm shrink-0 whitespace-nowrap cursor-pointer"
            >
              {t('admin_users.filter_banned')}
            </Label>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin_users.table.user')}</TableHead>
              <TableHead>{t('admin_users.table.stats')}</TableHead>
              <TableHead>{t('admin_users.table.status')}</TableHead>
              <TableHead className="text-right">{t('admin_users.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  {t('admin_users.loading')}
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  {t('admin_users.empty_list')}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  {/* User Column */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar_url || ''} alt={user.username} />
                        <AvatarFallback className="uppercase">
                          {user.username.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.username}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Stats Column */}
                  <TableCell>
                    <div className="flex gap-6 text-sm">
                      <div className="flex flex-col gap-1.5">
                        <div
                          className="flex items-center gap-2 text-muted-foreground"
                          title={t('admin_users.stats_tooltips.total_cards')}
                        >
                          <Layers className="h-4 w-4" />
                          <span>
                            {user.total_cards} {t('admin_users.stats_labels.cards')}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-2 text-green-600 dark:text-green-500"
                          title={t('admin_users.stats_tooltips.completed_cards')}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            {user.completed_cards} {t('admin_users.stats_labels.completed')}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-500"
                          title={t('admin_users.stats_tooltips.total_sentences')}
                        >
                          <PenTool className="h-4 w-4" />
                          <span>
                            {user.total_sentences} {t('admin_users.stats_labels.sentences')}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div
                          className="flex items-center gap-2 text-purple-600 dark:text-purple-400"
                          title={t('admin_users.stats_tooltips.total_tags')}
                        >
                          <Tag className="h-4 w-4" />
                          <span>
                            {user.total_tags || 0} {t('admin_users.stats_labels.tags')}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-2 text-orange-600 dark:text-orange-400"
                          title={t('admin_users.stats_tooltips.ai_usages')}
                        >
                          <Bot className="h-4 w-4" />
                          <span>
                            {user.total_ai_usages || 0} {t('admin_users.stats_labels.ai_usages')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Status Column */}
                  <TableCell>
                    {user.is_banned ? (
                      <Badge variant="destructive">{t('admin_users.status.banned')}</Badge>
                    ) : (
                      <Badge
                        variant="default"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        {t('admin_users.status.active')}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="mr-2"
                            onClick={() => openResetPwdDialog(user.id)}
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground border z-50">
                          <p>{t('admin.reset_password', 'Đặt lại mật khẩu')}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={user.is_banned ? 'outline' : 'destructive'}
                            size="icon"
                            onClick={() => handleToggleBan(user.id, user.is_banned)}
                          >
                            {user.is_banned ? (
                              <UnlockIcon className="h-4 w-4" />
                            ) : (
                              <BanIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground border z-50">
                          <p>
                            {user.is_banned
                              ? t('admin_users.actions.unban')
                              : t('admin_users.actions.ban')}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && users.length > 0 && (
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
              onClick={handlePrevPage}
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
              onClick={handleNextPage}
              disabled={pagination.page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Reset Password Dialog */}
      <Dialog open={!!resetPwdUserId} onOpenChange={(open) => !open && setResetPwdUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.reset_password', 'Đặt lại mật khẩu')}</DialogTitle>
            <DialogDescription>
              {t('admin.reset_password_desc', 'Vui lòng nhập mật khẩu mới cho người dùng này.')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitResetPwd)}>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label>{t('admin.new_password', 'Mật khẩu mới')}</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder={t('admin.new_password', 'Mật khẩu mới')}
                  {...register('newPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="text-destructive text-sm">{errors.newPassword.message as string}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>{t('admin.confirm_new_password', 'Xác nhận mật khẩu mới')}</Label>
              <div className="relative">
                <Input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  placeholder={t('admin.confirm_new_password', 'Xác nhận mật khẩu mới')}
                  {...register('confirmNewPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                >
                  {showConfirmNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-destructive text-sm">
                  {errors.confirmNewPassword.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={() => setResetPwdUserId(null)}>
              {t('admin.cancel', 'Hủy')}
            </Button>
            <Button type="submit" disabled={isResetting}>
              {isResetting ? t('admin.saving', 'Đang lưu...') : t('admin.confirm', 'Xác nhận')}
            </Button>
          </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;
