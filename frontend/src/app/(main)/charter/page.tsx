/**
 * @project AncestorTree
 * @file src/app/(main)/charter/page.tsx
 * @description Modern, state-of-the-art Family Charter page (Hương ước dòng họ)
 * @version 3.0.0
 * @updated 2026-07-21
 */

'use client';

import { useState, useMemo } from 'react';
import { useClanArticles } from '@/hooks/use-clan-articles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ScrollText, BookOpen, MessageCircle, Star, Layers,
  Search, Copy, Check, Sparkles, Compass, Bookmark
} from 'lucide-react';
import { toast } from 'sonner';
import type { ClanArticle, ClanArticleCategory } from '@/types';

type TabValue = 'all' | ClanArticleCategory;

const TABS: { value: TabValue; label: string; icon: typeof ScrollText }[] = [
  { value: 'all', label: 'Tất cả', icon: Layers },
  { value: 'gia_huan', label: 'Gia huấn', icon: BookOpen },
  { value: 'quy_uoc', label: 'Quy ước dòng họ', icon: ScrollText },
  { value: 'loi_dan', label: 'Lời dặn con cháu', icon: MessageCircle },
];

function getCategoryBadge(cat: ClanArticleCategory) {
  switch (cat) {
    case 'gia_huan':
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-300 font-medium px-2.5 py-0.5 text-xs rounded-full">
          Gia huấn
        </Badge>
      );
    case 'quy_uoc':
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-800 border-amber-300 font-medium px-2.5 py-0.5 text-xs rounded-full">
          Quy ước dòng họ
        </Badge>
      );
    case 'loi_dan':
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300 font-medium px-2.5 py-0.5 text-xs rounded-full">
          Lời dặn con cháu
        </Badge>
      );
    default:
      return null;
  }
}

function ModernArticleCard({ article, index }: { article: ClanArticle; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${article.title}\n\n${article.content}`);
    setCopied(true);
    toast.success('Đã sao chép nội dung bài viết!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 rounded-2xl border ${
      article.is_featured
        ? 'border-amber-400/80 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 shadow-amber-500/5 ring-1 ring-amber-300/50'
        : 'border-slate-200/80 bg-white hover:border-emerald-300 shadow-slate-200/50'
    }`}>
      {/* Top Banner Accent */}
      <div className={`h-1.5 w-full ${
        article.is_featured
          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600'
          : article.category === 'gia_huan'
          ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
          : article.category === 'quy_uoc'
          ? 'bg-gradient-to-r from-amber-500 to-amber-600'
          : 'bg-gradient-to-r from-blue-500 to-indigo-600'
      }`} />

      <CardHeader className="pb-4 pt-5 px-6 border-b border-slate-100/80 bg-slate-50/30">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-extrabold text-sm shadow-sm">
              {index}
            </span>
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-emerald-950 transition-colors">
                {article.title}
              </CardTitle>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {article.is_featured && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold flex items-center gap-1.5 text-xs shadow-sm px-3 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 fill-current" />
                Nổi bật
              </Badge>
            )}
            {getCategoryBadge(article.category)}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-1"
              onClick={handleCopy}
              title="Sao chép nội dung"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 pb-7 px-6">
        <div className="text-base sm:text-lg text-slate-800 whitespace-pre-wrap leading-relaxed space-y-4 font-normal tracking-normal">
          {article.content}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CharterPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: allArticles, isLoading } = useClanArticles();

  const counts = useMemo(() => {
    if (!allArticles) return { all: 0, gia_huan: 0, quy_uoc: 0, loi_dan: 0, featured: 0 };
    return {
      all: allArticles.length,
      gia_huan: allArticles.filter(a => a.category === 'gia_huan').length,
      quy_uoc: allArticles.filter(a => a.category === 'quy_uoc').length,
      loi_dan: allArticles.filter(a => a.category === 'loi_dan').length,
      featured: allArticles.filter(a => a.is_featured).length,
    };
  }, [allArticles]);

  const filteredArticles = useMemo(() => {
    if (!allArticles) return [];
    let list = activeTab === 'all'
      ? allArticles
      : allArticles.filter(a => a.category === activeTab);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allArticles, activeTab, searchQuery]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-amber-950 text-white p-7 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Di Sản & Tộc Phong Dòng Họ
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <ScrollText className="h-9 w-9 text-amber-400 shrink-0" />
            Hương Ước & Lời Dặn Dòng Họ
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
            Nơi gìn giữ gia huấn đạo đức, quy ước phong tục và những lời tâm huyết tổ tiên trao truyền lại cho con cháu muôn đời sau.
          </p>

          {/* Quick Stats Counter */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-emerald-200/90 font-medium">
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
              <Bookmark className="h-3.5 w-3.5 text-amber-300" />
              {counts.all} Bài viết
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 text-amber-300" />
              {counts.featured} Bài nổi bật
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
              <Compass className="h-3.5 w-3.5 text-amber-300" />
              3 Chuyên mục
            </span>
          </div>
        </div>
      </div>

      {/* Search & Tabs Controls */}
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm nội dung gia huấn, quy ước..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-emerald-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
          <TabsList className="w-full flex flex-wrap h-auto p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60 shadow-inner">
            {TABS.map(tab => {
              const tabCount = counts[tab.value as keyof typeof counts] ?? 0;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-emerald-950 data-[state=active]:shadow-md"
                >
                  <tab.icon className="h-4 w-4 mr-1.5 shrink-0" />
                  <span>{tab.label}</span>
                  <span className="ml-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900">
                    {tabCount}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Article List Content */}
      <div className="space-y-6 pt-2">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-500 shadow-sm">
            <ScrollText className="h-14 w-14 mx-auto mb-3 text-slate-300" />
            <h3 className="font-semibold text-lg text-slate-800">Không tìm thấy bài viết phù hợp</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery ? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc tìm kiếm.' : 'Chưa có bài viết nào trong mục này.'}
            </p>
          </div>
        ) : (
          filteredArticles.map((article, i) => (
            <ModernArticleCard key={article.id} article={article} index={i + 1} />
          ))
        )}
      </div>
    </div>
  );
}
