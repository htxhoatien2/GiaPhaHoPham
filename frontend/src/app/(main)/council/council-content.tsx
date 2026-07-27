/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/app/(main)/council/council-content.tsx
 * @description State-of-the-art client component for council page — leadership, history, mission, pillars, timeline
 * @version 2.0.0
 * @updated 2026-07-27
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Users, BookOpen, Target, Sparkles, 
  Award, Landmark, Phone, Mail, ChevronRight, GitBranch, 
  UserCheck, HeartHandshake, History, FileText, Compass, ExternalLink 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClanSettings } from '@/hooks/use-clan-settings';
import { CLAN_NAME, CLAN_FULL_NAME } from '@/lib/clan-config';
import type { CouncilMember } from '@/types';

export function CouncilContent() {
  const { data: cs } = useClanSettings();

  const defaultCouncilMembers: CouncilMember[] = [
    { name: 'Phạm Công Tuân', title: 'Trưởng Ban Quản Trị Phả Hệ Điện Tử & Công Nghệ' },
    { name: 'Hội Đồng Gia Tộc', title: 'Ban Điều Hành & Quản Trị Tộc Phạm Văn' },
    { name: 'Ban Cố Vấn Tộc', title: 'Các Vị Trưởng Phái & Trưởng Chi Dòng Họ' },
    { name: 'Ban Khuyến Học', title: 'Ban Quản Lý Quỹ & Tuyên Dương Thành Tích Con Cháu' }
  ];

  const councilMembers = (cs?.council_members && Array.isArray(cs.council_members) && cs.council_members.length > 0)
    ? (cs.council_members as CouncilMember[])
    : defaultCouncilMembers;

  const clanHistory = cs?.clan_history || 'Tộc Phạm Văn An Trạch có lịch sử phát triển lâu đời qua nhiều thế hệ. Con cháu trong dòng họ luôn gìn giữ truyền thống hiếu học, gia phong và luôn hướng về tổ tiên nguồn cội. Nhờ đức trạch cao dày của Tiên tổ, các thế hệ con cháu ngày nay phát triển đông đúc, thành đạt trên nhiều lĩnh vực khắp mọi miền đất nước.';

  const clanMission = cs?.clan_mission || 'Chuyển đổi số toàn diện công tác lưu trữ phả hệ, giúp con cháu xa quê dễ dàng tra cứu thế thứ, gắn kết tình thân và tiếp nối truyền thống tốt đẹp của dòng họ Tộc Phạm Văn An Trạch.';

  const pillars = [
    {
      title: 'Phụng Thờ Tiên Tổ',
      icon: Landmark,
      color: 'text-amber-400',
      border: 'hover:border-amber-500/50',
      bg: 'from-amber-950/40 to-slate-900',
      desc: 'Gìn giữ Từ đường Tộc Phạm Văn An Trạch, duy trì các lễ tế giỗ tổ hàng năm trang nghiêm, ghi nhớ công đức cha ông.',
    },
    {
      title: 'Quản Lý Phả Hệ Điện Tử',
      icon: GitBranch,
      color: 'text-emerald-400',
      border: 'hover:border-emerald-500/50',
      bg: 'from-emerald-950/40 to-slate-900',
      desc: 'Số hóa cây gia phả chuẩn quốc tế GEDCOM 5.5.1, cập nhật thông tin thành viên chính xác, minh bạch và bảo mật 4 cấp.',
    },
    {
      title: 'Khuyến Học & Khuyến Tài',
      icon: Award,
      color: 'text-cyan-400',
      border: 'hover:border-cyan-500/50',
      bg: 'from-cyan-950/40 to-slate-900',
      desc: 'Tuyên dương, trao thưởng hàng năm cho con cháu đạt thành tích học tập xuất sắc, đỗ đạt đại học và có cống hiến cho xã hội.',
    },
    {
      title: 'Gắn Kết & An Sinh Dòng Họ',
      icon: HeartHandshake,
      color: 'text-rose-400',
      border: 'hover:border-rose-500/50',
      bg: 'from-rose-950/40 to-slate-900',
      desc: 'Xây dựng tinh thần tương thân tương ái, thăm hỏi nghĩa tình, hỗ trợ các gia đình con cháu khi gặp hoàn cảnh khó khăn.',
    },
  ];

  const milestones = [
    {
      period: 'Khai Sơn Tạo Cơ',
      title: 'Thủy Tổ Lập Nghiệp Tộc Phạm Văn',
      desc: 'Thủy tổ về vùng đất An Trạch khai hoang, lập làng, xây dựng cơ nghiệp và đặt nền móng cho dòng họ Phạm Văn.',
    },
    {
      period: 'Gìn Giữ Gia Phong',
      title: 'Xây Dựng Từ Đường & Hương Ước',
      desc: 'Các thế hệ tiếp nối xây dựng Nhà thờ Tộc, ban hành Hương ước dòng họ, giữ gìn nề nếp gia phong hiếu học.',
    },
    {
      period: 'Phát Triển Đông Đúc',
      title: 'Phát Triển Các Phái Chi & Kết Nối',
      desc: 'Con cháu dòng họ tỏa đi lập nghiệp khắp mọi miền đất nước và hải ngoại nhưng luôn hướng về cội nguồn.',
    },
    {
      period: 'Kỷ Nguyên Số',
      title: 'Chuyển Đổi Số Gia Phả Điện Tử',
      desc: 'Ban Quản trị triển khai phần mềm Gia Phả Điện Tử thông minh, lưu trữ di sản và kết nối con cháu thời gian thực.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 text-slate-100">
      
      {/* ─── 1. Hero Banner ─── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-950 via-slate-950 to-emerald-950 border border-amber-500/30 p-8 sm:p-12 shadow-2xl text-center space-y-6">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            Ban Quản Trị & Điều Hành Gia Tộc
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
            Hội Đồng Gia Tộc
          </h1>

          <p className="text-base sm:text-lg text-amber-200/90 font-medium max-w-2xl mx-auto">
            {cs?.clan_full_name ?? CLAN_FULL_NAME}
          </p>

          {/* Traditional Couplet Banner */}
          <div className="max-w-2xl mx-auto my-4 px-6 py-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/40 shadow-lg backdrop-blur-md">
            <p className="text-amber-200 font-serif italic text-sm sm:text-base md:text-lg tracking-wide">
              “Mộc xuất thiên tầm do hữu bản — Thủy lưu vạn dặm khởi ư nguyên”
            </p>
            <p className="text-[11px] text-amber-400/80 font-semibold mt-1">
              (Cây cao ngàn thước nhờ có gốc &middot; Nước chảy vạn dặm khởi từ nguồn)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md text-xs sm:text-sm transition-all" asChild>
              <Link href="/tree">
                <GitBranch className="mr-2 h-4 w-4" /> Cây Gia Phả
              </Link>
            </Button>
            <Button variant="outline" className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all" asChild>
              <Link href="/ancestral-hall">
                <Landmark className="mr-2 h-4 w-4 text-emerald-400" /> Nhà Thờ Tộc
              </Link>
            </Button>
            <Button variant="outline" className="border-red-500/40 text-red-300 hover:bg-red-500/10 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all" asChild>
              <Link href="/youtube">
                Kênh YouTube Tộc
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── 2. Council Members ─── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-l-4 border-amber-500 pl-4 py-1">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-400" />
              Thành Viên Ban Quản Trị & Điều Hành
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Những người chịu trách nhiệm điều hành, bảo tồn di sản và phát triển dòng họ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {councilMembers.map((m, i) => (
            <Card key={i} className="bg-slate-950/90 border-slate-800 text-slate-100 shadow-xl hover:border-amber-500/50 hover:-translate-y-0.5 transition-all duration-300">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/30 to-amber-700/20 text-amber-300 font-black text-xl shrink-0 border border-amber-500/40 shadow-inner">
                  {m.name?.charAt(m.name.lastIndexOf(' ') + 1) || 'P'}
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base truncate">{m.name}</h3>
                    <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-300 border-amber-500/30 font-semibold">
                      Điều Hành
                    </Badge>
                  </div>
                  <p className="text-xs text-amber-400 font-medium leading-snug">{m.title}</p>
                  <p className="text-[11px] text-slate-400">Tộc Phạm Văn An Trạch &middot; Đà Nẵng</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── 3. Core Pillars ─── */}
      <section className="space-y-6">
        <div className="border-l-4 border-amber-500 pl-4 py-1">
          <h2 className="text-xl font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Compass className="h-5 w-5 text-amber-400" />
            4 Trụ Cột Hoạt Động Của Dòng Họ
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Các nguyên tắc và nhiệm vụ trọng tâm được Hội đồng gia tộc duy trì qua nhiều thế hệ</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p, i) => (
            <Card key={i} className={`bg-gradient-to-b ${p.bg} border-slate-800 ${p.border} transition-all duration-300 shadow-xl flex flex-col justify-between`}>
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-2 shadow-inner">
                  <p.icon className={`h-5 w-5 ${p.color}`} />
                </div>
                <CardTitle className="text-base font-bold text-white">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── 4. Historical Milestones ─── */}
      <section className="space-y-6">
        <div className="border-l-4 border-amber-500 pl-4 py-1">
          <h2 className="text-xl font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <History className="h-5 w-5 text-emerald-400" />
            Mốc Lịch Sử & Phát Triển
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Hành trình lịch sử gìn giữ gia phong và phát triển dòng họ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((ms, i) => (
            <Card key={i} className="bg-slate-950/80 border-slate-800 shadow-xl p-5 hover:border-emerald-500/40 transition-all">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase">
                  {ms.period}
                </span>
                <h3 className="font-bold text-white text-base">{ms.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{ms.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── 5. History & Mission Dual Cards ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* History */}
        <Card className="bg-slate-950/90 border-slate-800 shadow-2xl flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-800/80">
            <CardTitle className="text-base font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-400" />
              Lịch Sử Dòng Họ
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p className="whitespace-pre-line">{clanHistory}</p>
          </CardContent>
        </Card>

        {/* Mission */}
        <Card className="bg-slate-950/90 border-slate-800 shadow-2xl flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-800/80">
            <CardTitle className="text-base font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-400" />
              Sứ Mệnh & Định Hướng
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p className="whitespace-pre-line">{clanMission}</p>
          </CardContent>
        </Card>
      </section>

      {/* ─── 6. Overview Data Sheet ─── */}
      <section className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-400" />
              Thông Tin Tổng Quan Dòng Họ
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Thông tin cơ bản về Thủy tổ, Từ đường và Quản trị viên liên hệ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Thủy Tổ Dòng Họ</span>
            <p className="font-bold text-white text-sm">{cs?.clan_patriarch || 'Thủy Tổ Tộc Phạm Văn'}</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Quê Gốc & Từ Đường</span>
            <p className="font-bold text-white text-sm">{cs?.clan_origin || 'An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng'}</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Quản Trị Viên Liên Hệ</span>
            <p className="font-bold text-amber-300 text-sm">Phạm Công Tuân (0916 199 945)</p>
          </div>
        </div>
      </section>

      {/* ─── 7. Navigation Links ─── */}
      <div className="flex flex-wrap gap-4 justify-center pt-6 border-t border-slate-800/80 text-xs">
        <Link href="/welcome" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Trang chủ
        </Link>
        <span className="text-slate-700">&middot;</span>
        <Link href="/tree" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Cây gia phả
        </Link>
        <span className="text-slate-700">&middot;</span>
        <Link href="/ancestral-hall" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Nhà thờ Tộc
        </Link>
        <span className="text-slate-700">&middot;</span>
        <Link href="/youtube" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Kênh YouTube Tộc
        </Link>
      </div>

    </div>
  );
}
