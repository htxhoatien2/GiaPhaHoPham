/**
 * @project AncestorTree
 * @file src/components/feed/comments-section.tsx
 * @description Modern UI/UX Expandable comments section for feed posts with author profiles
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Trash2, Send, MessageSquare } from 'lucide-react';
import { usePostComments, useCreateComment, useDeleteComment } from '@/hooks/use-feed';
import { useProfiles } from '@/hooks/use-profiles';
import { getRelativeTime, getInitials } from '@/lib/format-utils';
import { toast } from 'sonner';

interface CommentsSectionProps {
  postId: string;
  currentUserId?: string;
  isAdmin?: boolean;
}

export function CommentsSection({
  postId,
  currentUserId,
  isAdmin,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { data: comments, isLoading } = usePostComments(postId);
  const { data: profiles } = useProfiles();
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

  const handleSubmitComment = async () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;

    try {
      await createComment.mutateAsync({ post_id: postId, content: trimmed });
      setNewComment('');
      toast.success('Đã gửi bình luận');
    } catch {
      toast.error('Lỗi khi gửi bình luận');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment.mutateAsync({ id: commentId, postId });
      toast.success('Đã xóa bình luận');
    } catch {
      toast.error('Lỗi khi xóa bình luận');
    }
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Comments list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-4 text-xs text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Đang tải bình luận...</span>
        </div>
      ) : !comments || comments.length === 0 ? (
        <p className="text-xs text-muted-foreground italic py-1 text-center">
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => {
            const author = profileMap.get(comment.author_id);
            const authorName = author?.full_name || 'Thành viên dòng họ';
            const canDelete = comment.author_id === currentUserId || isAdmin;

            return (
              <div key={comment.id} className="flex gap-2.5 group items-start">
                <Avatar className="h-7 w-7 flex-shrink-0 border shadow-2xs mt-0.5">
                  <AvatarFallback className="text-[10px] font-bold bg-muted text-foreground">
                    {getInitials(authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-muted/60 dark:bg-muted/30 rounded-2xl px-3.5 py-2 border border-border/50">
                    <span className="text-xs font-bold text-foreground block mb-0.5">{authorName}</span>
                    <p className="text-xs whitespace-pre-wrap break-words leading-relaxed text-foreground/90">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 px-1">
                    <span className="text-[10px] text-muted-foreground">
                      {getRelativeTime(comment.created_at)}
                    </span>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-[10px] text-muted-foreground hover:text-destructive transition-colors opacity-70 group-hover:opacity-100 flex items-center gap-0.5"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Xóa</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add comment input box */}
      {currentUserId ? (
        <div className="flex items-center gap-2 pt-1">
          <Input
            placeholder="Viết bình luận của bạn..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
            className="h-9 text-xs rounded-full bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary px-4"
            maxLength={2000}
          />
          <Button
            size="sm"
            onClick={handleSubmitComment}
            disabled={createComment.isPending || !newComment.trim()}
            className="h-9 w-9 p-0 rounded-full shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          >
            {createComment.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-1">Vui lòng đăng nhập để tham gia bình luận.</p>
      )}
    </div>
  );
}
