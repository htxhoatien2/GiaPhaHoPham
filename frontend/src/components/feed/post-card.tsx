/**
 * @project AncestorTree
 * @file src/components/feed/post-card.tsx
 * @description Modern UI/UX Post card component for feed timeline
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, MoreHorizontal, Trash2, EyeOff, Eye, MessageSquare, Share2, Sparkles } from 'lucide-react';
import { useDeletePost, useHidePost, useToggleLike } from '@/hooks/use-feed';
import { CommentsSection } from './comments-section';
import { POST_TYPE_LABELS } from '@/types';
import type { Post, Profile } from '@/types';
import { getRelativeTime, getInitials } from '@/lib/format-utils';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
  profileMap: Map<string, Profile>;
  currentUserId?: string;
  isLiked: boolean;
  isAdmin?: boolean;
  isEditor?: boolean;
}

export function PostCard({
  post,
  profileMap,
  currentUserId,
  isLiked,
  isAdmin,
  isEditor,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const deletePost = useDeletePost();
  const hidePost = useHidePost();
  const toggleLike = useToggleLike();

  const author = profileMap.get(post.author_id);
  const authorName = author?.full_name || 'Thành viên dòng họ';
  const isOwner = post.author_id === currentUserId;
  const canModerate = isAdmin || isEditor;
  const canDelete = isOwner || isAdmin;
  const isHidden = post.status === 'hidden';

  const handleLike = () => {
    toggleLike.mutate(post.id, {
      onError: () => toast.error('Lỗi khi thả tim'),
    });
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    try {
      await deletePost.mutateAsync(post.id);
      toast.success('Đã xóa bài viết');
    } catch {
      toast.error('Lỗi khi xóa bài viết');
    }
  };

  const handleToggleHide = () => {
    hidePost.mutate(
      { id: post.id, hide: !isHidden },
      {
        onSuccess: () => toast.success(isHidden ? 'Đã hiện bài viết' : 'Đã ẩn bài viết'),
        onError: () => toast.error('Lỗi'),
      }
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '/feed');
      toast.success('Đã sao chép liên kết Góc giao lưu!');
    }
  };

  const renderImages = () => {
    const images = post.images || [];
    if (images.length === 0) return null;

    if (images.length === 1) {
      return (
        <div className="rounded-xl overflow-hidden border shadow-xs">
          <img
            src={images[0]}
            alt=""
            className="w-full max-h-96 object-cover cursor-pointer hover:scale-[1.01] transition-transform"
            onClick={() => setActiveImage(images[0])}
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-1.5 rounded-xl overflow-hidden border shadow-xs">
        {images.slice(0, 4).map((url, i) => (
          <div
            key={i}
            className={`relative overflow-hidden cursor-pointer ${
              images.length === 3 && i === 0 ? 'col-span-2 h-52' : 'h-36'
            }`}
            onClick={() => setActiveImage(url)}
          >
            <img src={url} alt="" className="w-full h-full object-cover hover:scale-[1.02] transition-transform" />
            {i === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-lg font-extrabold">
                +{images.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
        isHidden ? 'opacity-60 border-dashed bg-muted/30' : 'bg-card'
      }`}>
        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-xs">
                <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {getInitials(authorName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold tracking-tight text-foreground">{authorName}</span>
                  {post.post_type !== 'general' && (
                    <Badge variant="secondary" className="text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {POST_TYPE_LABELS[post.post_type]}
                    </Badge>
                  )}
                  {isHidden && (
                    <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                      Đã ẩn
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{getRelativeTime(post.created_at)}</p>
              </div>
            </div>

            {/* Actions menu */}
            {(isOwner || canModerate) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-xs">
                  {canModerate && (
                    <DropdownMenuItem onClick={handleToggleHide}>
                      {isHidden ? <Eye className="mr-2 h-3.5 w-3.5" /> : <EyeOff className="mr-2 h-3.5 w-3.5" />}
                      {isHidden ? 'Hiện bài viết' : 'Ẩn bài viết'}
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Xóa bài viết
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Content */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground/90 font-normal">
            {post.content}
          </p>

          {/* Images */}
          {renderImages()}

          {/* Lightbox Modal */}
          {activeImage && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setActiveImage(null)}
            >
              <img src={activeImage} alt="" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" />
            </div>
          )}

          {/* Action bar */}
          <div className="flex items-center justify-between border-t pt-3 text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLike}
                disabled={toggleLike.isPending}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition-all ${
                  isLiked
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Heart className={`h-4 w-4 transition-transform active:scale-125 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
                <span>{post.likes_count > 0 ? post.likes_count : 'Thích'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span>Bình luận</span>
              </button>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Chia sẻ</span>
            </Button>
          </div>

          {/* Comments section */}
          {showComments && (
            <div className="border-t pt-3 mt-2 animate-in fade-in-50 duration-200">
              <CommentsSection postId={post.id} currentUserId={currentUserId} isAdmin={isAdmin} />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
