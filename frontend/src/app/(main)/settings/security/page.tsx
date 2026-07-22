/**
 * @project AncestorTree
 * @file src/app/(main)/settings/security/page.tsx
 * @description Modern UI/UX MFA (TOTP) self-service setup page.
 *              Users can enroll Google Authenticator, view enrolled factors, and unenroll.
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  ShieldCheck,
  ShieldOff,
  Smartphone,
  Info,
  Loader2,
  QrCode,
  CheckCircle,
  ArrowLeft,
  Lock,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface TotpFactor {
  id: string;
  friendly_name?: string;
  status: 'verified' | 'unverified';
}

interface EnrollState {
  factorId: string;
  qrCode: string;
  secret: string;
}

const isDesktop = process.env.NEXT_PUBLIC_DESKTOP_MODE === 'true';

export default function SecurityPage() {
  const [factors, setFactors] = useState<TotpFactor[]>([]);
  const [isLoadingFactors, setIsLoadingFactors] = useState(true);
  const [enrollState, setEnrollState] = useState<EnrollState | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [unenrollId, setUnenrollId] = useState<string | null>(null);
  const [isUnenrolling, setIsUnenrolling] = useState(false);

  const loadFactors = async () => {
    setIsLoadingFactors(true);
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      const totp = (user?.factors ?? []).filter(
        (f) => f.factor_type === 'totp'
      ) as TotpFactor[];
      setFactors(totp);
    } catch (err) {
      console.error('Failed to load MFA factors', err);
    } finally {
      setIsLoadingFactors(false);
    }
  };

  useEffect(() => {
    if (!isDesktop) loadFactors();
    else setIsLoadingFactors(false);
  }, []);

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'AncestorTree',
        friendlyName: 'Google Authenticator',
      });
      if (error) throw error;
      setEnrollState({
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      });
      setTotpCode('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi khởi tạo xác thực');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleVerifyEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollState || totpCode.length !== 6) return;
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: enrollState.factorId,
        code: totpCode,
      });
      if (error) throw error;
      toast.success('Xác thực 2 bước đã được kích hoạt thành công!');
      const totp = ((data.user.factors ?? []).filter(
        (f) => f.factor_type === 'totp'
      )) as TotpFactor[];
      setFactors(
        totp.length > 0
          ? totp
          : [{ id: enrollState.factorId, friendly_name: 'Google Authenticator', status: 'verified' }]
      );
      setEnrollState(null);
      setTotpCode('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Mã xác thực không đúng. Vui lòng thử lại.');
      setTotpCode('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancelEnroll = async () => {
    if (enrollState) {
      await supabase.auth.mfa.unenroll({ factorId: enrollState.factorId }).catch(() => null);
    }
    setEnrollState(null);
    setTotpCode('');
  };

  const handleUnenroll = async () => {
    if (!unenrollId) return;
    setIsUnenrolling(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: unenrollId });
      if (error) throw error;
      toast.success('Đã tắt xác thực 2 bước thành công.');
      setFactors((prev) => prev.filter((f) => f.id !== unenrollId));
      setUnenrollId(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi tắt xác thực');
    } finally {
      setIsUnenrolling(false);
    }
  };

  const verifiedFactors = factors.filter((f) => f.status === 'verified');
  const hasVerifiedMfa = verifiedFactors.length > 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6 pb-24">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <ShieldCheck className="h-56 w-56" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <ShieldCheck className="h-6 w-6 text-purple-200" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Bảo Mật Tài Khoản &amp; MFA</h1>
                <p className="text-xs sm:text-sm text-purple-100/90 mt-0.5">
                  Thiết lập xác thực 2 lớp (Google Authenticator) để bảo vệ tài khoản tối đa
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

      {isDesktop ? (
        <Card className="border-amber-200 bg-amber-50/40 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-amber-900 dark:text-amber-200">
              <Info className="h-5 w-5 text-amber-600" />
              Không áp dụng cho chế độ Desktop Offline
            </CardTitle>
            <CardDescription className="text-xs">
              Tính năng xác thực 2 bước (MFA/TOTP) yêu cầu kết nối với Cloud Server Supabase. Bản Desktop offline được bảo mật hoàn toàn cục bộ trên máy tính của bạn.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {/* Main MFA Setup Card */}
          <Card className="shadow-sm border-border/80">
            <CardHeader className="bg-muted/20 border-b pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-purple-600" />
                  Xác thực 2 bước qua Ứng dụng (TOTP)
                </CardTitle>
                {hasVerifiedMfa && (
                  <Badge className="bg-emerald-600 text-white font-bold text-xs gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Đã bảo vệ
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingFactors ? (
                <div className="space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-10 w-40" />
                </div>
              ) : enrollState ? (
                /* Enrollment Wizard */
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 space-y-1">
                    <p className="font-bold text-sm text-purple-900 dark:text-purple-200 flex items-center gap-2">
                      <QrCode className="h-4 w-4 text-purple-600" /> Bước 1: Quét mã QR vào Google Authenticator
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mở ứng dụng Google Authenticator hoặc Authy trên điện thoại → Chọn Thêm mã → Quét hình vuông bên dưới:
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="p-4 border-2 border-dashed border-purple-300 rounded-2xl bg-white shadow-md">
                      <Image
                        src={enrollState.qrCode}
                        alt="Mã QR Authenticator"
                        width={190}
                        height={190}
                        unoptimized
                      />
                    </div>
                  </div>

                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground font-medium">
                      Không quét được mã QR? Nhấp để nhập mã khóa thủ công
                    </summary>
                    <div className="mt-2 p-3 bg-muted rounded-xl font-mono text-xs break-all select-all border">
                      {enrollState.secret}
                    </div>
                  </details>

                  <form onSubmit={handleVerifyEnroll} className="space-y-4 pt-2 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="enroll-code" className="text-xs font-bold uppercase text-muted-foreground">
                        Bước 2: Nhập 6 chữ số từ ứng dụng xác thực
                      </Label>
                      <Input
                        id="enroll-code"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="000000"
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="text-center text-2xl tracking-[0.5em] font-mono font-bold max-w-[220px] mx-auto h-12 border-purple-400 focus:ring-2 focus:ring-purple-500"
                        autoFocus
                      />
                    </div>

                    <div className="flex justify-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEnroll}
                        disabled={isVerifying}
                        size="sm"
                      >
                        Hủy bỏ
                      </Button>
                      <Button
                        type="submit"
                        disabled={isVerifying || totpCode.length !== 6}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2"
                      >
                        {isVerifying ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Đang kiểm tra...</>
                        ) : (
                          <><CheckCircle className="h-4 w-4" /> Kích hoạt Xác thực 2 bước</>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : hasVerifiedMfa ? (
                /* Enrolled list */
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Tài khoản của bạn đã được bảo vệ bằng lớp xác thực thứ hai. Mỗi khi đăng nhập, hệ thống sẽ yêu cầu nhập mã 6 số ngẫu nhiên từ điện thoại.
                  </p>
                  <div className="space-y-3">
                    {verifiedFactors.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            <Smartphone className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              {f.friendly_name || 'Google Authenticator / Authy'}
                            </p>
                            <p className="text-xs text-emerald-600 font-medium">Trạng thái: Hoạt động an toàn</p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs gap-1.5"
                          onClick={() => setUnenrollId(f.id)}
                        >
                          <ShieldOff className="h-3.5 w-3.5" /> Tắt MFA
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Not enrolled state */
                <div className="space-y-4 py-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Xác thực 2 bước (MFA) chưa được bật. Khi bật tính năng này, kẻ gian không thể đăng nhập vào tài khoản của bạn dù có biết mật khẩu.
                  </p>
                  <Button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2 text-xs shadow-sm"
                  >
                    {isEnrolling ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Đang tạo mã...</>
                    ) : (
                      <><ShieldCheck className="h-4 w-4" /> Bật Xác thực 2 bước ngay</>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Unenroll confirm modal */}
      <AlertDialog open={!!unenrollId} onOpenChange={(open) => { if (!open) setUnenrollId(null); }}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-rose-600">
              <ShieldOff className="h-5 w-5" /> Tắt xác thực 2 bước?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Sau khi tắt, tài khoản chỉ được bảo vệ duy nhất bằng mật khẩu. Bạn có chắc chắn muốn tiếp tục?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Giữ lại bảo mật</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnenroll}
              disabled={isUnenrolling}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
            >
              {isUnenrolling ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Đang tắt...</>
              ) : (
                'Tắt xác thực MFA'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
