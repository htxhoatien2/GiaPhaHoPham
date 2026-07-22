/**
 * @project AncestorTree
 * @file src/app/(main)/tree/page.tsx
 * @description Modern UI/UX Family tree visualization page with GEDCOM export + elderly mode
 * @version 2.5.0
 * @updated 2026-03-25
 */

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useTreeData } from '@/hooks/use-families';
import { useElderly } from '@/contexts/elderly-context';
import { useAuth } from '@/components/auth/auth-provider';
import { generateGedcom, downloadGedcom } from '@/lib/gedcom-export';
import { ElderlyTreeView } from '@/components/tree/elderly-tree-view';
import { GitBranch, Download, Loader2, List, Sparkles, HelpCircle, Heart, ZoomIn } from 'lucide-react';
import { toast } from 'sonner';

const FamilyTree = dynamic(
  () => import('@/components/tree/family-tree').then(m => ({ default: m.FamilyTree })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[65vh] w-full rounded-2xl" />,
  }
);

export default function TreePage() {
  const { data: treeData } = useTreeData();
  const { elderlyMode, setElderlyMode } = useElderly();
  const { isAdmin, isEditor } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const canExport = isAdmin || isEditor;

  const handleExport = () => {
    if (!treeData) {
      toast.error('Chưa có dữ liệu để xuất');
      return;
    }
    setIsExporting(true);
    try {
      const content = generateGedcom(treeData);
      downloadGedcom(content);
      toast.success('Xuất file GEDCOM thành công!');
    } catch {
      toast.error('Lỗi khi xuất file');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl pb-24">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <GitBranch className="h-56 w-56" />
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
              {elderlyMode ? <List className="h-6 w-6 text-emerald-200" /> : <GitBranch className="h-6 w-6 text-emerald-200" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {elderlyMode ? 'Sơ Đồ Phả Hệ Theo Đời' : 'Cây Gia Phả Điện Tử Trực Quan'}
                </h1>
                <Badge className="bg-emerald-400 text-emerald-950 font-bold hidden sm:inline-flex">
                  Interactive 2D
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-0.5">
                {elderlyMode
                  ? 'Giao diện danh sách phóng to dễ đọc dành cho người cao tuổi'
                  : 'Sơ đồ hình cây trực quan — Thu phóng, kéo rê và nhấp vào từng thành viên để xem chi tiết'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setElderlyMode(!elderlyMode)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur text-xs font-semibold gap-1.5"
            >
              {elderlyMode ? <GitBranch className="h-4 w-4" /> : <List className="h-4 w-4" />}
              {elderlyMode ? 'Chuyển Cây Phả Hệ' : 'Chế độ Dễ Đọc'}
            </Button>

            {canExport && !elderlyMode && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                disabled={isExporting || !treeData}
                className="bg-emerald-400 text-emerald-950 hover:bg-emerald-300 font-bold text-xs gap-1.5 shadow-sm"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Xuất GEDCOM
              </Button>
            )}
          </div>
        </div>
      </div>

      {elderlyMode ? (
        <ElderlyTreeView />
      ) : (
        <Card className="border-emerald-200/60 dark:border-emerald-900/40 shadow-md">
          <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30 py-3.5 px-6">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-emerald-600" /> Ký hiệu &amp; Hướng dẫn:
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded-full bg-blue-500 inline-block" /> Nam
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded-full bg-pink-500 inline-block" /> Nữ
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 text-rose-500 fill-current" /> Vợ chồng
                </span>
                <span className="text-muted-foreground font-mono">† Đã mất</span>
              </div>
              <span className="text-muted-foreground flex items-center gap-1">
                <ZoomIn className="h-3.5 w-3.5 text-emerald-600" /> Dùng con trỏ/pinch để thu phóng
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-2 sm:p-4 min-h-[600px]">
            <FamilyTree />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
