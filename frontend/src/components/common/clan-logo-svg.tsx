/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/components/common/clan-logo-svg.tsx
 * @description Pixel-perfect, scalable SVG logo emblem for "Tộc Phạm Văn An Trạch"
 * featuring Dong Son drum motif, family tree, Chinese character "范" (Phạm),
 * rice ears, bamboo leaves, and classical typography.
 */

import React from 'react';

interface ClanLogoSvgProps {
  className?: string;
  size?: number | string;
  showTextBelow?: boolean;
}

export function ClanLogoSvg({
  className = '',
  size = 40,
  showTextBelow = false,
}: ClanLogoSvgProps) {
  return (
    <svg
      viewBox={showTextBelow ? "0 0 500 580" : "0 0 500 500"}
      width={size}
      height={showTextBelow ? (typeof size === 'number' ? size * 1.16 : 'auto') : size}
      className={`select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Crimson Red Gradient */}
        <linearGradient id="pvtCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9C1C23" />
          <stop offset="50%" stopColor="#7F1319" />
          <stop offset="100%" stopColor="#5E0B10" />
        </linearGradient>

        {/* Imperial Gold Gradient */}
        <linearGradient id="pvtGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ECC875" />
          <stop offset="40%" stopColor="#C99E38" />
          <stop offset="100%" stopColor="#96701B" />
        </linearGradient>

        {/* Outer Ring Gold */}
        <linearGradient id="pvtRingGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B88E33" />
          <stop offset="25%" stopColor="#EAD087" />
          <stop offset="50%" stopColor="#A87E28" />
          <stop offset="75%" stopColor="#EAD087" />
          <stop offset="100%" stopColor="#B88E33" />
        </linearGradient>

        {/* Soft Background Fill */}
        <radialGradient id="pvtBg" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FAF6EE" stopOpacity="0.9" />
        </radialGradient>
      </defs>

      {/* Main Emblem Group centered at (250, 240) */}
      <g id="emblem-group">
        {/* Background Circle */}
        <circle cx="250" cy="240" r="225" fill="url(#pvtBg)" />

        {/* 1. Dong Son Outer Concentric Rings */}
        <circle cx="250" cy="240" r="220" fill="none" stroke="url(#pvtRingGold)" strokeWidth="3" />
        <circle cx="250" cy="240" r="214" fill="none" stroke="url(#pvtRingGold)" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="250" cy="240" r="207" fill="none" stroke="url(#pvtRingGold)" strokeWidth="2" />
        <circle cx="250" cy="240" r="198" fill="none" stroke="url(#pvtRingGold)" strokeWidth="1" strokeDasharray="4 3" />
        <circle cx="250" cy="240" r="190" fill="none" stroke="url(#pvtRingGold)" strokeWidth="2.5" />

        {/* 2. Dong Son Pattern - Tangential Birds Ring (Chim Lạc motif) */}
        <g fill="url(#pvtRingGold)" opacity="0.85">
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <g key={i} transform={`rotate(${angle} 250 240)`}>
                {/* Stylized Chim Lạc icon flying counter-clockwise */}
                <path d="M 250 48 C 254 46, 258 49, 257 53 C 254 55, 249 53, 245 57 C 242 60, 240 64, 237 61 C 241 57, 246 51, 250 48 Z" />
                <circle cx="250" cy="67" r="1.5" />
              </g>
            );
          })}
        </g>

        {/* Inner Border Rings */}
        <circle cx="250" cy="240" r="176" fill="none" stroke="url(#pvtRingGold)" strokeWidth="2" />
        <circle cx="250" cy="240" r="170" fill="none" stroke="url(#pvtRingGold)" strokeWidth="1" strokeDasharray="2 2" />

        {/* 3. Family Tree Structure (Cây Gia Phả) */}
        {/* Tree Roots & Trunk */}
        <g id="tree-trunk" fill="url(#pvtCrimson)">
          {/* Main Trunk & Root Base */}
          <path d="M 230 300 C 230 280, 235 250, 222 230 C 215 218, 202 212, 195 205 C 190 200, 195 194, 202 196 C 215 200, 226 212, 235 224 C 240 230, 245 220, 248 200 C 250 185, 245 170, 240 155 C 245 152, 255 152, 260 155 C 255 170, 250 185, 252 200 C 255 220, 260 230, 265 224 C 274 212, 285 200, 298 196 C 305 194, 310 200, 305 205 C 298 212, 285 218, 278 230 C 265 250, 270 280, 270 300 C 285 305, 305 300, 320 295 C 310 305, 290 310, 275 308 C 265 315, 250 318, 235 308 C 220 310, 200 305, 180 295 C 195 300, 215 305, 230 300 Z" />

          {/* Upper Tree Canopy Branching Structure */}
          <path d="M 245 160 C 230 145, 210 135, 190 135 C 185 135, 185 128, 192 128 C 215 128, 235 140, 248 152 Z" />
          <path d="M 255 160 C 270 145, 290 135, 310 135 C 315 135, 315 128, 308 128 C 285 128, 265 140, 252 152 Z" />
          <path d="M 248 140 C 240 120, 225 105, 205 95 C 202 93, 205 88, 210 90 C 230 100, 245 118, 250 135 Z" />
          <path d="M 252 140 C 260 120, 275 105, 295 95 C 298 93, 295 88, 290 90 C 270 100, 255 118, 250 135 Z" />
        </g>

        {/* Tree Leaves Canopy (Rực rỡ Đỏ Đô & Vàng Hoàng Gia) */}
        <g id="tree-leaves">
          {/* Crimson Red Leaves */}
          <g fill="url(#pvtCrimson)">
            {/* Top Canopy Center */}
            <path d="M 250 80 C 242 65, 250 50, 250 50 C 250 50, 258 65, 250 80 Z" />
            <path d="M 235 88 C 223 76, 227 60, 227 60 C 227 60, 239 72, 235 88 Z" />
            <path d="M 265 88 C 277 76, 273 60, 273 60 C 273 60, 261 72, 265 88 Z" />

            {/* Upper Left Cluster */}
            <path d="M 215 98 C 200 88, 202 72, 202 72 C 202 72, 217 80, 215 98 Z" />
            <path d="M 195 108 C 178 100, 178 84, 178 84 C 178 84, 195 90, 195 108 Z" />
            <path d="M 180 122 C 162 116, 160 100, 160 100 C 160 100, 178 104, 180 122 Z" />
            <path d="M 168 140 C 150 136, 146 120, 146 120 C 146 120, 164 122, 168 140 Z" />

            {/* Upper Right Cluster */}
            <path d="M 285 98 C 300 88, 298 72, 298 72 C 298 72, 283 80, 285 98 Z" />
            <path d="M 305 108 C 322 100, 322 84, 322 84 C 322 84, 305 90, 305 108 Z" />
            <path d="M 320 122 C 338 116, 340 100, 340 100 C 340 100, 322 104, 320 122 Z" />
            <path d="M 332 140 C 350 136, 354 120, 354 120 C 354 120, 336 122, 332 140 Z" />

            {/* Mid Outer Wings Red */}
            <path d="M 158 160 C 140 160, 134 145, 134 145 C 134 145, 152 144, 158 160 Z" />
            <path d="M 152 180 C 135 184, 126 170, 126 170 C 126 170, 144 167, 152 180 Z" />
            <path d="M 342 160 C 360 160, 366 145, 366 145 C 366 145, 348 144, 342 160 Z" />
            <path d="M 348 180 C 365 184, 374 170, 374 170 C 374 170, 356 167, 348 180 Z" />

            {/* Lower Hanging Red Leaves */}
            <path d="M 158 200 C 142 208, 132 195, 132 195 C 132 195, 150 189, 158 200 Z" />
            <path d="M 342 200 C 358 208, 368 195, 368 195 C 368 195, 350 189, 342 200 Z" />
          </g>

          {/* Imperial Gold Interspersed Leaves */}
          <g fill="url(#pvtGold)">
            <path d="M 224 75 C 214 62, 220 48, 220 48 C 220 48, 230 60, 224 75 Z" />
            <path d="M 276 75 C 286 62, 280 48, 280 48 C 280 48, 270 60, 276 75 Z" />
            <path d="M 205 90 C 190 80, 194 65, 194 65 C 194 65, 208 72, 205 90 Z" />
            <path d="M 295 90 C 310 80, 306 65, 306 65 C 306 65, 292 72, 295 90 Z" />
            <path d="M 184 105 C 168 98, 170 82, 170 82 C 170 82, 186 88, 184 105 Z" />
            <path d="M 316 105 C 332 98, 330 82, 330 82 C 330 82, 314 88, 316 105 Z" />
            <path d="M 170 125 C 152 120, 152 104, 152 104 C 152 104, 170 108, 170 125 Z" />
            <path d="M 330 125 C 348 120, 348 104, 348 104 C 348 104, 330 108, 330 125 Z" />
            <path d="M 160 150 C 142 148, 140 132, 140 132 C 140 132, 158 134, 160 150 Z" />
            <path d="M 340 150 C 358 148, 360 132, 360 132 C 360 132, 342 134, 340 150 Z" />
            <path d="M 154 170 C 136 172, 130 158, 130 158 C 130 158, 148 156, 154 170 Z" />
            <path d="M 346 170 C 364 172, 370 158, 370 158 C 370 158, 352 156, 346 170 Z" />
            <path d="M 162 190 C 146 195, 138 182, 138 182 C 138 182, 154 178, 162 190 Z" />
            <path d="M 338 190 C 354 195, 362 182, 362 182 C 362 182, 346 178, 338 190 Z" />
          </g>
        </g>

        {/* 4. Classical Hán tự CHỮ PHẠM "范" inside central canopy space */}
        <g id="han-tu-pham" transform="translate(0, 5)">
          {/* Subtle background highlight behind character */}
          <circle cx="250" cy="235" r="42" fill="#FFFFFF" opacity="0.9" />

          {/* Calligraphic Hán tự "范" */}
          <text
            x="250"
            y="262"
            fontFamily="'Noto Serif SC', 'Songti SC', 'SimSun', 'Playfair Display', 'Times New Roman', serif"
            fontWeight="900"
            fontSize="102"
            fill="url(#pvtCrimson)"
            textAnchor="middle"
            style={{ filter: 'drop-shadow(0px 1px 1px rgba(120,20,25,0.2))' }}
          >
            范
          </text>
        </g>

        {/* 5. Bottom Twin Wreath (Bông Lúa Vàng & Lá Trúc Đỏ) */}
        <g id="wreath-and-bamboo">
          {/* Left Rice Wreath */}
          <g fill="url(#pvtGold)">
            {Array.from({ length: 9 }).map((_, i) => {
              const ang = -140 + i * 14;
              const rad = (ang * Math.PI) / 180;
              const cx = 250 + 165 * Math.cos(rad);
              const cy = 240 + 165 * Math.sin(rad);
              const rot = ang + 90;
              return (
                <g key={`rice-l-${i}`} transform={`translate(${cx}, ${cy}) rotate(${rot})`}>
                  <path d="M 0 -10 C 6 -5, 6 5, 0 10 C -6 5, -6 -5, 0 -10 Z" />
                </g>
              );
            })}
          </g>

          {/* Right Rice Wreath */}
          <g fill="url(#pvtGold)">
            {Array.from({ length: 9 }).map((_, i) => {
              const ang = -40 - i * 14;
              const rad = (ang * Math.PI) / 180;
              const cx = 250 + 165 * Math.cos(rad);
              const cy = 240 + 165 * Math.sin(rad);
              const rot = ang - 90;
              return (
                <g key={`rice-r-${i}`} transform={`translate(${cx}, ${cy}) rotate(${rot})`}>
                  <path d="M 0 -10 C 6 -5, 6 5, 0 10 C -6 5, -6 -5, 0 -10 Z" />
                </g>
              );
            })}
          </g>

          {/* Lower Bamboo Leaf Sprigs (Cành Trúc) */}
          <g fill="url(#pvtCrimson)">
            {/* Left Bamboo Cluster */}
            <path d="M 215 365 C 190 380, 160 385, 140 370 C 165 370, 195 365, 215 365 Z" />
            <path d="M 225 375 C 205 398, 175 410, 150 400 C 178 395, 205 385, 225 375 Z" />
            <path d="M 235 380 C 220 410, 195 425, 175 420 C 198 412, 220 398, 235 380 Z" />

            {/* Right Bamboo Cluster */}
            <path d="M 285 365 C 310 380, 340 385, 360 370 C 335 370, 305 365, 285 365 Z" />
            <path d="M 275 375 C 295 398, 325 410, 350 400 C 322 395, 295 385, 275 375 Z" />
            <path d="M 265 380 C 280 410, 305 425, 325 420 C 302 412, 280 398, 265 380 Z" />
          </g>

          {/* Central Flower Emblem at Bottom Center */}
          <g transform="translate(250, 362)">
            {/* Outer Petals */}
            {Array.from({ length: 6 }).map((_, i) => (
              <path
                key={`petal-${i}`}
                d="M 0 0 C -8 -15, 0 -22, 0 -22 C 0 -22, 8 -15, 0 0 Z"
                fill="url(#pvtGold)"
                transform={`rotate(${i * 60})`}
              />
            ))}
            {/* Center Golden Core */}
            <circle cx="0" cy="0" r="6" fill="url(#pvtCrimson)" />
            <circle cx="0" cy="0" r="3" fill="#EAD087" />
          </g>
        </g>
      </g>

      {/* 6. Typography Below Emblem (TỘC PHẠM VĂN / AN TRẠCH) */}
      {showTextBelow && (
        <g id="typography-group">
          {/* Main Title: TỘC PHẠM VĂN */}
          <text
            x="250"
            y="505"
            fontFamily="'Cinzel', 'Noto Serif', 'Times New Roman', 'Playfair Display', serif"
            fontWeight="900"
            fontSize="46"
            letterSpacing="3.5"
            fill="url(#pvtCrimson)"
            textAnchor="middle"
            style={{ filter: 'drop-shadow(0px 1px 1px rgba(120,20,25,0.15))' }}
          >
            TỘC PHẠM VĂN
          </text>

          {/* Subtitle: AN TRẠCH */}
          <text
            x="250"
            y="552"
            fontFamily="'Cinzel', 'Noto Serif', 'Times New Roman', 'Playfair Display', serif"
            fontWeight="700"
            fontSize="32"
            letterSpacing="7"
            fill="url(#pvtCrimson)"
            textAnchor="middle"
          >
            AN TRẠCH
          </text>
        </g>
      )}
    </svg>
  );
}
