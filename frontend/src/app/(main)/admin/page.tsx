/**
 * @project AncestorTree
 * @file src/app/(main)/admin/page.tsx
 * @description Admin dashboard with overview stats and quick actions
 * @version 2.0.0
 * @updated 2026-07-21
 */

'use client';

import { useStats } from '@/hooks/use-people';
import { useFamilies } from '@/hooks/use-families';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  GitBranchPlus,
  Heart,
  UserPlus,
  Settings,
  Shield,
  Activity,
  TrendingUp,
  DatabaseBackup,
  ClipboardList,
  Copy,
  Landmark,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: families, isLoading: familiesLoading } = useFamilies();

  const isLoading = statsLoading || familiesLoading;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-amber-950 p-8 text-white shadow-xl shadow-slate-950/20">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-200 border border-amber-300/30 mb-3">
              <Shield className="h-3.5 w-3.5 text-amber-300" />
              Bảng Điều Khiển Admin
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              Quản Trị Hệ Thống Gia Phả
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-xl font-normal leading-relaxed">
              Tổng quan chỉ số nhân khẩu, phân quyền người dùng và công cụ quản lý toàn bộ cơ sở dữ liệu dòng họ.
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold rounded-xl shadow-lg border border-amber-300/40">
            <Link href="/admin/settings">
              <Settings className="h-4 w-4 mr-2" />
              Cài Đặt Dòng Họ
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-emerald-200 bg-gradient-to-b from-white to-emerald-50/40 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-700" />
              Tổng Thành Viên
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-9 w-24 rounded-lg" />
            ) : (
              <div className="text-3xl font-black text-slate-900">{stats?.totalPeople || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-amber-200 bg-gradient-to-b from-white to-amber-50/40 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-700" />
              Tổng Số Đời
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-9 w-16 rounded-lg" />
            ) : (
              <div className="text-3xl font-black text-amber-900">{stats?.totalGenerations || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-blue-200 bg-gradient-to-b from-white to-blue-50/40 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <GitBranchPlus className="h-4 w-4 text-blue-700" />
              Số Chi Nhánh
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-9 w-16 rounded-lg" />
            ) : (
              <div className="text-3xl font-black text-blue-900">{stats?.totalChi || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-purple-200 bg-gradient-to-b from-white to-purple-50/40 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Heart className="h-4 w-4 text-purple-700" />
              Số Gia Đình
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-9 w-16 rounded-lg" />
            ) : (
              <div className="text-3xl font-black text-purple-900">{families?.length || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Detail Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Công Cụ Quản Trị Nhanh
            </CardTitle>
            <CardDescription>Các chức năng truy cập nhanh dành cho Admin</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Button asChild variant="outline" className="h-auto py-3.5 flex-col items-center justify-center rounded-xl border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
              <Link href="/admin/users">
                <Users className="h-5 w-5 mb-1.5 text-emerald-700" />
                <span className="font-semibold text-xs text-slate-800">Quản Lý Users</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3.5 flex-col items-center justify-center rounded-xl border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all">
              <Link href="/admin/contributions">
                <ClipboardList className="h-5 w-5 mb-1.5 text-amber-700" />
                <span className="font-semibold text-xs text-slate-800">Duyệt Đề Xuất</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3.5 flex-col items-center justify-center rounded-xl border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all">
              <Link href="/admin/backup">
                <DatabaseBackup className="h-5 w-5 mb-1.5 text-blue-700" />
                <span className="font-semibold text-xs text-slate-800">Sao Lưu Dữ Liệu</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3.5 flex-col items-center justify-center rounded-xl border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all">
              <Link href="/admin/duplicates">
                <Copy className="h-5 w-5 mb-1.5 text-purple-700" />
                <span className="font-semibold text-xs text-slate-800">Kiểm Trùng Lặp</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3.5 flex-col items-center justify-center rounded-xl border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all">
              <Link href="/admin/registrations">
                <Landmark className="h-5 w-5 mb-1.5 text-teal-700" />
                <span className="font-semibold text-xs text-slate-800">Đơn Ghi Danh</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3.5 flex-col items-center justify-center rounded-xl border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all">
              <Link href="/people/new">
                <UserPlus className="h-5 w-5 mb-1.5 text-indigo-700" />
                <span className="font-semibold text-xs text-slate-800">Thêm Thành Viên</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Detailed Demographic Meters */}
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-slate-900">Phân Bố Nhân Khẩu</CardTitle>
            <CardDescription>Tỉ lệ thành viên trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-xs font-bold text-emerald-950 uppercase">Còn Sống</span>
              {isLoading ? (
                <Skeleton className="h-5 w-12 rounded" />
              ) : (
                <span className="font-black text-emerald-700 text-sm">{stats?.livingCount || 0} người</span>
              )}
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-600 uppercase">Đã Mất (Hưởng Thọ)</span>
              {isLoading ? (
                <Skeleton className="h-5 w-12 rounded" />
              ) : (
                <span className="font-black text-slate-700 text-sm">{stats?.deceasedCount || 0} người</span>
              )}
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-purple-50/70 border border-purple-100">
              <span className="text-xs font-bold text-purple-950 uppercase">Hộ Gia Đình</span>
              {isLoading ? (
                <Skeleton className="h-5 w-12 rounded" />
              ) : (
                <span className="font-black text-purple-700 text-sm">{families?.length || 0} hộ</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log Status */}
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-700" />
              Trạng Thái Hệ Thống
            </span>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 font-bold text-xs rounded-full">
              Hoạt động tốt
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <Shield className="h-10 w-10 mx-auto mb-2 text-emerald-600/40" />
            <p className="font-semibold text-slate-700 text-sm">Hệ thống gia phả đang vận hành ổn định</p>
            <p className="text-xs text-slate-400 mt-1">Dữ liệu được bảo mật với mã hóa Supabase RLS.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

