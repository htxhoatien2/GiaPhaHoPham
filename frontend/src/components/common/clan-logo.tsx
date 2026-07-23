/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/components/common/clan-logo.tsx
 * @description Official Clan Emblem component for "Tộc Phạm Văn An Trạch"
 * Renders official uploaded clan logo with scalable vector fallback.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { CLAN_NAME as ENV_CLAN_NAME, CLAN_FULL_NAME as ENV_CLAN_FULL_NAME } from '@/lib/clan-config';
import { ClanLogoSvg } from './clan-logo-svg';

interface ClanLogoProps {
  name?: string;
  fullName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  clickable?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { box: 'h-8 w-8', px: 32, text: 'text-xs font-semibold', sub: 'text-[10px]' },
  md: { box: 'h-10 w-10', px: 40, text: 'text-sm font-bold', sub: 'text-xs' },
  lg: { box: 'h-14 w-14', px: 56, text: 'text-lg font-extrabold', sub: 'text-xs' },
  xl: { box: 'h-20 w-20', px: 80, text: 'text-2xl font-black', sub: 'text-sm' },
};

export function ClanLogo({
  name = ENV_CLAN_NAME,
  fullName = ENV_CLAN_FULL_NAME,
  size = 'md',
  showText = true,
  clickable = true,
  className = '',
}: ClanLogoProps) {
  const [imageError, setImageError] = useState(false);
  const sz = SIZE_MAP[size];

  const logoGraphic = (
    <div
      className={`relative flex ${sz.box} shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-700/5 to-amber-900/10 dark:from-amber-500/20 dark:to-amber-950/40 border border-amber-500/30 p-0.5 shadow-sm hover:shadow-amber-500/20 group-hover:scale-105 group-hover:border-amber-400 transition-all duration-300 ${className}`}
    >
      {!imageError ? (
        /* Render Official Image Logo */
        <img
          src="/clan-logo.png"
          alt={`Logo ${fullName}`}
          className="h-full w-full object-contain rounded-xl drop-shadow-xs"
          onError={() => setImageError(true)}
        />
      ) : (
        /* Scalable SVG Vector Emblem Fallback */
        <ClanLogoSvg size={sz.px} />
      )}
    </div>
  );

  const content = (
    <div className="flex items-center gap-3 group">
      {logoGraphic}
      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`tracking-tight text-foreground truncate group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors ${sz.text}`}
            >
              {name}
            </span>
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          </div>
          <span className={`text-muted-foreground truncate font-medium ${sz.sub}`}>
            Gia Phả Điện Tử · An Trạch
          </span>
        </div>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
