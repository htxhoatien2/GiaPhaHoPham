/**
 * @project AncestorTree
 * @file src/app/(main)/council/council-content.tsx
 * @description Client component for council page — fetches clan settings
 * @version 1.1.0
 * @updated 2026-07-27
 */

'use client';

import { useClanSettings } from '@/hooks/use-clan-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Target, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { CouncilMember } from '@/types';

export function CouncilContent() {
  const { data: cs } = useClanSettings();

  const defaultCouncilMembers: CouncilMember[] = [
    { name: 'Phạm Công Tuân', title: 'Trưởng Ban Quản Trị Phả Hệ Điện Tử' },
    { name: 'Hội Đồng Gia Tộc', title: 'Ban Điều Hành & Quản Trị Tộc Phạm Văn' },
  ];

  const councilMembers = (cs?.council_members && Array.isArray(cs.council_members) && cs.council_members.length > 0)
    ? (cs.council_members as CouncilMember[])
    : defaultCouncilMembers;

  const clanHistory = cs?.clan_history || 'Tộc Phạm Văn An Trạch có lịch sử phát triển lâu đời qua nhiều thế hệ. Con cháu trong dòng họ luôn gìn giữ truyền thống hiếu học, gia phong và luôn hướng về tổ tiên nguồn cội.';

  const clanMission = cs?.clan_mission || 'Chuyển đổi số toàn diện công tác lưu trữ phả hệ, giúp con cháu xa quê dễ dàng tra cứu thế thứ, gắn kết tình thân và tiếp nối truyền thống tốt đẹp của dòng họ.';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 text-slate-100">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          Ban Quản Trị & Điều Hành
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Hội Đồng Gia Tộc
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          {cs?.clan_full_name ?? 'Tộc Phạm Văn An Trạch — Gia Phả Điện Tử'}
        </p>
      </div>

      {/* Council members */}
      <section className="space-y-5">
        <h2 className="text-lg font-bold uppercase tracking-wider text-amber-400 border-l-4 border-amber-500 pl-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-400" />
          Thành Viên Ban Quản Trị
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {councilMembers.map((m, i) => (
            <Card key={i} className="bg-slate-950/80 border-slate-800 text-slate-100 shadow-xl hover:border-amber-500/40 transition-all">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/30 text-amber-300 font-extrabold text-xl shrink-0 border border-amber-500/30 shadow-inner">
                  {m.name?.charAt(m.name.lastIndexOf(' ') + 1) || '?'}
                </div>
                <div>
                  <p className="font-bold text-white text-base">{m.name}</p>
                  <p className="text-xs text-amber-400 font-medium mt-0.5">{m.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-amber-400 border-l-4 border-amber-500 pl-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          Lịch Sử Dòng Họ
        </h2>
        <Card className="bg-slate-950/80 border-slate-800 text-slate-200 shadow-xl">
          <CardContent className="py-6 text-sm leading-relaxed text-slate-300">
            <p className="whitespace-pre-line">{clanHistory}</p>
          </CardContent>
        </Card>
      </section>

      {/* Mission */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-amber-400 border-l-4 border-amber-500 pl-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-400" />
          Sứ Mệnh & Tầm Nhìn
        </h2>
        <Card className="bg-slate-950/80 border-slate-800 text-slate-200 shadow-xl">
          <CardContent className="py-6 text-sm leading-relaxed text-slate-300">
            <p className="whitespace-pre-line">{clanMission}</p>
          </CardContent>
        </Card>
      </section>

      {/* Clan info */}
      <section>
        <Card className="bg-slate-950/80 border-slate-800 text-slate-200 shadow-xl">
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-amber-400">Thông Tin Tổng Quan Dòng Họ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-400">Thủy tổ</span>
              <span className="text-xs font-semibold text-white">{cs?.clan_patriarch || 'Thủy Tổ Tộc Phạm Văn'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-xs text-slate-400">Quê gốc & Từ đường</span>
              <span className="text-xs font-semibold text-white">{cs?.clan_origin || 'An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-xs text-slate-400">Quản trị viên liên hệ</span>
              <span className="text-xs font-semibold text-amber-300">Phạm Công Tuân (0916 199 945)</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Navigation links */}
      <div className="flex flex-wrap gap-4 justify-center pt-6 border-t border-slate-800/80 text-xs">
        <Link href="/welcome" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Trang chủ
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
