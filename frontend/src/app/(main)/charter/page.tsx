/**
 * @project AncestorTree
 * @file src/app/(main)/charter/page.tsx
 * @description Family charter page - Hương ước dòng họ (hiển thị đầy đủ bài viết theo tab)
 * @version 2.0.0
 * @updated 2026-07-21
 */

'use client';

import { useState } from 'react';
import { useClanArticles } from '@/hooks/use-clan-articles';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollText, BookOpen, MessageCircle, Star, Layers } from 'lucide-react';
import type { ClanArticle, ClanArticleCategory } from '@/types';

type TabValue = 'all' | ClanArticleCategory;

const TABS: { value: TabValue; label: string; icon: typeof ScrollText }[] = [
  { value: 'all', label: 'Tất cả bài viết', icon: Layers },
  { value: 'gia_huan', label: 'Gia huấn', icon: BookOpen },
  { value: 'quy_uoc', label: 'Quy ước dòng họ', icon: ScrollText },
  { value: 'loi_dan', label: 'Lời dặn con cháu', icon: MessageCircle },
];

function getCategoryBadge(cat: ClanArticleCategory) {
  switch (cat) {
    case 'gia_huan':
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs">Gia huấn</Badge>;
    case 'quy_uoc':
      return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs">Quy ước dòng họ</Badge>;
    case 'loi_dan':
      return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 text-xs">Lời dặn con cháu</Badge>;
    default:
      return null;
  }
}

function ArticleFullCard({ article, index }: { article: ClanArticle; index: number }) {
  return (
    <Card className={`overflow-hidden transition-all duration-200 shadow-sm ${
      article.is_featured ? 'border-amber-300 bg-amber-50/20 ring-1 ring-amber-200' : 'border-slate-200 hover:shadow-md'
    }`}>
      <CardHeader className="pb-3 border-b bg-slate-50/50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
              {index}
            </span>
            <CardTitle className="text-lg font-bold text-slate-900 leading-snug">
              {article.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {article.is_featured && (
              <Badge className="bg-amber-500 text-white flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 fill-current" />
                Nổi bật
              </Badge>
            )}
            {getCategoryBadge(article.category)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-5 pb-6">
        <div className="text-base text-slate-800 whitespace-pre-wrap leading-relaxed space-y-4 font-normal">
          {article.content}
        </div>
      </CardContent>
    </Card>
  );
}

function ArticleList({ articles, category }: { articles: ClanArticle[]; category: TabValue }) {
  const filtered = category === 'all'
    ? articles
    : articles.filter(a => a.category === category);

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed text-slate-500">
        <ScrollText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
        <p className="font-medium text-base">Chưa có bài viết nào trong mục này</p>
        <p className="text-sm text-slate-400 mt-1">Quản trị viên có thể thêm bài viết tại mục Quản Trị &rarr; QL Hương Ước.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filtered.map((article, i) => (
        <ArticleFullCard key={article.id} article={article} index={i + 1} />
      ))}
    </div>
  );
}

export default function CharterPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const { data: allArticles, isLoading } = useClanArticles();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div className="bg-gradient-to-r from-emerald-900 to-amber-900 text-white rounded-xl p-6 shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <ScrollText className="h-8 w-8 text-amber-300 shrink-0" />
          Hương Ước & Lời Dặn Dòng Họ
        </h1>
        <p className="text-amber-100 mt-2 text-sm sm:text-base leading-relaxed">
          Nơi gìn giữ gia huấn, quy ước tộc phong và những lời tâm huyết tổ tiên truyền lại cho con cháu muôn đời.
        </p>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto p-1 bg-slate-100 rounded-lg">
          {TABS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex-1 py-2.5 text-xs sm:text-sm font-medium">
              <tab.icon className="h-4 w-4 mr-1.5 shrink-0" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            <ArticleList articles={allArticles || []} category={tab.value} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
