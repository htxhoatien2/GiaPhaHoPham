/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/components/layout/app-footer.tsx
 * @description Premium, state-of-the-art footer component for Gia Phả Điện Tử
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { 
  GitBranch, Users, Landmark, BookOpen, 
  Mail, Phone, MapPin, ArrowUp, ShieldCheck, Heart, Sparkles, Youtube 
} from 'lucide-react';
import { CLAN_NAME, CLAN_FULL_NAME, CLAN_YOUTUBE_URL } from '@/lib/clan-config';
import { ClanLogo } from '@/components/common/clan-logo';

interface AppFooterProps {
  className?: string;
  variant?: 'full' | 'compact';
}

export function AppFooter({ className = '', variant = 'full' }: AppFooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (variant === 'compact') {
    return (
      <footer className={`border-t border-slate-200/80 bg-slate-50/80 dark:bg-slate-900/90 dark:border-slate-800 py-4 px-6 ${className}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-base">🌳</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{CLAN_NAME}</span>
            <span className="text-slate-300 dark:text-slate-700">&middot;</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">Gia Phả Điện Tử</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <a 
              href={CLAN_YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold transition-colors"
            >
              <Youtube className="h-4 w-4" /> Kênh YouTube Tộc
            </a>
            <span>&copy; {currentYear} {CLAN_NAME}</span>
            <button 
              onClick={scrollToTop} 
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition-colors"
            >
              Lên đầu trang <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`border-t border-slate-800 bg-slate-950 text-slate-300 pt-12 pb-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Vision */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ClanLogo size="md" showText={false} clickable={false} className="ring-2 ring-amber-500/40 shadow-lg" />
              <div>
                <h3 className="font-bold text-white text-base tracking-wide">{CLAN_NAME}</h3>
                <p className="text-xs text-amber-400 font-medium">{CLAN_FULL_NAME}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Giải pháp chuyển đổi số toàn diện cho công tác lưu trữ phả hệ, gìn giữ di sản dòng họ và kết nối tình thân con cháu Tộc Phạm Văn.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Gìn giữ tinh hoa &middot; Tiếp bước cha ông
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-l-2 border-amber-500 pl-2.5">
              Danh Mục Gia Phả
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/tree" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <GitBranch className="h-3.5 w-3.5 text-emerald-500" /> Cây Gia Phả Điện Tử
                </Link>
              </li>
              <li>
                <Link href="/people" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-emerald-500" /> Danh sách Thành viên
                </Link>
              </li>
              <li>
                <Link href="/ancestral-hall" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <Landmark className="h-3.5 w-3.5 text-emerald-500" /> Nhà thờ Tộc Phạm Văn
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-500" /> Ebook Hướng dẫn & Thế thứ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-l-2 border-amber-500 pl-2.5">
              Liên Hệ & Từ Đường
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <a href="mailto:pctuanit@gmail.com" className="hover:text-amber-300 transition-colors">
                  pctuanit@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <a href="tel:0916199945" className="hover:text-amber-300 transition-colors">
                  0916 199 945 (Phạm Công Tuân)
                </a>
              </li>
              <li className="flex items-center gap-2.5 pt-1">
                <Youtube className="h-4 w-4 text-red-500 shrink-0" />
                <a 
                  href={CLAN_YOUTUBE_URL} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-red-300 transition-colors text-red-400 font-semibold"
                >
                  Kênh YouTube Tộc Phạm Văn
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: System Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-l-2 border-amber-500 pl-2.5">
              Quản Trị Phả Hệ
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hệ thống hoạt động với tính năng bảo mật phân quyền thành viên, đồng bộ thời gian thực và sao lưu dữ liệu an toàn.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Cổng Đăng Nhập
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>&copy; {currentYear} {CLAN_FULL_NAME}. Tất cả quyền được bảo lưu.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              Phát triển với <Heart className="h-3 w-3 text-red-500 fill-red-500" /> bởi Phạm Công Tuân
            </span>
            <button 
              onClick={scrollToTop} 
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors font-medium"
            >
              Lên đầu trang <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
