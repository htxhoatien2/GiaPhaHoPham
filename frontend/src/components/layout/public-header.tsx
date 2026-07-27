/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/components/layout/public-header.tsx
 * @description State-of-the-art public navigation header with glassmorphism & mobile drawer
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Landmark, ShieldCheck, BookOpen, UserPlus, LogIn, UserCheck, Menu, X, Sparkles, Youtube 
} from 'lucide-react';
import { ClanLogo } from '@/components/common/clan-logo';
import { CLAN_NAME } from '@/lib/clan-config';

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 text-slate-100 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <ClanLogo size="sm" showText={false} clickable={true} className="ring-2 ring-amber-500/40 shadow-md" />
          <Link href="/welcome" className="flex flex-col">
            <span className="font-bold text-white text-base tracking-wide flex items-center gap-1.5">
              {CLAN_NAME}
            </span>
            <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
              Gia Phả Điện Tử
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link 
            href="/council" 
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive('/council') 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            Hội đồng
          </Link>

          <Link 
            href="/ancestral-hall" 
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive('/ancestral-hall') 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Landmark className="h-3.5 w-3.5 text-emerald-400" />
            Nhà thờ
          </Link>

          <Link 
            href="/youtube" 
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive('/youtube') 
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-xs' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Youtube className="h-3.5 w-3.5 text-red-500" />
            Kênh Youtube
          </Link>

          <Link 
            href="/guide" 
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isActive('/guide') 
                ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-200 border border-amber-400/60' 
                : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-amber-400" />
            <span>📖</span> Ebook Hướng dẫn
          </Link>

          <Link 
            href="/register-member" 
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive('/register-member') 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5 text-cyan-400" />
            Ghi danh
          </Link>
        </nav>

        {/* CTA Auth Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-white transition-all shadow-md border border-emerald-600/40"
          >
            <LogIn className="h-3.5 w-3.5 text-emerald-300" />
            Đăng nhập
          </Link>
          <Link 
            href="/register" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 transition-all"
          >
            <UserCheck className="h-3.5 w-3.5 text-amber-400" />
            Đăng ký
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-5 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-2">
            <Link 
              href="/council" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 bg-slate-900/80 border border-slate-800 text-slate-200"
            >
              <ShieldCheck className="h-4 w-4 text-amber-400" /> Hội đồng gia tộc
            </Link>

            <Link 
              href="/ancestral-hall" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 bg-slate-900/80 border border-slate-800 text-slate-200"
            >
              <Landmark className="h-4 w-4 text-emerald-400" /> Nhà thờ Tộc
            </Link>

            <Link 
              href="/youtube" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 bg-slate-900/80 border border-slate-800 text-slate-200 text-red-300"
            >
              <Youtube className="h-4 w-4 text-red-500" /> Kênh Youtube Tộc
            </Link>

            <Link 
              href="/guide" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300"
            >
              <BookOpen className="h-4 w-4 text-amber-400" /> 📖 Ebook Hướng dẫn & Thế thứ
            </Link>

            <Link 
              href="/register-member" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 bg-slate-900/80 border border-slate-800 text-slate-200"
            >
              <UserPlus className="h-4 w-4 text-cyan-400" /> Ghi danh thành viên online
            </Link>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-2 border-t border-slate-800/80">
            <Link 
              href="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-center bg-emerald-800 text-white shadow-sm flex items-center justify-center gap-1.5"
            >
              <LogIn className="h-3.5 w-3.5" /> Đăng nhập
            </Link>

            <Link 
              href="/register" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-center border border-amber-500/40 text-amber-300 flex items-center justify-center gap-1.5"
            >
              <UserCheck className="h-3.5 w-3.5" /> Đăng ký
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
