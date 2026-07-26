/**
 * @project AncestorTree
 * @file src/app/(main)/documents/page.tsx
 * @description World-class, rich UI/UX Documents Hub - GEDCOM export, Book view, Archives & Backup
 * @version 3.0.0
 * @updated 2026-07-26
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTreeData } from '@/hooks/use-families';
import { useAuth } from '@/components/auth/auth-provider';
import { generateGedcom, validateGedcom, downloadGedcom } from '@/lib/gedcom-export';
import {
  Download,
  BookOpen,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Archive,
  Database,
  Printer,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  FolderOpen,
  ScrollText,
  Bookmark,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DocumentsPage() {
  const { data: treeData, isLoading: isTreeLoading } = useTreeData();
  const { isEditor } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportGedcom = () => {
    if (!treeData) {
      toast.error('Chưa có dữ liệu gia phả để xuất');
      return;
    }

    setIsExporting(true);
    try {
      const content = generateGedcom(treeData);
      const validation = validateGedcom(content);

      if (!validation.valid) {
        toast.warning(`File GEDCOM có ${validation.errors.length} cảnh báo nhưng vẫn có thể sử dụng`);
      }

      downloadGedcom(content);
      toast.success('Xuất file GEDCOM chuẩn 5.5.1 thành công');
    } catch {
      toast.error('Lỗi khi xuất file GEDCOM');
    } finally {
      setIsExporting(false);
    }
  };

  const peopleCount = treeData?.people.filter(p => p.privacy_level !== 2).length || 0;
  const familyCount = treeData?.families.length || 0;
  const livingCount = treeData?.people.filter(p => p.is_living).length || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 pb-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-8 sm:p-10 text-white shadow-2xl border border-emerald-700/50">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <ScrollText className="h-72 w-72 text-emerald-200" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-200 backdrop-blur border border-emerald-400/30">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Trung Tâm Lưu Trữ &amp; Số Hóa Dòng Họ</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Tài Liệu, Gia Phả Sách &amp; Xuất Dữ Liệu
          </h1>
          
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed">
            Tra cứu phả hệ dạng sách truyền thống, lưu trữ tư liệu văn khắc lịch sử, xuất dữ liệu chuẩn quốc tế GEDCOM và sao lưu di sản dòng họ.
          </p>

          {/* Quick Metrics */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur border border-white/15">
              <BookOpen className="h-4 w-4 text-amber-300" />
              <span>Gia Phả Sách Đa Tầng</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur border border-white/15">
              <Archive className="h-4 w-4 text-emerald-300" />
              <span>Kho Tư Liệu Số Hóa</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur border border-white/15">
              <Download className="h-4 w-4 text-cyan-300" />
              <span>Chuẩn GEDCOM 5.5.1</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur border border-white/15">
              <ShieldCheck className="h-4 w-4 text-purple-300" />
              <span>Bảo Vệ Quyền Riêng Tư</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: 4 Premium Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Gia Phả Dạng Sách */}
        <Card className="group relative overflow-hidden rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shadow-inner">
                <BookOpen className="h-6 w-6" />
              </div>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 font-bold text-[11px]">
                TRUYỀN THỐNG
              </Badge>
            </div>
            
            <CardTitle className="text-xl font-bold pt-3 group-hover:text-purple-600 transition-colors">
              Gia Phả Dạng Sách
            </CardTitle>
            <CardDescription className="text-xs">
              Trình bày gia phả chuẩn trang sách truyền thống (Phả đồ, Phả ký, Tộc ước, Thượng phả, Hạ phả).
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tự động xếp trang theo thứ tự từng đời, từng chi tộc với đầy đủ thông tin thành viên. Hỗ trợ chế độ xem sách lật trang, xuất PDF và in ấn trực tiếp khổ giấy A4/A3.
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] font-medium text-purple-950 dark:text-purple-300">
              <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 dark:bg-purple-950/50 px-2 py-1 border border-purple-200/60">
                <Printer className="h-3 w-3 text-purple-600" /> Sẵn sàng in ấn PDF
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 dark:bg-purple-950/50 px-2 py-1 border border-purple-200/60">
                <Bookmark className="h-3 w-3 text-purple-600" /> Phân chia Phả đồ &amp; Phả ký
              </span>
            </div>

            <Button asChild className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20">
              <Link href="/documents/book" className="flex items-center justify-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Xem &amp; In Gia Phả Sách</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Card 2: Kho Tư Liệu Số Hóa */}
        <Card className="group relative overflow-hidden rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shadow-inner">
                <Archive className="h-6 w-6" />
              </div>
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 font-bold text-[11px]">
                KHO THƯ VIỆN
              </Badge>
            </div>

            <CardTitle className="text-xl font-bold pt-3 group-hover:text-amber-600 transition-colors">
              Kho Tư Liệu &amp; Di Sản
            </CardTitle>
            <CardDescription className="text-xs">
              Lưu giữ tư liệu lịch sử dòng họ: ảnh cổ, sắc phong, bản đồ làng, thước phim lễ tế.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nơi lưu trữ và số hóa ký ức dòng họ: các văn bản Hán Nôm cổ, bài viết lịch sử làng quê, bằng khen vinh danh, video ghi lại không khí lễ giỗ tổ hàng năm.
            </p>

            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <Badge variant="outline" className="bg-amber-50/80 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                🖼️ Ảnh lịch sử
              </Badge>
              <Badge variant="outline" className="bg-amber-50/80 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                📜 Sắc phong cổ
              </Badge>
              <Badge variant="outline" className="bg-amber-50/80 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                🗺️ Bản đồ làng
              </Badge>
              <Badge variant="outline" className="bg-amber-50/80 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                🎥 Video lễ tế
              </Badge>
            </div>

            <Button asChild variant="outline" className="w-full rounded-xl border-amber-300 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-950/50 font-bold text-amber-950 dark:text-amber-300">
              <Link href="/documents/library" className="flex items-center justify-center gap-2">
                <FolderOpen className="h-4 w-4 text-amber-600" />
                <span>Khám Phá Kho Tư Liệu</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Card 3: Xuất Dữ Liệu GEDCOM */}
        <Card className="group relative overflow-hidden rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-inner">
                <Download className="h-6 w-6" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 font-bold text-[11px]">
                CHUẨN QUỐC TẾ
              </Badge>
            </div>

            <CardTitle className="text-xl font-bold pt-3 group-hover:text-emerald-600 transition-colors">
              Xuất File GEDCOM 5.5.1
            </CardTitle>
            <CardDescription className="text-xs">
              Xuất toàn bộ dữ liệu dòng họ theo chuẩn phả hệ quốc tế GEDCOM (.ged).
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tương thích hoàn toàn với các phần mềm gia phả nổi tiếng như FamilySearch, Gramps, MyHeritage, Ancestry. Hỗ trợ sao lưu và di chuyển phả hệ an toàn.
            </p>

            {treeData && (
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/70 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{peopleCount} thành viên</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{familyCount} hộ gia đình</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/60">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
              <span>Tự động bảo vệ thông tin riêng tư (privacy_level = 2)</span>
            </div>

            <Button
              onClick={handleExportGedcom}
              disabled={isTreeLoading || isExporting || !treeData}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isTreeLoading ? 'Đang tải dữ liệu...' : 'Xuất File GEDCOM (.ged)'}
            </Button>
          </CardContent>
        </Card>

        {/* Card 4: Sao Lưu & Khôi Phục Dữ Liệu Tối Cao */}
        <Card className="group relative overflow-hidden rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-inner">
                <Database className="h-6 w-6" />
              </div>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 font-bold text-[11px]">
                SAO LƯU AN TOÀN
              </Badge>
            </div>

            <CardTitle className="text-xl font-bold pt-3 group-hover:text-blue-600 transition-colors">
              Sao Lưu Dữ Liệu Hệ Thống
            </CardTitle>
            <CardDescription className="text-xs">
              Sao lưu định dạng JSON toàn bộ cây gia phả, sự kiện và cài đặt dòng họ.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bảo vệ an toàn tuyệt đối di sản số của dòng họ. Cho phép xuất toàn bộ cơ sở dữ liệu về máy cá nhân hoặc khôi phục nhanh chóng khi nâng cấp hệ thống.
            </p>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span>Sao lưu 1-click định dạng JSON tiêu chuẩn</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span>Lưu giữ nguyên vẹn thông tin phả hệ &amp; hình ảnh</span>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full rounded-xl border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/50 font-bold text-blue-900 dark:text-blue-300">
              <Link href="/admin/backup" className="flex items-center justify-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span>{isEditor ? 'Quản Lý Sao Lưu &amp; Khôi Phục' : 'Xem Trang Khôi Phục Dữ Liệu'}</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* Guide & Printing Best Practices */}
      <Card className="rounded-2xl border-emerald-200/80 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md shrink-0 hidden sm:block">
            <Printer className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
              <Printer className="h-5 w-5 sm:hidden text-emerald-600" />
              Hướng Dẫn In Ấn &amp; Đóng Tập Gia Phả Dòng Họ
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Để cuốn <strong>Gia Phả Sách</strong> của dòng họ đạt chất lượng tốt nhất khi in ấn và lưu truyền qua nhiều thế hệ:
            </p>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside pt-1">
              <li>Sử dụng tính năng <strong>Gia Phả Sách</strong> để xem phả đồ &amp; danh sách tiểu sử theo từng đời.</li>
              <li>Chọn khổ giấy <strong>A4</strong> (đối với sách lật) hoặc khổ <strong>A3</strong> (đối với phả đồ dạng sơ đồ ngang).</li>
              <li>Sử dụng loại giấy định lượng từ <strong>100gsm - 120gsm</strong> để màu sắc in đậm nét và bền lâu theo thời gian.</li>
              <li>Nên in thêm bìa cứng mạ vàng tên Tộc Họ để cuốn phả hệ thêm trang trọng trong nhà thờ tổ.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

