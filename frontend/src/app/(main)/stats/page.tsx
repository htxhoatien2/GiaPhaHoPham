/**
 * @project AncestorTree
 * @file src/app/(main)/stats/page.tsx
 * @description Modern, rich UI/UX Statistics dashboard with recharts visualizations
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTreeData } from '@/hooks/use-families';
import { calculateDetailedStats } from '@/lib/stats-calculator';
import { BarChart3, Users, Heart, Layers, Baby, Sparkles, PieChart } from 'lucide-react';

const RechartsCharts = dynamic(() => import('./stats-charts'), {
  ssr: false,
  loading: () => <Skeleton className="h-[420px] w-full rounded-2xl" />,
});

export default function StatsPage() {
  const { data: treeData, isLoading } = useTreeData();

  const stats = useMemo(() => {
    if (!treeData) return null;
    return calculateDetailedStats(treeData);
  }, [treeData]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-8 pb-24">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <BarChart3 className="h-56 w-56" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <BarChart3 className="h-6 w-6 text-blue-200" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Thống kê Dòng Họ &amp; Gia Phả</h1>
              <p className="text-xs sm:text-sm text-blue-100/90">
                Tổng hợp số liệu phân bố thế hệ, chi tộc, giới tính và mật độ gia đình
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <Card className="border-blue-200/60 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/50 to-card dark:from-blue-950/20 shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
              <span className="text-xs font-bold uppercase tracking-wider">Tổng thành viên</span>
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-foreground">{stats.totalPeople}</p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1 border-t">
              <Sparkles className="h-3 w-3 text-blue-500" /> Dữ liệu đã xác thực
            </p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/50 to-card dark:from-amber-950/20 shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
              <span className="text-xs font-bold uppercase tracking-wider">Số đời phả hệ</span>
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                <Layers className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-foreground">{stats.totalGenerations} <span className="text-base font-normal text-muted-foreground">thế hệ</span></p>
            <p className="text-[11px] text-muted-foreground pt-1 border-t">
              Từ Thủy Tổ đến thế hệ mới nhất
            </p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border-emerald-200/60 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/50 to-card dark:from-emerald-950/20 shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="text-xs font-bold uppercase tracking-wider">Gia đình</span>
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                <Heart className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-foreground">{stats.totalFamilies} <span className="text-base font-normal text-muted-foreground">hộ</span></p>
            <p className="text-[11px] text-muted-foreground pt-1 border-t">
              Các hộ gia đình trong gia phả
            </p>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="border-purple-200/60 dark:border-purple-900/40 bg-gradient-to-br from-purple-50/50 to-card dark:from-purple-950/20 shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
              <span className="text-xs font-bold uppercase tracking-wider">TB con / gia đình</span>
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                <Baby className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-foreground">{stats.avgChildrenPerFamily}</p>
            <p className="text-[11px] text-muted-foreground pt-1 border-t">
              Tỷ lệ tuyệt tự: <span className="font-semibold text-purple-700 dark:text-purple-300">{stats.childlessRate}%</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts section */}
      <RechartsCharts stats={stats} />
    </div>
  );
}
