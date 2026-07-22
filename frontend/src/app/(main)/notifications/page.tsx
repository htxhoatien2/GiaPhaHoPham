/**
 * @project AncestorTree
 * @file src/app/(main)/notifications/page.tsx
 * @description Modern, rich UI/UX Notifications page with filters, mark-as-read, and quick actions
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Loader2, Trash2, ArrowRight, Sparkles, Inbox } from 'lucide-react';
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from '@/hooks/use-notifications';
import { getRelativeTime } from '@/lib/format-utils';
import { NOTIFICATION_TYPE_ICONS, NOTIFICATION_TYPE_LABELS } from '@/types';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const router = useRouter();
  const [filterCategory, setFilterCategory] = useState<'all' | 'members' | 'posts' | 'system'>('all');
  const { data: notifications, isLoading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotif = useDeleteNotification();

  const handleClick = (id: string, link: string | null, isRead: boolean) => {
    if (!isRead) {
      markAsRead.mutate(id);
    }
    if (link) {
      router.push(link);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotif.mutate(id, {
      onSuccess: () => toast.success('Đã xóa thông báo'),
      onError: () => toast.error('Lỗi khi xóa thông báo'),
    });
  };

  const memberTypes = [
    'new_member',
    'member_updated',
    'member_deleted',
    'registration_submitted',
    'registration_approved',
    'account_verified',
  ];
  const postTypes = ['post_comment', 'post_like', 'new_post'];

  const allCount = (notifications || []).length;
  const membersCount = (notifications || []).filter(n => memberTypes.includes(n.type)).length;
  const postsCount = (notifications || []).filter(n => postTypes.includes(n.type)).length;
  const systemCount = (notifications || []).filter(
    n => !memberTypes.includes(n.type) && !postTypes.includes(n.type)
  ).length;

  const filteredNotifications = (notifications || []).filter(n => {
    if (filterCategory === 'members') return memberTypes.includes(n.type);
    if (filterCategory === 'posts') return postTypes.includes(n.type);
    if (filterCategory === 'system') return !memberTypes.includes(n.type) && !postTypes.includes(n.type);
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6 pb-24">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 p-6 text-white shadow-xl">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <Bell className="h-48 w-48" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <Bell className="h-6 w-6 text-amber-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight">Trung tâm Thông báo</h1>
                  {unreadCount > 0 && (
                    <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-bold animate-pulse">
                      {unreadCount} chưa đọc
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-amber-100/90 mt-0.5">
                  Cập nhật tin tức thành viên, gia phả và các tương tác Góc giao lưu
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => markAllAsRead.mutate()}
                disabled={markAllAsRead.isPending}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20 text-xs font-semibold backdrop-blur gap-1.5"
              >
                <CheckCheck className="h-4 w-4" />
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b">
        <button
          type="button"
          onClick={() => setFilterCategory('all')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 border ${
            filterCategory === 'all'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-background text-muted-foreground border-border hover:bg-accent'
          }`}
        >
          <span>🌐 Tất cả</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {allCount}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setFilterCategory('members')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 border ${
            filterCategory === 'members'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-background text-muted-foreground border-border hover:bg-accent'
          }`}
        >
          <span>👤 Thành viên</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {membersCount}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setFilterCategory('posts')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 border ${
            filterCategory === 'posts'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-background text-muted-foreground border-border hover:bg-accent'
          }`}
        >
          <span>💬 Bài viết &amp; Bình luận</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {postsCount}
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setFilterCategory('system')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 border ${
            filterCategory === 'system'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-background text-muted-foreground border-border hover:bg-accent'
          }`}
        >
          <span>🔔 Khác</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {systemCount}
          </Badge>
        </button>
      </div>

      {/* Notifications list */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          <p className="text-sm text-muted-foreground">Đang tải thông báo...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center space-y-3">
            <Inbox className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-medium text-muted-foreground">
              {filterCategory === 'members'
                ? 'Chưa có thông báo cập nhật thành viên nào'
                : filterCategory === 'posts'
                ? 'Chưa có thông báo tương tác bài viết nào'
                : 'Bạn không có thông báo nào vào lúc này'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(n => {
            const isUnread = !n.is_read;
            const icon = NOTIFICATION_TYPE_ICONS[n.type] || '🔔';
            const label = NOTIFICATION_TYPE_LABELS[n.type] || n.type;

            return (
              <Card
                key={n.id}
                onClick={() => handleClick(n.id, n.link, n.is_read)}
                className={`group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md ${
                  isUnread
                    ? 'border-l-4 border-l-amber-500 border-amber-200/80 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900/60'
                    : 'bg-card hover:bg-muted/30 border-border/80'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3.5">
                    {/* Icon Container */}
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg shrink-0 shadow-xs ${
                      isUnread
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {icon}
                    </div>

                    {/* Notification content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className={`text-sm tracking-tight ${isUnread ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                          {n.title}
                        </h2>
                        {isUnread && (
                          <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                        )}
                      </div>

                      {n.body && (
                        <p className={`text-xs mt-1 leading-relaxed ${isUnread ? 'text-foreground/90 font-normal' : 'text-muted-foreground'}`}>
                          {n.body}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-muted-foreground">
                          {getRelativeTime(n.created_at)}
                        </span>
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal">
                          {label}
                        </Badge>
                        {n.link && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            Xem chi tiết <ArrowRight className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete Action */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0 opacity-70 group-hover:opacity-100"
                      onClick={e => handleDelete(e, n.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
