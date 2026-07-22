/**
 * @project AncestorTree
 * @file src/components/layout/app-sidebar.tsx
 * @description Modern state-of-the-art navigation sidebar for Frontend & Backend (Admin)
 * @version 3.0.0
 * @updated 2026-07-21
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ClanLogo } from '@/components/common/clan-logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  GitBranchPlus,
  Users,
  BookUser,
  Calendar,
  FileText,
  Settings,
  UserCog,
  ClipboardList,
  LogOut,
  LogIn,
  UserPlus,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  UserCircle,
  Trophy,
  BookOpen,
  ScrollText,
  RotateCcw,
  DatabaseBackup,
  HelpCircle,
  Download,
  Upload,
  Copy,
  Route,
  BarChart3,
  MessageSquare,
  Bell,
  Landmark,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useElderly } from '@/contexts/elderly-context';
import { CLAN_NAME, CLAN_FULL_NAME } from '@/lib/clan-config';
import { useClanSettings } from '@/hooks/use-clan-settings';

function deriveInitial(name: string): string {
  const parts = name.trim().split(' ');
  return parts.length > 1 ? (parts[parts.length - 1][0] ?? '?') : (parts[0][0] ?? '?');
}

function deriveSubtitle(fullName: string, shortName: string): string {
  return fullName.startsWith(shortName) ? fullName.slice(shortName.length).trim() : '';
}

const mainNavGroup = {
  label: 'Tổng quan & Gia phả',
  items: [
    { title: 'Trang chủ', url: '/', icon: Home },
    { title: 'Cây gia phả', url: '/tree', icon: GitBranchPlus },
    { title: 'Thành viên', url: '/people', icon: Users },
    { title: 'Tìm quan hệ', url: '/relationship', icon: Route },
    { title: 'Lịch cúng lễ', url: '/events', icon: Calendar },
    { title: 'Danh bạ', url: '/directory', icon: BookUser, viewerHidden: true },
  ],
};

const cultureNavGroup = {
  label: 'Văn hóa & Truyền thống',
  items: [
    { title: 'Hương ước dòng họ', url: '/charter', icon: ScrollText },
    { title: 'Cầu đương', url: '/cau-duong', icon: RotateCcw },
    { title: 'Góc giao lưu', url: '/feed', icon: MessageSquare },
    { title: 'Vinh danh', url: '/achievements', icon: Trophy },
    { title: 'Quỹ khuyến học', url: '/fund', icon: BookOpen },
  ],
};

const utilityNavGroup = {
  label: 'Tiện ích & Khác',
  items: [
    { title: 'Thống kê dòng họ', url: '/stats', icon: BarChart3 },
    { title: 'Thông báo', url: '/notifications', icon: Bell },
    { title: 'Đề xuất ý kiến', url: '/contributions', icon: ClipboardList },
    { title: 'Tài liệu dòng họ', url: '/documents', icon: FileText },
    { title: 'Hướng dẫn sử dụng', url: '/help', icon: HelpCircle },
  ],
};

const adminNavItems = [
  { title: 'Bảng điều khiển', url: '/admin', icon: Settings },
  { title: 'Quản lý Người dùng', url: '/admin/users', icon: UserCog },
  { title: 'Duyệt Đề xuất', url: '/admin/contributions', icon: ClipboardList },
  { title: 'QL Lịch cúng lễ', url: '/admin/events', icon: Calendar },
  { title: 'QL Vinh danh', url: '/admin/achievements', icon: Trophy },
  { title: 'QL Quỹ & Học bổng', url: '/admin/fund', icon: BookOpen },
  { title: 'QL Hương ước', url: '/admin/charter', icon: ScrollText },
  { title: 'QL Cầu đương', url: '/admin/cau-duong', icon: RotateCcw },
  { title: 'QL Tài liệu', url: '/admin/documents', icon: FileText },
  { title: 'QL Bài viết', url: '/admin/feed', icon: MessageSquare },
  { title: 'Xuất dữ liệu', url: '/admin/export', icon: Download },
  { title: 'Nhập GEDCOM', url: '/admin/import', icon: Upload },
  { title: 'Kiểm tra trùng lặp', url: '/admin/duplicates', icon: Copy },
  { title: 'Đơn ghi danh', url: '/admin/registrations', icon: Landmark },
  { title: 'Cài đặt Dòng họ', url: '/admin/settings', icon: Settings },
  { title: 'Sao lưu dữ liệu', url: '/admin/backup', icon: DatabaseBackup },
];

const accountNavItems = [
  { title: 'Hồ sơ cá nhân', url: '/settings/profile', icon: UserCircle },
  { title: 'Bảo mật (MFA)', url: '/settings/security', icon: ShieldCheck },
];

const ELDERLY_NAV_URLS = new Set(['/', '/tree', '/people', '/events', '/help']);
const ELDERLY_ADMIN_URLS = new Set(['/admin', '/admin/users', '/admin/contributions']);

function ModernNavItem({ item, isActive }: { item: { title: string; url: string; icon: typeof Home }; isActive: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-emerald-800 to-amber-800 text-white font-bold shadow-md shadow-emerald-950/20'
            : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 font-medium'
        }`}
      >
        <Link href={item.url}>
          <item.icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
          <span className="text-sm tracking-tight">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function AdminNavGroup({ pathname, elderlyMode }: { pathname: string; elderlyMode: boolean }) {
  const isAdminPath = pathname.startsWith('/admin');
  const [open, setOpen] = useState(isAdminPath);

  const items = adminNavItems.filter((item) => !elderlyMode || ELDERLY_ADMIN_URLS.has(item.url));

  return (
    <SidebarGroup className="pt-3">
      <SidebarGroupLabel
        className="cursor-pointer select-none flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-500/10 border border-amber-300/40 rounded-xl mb-2 hover:bg-amber-500/20 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
          Bảng Quản Trị Backend
        </span>
        <ChevronDown className={`h-4 w-4 text-amber-700 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </SidebarGroupLabel>
      {open && (
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1">
            {items.map((item) => {
              const isActive = item.url === '/admin' ? pathname === '/admin' : pathname.startsWith(item.url);
              return <ModernNavItem key={item.url} item={item} isActive={isActive} />;
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user, profile, isAdmin, isEditor, signOut } = useAuth();
  const { elderlyMode } = useElderly();
  const { data: cs } = useClanSettings();
  const clanName = cs?.clan_name ?? CLAN_NAME;
  const clanFullName = cs?.clan_full_name ?? CLAN_FULL_NAME;

  return (
    <Sidebar className="border-r border-slate-200/80 bg-white">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-slate-100 px-4 py-4 bg-slate-50/60">
        <ClanLogo name={clanName} fullName={clanFullName} size="md" clickable={true} />
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 space-y-4">
        {/* Group 1: Main Nav */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1">
            {mainNavGroup.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavGroup.items
                .filter((item) => !item.viewerHidden || isEditor)
                .filter((item) => !elderlyMode || ELDERLY_NAV_URLS.has(item.url))
                .map((item) => {
                  const isActive = item.url === '/' ? pathname === '/' : pathname.startsWith(item.url);
                  return <ModernNavItem key={item.url} item={item} isActive={isActive} />;
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Group 2: Culture & Traditions */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1">
            {cultureNavGroup.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {cultureNavGroup.items
                .filter((item) => !elderlyMode || ELDERLY_NAV_URLS.has(item.url))
                .map((item) => {
                  const isActive = pathname.startsWith(item.url);
                  return <ModernNavItem key={item.url} item={item} isActive={isActive} />;
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Group 3: Utility & Docs */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1">
            {utilityNavGroup.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {utilityNavGroup.items
                .filter((item) => !elderlyMode || ELDERLY_NAV_URLS.has(item.url))
                .map((item) => {
                  const isActive = pathname.startsWith(item.url);
                  return <ModernNavItem key={item.url} item={item} isActive={isActive} />;
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Nav for Logged In Users */}
        {user && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1">
              Cá nhân
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {accountNavItems.map((item) => {
                  const isActive = pathname.startsWith(item.url);
                  return <ModernNavItem key={item.url} item={item} isActive={isActive} />;
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin Panel Group - Admin only */}
        {isAdmin && (
          <AdminNavGroup pathname={pathname} elderlyMode={elderlyMode} />
        )}
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter className="border-t border-slate-100 p-3 bg-slate-50/50">
        <SidebarMenu>
          {user ? (
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-200/60 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="h-8 w-8 shrink-0 ring-2 ring-emerald-500/30">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback className="bg-emerald-800 text-white text-xs font-bold">
                          {getInitials(profile?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start min-w-0">
                        <span className="font-semibold text-xs text-slate-900 truncate max-w-[130px]">
                          {profile?.full_name || user?.email}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                          {profile?.role || 'viewer'}
                        </span>
                      </div>
                    </div>
                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width] rounded-xl shadow-lg border-slate-200">
                  <DropdownMenuItem asChild>
                    <Link href="/settings/profile" className="flex items-center gap-2 text-sm font-medium">
                      <UserCircle className="h-4 w-4 text-emerald-700" />
                      Hồ sơ cá nhân
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings/security" className="flex items-center gap-2 text-sm font-medium">
                      <ShieldCheck className="h-4 w-4 text-emerald-700" />
                      Bảo mật (MFA)
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-sm font-medium text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ) : (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/login'} className="rounded-xl">
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4 text-emerald-700" />
                    <span>Đăng nhập</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/register'} className="rounded-xl">
                  <Link href="/register" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-amber-700" />
                    <span>Đăng ký</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
