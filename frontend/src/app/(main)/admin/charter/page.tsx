/**
 * @project AncestorTree
 * @file src/app/(main)/admin/charter/page.tsx
 * @description Admin clan article management page
 * @version 1.0.0
 * @updated 2026-02-25
 */

'use client';

import { useState } from 'react';
import { useClanArticles, useCreateClanArticle, useUpdateClanArticle, useDeleteClanArticle } from '@/hooks/use-clan-articles';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, ScrollText, Star, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import Link from 'next/link';
import type { ClanArticle, ClanArticleCategory, CreateClanArticleInput } from '@/types';

const CATEGORY_OPTIONS: { value: ClanArticleCategory; label: string }[] = [
  { value: 'gia_huan', label: 'Gia huấn' },
  { value: 'quy_uoc', label: 'Quy ước' },
  { value: 'loi_dan', label: 'Lời dặn con cháu' },
];

function ArticleForm({
  article,
  onSubmit,
  isPending,
}: {
  article?: ClanArticle;
  onSubmit: (data: CreateClanArticleInput) => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [category, setCategory] = useState<ClanArticleCategory>(article?.category || 'gia_huan');
  const [sortOrder, setSortOrder] = useState(article?.sort_order?.toString() || '0');
  const [isFeatured, setIsFeatured] = useState(article?.is_featured || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Vui lòng điền tiêu đề và nội dung');
      return;
    }
    onSubmit({
      title,
      content,
      category,
      sort_order: parseInt(sortOrder) || 0,
      is_featured: isFeatured,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Tiêu đề *</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Về đạo Hiếu" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Danh mục</Label>
          <Select value={category} onValueChange={v => setCategory(v as ClanArticleCategory)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Thứ tự</Label>
          <Input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Nội dung *</Label>
        <Textarea value={content} onChange={e => setContent(e.target.value)} rows={8} placeholder="Nội dung bài viết..." />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
        <Label>Nổi bật</Label>
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Đang lưu...' : (article ? 'Cập nhật' : 'Thêm mới')}
      </Button>
    </form>
  );
}

export default function AdminCharterPage() {
  const { profile, isEditor } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClanArticle | undefined>();
  const [filterCat, setFilterCat] = useState<ClanArticleCategory | 'all'>('all');

  const { data: articles, isLoading } = useClanArticles(
    filterCat === 'all' ? undefined : filterCat
  );
  const createMutation = useCreateClanArticle();
  const updateMutation = useUpdateClanArticle();
  const deleteMutation = useDeleteClanArticle();

  if (!isEditor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Bạn cần quyền biên tập viên để truy cập trang này</p>
            <Button asChild className="mt-4"><Link href="/">Về trang chủ</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreate = async (data: CreateClanArticleInput) => {
    try {
      await createMutation.mutateAsync({ ...data, author_id: profile?.id });
      toast.success('Đã thêm bài viết');
      setDialogOpen(false);
    } catch {
      toast.error('Lỗi khi thêm bài viết');
    }
  };

  const handleUpdate = async (data: CreateClanArticleInput) => {
    if (!editingItem) return;
    try {
      await updateMutation.mutateAsync({ id: editingItem.id, input: data });
      toast.success('Đã cập nhật bài viết');
      setDialogOpen(false);
      setEditingItem(undefined);
    } catch {
      toast.error('Lỗi khi cập nhật');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Đã xóa bài viết');
    } catch {
      toast.error('Lỗi khi xóa');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-6xl pb-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <ScrollText className="h-56 w-56 text-emerald-200" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white -ml-2">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Bảng quản trị
              </Link>
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <ScrollText className="h-6 w-6 text-emerald-200" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Quản Lý Tộc Ước &amp; Gia Huấn</h1>
                <p className="text-xs sm:text-sm text-emerald-100/90">
                  Biên soạn tộc ước, lời dặn con cháu và quy ước văn hóa dòng họ
                </p>
              </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditingItem(undefined); }}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md">
                  <Plus className="h-4 w-4 mr-2" />Thêm bài viết
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Sửa bài viết' : 'Thêm bài viết mới'}</DialogTitle>
                </DialogHeader>
                <ArticleForm
                  key={editingItem?.id || 'new'}
                  article={editingItem}
                  onSubmit={editingItem ? handleUpdate : handleCreate}
                  isPending={createMutation.isPending || updateMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant={filterCat === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilterCat('all')}>
          Tất cả
        </Button>
        {CATEGORY_OPTIONS.map(opt => (
          <Button
            key={opt.value}
            variant={filterCat === opt.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCat(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <Card key={i}><CardContent className="p-4 h-16" /></Card>)}
        </div>
      ) : !articles || articles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <ScrollText className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Chưa có bài viết nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {articles.map(a => (
            <Card key={a.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {a.is_featured && <Star className="h-4 w-4 text-amber-500 shrink-0" />}
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {CATEGORY_OPTIONS.find(c => c.value === a.category)?.label} · Thứ tự: {a.sort_order}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => { setEditingItem(a); setDialogOpen(true); }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xóa bài viết?</AlertDialogTitle>
                        <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(a.id)}>Xóa</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
