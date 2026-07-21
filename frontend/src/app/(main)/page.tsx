/**
 * @project AncestorTree
 * @file src/app/(main)/page.tsx
 * @description Modern, state-of-the-art Homepage Dashboard
 * @version 3.0.0
 * @updated 2026-07-21
 */

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GitBranchPlus, Calendar, Users, ArrowRight,
  Sparkles, RotateCcw, MessageSquare, BookOpen, ScrollText, Heart
} from 'lucide-react';
import { StatsCard } from '@/components/home/stats-card';
import { FeaturedCharter } from '@/components/home/featured-charter';
import { ClanFullName } from '@/components/home/clan-name';

const features = [
  {
    title: 'Cây Gia Phả Tương Tác',
    description: 'Sơ đồ cây đa thế hệ trực quan, hỗ trợ zoom, pan, lọc nhánh và xuất file PDF/Word.',
    icon: GitBranchPlus,
    href: '/tree',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    badge: 'Trực quan',
  },
  {
    title: 'Lịch Cúng Lễ & Âm Dương',
    description: 'Theo dõi ngày giỗ chạp, nghi lễ truyền thống và tự động đổi lịch âm dương chính xác.',
    icon: Calendar,
    href: '/events',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    badge: 'Tự động',
  },
  {
    title: 'Danh Sách Thành Viên',
    description: 'Tra cứu thông tin cá nhân, quan hệ gia đình, thế hệ và thông tin liên lạc gắn kết tình thân.',
    icon: Users,
    href: '/people',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    badge: 'Gắn kết',
  },
  {
    title: 'Xoay Vòng Cầu Đương',
    description: 'Tự động tính toán và phân công cúng lễ công bằng theo thuật toán cây con cháu.',
    icon: RotateCcw,
    href: '/cau-duong',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200',
    badge: 'Công bằng',
  },
  {
    title: 'Góc Giao Lưu Dòng Họ',
    description: 'Đăng tin tức, chia sẻ hình ảnh kỷ niệm, bình luận và thắt chặt tình cảm con cháu xa quê.',
    icon: MessageSquare,
    href: '/feed',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 border-pink-200',
    badge: 'Cộng đồng',
  },
  {
    title: 'Hương Ước & Gia Huấn',
    description: 'Lưu giữ tôn chỉ đạo đức, tộc quy và bài học tâm huyết tổ tiên truyền lại.',
    icon: ScrollText,
    href: '/charter',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 border-rose-200',
    badge: 'Di sản',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col space-y-10 pb-12">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-amber-950 text-white p-8 md:p-16 shadow-2xl border border-emerald-800/40">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-400/30 px-4 py-1.5 text-xs font-semibold backdrop-blur-md rounded-full">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-300 inline" />
            Hệ Thống Gia Phả Điện Tử Thông Minh
          </Badge>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            <ClanFullName />
          </h1>

          <p className="text-base md:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto leading-relaxed">
            &ldquo;Gìn giữ tinh hoa &mdash; Tiếp bước cha ông&rdquo;
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 rounded-xl px-8 h-12">
              <Link href="/tree">
                <GitBranchPlus className="mr-2 h-5 w-5" />
                Xem Cây Gia Phả
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl px-6 h-12">
              <Link href="/people">
                <Users className="mr-2 h-5 w-5" />
                Danh sách thành viên
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="container mx-auto px-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Tính năng nổi bật</h2>
            <p className="text-sm text-slate-500 mt-1">Giải pháp toàn diện quản lý dòng họ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center border shadow-sm`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <Badge variant="outline" className="text-xs font-medium text-slate-500 bg-slate-50 border-slate-200 rounded-full">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-emerald-950 transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-slate-600 text-sm leading-relaxed mt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <Button variant="ghost" asChild className="p-0 h-auto font-semibold text-sm text-emerald-700 hover:text-emerald-800 hover:bg-transparent group-hover:translate-x-1 transition-all">
                  <Link href={feature.href} className="inline-flex items-center">
                    Khám phá ngay
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Dynamic Statistics Section */}
      <section className="container mx-auto px-1">
        <StatsCard />
      </section>

      {/* Featured Charter Section */}
      <section className="container mx-auto px-1">
        <FeaturedCharter />
      </section>

      {/* Quick Access Grid */}
      <section className="container mx-auto px-1">
        <Card className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-emerald-50/50 via-white to-amber-50/50 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                Gắn kết con cháu bốn phương
              </h3>
              <p className="text-sm text-slate-600 max-w-xl">
                Cập nhật thông tin gia đình, đăng ký thành viên mới hoặc gửi đóng góp cho ban quản trị dòng họ.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button asChild variant="outline" className="rounded-xl border-slate-300 hover:bg-slate-100">
                <Link href="/directory">Danh bạ liên lạc</Link>
              </Button>
              <Button asChild className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-sm">
                <Link href="/contributions">Gửi đề xuất</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
