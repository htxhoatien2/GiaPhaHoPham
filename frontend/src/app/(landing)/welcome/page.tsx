/**
 * @project AncestorTree
 * @file src/app/(landing)/welcome/page.tsx
 * @description Public landing page — 10 sections, Vietnamese-first, SSR static
 * @version 2.4.0
 * @updated 2026-03-01
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  GitBranch, Calendar, Users, Shield, Bug, LogIn,
  Lightbulb, MessageCircle, Code2, Heart,
  ChevronRight, Award, BookOpen, Utensils, Clock, Rocket,
  Mail, Phone, UserCheck, MessageSquare, Route, BarChart3,
  Bell, Landmark, UserPlus, Search, FileDown, Youtube, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CLAN_NAME, CLAN_FULL_NAME, CLAN_YOUTUBE_URL } from '@/lib/clan-config';
import { ClanLogo } from '@/components/common/clan-logo';
import { ClanBanner } from '@/components/common/clan-banner';
import { AppFooter } from '@/components/layout/app-footer';

const GITHUB_REPO = 'https://github.com/htxhoatien2/GiaPhaHoPham';
const GITHUB_RELEASES = `${GITHUB_REPO}/releases`;
const GITHUB_ISSUES = `${GITHUB_REPO}/issues`;
const GITHUB_DISCUSSIONS = `${GITHUB_REPO}/discussions`;

export const metadata: Metadata = {
  title: 'Phạm Văn Tộc — Gia Phả Điện Tử',
  description:
    'Phần mềm mã nguồn mở quản lý gia phả điện tử. Cây gia phả tương tác, lịch âm dương, quản lý dòng họ. Miễn phí, tự host, có bản Desktop offline.',
  alternates: {
    canonical: 'https://giaphaphamvan.vercel.app/welcome',
  },
  openGraph: {
    title: 'Phạm Văn Tộc — Gia Phả Điện Tử',
    description: 'Gìn giữ tinh hoa — Tiếp bước cha ông',
    type: 'website',
    locale: 'vi_VN',
    url: 'https://giaphaphamvan.vercel.app/welcome',
    images: [{ url: '/og-landing.png', width: 1200, height: 630, alt: 'AncestorTree' }],
  },
};

// -- Data --

const features = [
  {
    icon: GitBranch,
    title: 'Cây gia phả tương tác',
    desc: '10+ đời hiển thị, zoom, pan, lọc theo gốc. SVG rendering với layout engine tự phát triển.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Calendar,
    title: 'Lịch âm dương & ngày giỗ',
    desc: 'Tự động chuyển đổi âm-dương, nhắc giỗ chạp hàng năm theo lịch truyền thống.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Users,
    title: 'Quản lý chi / nhánh',
    desc: 'Phân chia chi-nhánh rõ ràng, tính đời tự động, ghi nhận quan hệ cha-mẹ-con-vợ chồng.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Award,
    title: 'Vinh danh & quỹ khuyến học',
    desc: 'Ghi nhận thành tích, quản lý quỹ khuyến học với tài khoản minh bạch.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: BookOpen,
    title: 'Hương ước gia tộc',
    desc: 'Lưu trữ và hiển thị hương ước, quy định dòng họ dạng bài viết có phiên bản.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: Utensils,
    title: 'Cầu đường — phân công lễ hội',
    desc: 'Thuật toán DFS tự động xoay vòng phân công cúng lễ công bằng giữa các gia đình.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: Heart,
    title: 'Quan hệ gia đình đầy đủ',
    desc: 'Cha mẹ, anh chị em, vợ/chồng, con cái — thêm/xóa trực tiếp từ trang cá nhân.',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
  },
  {
    icon: Shield,
    title: 'Bảo mật & phân quyền 4 cấp',
    desc: 'Row Level Security trên Supabase: admin, editor, viewer, guest — bảo vệ dữ liệu cá nhân.',
    color: 'text-slate-600',
    bg: 'bg-slate-50',
  },
  {
    icon: MessageSquare,
    title: 'Góc giao lưu',
    desc: 'Feed bài viết, bình luận, thả tim, upload ảnh (tối đa 5/bài), lọc theo loại, moderation.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    icon: Route,
    title: 'Tìm quan hệ',
    desc: 'BFS pathfinding tìm đường quan hệ giữa 2 thành viên bất kỳ trong gia phả.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
  {
    icon: BarChart3,
    title: 'Thống kê nâng cao',
    desc: 'Dashboard biểu đồ phân bố đời, giới tính, còn sống/mất với Recharts.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    icon: FileDown,
    title: 'Export & Import đa dạng',
    desc: 'GEDCOM 7.0, CSV, Markdown, PDF — xuất/nhập dữ liệu gia phả linh hoạt.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
  },
  {
    icon: Bell,
    title: 'Thông báo thời gian thực',
    desc: 'Bell icon + 6 loại thông báo tự động qua DB triggers khi có bình luận, thích bài.',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  {
    icon: Landmark,
    title: 'Nhà thờ họ & Hội đồng',
    desc: 'Trang công khai giới thiệu nhà thờ (gallery, bản đồ) và ban quản trị dòng họ.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  {
    icon: UserPlus,
    title: 'Đăng ký thành viên online',
    desc: 'Con cháu sống xa ghi danh trực tuyến, admin duyệt đơn. Honeypot chống spam.',
    color: 'text-lime-600',
    bg: 'bg-lime-50',
  },
  {
    icon: Search,
    title: 'Tìm kiếm thông minh & SEO',
    desc: 'Fuzzy search (Fuse.js) hỗ trợ dấu tiếng Việt. Sitemap, Open Graph cho trang public.',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
];

const techStack = [
  'Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4',
  'Supabase (PostgreSQL)', 'shadcn/ui', 'Electron', 'sql.js (SQLite WASM)',
];

// -- Page --

export default function WelcomePage() {
  return (
    <div className="flex flex-col text-slate-100 bg-slate-900">
      {/* ───── 1. Hero ───── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-[30rem] h-[30rem] bg-amber-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="mb-6 flex justify-center">
            <ClanLogo size="xl" showText={false} clickable={false} className="ring-4 ring-amber-400/60 shadow-2xl animate-pulse" />
          </div>
          
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Hệ thống Quản lý Gia Phả Điện Tử
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-5 text-white drop-shadow-md">
            {CLAN_FULL_NAME}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Giải pháp chuyển đổi số toàn diện cho công tác lưu trữ phả hệ, kết nối dòng tộc và gìn giữ di sản cho các thế hệ mai sau.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Button size="lg" className="bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800 text-white font-bold px-6 py-3 rounded-2xl shadow-xl border border-emerald-500/40 text-sm transition-all" asChild>
              <Link href="/tree">
                <GitBranch className="mr-2 h-5 w-5 text-emerald-300" />
                Cây Gia Phả Điện Tử
              </Link>
            </Button>

            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-2xl shadow-xl border border-red-500/40 text-sm transition-all" asChild>
              <a href={CLAN_YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
                <Youtube className="mr-2 h-5 w-5" />
                Kênh YouTube Tộc
              </a>
            </Button>

            <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold px-6 py-3 rounded-2xl shadow-xl text-sm transition-all" asChild>
              <Link href="/register-member">
                <UserPlus className="mr-2 h-5 w-5 text-cyan-400" />
                Ghi Danh Online
              </Link>
            </Button>
          </div>

          {/* Official Clan Banner Display */}
          <div className="mt-14 max-w-4xl mx-auto">
            <ClanBanner className="ring-2 ring-amber-400/40 shadow-2xl rounded-2xl overflow-hidden" />
          </div>
        </div>
      </section>

      {/* ───── 2. Features ───── */}
      <section className="py-20 bg-slate-900/90 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Tính Năng Nổi Bật</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Giải pháp toàn diện cho quản lý gia phả — từ sơ đồ cây tương tác đến lễ nghi truyền thống.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <Card key={f.title} className="bg-slate-950/80 border-slate-800 text-slate-100 shadow-xl hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-3 shadow-inner`}>
                    <f.icon className={`h-5 w-5 ${f.color}`} />
                  </div>
                  <CardTitle className="text-base text-white font-bold">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 3. Screenshots ───── */}
      <section className="py-20 bg-slate-950/80 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Giao Diện Ứng Dụng</h2>
            <p className="text-slate-400 text-sm">Thiết kế hiện đại, mượt mà, hỗ trợ tiếng Việt & tối ưu cho mọi thiết bị.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { src: '/screenshots/tree-view.png', alt: 'Cây gia phả tương tác', label: 'Sơ đồ Cây gia phả tương tác' },
              { src: '/screenshots/people-list.png', alt: 'Quản lý thành viên', label: 'Danh sách & Bộ lọc Phái Chi' },
              { src: '/screenshots/admin-panel.png', alt: 'Trang quản trị', label: 'Bảng Quản Trị Hệ Thống' },
              { src: '/screenshots/mobile-view.png', alt: 'Giao diện di động', label: 'Giao Diện Tương Thích Di Động' },
            ].map((img) => (
              <div key={img.src} className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center shadow-xl hover:border-amber-500/40 transition-all">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <span className="absolute bottom-4 left-5 text-amber-300 text-sm font-bold opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  {img.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 4. Hướng dẫn sử dụng ───── */}
      <section id="guide" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Hướng Dẫn Vận Hành</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Tổng quan các chức năng chính và hướng dẫn sử dụng nhanh hệ thống phả hệ.
            </p>
          </div>

          {/* Navigation overview */}
          <div className="mb-14">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-6 text-center">Các Chức Năng Chính</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
              {[
                { name: 'Trang chủ', desc: 'Tổng quan & Thống kê' },
                { name: 'Cây phả hệ', desc: 'Sơ đồ gia phả tương tác' },
                { name: 'Thành viên', desc: 'Quản lý Phái & Chi' },
                { name: 'Danh bạ', desc: 'Lưu trữ thông tin liên lạc' },
                { name: 'Sự kiện', desc: 'Tính ngày giỗ Âm lịch' },
                { name: 'Góc giao lưu', desc: 'Bài viết & Kỷ niệm' },
                { name: 'Tìm quan hệ', desc: 'Thuật toán BFS 2 người' },
                { name: 'Thống kê', desc: 'Phân tích nhân khẩu học' },
                { name: 'Thông báo', desc: 'Cập nhật thời gian thực' },
                { name: 'Vinh danh', desc: 'Thành tích con cháu' },
                { name: 'Quỹ khuyến học', desc: 'Thu chi & Học bổng' },
                { name: 'Hương ước', desc: 'Gia huấn dòng họ' },
                { name: 'Cầu đương', desc: 'Phân công tế lễ' },
                { name: 'Kho tài liệu', desc: 'Lưu trữ ảnh & PDF' },
                { name: 'Xuất/Nhập', desc: 'GEDCOM, CSV, PDF' },
                { name: 'Quản trị', desc: 'Cài đặt hệ thống' },
              ].map((item) => (
                <div key={item.name} className="bg-slate-950/80 rounded-xl px-4 py-3 border border-slate-800 shadow-md hover:border-amber-500/30 transition-all">
                  <p className="font-bold text-xs text-white">{item.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key workflows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-14">
            {[
              {
                title: 'Thêm & Cập nhật thành viên',
                steps: [
                  'Nhấn "Thêm thành viên" ở trang Thành viên',
                  'Nhập họ tên, giới tính, Đời, Phái tộc và Chi tộc',
                  'Chọn Cha/Mẹ để hệ thống tự động kết nối quan hệ',
                  'Bấm Lưu — thành viên sẽ tự động xuất hiện trên Cây phả hệ',
                ],
              },
              {
                title: 'Xem & Tra cứu cây gia phả',
                steps: [
                  'Vào Cây phả hệ từ thanh điều hướng chính',
                  'Cuộn chuột để thu phóng, kéo rê để di chuyển sơ đồ',
                  'Bấm vào thành viên để xem thông tin cá nhân',
                  'Chọn "Xem cây từ đây" để lọc xem riêng từng Chi/Nhánh',
                ],
              },
              {
                title: 'Quản lý sự kiện & Ngày giỗ',
                steps: [
                  'Ngày giỗ tự động quy đổi từ ngày mất Âm lịch',
                  'Tạo sự kiện mới: Giỗ tộc, Tế thu, hoặc Lễ Tết',
                  'Chọn ngày Âm lịch và thành viên liên quan',
                  'Bật "Lặp lại hàng năm" để tự động nhắc lịch',
                ],
              },
              {
                title: 'Sao lưu dữ liệu an toàn',
                steps: [
                  'Dữ liệu tự động đồng bộ thời gian thực lên Cloud',
                  'Xuất file GEDCOM 7.0 / Excel CSV định kỳ',
                  'Bản Desktop lưu dữ liệu offline tại máy cá nhân',
                  'Đảm bảo di sản dòng họ được bảo toàn vĩnh viễn',
                ],
              },
            ].map((workflow) => (
              <Card key={workflow.title} className="bg-slate-950/80 border-slate-800 text-slate-100 shadow-xl">
                <CardHeader className="pb-3 border-b border-slate-800/80">
                  <CardTitle className="text-sm font-bold text-amber-300">{workflow.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ol className="space-y-2.5">
                    {workflow.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-xs text-slate-300">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 5. Liên hệ ───── */}
      <section id="contact" className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Liên Hệ Ban Quản Trị</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Hệ thống Gia Phả Điện Tử được vận hành phục vụ dòng họ Tộc Phạm Văn, An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Author card */}
            <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
              <CardHeader className="pb-3 border-b border-slate-800">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-amber-400">Đơn Vị Vận Hành</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <p className="text-base font-bold text-white">Phạm Công Tuân (Quản Trị Viên)</p>
                <div className="space-y-2.5">
                  <a href="mailto:pctuanit@gmail.com" className="flex items-center gap-3 text-xs text-slate-300 hover:text-amber-300 transition-colors">
                    <Mail className="h-4 w-4 text-amber-400" />
                    pctuanit@gmail.com
                  </a>
                  <a href="tel:0916199945" className="flex items-center gap-3 text-xs text-slate-300 hover:text-amber-300 transition-colors">
                    <Phone className="h-4 w-4 text-amber-400" />
                    0916 199 945
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Verification guide card */}
            <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
              <CardHeader className="pb-3 border-b border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-2">
                  <UserCheck className="h-4 w-4 text-emerald-300" />
                </div>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-amber-400">Hướng Dẫn Xác Nhận Tài Khoản</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ol className="space-y-2">
                  {[
                    'Đăng ký tài khoản trực tuyến',
                    'Liên hệ Admin qua SĐT/Zalo ở bên',
                    'Cung cấp tên và quan hệ gia đình',
                    'Admin duyệt quyền xem & chỉnh sửa',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 text-xs text-slate-300">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <div className="mt-5">
                  <Button variant="outline" size="sm" className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs rounded-xl" asChild>
                    <Link href="/register">
                      Tạo tài khoản ngay <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
