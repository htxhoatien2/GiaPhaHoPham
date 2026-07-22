/**
 * @project AncestorTree
 * @file src/components/common/page-header.tsx
 * @description State-of-the-art unified page header component with gradient banners, badges, and action toolbars
 * @version 2.5.0
 * @updated 2026-07-23
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, LucideIcon } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  badgeColor?: string;
  theme?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'blue' | 'slate';
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

const themeStyles = {
  emerald: {
    banner: 'bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white',
    iconBg: 'bg-white/10 text-emerald-200 border-white/20',
    badgeBg: 'bg-amber-500 text-black font-bold',
    subText: 'text-emerald-100/90',
  },
  indigo: {
    banner: 'bg-gradient-to-r from-blue-700 via-indigo-900 to-slate-900 text-white',
    iconBg: 'bg-white/10 text-blue-200 border-white/20',
    badgeBg: 'bg-amber-400 text-black font-bold',
    subText: 'text-blue-100/90',
  },
  amber: {
    banner: 'bg-gradient-to-r from-amber-800 via-orange-900 to-slate-900 text-white',
    iconBg: 'bg-white/10 text-amber-200 border-white/20',
    badgeBg: 'bg-amber-400 text-black font-bold',
    subText: 'text-amber-100/90',
  },
  rose: {
    banner: 'bg-gradient-to-r from-rose-800 via-red-900 to-slate-900 text-white',
    iconBg: 'bg-white/10 text-rose-200 border-white/20',
    badgeBg: 'bg-white text-rose-800 font-bold',
    subText: 'text-rose-100/90',
  },
  blue: {
    banner: 'bg-gradient-to-r from-sky-800 via-blue-900 to-slate-900 text-white',
    iconBg: 'bg-white/10 text-sky-200 border-white/20',
    badgeBg: 'bg-amber-400 text-black font-bold',
    subText: 'text-sky-100/90',
  },
  slate: {
    banner: 'bg-gradient-to-r from-slate-800 via-slate-900 to-zinc-950 text-white',
    iconBg: 'bg-white/10 text-slate-200 border-white/20',
    badgeBg: 'bg-emerald-500 text-white font-bold',
    subText: 'text-slate-200/90',
  },
};

export function PageHeader({
  title,
  description,
  icon: Icon,
  badge,
  theme = 'indigo',
  actions,
  breadcrumbs,
  className = '',
}: PageHeaderProps) {
  const currentTheme = themeStyles[theme] || themeStyles.indigo;

  return (
    <div className={`relative overflow-hidden rounded-2xl ${currentTheme.banner} p-6 sm:p-8 shadow-xl ${className}`}>
      {/* Background Decorative Icon */}
      {Icon && (
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <Icon className="h-60 w-60" />
        </div>
      )}

      <div className="relative z-10 space-y-4">
        {/* Optional Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-white/70">
            <Link href="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            {breadcrumbs.map((item, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="h-3 w-3 opacity-60" />
                {item.href ? (
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white font-semibold">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Header Main Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            {Icon && (
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl backdrop-blur border ${currentTheme.iconBg}`}>
                <Icon className="h-6 w-6" />
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
                {badge && (
                  <Badge className={`${currentTheme.badgeBg} text-xs px-2.5 py-0.5 rounded-full shadow-xs`}>
                    {badge}
                  </Badge>
                )}
              </div>
              {description && (
                <p className={`text-xs sm:text-sm ${currentTheme.subText} max-w-2xl leading-relaxed`}>
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          {actions && (
            <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
