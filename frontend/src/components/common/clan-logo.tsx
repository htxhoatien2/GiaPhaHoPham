/**
 * @project AncestorTree
 * @file src/components/common/clan-logo.tsx
 * @description Modern, premium visual logo emblem for "Phạm Văn Tộc"
 * @version 1.0.0
 * @updated 2026-03-25
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Landmark } from 'lucide-react';
import { CLAN_NAME as ENV_CLAN_NAME, CLAN_FULL_NAME as ENV_CLAN_FULL_NAME } from '@/lib/clan-config';

interface ClanLogoProps {
  name?: string;
  fullName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  clickable?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { box: 'h-8 w-8', icon: 'h-4 w-4', text: 'text-xs', sub: 'text-[10px]' },
  md: { box: 'h-10 w-10', icon: 'h-5 w-5', text: 'text-sm', sub: 'text-xs' },
  lg: { box: 'h-14 w-14', icon: 'h-7 w-7', text: 'text-lg', sub: 'text-xs' },
  xl: { box: 'h-20 w-20', icon: 'h-10 w-10', text: 'text-2xl', sub: 'text-sm' },
};

export function ClanLogo({
  name = ENV_CLAN_NAME,
  fullName = ENV_CLAN_FULL_NAME,
  size = 'md',
  showText = true,
  clickable = true,
  className = '',
}: ClanLogoProps) {
  const sz = SIZE_MAP[size];

  const logoGraphic = (
    <div className={`relative flex ${sz.box} shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 text-white font-extrabold shadow-lg shadow-amber-950/20 ring-2 ring-amber-400/40 p-0.5 group-hover:scale-105 group-hover:ring-amber-300 transition-all duration-300 ${className}`}>
      {/* Outer subtle glow */}
      <div className="absolute inset-0 rounded-2xl bg-amber-400/20 blur-sm pointer-events-none" />

      {/* Inner emblem container */}
      <div className="relative h-full w-full rounded-xl bg-gradient-to-b from-amber-800 to-amber-950 flex flex-col items-center justify-center border border-amber-400/30 overflow-hidden">
        {/* Decorative corner patterns */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-300/60" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-300/60" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-300/60" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-300/60" />

        {/* Logo Monogram */}
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="text-amber-200 tracking-tighter font-serif font-black text-[110%] drop-shadow-xs">
            PVT
          </span>
        </div>
      </div>
    </div>
  );

  const content = (
    <div className="flex items-center gap-3 group">
      {logoGraphic}
      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-foreground truncate group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors ${sz.text}`}>
              {name}
            </span>
            <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
          </div>
          <span className={`text-muted-foreground truncate font-normal ${sz.sub}`}>
            Gia Phả Điện Tử · An Trạch
          </span>
        </div>
      )}
    </div>
  );

  if (clickable) {
    return <Link href="/" className="inline-flex">{content}</Link>;
  }

  return content;
}
