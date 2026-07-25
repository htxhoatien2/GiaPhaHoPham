/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/components/layout/app-footer.tsx
 * @description State-of-the-art unified footer component for Gia Phả Điện Tử
 */

'use client';

import React from 'react';
import { CLAN_NAME, CLAN_FULL_NAME } from '@/lib/clan-config';

interface AppFooterProps {
  className?: string;
  variant?: 'simple' | 'detailed';
}

export function AppFooter({ className = '', variant = 'simple' }: AppFooterProps) {
  const currentYear = new Date().getFullYear();

  if (variant === 'detailed') {
    return (
      <footer className={`border-t border-slate-200/80 bg-white dark:bg-slate-950 py-10 px-4 ${className}`}>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌳</span>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{CLAN_NAME}</span>
                <span className="text-xs text-amber-800 dark:text-amber-400 font-semibold">{CLAN_FULL_NAME} &middot; Gia Phả Điện Tử</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Gìn giữ tinh hoa &middot; Tiếp bước cha ông
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 text-center text-xs text-slate-400 font-medium">
            &copy; {currentYear} {CLAN_NAME} &middot; Hệ thống Quản lý Gia Phả Điện Tử
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`border-t border-slate-200/80 bg-slate-50/60 dark:bg-slate-900/50 py-4 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-base">🌳</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{CLAN_NAME}</span>
          <span className="text-slate-300 dark:text-slate-700">&middot;</span>
          <span className="text-amber-800 dark:text-amber-400 font-bold">Gia Phả Điện Tử</span>
        </div>
        <div className="text-center sm:text-right font-medium">
          &copy; {currentYear} {CLAN_NAME} &middot; Hệ thống Quản lý Gia Phả Điện Tử
        </div>
      </div>
    </footer>
  );
}
