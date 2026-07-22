/**
 * @project AncestorTree
 * @file src/app/(main)/feed/page.tsx
 * @description Modern, rich UI/UX Community feed page — timeline + compose + filter
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare, Sparkles, Megaphone, Calendar, Flame, Users, RefreshCcw } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { usePosts, useUserLikedPosts } from '@/hooks/use-feed';
import { useProfiles } from '@/hooks/use-profiles';
import { ComposeBox } from '@/components/feed/compose-box';
import { PostCard } from '@/components/feed/post-card';
import { POST_TYPE_LABELS } from '@/types';
import type { PostType, Profile } from '@/types';

const FILTER_TABS: { key: PostType | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: 'Tất cả', icon: '🌐' },
  { key: 'general', label: 'Thảo luận', icon: '💬' },
  { key: 'announcement', label: 'Thông báo', icon: '📢' },
  { key: 'photo', label: 'Hình ảnh', icon: '🖼️' },
  { key: 'milestone', label: 'Tin vui', icon: '🎉' },
  { key: 'memory', label: 'Kỷ niệm', icon: '🕯️' },
];

export default function FeedPage() {
  const { user, isAdmin, isEditor } = useAuth();
  const [activeFilter, setActiveFilter] = useState<PostType | 'all'>('all');

  const filterType = activeFilter === 'all' ? undefined : activeFilter;
  const { data: posts, isLoading: postsLoading, refetch } = usePosts(filterType);
  const { data: profiles } = useProfiles();
  const { data: likedPostIds } = useUserLikedPosts(user?.id);

  const profileMap = useMemo(() => {
    const map = new Map<string, Profile>();
    for (const p of profiles || []) {
      map.set(p.user_id, p);
    }
    return map;
  }, [profiles]);

  const likedSet = useMemo(() => new Set(likedPostIds || []), [likedPostIds]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6 pb-24">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 text-white shadow-xl">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <MessageSquare className="h-48 w-48" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Góc Giao Lưu Gia Tộc</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="text-white/80 hover:text-white hover:bg-white/10 text-xs gap-1.5"
            >
              <RefreshCcw className="h-3.5 w-3.5" /> Làm mới
            </Button>
          </div>
          <p className="text-sm text-blue-100/90">
            Không gian chia sẻ tin tức, sự kiện, câu chuyện và kết nối con cháu dòng họ
          </p>
        </div>
      </div>

      {/* Compose box */}
      {user && <ComposeBox />}

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 border ${
              activeFilter === tab.key
                ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                : 'bg-background text-muted-foreground border-border hover:bg-accent hover:text-foreground'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Posts list */}
      {postsLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Đang tải bài viết...</p>
        </div>
      ) : !posts || posts.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed rounded-2xl bg-muted/20 space-y-3">
          <MessageSquare className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <p className="text-sm font-medium text-muted-foreground">
            {activeFilter !== 'all'
              ? 'Không có bài viết nào trong mục này'
              : 'Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!'}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              profileMap={profileMap}
              currentUserId={user?.id}
              isLiked={likedSet.has(post.id)}
              isAdmin={isAdmin}
              isEditor={isEditor}
            />
          ))}
        </div>
      )}
    </div>
  );
}
