/**
 * @project AncestorTree
 * @file src/app/(landing)/layout.tsx
 * @description Landing route group layout — no auth, no sidebar, clean public shell
 * @version 2.0.0
 * @updated 2026-03-09
 */

import Link from 'next/link';
import { CLAN_NAME } from '@/lib/clan-config';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* Top nav with public page links */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/welcome" className="flex items-center gap-2">
              <span className="text-xl">🌳</span>
              <span className="font-semibold text-gray-900">{CLAN_NAME}</span>
            </Link>
            <span className="hidden sm:inline text-xs text-gray-400 ml-1">Gia Phả Điện Tử</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/council" className="hidden md:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Hội đồng
            </Link>
            <Link href="/ancestral-hall" className="hidden md:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Nhà thờ
            </Link>
            <Link href="/guide" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold text-xs hover:bg-amber-500/20 transition-all border border-amber-500/30">
              <span>📖</span> Ebook Hướng dẫn
            </Link>
            <Link href="/register-member" className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Ghi danh
            </Link>
            <Link href="/login" className="inline-flex text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 transition-all shadow-xs">
              Đăng nhập
            </Link>
          </div>
        </div>
      </nav>

      {/* Page content with nav offset */}
      <main className="pt-14">
        {children}
      </main>
    </div>
  );
}
