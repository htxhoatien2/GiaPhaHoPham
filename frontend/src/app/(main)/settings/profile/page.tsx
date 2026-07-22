/**
 * @project AncestorTree
 * @file src/app/(main)/settings/profile/page.tsx
 * @description Modern UI/UX User profile settings — edit display name, view account info,
 *              and change password with avatar initials.
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useUpdateProfile } from '@/hooks/use-profiles';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  User,
  KeyRound,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Mail,
  Shield,
  Sparkles,
  Save,
  ShieldCheck,
  Calendar,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

const roleLabels: Record<string, { label: string; color: string }> = {
  admin: { label: 'Quản trị viên', color: 'bg-rose-500 text-white' },
  editor: { label: 'Biên tập viên', color: 'bg-blue-600 text-white' },
  viewer: { label: 'Thành viên người xem', color: 'bg-emerald-600 text-white' },
};

function getInitials(name?: string | null, email?: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(' ');
    return parts[parts.length - 1].charAt(0).toUpperCase();
  }
  return (email?.charAt(0) ?? '?').toUpperCase();
}

function ProfileForm() {
  const { user, profile, refreshProfile } = useAuth();
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setIsDirty(false);
  }, [profile?.full_name]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.user_id) return;
    try {
      await updateProfile.mutateAsync({
        userId: profile.user_id,
        input: { full_name: fullName.trim() },
      });
      await supabase.auth.updateUser({ data: { full_name: fullName.trim() } });
      await refreshProfile();
      toast.success('Đã cập nhật tên hiển thị thành công!');
      setIsDirty(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi lưu thông tin');
    }
  };

  const roleInfo = roleLabels[profile?.role ?? 'viewer'] ?? roleLabels.viewer;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Avatar Header */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border bg-muted/20">
        <Avatar className="h-20 w-20 border-4 border-background shadow-md">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-2xl font-bold">
            {getInitials(profile?.full_name, user?.email)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="font-extrabold text-xl text-foreground">{profile?.full_name || 'Chưa cập nhật tên'}</h2>
            <Badge className={`${roleInfo.color} text-xs font-bold`}>{roleInfo.label}</Badge>
          </div>
          <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
            <Mail className="h-3.5 w-3.5 text-blue-600" /> {user?.email}
          </p>
        </div>
      </div>

      <Separator />

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="full-name" className="text-xs font-semibold uppercase text-muted-foreground">Tên hiển thị trên hệ thống *</Label>
          <Input
            id="full-name"
            placeholder="VD: Nguyễn Văn Anh"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setIsDirty(e.target.value.trim() !== (profile?.full_name ?? ''));
            }}
            maxLength={100}
            className="mt-1"
          />
          <p className="text-[11px] text-muted-foreground">Tên hiển thị với con cháu và trong các bài viết, bình luận</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" /> Địa chỉ Email (Đăng nhập)
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="email"
              value={user?.email ?? ''}
              readOnly
              className="bg-muted/50 cursor-not-allowed text-xs font-mono"
            />
            {user?.email_confirmed_at && (
              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-300 shrink-0 gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Đã xác thực
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-3 rounded-xl border bg-card space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-blue-600" /> Ngày khởi tạo tài khoản
            </span>
            <p className="font-bold text-foreground">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
                : '—'}
            </p>
          </div>
          <div className="p-3 rounded-xl border bg-card space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Vai trò tài khoản
            </span>
            <p className="font-bold text-foreground">{roleInfo.label}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={!isDirty || updateProfile.isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-sm text-xs"
        >
          {updateProfile.isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...</>
          ) : (
            <><Save className="h-4 w-4" /> Lưu thông tin cá nhân</>
          )}
        </Button>
      </div>
    </form>
  );
}

function PasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const isValid = newPassword.length >= 8 && passwordsMatch;

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsChanging(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Đã đổi mật khẩu thành công!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi đổi mật khẩu');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <form onSubmit={handleChange} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="new-password" className="text-xs font-semibold uppercase text-muted-foreground">Mật khẩu mới</Label>
        <Input
          id="new-password"
          type="password"
          placeholder="Tối thiểu 8 ký tự"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm-password" className="text-xs font-semibold uppercase text-muted-foreground">Xác nhận mật khẩu mới</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {confirmPassword && !passwordsMatch && (
          <p className="text-xs text-rose-600 font-medium">⚠️ Mật khẩu xác nhận không khớp.</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={!isValid || isChanging}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 text-xs shadow-sm"
        >
          {isChanging ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Đang cập nhật...</>
          ) : (
            <><KeyRound className="h-4 w-4" /> Đổi mật khẩu</>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6 pb-24">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <User className="h-56 w-56" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <User className="h-6 w-6 text-blue-200" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Hồ Sơ Cá Nhân</h1>
                <p className="text-xs sm:text-sm text-blue-100/90 mt-0.5">
                  Quản lý tên hiển thị, mật khẩu và thông tin tài khoản thành viên
                </p>
              </div>
            </div>
            <Button asChild variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/20 text-xs backdrop-blur">
              <Link href="/">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Info Card */}
      <Card className="shadow-sm border-border/80">
        <CardHeader className="bg-muted/20 border-b pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            Cài đặt thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ProfileForm />
        </CardContent>
      </Card>

      {/* Security Password Card */}
      <Card className="shadow-sm border-border/80">
        <CardHeader className="bg-muted/20 border-b pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4 text-indigo-600" />
            Đổi mật khẩu tài khoản
          </CardTitle>
          <CardDescription className="text-xs">Tạo mật khẩu mạnh có ít nhất 8 ký tự để bảo vệ tài khoản</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
