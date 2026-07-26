/**
 * @project AncestorTree
 * @file src/components/home/featured-charter.tsx
 * @description Featured clan charter articles for homepage with elegant parchment card styling
 * @version 2.0.0
 * @updated 2026-07-26
 */

'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ScrollText, BookOpen, Quote } from 'lucide-react';
import { useFeaturedArticles } from '@/hooks/use-clan-articles';

const categoryLabels: Record<string, string> = {
  gia_huan: 'Gia huấn',
  quy_uoc: 'Quy ước gia tộc',
  loi_dan: 'Lời dặn tổ tiên',
};

export function FeaturedCharter() {
  const { data: articles, isLoading } = useFeaturedArticles();

  if (isLoading || !articles || articles.length === 0) return null;

  return (
    <Card className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-amber-100/30 shadow-lg overflow-hidden relative">
      <div className="absolute right-0 top-0 opacity-5 pointer-events-none p-6">
        <ScrollText className="h-64 w-64 text-amber-900" />
      </div>

      <CardHeader className="p-6 md:p-8 pb-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
              <BookOpen className="h-3.5 w-3.5" />
              Di Sản &amp; Gia Huấn Dòng Họ
            </div>
            <CardTitle className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              Hương Ước &amp; Tộc Quy Truyền Thống
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 mt-1">
              Những lời dặn dò tâm huyết và tộc quy đạo đức truyền qua nhiều thế hệ
            </CardDescription>
          </div>
          <Button asChild variant="outline" className="rounded-xl border-amber-300 text-amber-900 hover:bg-amber-100 shrink-0 font-semibold text-xs bg-white">
            <Link href="/charter">
              Đọc Tất Cả Hương Ước
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8 pt-2 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {articles.slice(0, 3).map((article) => (
            <div
              key={article.id}
              className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-amber-200/60 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[11px] font-bold text-amber-800 bg-amber-50 border-amber-200 rounded-full">
                    {categoryLabels[article.category] || article.category}
                  </Badge>
                  <Quote className="h-4 w-4 text-amber-400 opacity-60" />
                </div>
                <h4 className="font-bold text-base text-slate-900 leading-snug line-clamp-1">
                  {article.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed font-normal italic">
                  &ldquo;{article.content}&rdquo;
                </p>
              </div>

              <Link
                href="/charter"
                className="text-xs font-bold text-amber-800 hover:text-amber-950 inline-flex items-center pt-2 border-t border-amber-100"
              >
                Xem chi tiết
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

