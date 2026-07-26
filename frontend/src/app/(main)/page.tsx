/**
 * @project AncestorTree
 * @file src/app/(main)/page.tsx
 * @description Modern, scientific, state-of-the-art Homepage Dashboard
 * @version 4.0.0
 * @updated 2026-07-26
 */

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GitBranchPlus, Calendar, Users, ArrowRight,
  Sparkles, RotateCcw, MessageSquare, BookOpen, ScrollText, Heart,
  BarChart3, Archive, Wallet, Trophy, Compass, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { StatsCard } from '@/components/home/stats-card';
import { FeaturedCharter } from '@/components/home/featured-charter';
import { ClanFullName } from '@/components/home/clan-name';

interface FeatureItem {
  title: string;
  description: string;
  icon: typeof GitBranchPlus;
  href: string;
  color: string;
  bgColor: string;
  badge: string;
}

const pillarGenealogy: FeatureItem[] = [
  {
    title: 'Cây Gia Phả Tương Tác',
    description: 'Sơ đồ cây phả hệ đa thế hệ trực quan, hỗ trợ zoom, pan, lọc chi phái và xuất PDF/Word.',
    icon: GitBranchPlus,
    href: '/tree',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    badge: 'Sơ đồ trực quan',
  },
  {
    title: 'Danh Sách Thành Viên',
    description: 'Tra cứu thông tin cá nhân, ngày sinh/mất, thế hệ, mối quan hệ và liên lạc gia đình.',
    icon: Users,
    href: '/people',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
    badge: 'Tra cứu nhanh',
  },
  {
    title: 'Thống Kê Chi Tộc & Phái',
    description: 'Phân tích tỷ lệ nam/nữ, thành viên còn sống/hưởng thọ và phân bổ theo từng Chi nhánh.',
    icon: BarChart3,
    href: '/stats',
    color: 'text-indigo-700 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800',
    badge: 'Phân tích khoa học',
  },
];

const pillarTraditions: FeatureItem[] = [
  {
    title: 'Lịch Cúng Lễ & Giỗ Chạp',
    description: 'Theo dõi ngày tế tự dòng họ, ngày giỗ chạp tổ tiên và tự động quy đổi lịch Âm Dương.',
    icon: Calendar,
    href: '/events',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
    badge: 'Âm dương tự động',
  },
  {
    title: 'Xoay Vòng Cầu Đương',
    description: 'Tự động tính toán và phân công gia đình chủ lễ cúng tế xoay vòng công bằng hàng năm.',
    icon: RotateCcw,
    href: '/cau-duong',
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800',
    badge: 'Xoay vòng công bằng',
  },
  {
    title: 'Tộc Ước & Gia Huấn',
    description: 'Lưu giữ tôn chỉ đạo đức, quy ước văn hóa và những bài học tâm huyết tổ tiên truyền lại.',
    icon: ScrollText,
    href: '/charter',
    color: 'text-rose-700 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800',
    badge: 'Tôn chỉ tổ tiên',
  },
];

