/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/components/common/clan-banner.tsx
 * @description Official Clan Banner component for "Tộc Phạm Văn An Trạch"
 * Renders official uploaded banner image with fallback to scalable vector SVG artwork.
 */

'use client';

import React, { useState } from 'react';
import { ClanBannerSvg } from './clan-banner-svg';

interface ClanBannerProps {
  className?: string;
  showTitle?: boolean;
  aspectRatio?: 'auto' | '16/9' | '21/9' | 'banner';
}

export function ClanBanner({
  className = '',
  showTitle = true,
  aspectRatio = 'banner',
}: ClanBannerProps) {
  const [imageError, setImageError] = useState(false);

  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '21/9'
      ? 'aspect-[21/9]'
      : aspectRatio === 'banner'
      ? 'aspect-[21/9] sm:aspect-[2.5/1]'
      : '';

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-amber-500/30 shadow-xl bg-gradient-to-r from-amber-950 via-red-950 to-slate-950 ${aspectClass} ${className}`}
    >
      {!imageError ? (
        <img
          src="/clan-banner.jpg"
          alt="Banner Tộc Phạm Văn An Trạch"
          className="h-full w-full object-cover object-center transition-all duration-500 hover:scale-101"
          onError={() => setImageError(true)}
        />
      ) : (
        <ClanBannerSvg showTitle={showTitle} />
      )}
    </div>
  );
}
