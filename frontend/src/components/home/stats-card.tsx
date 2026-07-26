/**
 * @project AncestorTree
 * @file src/components/home/stats-card.tsx
 * @description Homepage stats card with live data and rich metrics
 * @version 2.0.0
 * @updated 2026-07-26
 */

'use client';

import { useStats } from '@/hooks/use-people';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Users, GitBranchPlus, TrendingUp, Heart, ArrowRight, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export function StatsCard() {
  const { data: stats, isLoading } = useStats();

  return (
    <Card className="rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-50/50 via-white to-emerald-50/20 shadow-lg">
      <CardHeader className="p-6 md:p-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="h-3.5 w-3.5" />
              Tổng Quan Nhân Khẩu Dòng Họ
            </div>
            <CardTitle className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Thống Kê Dữ Liệu Gia Phả
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 mt-1">
              Chỉ số phát triển thế hệ, tỷ lệ phân bổ con cháu và quy mô họ tộc
            </CardDescription>
          </div>
          <Button asChild variant="outline" className="rounded-xl border-emerald-300 text-emerald-800 hover:bg-emerald-50 shrink-0 font-semibold text-xs">
            <Link href="/stats">
              Xem Thống Kê Chi Tiết
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8 pt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Stat Item 1 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Tổng cộng
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats?.totalPeople || 0}
              </div>
            )}
            <p className="text-xs font-medium text-slate-500">Thành viên dòng họ</p>
          </div>

          {/* Stat Item 2 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-300 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                Kế thừa
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl sm:text-3xl font-black text-amber-900">
                {stats?.totalGenerations || 0}
              </div>
            )}
            <p className="text-xs font-medium text-slate-500">Thế hệ truyền nối</p>
          </div>

          {/* Stat Item 3 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                <GitBranchPlus className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Nhánh tộc
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl sm:text-3xl font-black text-blue-900">
                {stats?.totalChi || 0}
              </div>
            )}
            <p className="text-xs font-medium text-slate-500">Phái / Chi tộc phả hệ</p>
          </div>

          {/* Stat Item 4 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-rose-300 transition-all space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700">
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                Hiện tại
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl sm:text-3xl font-black text-rose-900">
                {stats?.livingCount || 0}
              </div>
            )}
            <p className="text-xs font-medium text-slate-500">Con cháu đang sống</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

