/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/components/common/clan-banner-svg.tsx
 * @description Scalable SVG vector banner representation of the official Ancestral Temple Banner
 * for "Tộc Phạm Văn An Trạch" with traditional motifs: Ancestral hall, Banyan tree,
 * calligraphy book, flying white cranes, pink lotus flowers, and Dong Son bronze drum.
 */

import React from 'react';

interface ClanBannerSvgProps {
  className?: string;
  showTitle?: boolean;
}

export function ClanBannerSvg({
  className = '',
  showTitle = true,
}: ClanBannerSvgProps) {
  return (
    <svg
      viewBox="0 0 1200 630"
      className={`w-full h-auto select-none rounded-2xl ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sunset Sky Background Gradient */}
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C86D3B" />
          <stop offset="35%" stopColor="#E9A867" />
          <stop offset="70%" stopColor="#FAF0D7" />
          <stop offset="100%" stopColor="#8A4A1C" />
        </linearGradient>

        {/* Central Crimson Lacquer Plaque Gradient */}
        <linearGradient id="plaqueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A080C" />
          <stop offset="15%" stopColor="#7A131A" />
          <stop offset="50%" stopColor="#8B141C" />
          <stop offset="85%" stopColor="#7A131A" />
          <stop offset="100%" stopColor="#4A080C" />
        </linearGradient>

        {/* Metallic Gold Gradient for Text & Borders */}
        <linearGradient id="bannerGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDF0BD" />
          <stop offset="30%" stopColor="#E5BE65" />
          <stop offset="70%" stopColor="#B3892D" />
          <stop offset="100%" stopColor="#F5D782" />
        </linearGradient>

        {/* Roof Terracotta Gradient */}
        <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8C2C1D" />
          <stop offset="100%" stopColor="#4A160F" />
        </linearGradient>

        {/* Soft Radial Sun Glow */}
        <radialGradient id="sunGlow" cx="80%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#F5C07A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E9A867" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Sky & Sun Atmosphere */}
      <rect width="1200" height="630" fill="url(#skyGrad)" />
      <rect width="1200" height="630" fill="url(#sunGlow)" />

      {/* Background Mountain Silhouette */}
      <path
        d="M 0 350 Q 200 280, 450 320 T 900 290 Q 1100 270, 1200 310 L 1200 630 L 0 630 Z"
        fill="#5E381C"
        opacity="0.35"
      />

      {/* 2. Traditional Ancestral Temple Roof (Từ Đường / Nhà Thờ Họ) */}
      <g id="temple-roof">
        {/* Main Roof Arch */}
        <path
          d="M 250 200 Q 600 130, 950 200 L 980 230 C 920 220, 850 215, 600 215 C 350 215, 280 220, 220 230 Z"
          fill="url(#roofGrad)"
        />
        {/* Curved Roof Ridge Ends (Đao Mái Đền) */}
        <path d="M 220 230 Q 180 180, 200 140 Q 240 180, 250 200 Z" fill="#D4AF37" />
        <path d="M 980 230 Q 1020 180, 1000 140 Q 960 180, 950 200 Z" fill="#D4AF37" />

        {/* Temple Support Columns & Courtyard Steps */}
        <rect x="360" y="220" width="480" height="240" fill="#3D1D13" opacity="0.85" />
        {/* Steps */}
        <path d="M 400 460 L 800 460 L 830 520 L 370 520 Z" fill="#7D746D" />
        <path d="M 420 460 L 780 460 L 790 480 L 410 480 Z" fill="#A8A099" />
      </g>

      {/* 3. Ancient Banyan Tree on Left (Cây Đa Cổ Thụ) */}
      <g id="banyan-tree">
        {/* Trunk & Roots */}
        <path
          d="M -20 0 L 120 0 C 140 180, 160 300, 100 450 C 70 520, 40 580, -20 630 L -20 0 Z"
          fill="#2B1A0E"
        />
        <path
          d="M 100 350 C 140 400, 180 480, 240 550 C 200 550, 150 480, 110 420 Z"
          fill="#3B2616"
        />
        {/* Foliage Canopy */}
        <circle cx="60" cy="80" r="140" fill="#1C3815" opacity="0.9" />
        <circle cx="140" cy="120" r="110" fill="#2D5422" opacity="0.85" />
        <circle cx="20" cy="180" r="120" fill="#172E12" opacity="0.9" />
      </g>

      {/* 4. Central Lacquer Banner Board (Bảng Tên Tộc Đỏ Son) */}
      <g id="lacquer-banner">
        {/* Shadow & Glow */}
        <rect
          x="140"
          y="250"
          width="920"
          height="190"
          rx="12"
          fill="#000000"
          opacity="0.35"
          transform="translate(4, 6)"
        />

        {/* Main Plaque Body */}
        <rect
          x="140"
          y="250"
          width="920"
          height="190"
          rx="12"
          fill="url(#plaqueGrad)"
          stroke="url(#bannerGold)"
          strokeWidth="4"
        />

        {/* Inner Gold Filigree Frame */}
        <rect
          x="150"
          y="260"
          width="900"
          height="170"
          rx="8"
          fill="none"
          stroke="url(#bannerGold)"
          strokeWidth="1.5"
          strokeDasharray="12 4"
        />

        {/* Dong Son Drum Watermark Pattern inside Plaque */}
        <circle cx="600" cy="345" r="85" fill="none" stroke="url(#bannerGold)" strokeWidth="1" opacity="0.15" />
        <circle cx="600" cy="345" r="60" fill="none" stroke="url(#bannerGold)" strokeWidth="1" strokeDasharray="3 3" opacity="0.15" />

        {/* Banner Text Content */}
        {showTitle && (
          <g textAnchor="middle">
            {/* Title: TỘC PHẠM VĂN - AN TRẠCH */}
            <text
              x="600"
              y="335"
              fontFamily="'Cinzel', 'Noto Serif', 'Playfair Display', 'Times New Roman', serif"
              fontWeight="900"
              fontSize="44"
              letterSpacing="3"
              fill="url(#bannerGold)"
              style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.6))' }}
            >
              TỘC PHẠM VĂN - AN TRẠCH
            </text>

            {/* Subtitle: Gìn giữ cội nguồn • Kết nối thế hệ • Lan tỏa truyền thống */}
            <text
              x="600"
              y="385"
              fontFamily="'Noto Serif', 'Times New Roman', serif"
              fontStyle="italic"
              fontWeight="600"
              fontSize="22"
              letterSpacing="1.5"
              fill="#F3E5AB"
              opacity="0.95"
            >
              Gìn giữ cội nguồn • Kết nối thế hệ • Lan tỏa truyền thống
            </text>
          </g>
        )}
      </g>

      {/* 5. Left Foreground: Ancient Genealogy Book, Calligraphy Brush & Seal */}
      <g id="genealogy-book-and-seal">
        {/* Open Han/Nom Book Pages */}
        <polygon points="40,480 280,440 320,580 60,630" fill="#F4E8CE" stroke="#C5B28B" strokeWidth="2" />
        <polygon points="280,440 500,470 480,610 320,580" fill="#EFE0BE" stroke="#C5B28B" strokeWidth="2" />
        {/* Book Binding Stitching & Lines */}
        <line x1="280" y1="440" x2="320" y2="580" stroke="#8C6D3B" strokeWidth="3" />
        <line x1="90" y1="510" x2="250" y2="480" stroke="#4A381E" strokeWidth="1.5" opacity="0.6" strokeDasharray="6 4" />
        <line x1="100" y1="540" x2="260" y2="510" stroke="#4A381E" strokeWidth="1.5" opacity="0.6" strokeDasharray="6 4" />
        <line x1="330" y1="500" x2="470" y2="520" stroke="#4A381E" strokeWidth="1.5" opacity="0.6" strokeDasharray="6 4" />

        {/* Calligraphy Brush (Bút Lông) */}
        <line x1="20" y1="600" x2="340" y2="430" stroke="#3D2516" strokeWidth="10" strokeLinecap="round" />
        <polygon points="340,430 365,415 350,445" fill="#1C1B1A" />

        {/* Jade/Stone Seal (Ấn Triện) */}
        <rect x="230" y="420" width="35" height="35" rx="4" fill="#8B261D" stroke="#D4AF37" strokeWidth="1.5" />
        <circle cx="247" cy="405" r="10" fill="#D4AF37" />
      </g>

      {/* 6. Right Foreground: Flying White Cranes */}
      <g id="flying-cranes" fill="#FFFFFF">
        {/* Crane 1 */}
        <path d="M 980 180 Q 950 160, 920 190 Q 960 195, 980 180 Z" fill="#FFFFFF" />
        <path d="M 980 180 Q 1020 150, 1050 170 Q 1000 190, 980 180 Z" fill="#FFFFFF" />
        <circle cx="1055" cy="168" r="3" fill="#D8232A" />

        {/* Crane 2 */}
        <path d="M 1060 240 Q 1030 220, 1000 250 Q 1040 255, 1060 240 Z" fill="#FFFFFF" />
        <path d="M 1060 240 Q 1100 210, 1130 230 Q 1080 250, 1060 240 Z" fill="#FFFFFF" />

        {/* Crane 3 */}
        <path d="M 880 230 Q 860 215, 840 235 Q 870 240, 880 230 Z" fill="#FFFFFF" opacity="0.9" />
        <path d="M 880 230 Q 910 205, 930 220 Q 895 238, 880 230 Z" fill="#FFFFFF" opacity="0.9" />
      </g>

      {/* 7. Right Foreground: Lotus Flowers & Dong Son Bronze Drum */}
      <g id="lotus-and-bronze-drum">
        {/* Lotus Leaves (Lá Sen Green) */}
        <circle cx="1120" cy="560" r="90" fill="#2E5A36" opacity="0.95" />
        <circle cx="980" cy="600" r="70" fill="#3D7047" opacity="0.9" />

        {/* Lotus Blossoms (Hoa Sen Pink) */}
        <g id="lotus-flowers">
          {/* Flower 1 */}
          <path d="M 1080 500 C 1060 450, 1080 430, 1080 430 C 1080 430, 1100 450, 1080 500 Z" fill="#F48FB1" />
          <path d="M 1060 510 C 1030 470, 1050 440, 1050 440 C 1050 440, 1080 470, 1060 510 Z" fill="#F06292" />
          <path d="M 1100 510 C 1130 470, 1110 440, 1110 440 C 1110 440, 1080 470, 1100 510 Z" fill="#F06292" />

          {/* Flower 2 */}
          <path d="M 960 530 C 945 490, 960 475, 960 475 C 960 475, 975 490, 960 530 Z" fill="#F8BBD0" />
        </g>

        {/* Dong Son Bronze Drum on Stand (Trống Đồng) */}
        <g transform="translate(940, 440)">
          {/* Wooden Stand */}
          <rect x="-10" y="80" width="120" height="40" fill="#3A2218" rx="4" />
          <line x1="0" y1="120" x2="-20" y2="170" stroke="#3A2218" strokeWidth="8" />
          <line x1="100" y1="120" x2="120" y2="170" stroke="#3A2218" strokeWidth="8" />

          {/* Bronze Drum Body */}
          <ellipse cx="50" cy="20" rx="60" ry="20" fill="url(#bannerGold)" stroke="#7A5A1C" strokeWidth="2" />
          <rect x="-10" y="20" width="120" height="60" fill="url(#bannerGold)" stroke="#7A5A1C" strokeWidth="2" />
          <ellipse cx="50" cy="80" rx="60" ry="20" fill="#B3892D" stroke="#7A5A1C" strokeWidth="2" />

          {/* Drum Top Star Pattern */}
          <circle cx="50" cy="20" r="14" fill="#7A5A1C" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={`star-${i}`}
              x1="50"
              y1="20"
              x2={50 + 12 * Math.cos((i * Math.PI) / 4)}
              y2={20 + 12 * Math.sin((i * Math.PI) / 4)}
              stroke="#FDF0BD"
              strokeWidth="2"
            />
          ))}
        </g>
      </g>
    </svg>
  );
}
