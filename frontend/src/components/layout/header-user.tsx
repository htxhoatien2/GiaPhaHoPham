/**
 * @project AncestorTree
 * @file src/components/layout/header-user.tsx
 * @description Modern user badge for top header bar with role pills and dropdown
 * @version 2.0.0
 * @updated 2026-07-21
 */

'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCircle, ShieldCheck, LogOut, ChevronDown } from 'lucide-react';

function getInitials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(' ');
    return parts[parts.length - 1].charAt(0).toUpperCase();
  }
  return (email?.charAt(0) ?? '?').toUpperCase();
}

const roleLabels: Record<string, string> = {
  admin:  'Quản trị viên',
  editor: 'Biên tập viên',
  viewer: 'Người xem',
};

export function HeaderUser() {
  const { user, profile, signOut } = useAuth();
  if (!user) return null;

  const role = profile?.role ?? 'viewer';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white px-3 py-1.5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Tài khoản"
        >
          <Avatar className="h-7 w-7 ring-2 ring-emerald-500/20">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-800 to-amber-800 text-white text-xs font-bold">
              {getInitials(profile?.full_name, user.email)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:block text-xs font-bold text-slate-800 max-w-[130px] truncate">
            {profile?.full_name || user.email}
          </span>
          <Badge
            variant="outline"
            className={`hidden md:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              role === 'admin'
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : role === 'editor'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {roleLabels[role]}
          </Badge>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-slate-200 p-1.5 space-y-1">
        <div className="px-3 py-2 bg-slate-50 rounded-xl space-y-0.5">
          <p className="text-xs font-bold text-slate-900 truncate">{profile?.full_name || 'Thành viên'}</p>
          <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="rounded-xl">
          <Link href="/settings/profile" className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2">
            <UserCircle className="h-4 w-4 text-emerald-700" />
            Hồ sơ cá nhân
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-xl">
          <Link href="/settings/security" className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 py-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            Bảo mật (MFA)
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="rounded-xl flex items-center gap-2.5 text-xs font-semibold text-rose-600 focus:text-rose-700 focus:bg-rose-50 py-2"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
