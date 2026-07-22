/**
 * @project AncestorTree
 * @file src/components/feed/compose-box.tsx
 * @description Modern, rich UI/UX Compose box for creating new feed posts
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImagePlus, X, Loader2, Send, Sparkles } from 'lucide-react';
import { useCreatePost } from '@/hooks/use-feed';
import { POST_TYPE_LABELS } from '@/types';
import type { PostType } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const MAX_IMAGES = 5;
const MAX_CONTENT_LENGTH = 5000;

interface ComposeBoxProps {
  onPostCreated?: () => void;
}

export function ComposeBox({ onPostCreated }: ComposeBoxProps) {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('general');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createPost = useCreatePost();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = MAX_IMAGES - imageUrls.length;
    if (remaining <= 0) {
      toast.error(`Tối đa ${MAX_IMAGES} ảnh cho mỗi bài viết`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);
    setIsUploading(true);

    try {
      const isDesktop = process.env.NEXT_PUBLIC_DESKTOP_MODE === 'true';
      const newUrls: string[] = [];

      for (const file of filesToUpload) {
        if (!file.type.startsWith('image/')) {
          toast.error(`"${file.name}" không phải định dạng hình ảnh`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`"${file.name}" quá lớn (tối đa 5MB)`);
          continue;
        }

        if (isDesktop) {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('/api/media/feed', { method: 'POST', body: formData });
          if (!res.ok) throw new Error('Upload failed');
          const data = await res.json();
          newUrls.push(data.url || `/api/media/feed/${file.name}`);
        } else {
          const ext = file.name.split('.').pop() || 'jpg';
          const path = `feed/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error } = await supabase.storage.from('media').upload(path, file);
          if (error) throw error;
          const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
          newUrls.push(urlData.publicUrl);
        }
      }

      setImageUrls(prev => [...prev, ...newUrls]);
      toast.success(`Đã tải lên ${newUrls.length} hình ảnh`);
    } catch {
      toast.error('Lỗi khi tải ảnh lên');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      toast.error('Vui lòng nhập nội dung bài viết');
      return;
    }

    try {
      await createPost.mutateAsync({
        content: trimmed,
        post_type: postType,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      });
      setContent('');
      setPostType('general');
      setImageUrls([]);
      toast.success('Đã đăng bài viết thành công!');
      onPostCreated?.();
    } catch {
      toast.error('Lỗi khi đăng bài');
    }
  };

  return (
    <Card className="border-primary/20 shadow-md bg-gradient-to-b from-card to-card/95">
      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold">Tạo bài viết mới</span>
          </div>
          <Select value={postType} onValueChange={v => setPostType(v as PostType)}>
            <SelectTrigger className="w-[140px] h-8 text-xs font-medium border-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(POST_TYPE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-xs">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Chia sẻ tin tức, câu chuyện hoặc tâm tư với gia đình..."
          value={content}
          onChange={e => setContent(e.target.value)}
          className="min-h-[90px] resize-none border-none focus-visible:ring-0 p-0 text-sm placeholder:text-muted-foreground/70"
          maxLength={MAX_CONTENT_LENGTH}
        />

        {/* Image previews */}
        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-2.5 pt-2 border-t">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border shadow-xs group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actions bar */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t flex-wrap">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || imageUrls.length >= MAX_IMAGES}
              className="h-8 text-xs font-medium gap-1.5 border-dashed"
            >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5 text-blue-600" />
              )}
              <span>Đính kèm ảnh ({imageUrls.length}/{MAX_IMAGES})</span>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-muted-foreground">
              {content.length}/{MAX_CONTENT_LENGTH}
            </span>

            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={createPost.isPending || !content.trim()}
              className="h-8 font-semibold text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              {createPost.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Đăng bài
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