const pillarHeritage: FeatureItem[] = [
  {
    title: 'Kho Tư Liệu & Di Sản',
    description: 'Lưu trữ hình ảnh lịch sử, sắc phong Hán Nôm cổ, bản đồ làng xã và video hội lễ.',
    icon: Archive,
    href: '/documents',
    color: 'text-teal-700 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800',
    badge: 'Số hóa tư liệu',
  },
  {
    title: 'Quỹ Dòng Họ & Khuyến Học',
    description: 'Báo cáo thu chi quỹ tộc công khai, minh bạch và xét duyệt học bổng khen thưởng con cháu.',
    icon: Wallet,
    href: '/fund',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    badge: 'Minh bạch thu chi',
  },
  {
    title: 'Tuyên Dương & Thành Tích',
    description: 'Vinh danh thành tích học tập xuất sắc, sự nghiệp vẻ vang và cống hiến dòng họ.',
    icon: Trophy,
    href: '/achievements',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
    badge: 'Bảng vàng vinh danh',
  },
  {
    title: 'Góc Giao Lưu Dòng Họ',
    description: 'Đăng tin tức, chia sẻ khoảnh khắc kỷ niệm, gửi lời chúc mừng thắt chặt tình thân.',
    icon: MessageSquare,
    href: '/feed',
    color: 'text-pink-700 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-950/50 border-pink-200 dark:border-pink-800',
    badge: 'Kết nối con cháu',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col space-y-12 pb-16">
      {/* State-of-the-Art Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-amber-950 text-white p-8 md:p-16 shadow-2xl border border-emerald-800/40">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-400/30 px-3.5 py-1 text-xs font-semibold backdrop-blur-md rounded-full">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-300 inline" />
              Hệ Thống Phả Hệ Điện Tử Thông Minh
            </Badge>
            <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 px-3.5 py-1 text-xs font-semibold backdrop-blur-md rounded-full">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-300 inline" />
              Chuẩn Quốc Tế GEDCOM 5.5.1
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            <ClanFullName />
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed italic">
            &ldquo;Mộc xuất thiên tầm do hữu bản &mdash; Thủy lưu vạn dặm khởi ư nguyên&rdquo;
          </p>

          {/* Quick Action Navigation Grid */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 rounded-2xl h-12 text-xs sm:text-sm">
              <Link href="/tree">
                <GitBranchPlus className="mr-1.5 h-4 w-4" />
                Cây Gia Phả
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-2xl h-12 text-xs sm:text-sm">
              <Link href="/people">
                <Users className="mr-1.5 h-4 w-4" />
                Thành Viên
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-2xl h-12 text-xs sm:text-sm">
              <Link href="/events">
                <Calendar className="mr-1.5 h-4 w-4 text-amber-300" />
                Lịch Cúng Lễ
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-2xl h-12 text-xs sm:text-sm">
              <Link href="/documents/book">
                <BookOpen className="mr-1.5 h-4 w-4 text-emerald-300" />
                Gia Phả Sách
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dynamic Statistics Section */}
      <section className="container mx-auto px-1">
        <StatsCard />
      </section>

      {/* Scientific 3-Pillar Architecture Section */}
      <section className="container mx-auto px-1 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full">
            <Compass className="h-3.5 w-3.5 mr-1.5 text-emerald-700 inline" />
            Cấu Trúc Hệ Thống Khoa Học
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            3 Trụ Cột Quản Lý Gia Phả Điện Tử
          </h2>
          <p className="text-sm text-slate-600">
            Giải pháp toàn diện bảo tồn di sản, gắn kết con cháu và tổ chức tế lễ dòng họ
          </p>
        </div>

        {/* Pillar 1: Số Hóa & Quản Lý Phả Hệ */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-md">
              1
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Số Hóa &amp; Quản Lý Phả Hệ</h3>
              <p className="text-xs text-slate-500">Trực quan hóa cây gia phả, phân tích thế hệ và nhân khẩu họ tộc</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillarGenealogy.map((item) => (
              <FeatureCard key={item.title} item={item} />
            ))}
          </div>
        </div>

        {/* Pillar 2: Lễ Nghi & Văn Hóa Dòng Họ */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 border-b border-amber-100 pb-3">
            <div className="h-8 w-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              2
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Lễ Nghi &amp; Truyền Thống Dòng Họ</h3>
              <p className="text-xs text-slate-500">Tự động hóa lịch cúng tế, phân công cầu đương và gìn giữ gia huấn</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillarTraditions.map((item) => (
              <FeatureCard key={item.title} item={item} />
            ))}
          </div>
        </div>

        {/* Pillar 3: Di Sản & Kết Nối Cộng Đồng */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 border-b border-teal-100 pb-3">
            <div className="h-8 w-8 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-md">
              3
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Di Sản &amp; Kết Nối Cộng Đồng</h3>
              <p className="text-xs text-slate-500">Số hóa tư liệu lịch sử, minh bạch quỹ họ và vinh danh thành tích</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillarHeritage.map((item) => (
              <FeatureCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Charter Section */}
      <section className="container mx-auto px-1">
        <FeaturedCharter />
      </section>

      {/* Quick Access Banner */}
      <section className="container mx-auto px-1">
        <Card className="rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-900 via-emerald-950 to-amber-950 p-6 md:p-10 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1 border border-amber-300/30">
                <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" />
                Gắn Kết Con Cháu Bốn Phương
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Cùng Chung Tay Xây Dựng &amp; Cập Nhật Gia Phả
              </h3>
              <p className="text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
                Đăng ký thông tin thành viên mới, cập nhật danh bạ liên lạc hoặc gửi đề xuất cho ban quản trị dòng họ.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0 justify-center">
              <Button asChild variant="outline" className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm font-semibold">
                <Link href="/directory">Danh Bạ Liên Lạc</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold rounded-xl shadow-lg border border-amber-300/40">
                <Link href="/contributions">Gửi Đề Xuất Đóng Góp</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

// ─── Feature Card Subcomponent ────────────────────────────────────────────────

function FeatureCard({ item }: { item: FeatureItem }) {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-400 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      <CardHeader className="p-6 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-11 h-11 rounded-xl ${item.bgColor} flex items-center justify-center border shadow-sm shrink-0`}>
            <item.icon className={`h-5 w-5 ${item.color}`} />
          </div>
          <Badge variant="outline" className="text-[11px] font-medium text-slate-500 bg-slate-50 border-slate-200 rounded-full">
            {item.badge}
          </Badge>
        </div>
        <CardTitle className="text-base font-bold text-slate-900 group-hover:text-emerald-950 transition-colors leading-snug">
          {item.title}
        </CardTitle>
        <CardDescription className="text-slate-600 text-xs leading-relaxed mt-1.5 font-normal">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-5 pt-0">
        <Button variant="ghost" asChild className="p-0 h-auto font-bold text-xs text-emerald-700 hover:text-emerald-800 hover:bg-transparent group-hover:translate-x-1 transition-all">
          <Link href={item.href} className="inline-flex items-center">
            Khám phá tính năng
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

