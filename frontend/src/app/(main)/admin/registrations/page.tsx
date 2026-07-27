/**
 * @project AncestorTree
 * @file src/app/(main)/admin/registrations/page.tsx
 * @description Admin page to review member registration requests
 * @version 1.0.0
 * @updated 2026-03-09
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRegistrations, useApproveRegistration, useRejectRegistration, useDeleteRegistration } from '@/hooks/use-registrations';
import { useSearchPeople } from '@/hooks/use-people';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Textarea } from '@/components/ui/textarea';
import { ClipboardList, Check, X, Trash2, Loader2, Search, ArrowLeft, Users, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { getRelativeTime } from '@/lib/format-utils';
import Link from 'next/link';
import type { MemberRegistration, Person } from '@/types';

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Chờ duyệt', variant: 'default' },
  approved: { label: 'Đã duyệt', variant: 'secondary' },
  rejected: { label: 'Từ chối', variant: 'destructive' },
};

export default function AdminRegistrationsPage() {
  const { isEditor, isAdmin } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [search, setSearch] = useState('');
  const { data: registrations, isLoading } = useRegistrations(statusFilter);
  const approveMutation = useApproveRegistration();
  const rejectMutation = useRejectRegistration();
  const deleteMutation = useDeleteRegistration();

  // Modal states
  const [approveTarget, setApproveTarget] = useState<MemberRegistration | null>(null);
  const [parentSearch, setParentSearch] = useState('');
  const [selectedParent, setSelectedParent] = useState<Person | null>(null);
  const { data: parentSearchResults } = useSearchPeople(parentSearch);

  const [rejectTarget, setRejectTarget] = useState<MemberRegistration | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<MemberRegistration | null>(null);

  if (!isEditor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card><CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Bạn cần quyền biên tập viên để truy cập trang này</p>
          <Button asChild className="mt-4"><Link href="/">Về trang chủ</Link></Button>
        </CardContent></Card>
      </div>
    );
  }

  const filtered = (registrations || []).filter(r =>
    !search || r.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const openApproveModal = (reg: MemberRegistration) => {
    setApproveTarget(reg);
    setParentSearch(reg.parent_name || '');
    setSelectedParent(null);
  };

  const handleConfirmApprove = async () => {
    if (!approveTarget) return;
    try {
      const fatherId = selectedParent?.gender === 1 ? selectedParent.id : undefined;
      const motherId = selectedParent?.gender === 2 ? selectedParent.id : undefined;

      await approveMutation.mutateAsync({
        id: approveTarget.id,
        fatherId,
        motherId,
      });

      toast.success(`Đã duyệt & kết nối thành công ${approveTarget.full_name}`);
      setApproveTarget(null);
      setSelectedParent(null);
    } catch {
      toast.error('Lỗi khi duyệt đơn');
    }
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    try {
      await rejectMutation.mutateAsync({ id: rejectTarget.id, reason: rejectReason });
      toast.success(`Đã từ chối ${rejectTarget.full_name}`);
      setRejectTarget(null);
      setRejectReason('');
    } catch {
      toast.error('Lỗi khi từ chối');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Đã xóa đơn đăng ký');
      setDeleteTarget(null);
    } catch {
      toast.error('Lỗi khi xóa');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-6xl pb-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <ClipboardList className="h-56 w-56 text-blue-200" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white -ml-2">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Bảng quản trị
              </Link>
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <ClipboardList className="h-6 w-6 text-blue-200" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Duyệt Đơn Đăng Ký Thành Viên</h1>
                <p className="text-xs sm:text-sm text-blue-100/90">
                  Xét duyệt đơn đăng ký tham gia gia phả của con cháu sống xa tổ quốc
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs px-3 py-1">
                {(registrations || []).length} Đơn ghi danh
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {statusFilter === 'pending' ? 'Không có đơn chờ duyệt' : 'Không có kết quả'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(reg => (
            <Card key={reg.id}>
              <CardHeader className="pb-2 pt-3 px-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{reg.full_name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {reg.gender === 1 ? 'Nam' : 'Nữ'}
                      {reg.birth_year && ` · Sinh ${reg.birth_year}`}
                      {reg.birth_place && ` · ${reg.birth_place}`}
                    </p>
                  </div>
                  <Badge variant={STATUS_MAP[reg.status]?.variant ?? 'outline'}>
                    {STATUS_MAP[reg.status]?.label ?? reg.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-3 space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {reg.parent_name && (
                    <div><span className="text-muted-foreground">Cha/mẹ: </span>{reg.parent_name}</div>
                  )}
                  {reg.generation && (
                    <div><span className="text-muted-foreground">Đời: </span>{reg.generation}</div>
                  )}
                  {reg.chi && (
                    <div><span className="text-muted-foreground">Chi: </span>{reg.chi}</div>
                  )}
                  {reg.relationship && (
                    <div><span className="text-muted-foreground">Quan hệ: </span>{reg.relationship}</div>
                  )}
                  {reg.phone && (
                    <div><span className="text-muted-foreground">SĐT: </span>{reg.phone}</div>
                  )}
                  {reg.email && (
                    <div><span className="text-muted-foreground">Email: </span>{reg.email}</div>
                  )}
                </div>
                {reg.notes && (
                  <p className="text-xs text-muted-foreground border-t pt-2">{reg.notes}</p>
                )}
                {reg.reject_reason && (
                  <p className="text-xs text-red-500 border-t pt-2">Lý do từ chối: {reg.reject_reason}</p>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-[10px] text-muted-foreground">
                    {getRelativeTime(reg.created_at)}
                  </span>
                  <div className="flex gap-1.5">
                    {reg.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => openApproveModal(reg)}
                          disabled={approveMutation.isPending}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Phê duyệt & Kết nối
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => { setRejectTarget(reg); setRejectReason(''); }}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Từ chối
                        </Button>
                      </>
                    )}
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteTarget(reg)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Approval & Parent Selection Dialog */}
      <AlertDialog open={!!approveTarget} onOpenChange={open => { if (!open) setApproveTarget(null); }}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-emerald-700">
              <UserCheck className="h-5 w-5 text-emerald-600" />
              Phê Duyệt & Kết Nối Vào Cây Gia Phả
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Phê duyệt đơn ghi danh của <strong>{approveTarget?.full_name}</strong> và tự động khởi tạo thành viên trong gia phả.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-xl space-y-1">
              <div><strong>Họ tên:</strong> {approveTarget?.full_name} ({approveTarget?.gender === 1 ? 'Nam' : 'Nữ'})</div>
              <div><strong>Đời thứ:</strong> {approveTarget?.generation || '1'} &bull; <strong>Chi:</strong> {approveTarget?.chi || '1'}</div>
              <div><strong>Quê quán:</strong> {approveTarget?.birth_place || 'Chưa rõ'}</div>
              <div><strong>Tên Cha/Mẹ tự khai:</strong> <span className="text-amber-600 font-semibold">{approveTarget?.parent_name || 'Chưa điền'}</span></div>
            </div>

            <div className="space-y-2">
              <label className="font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                <Users className="h-3.5 w-3.5 text-blue-600" />
                Chọn Cha / Mẹ từ Cây Gia Phả (Tùy chọn):
              </label>
              <p className="text-[11px] text-muted-foreground">
                Gõ tìm tên Cha/Mẹ trong hệ thống. Nếu không chọn, hệ thống sẽ tự tìm theo tên tự khai.
              </p>
              <Input
                placeholder="Tìm tên Cha hoặc Mẹ..."
                value={parentSearch}
                onChange={e => {
                  setParentSearch(e.target.value);
                  setSelectedParent(null);
                }}
                className="h-8 text-xs"
              />

              {selectedParent ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  <div>
                    <strong>Đã chọn:</strong> {selectedParent.display_name} ({selectedParent.gender === 1 ? 'Cha' : 'Mẹ'}) &bull; Đời {selectedParent.generation}
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={() => setSelectedParent(null)}>
                    Bỏ chọn
                  </Button>
                </div>
              ) : (
                parentSearchResults && parentSearchResults.length > 0 && (
                  <div className="max-h-36 overflow-y-auto border rounded-lg divide-y bg-background text-xs">
                    {parentSearchResults.slice(0, 5).map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedParent(p)}
                        className="w-full text-left p-2 hover:bg-accent flex items-center justify-between"
                      >
                        <div>
                          <span className="font-semibold">{p.display_name}</span>
                          <span className="text-[11px] text-muted-foreground ml-1.5">
                            ({p.gender === 1 ? 'Nam' : 'Nữ'}, Đời {p.generation})
                          </span>
                        </div>
                        <span className="text-[10px] text-blue-600">Chọn</span>
                      </button>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmApprove}
              disabled={approveMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              {approveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Phê Duyệt & Nhập Phả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject dialog */}
      <AlertDialog open={!!rejectTarget} onOpenChange={open => { if (!open) setRejectTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Từ chối đơn đăng ký</AlertDialogTitle>
            <AlertDialogDescription>
              Từ chối đơn của <strong>{rejectTarget?.full_name}</strong>. Vui lòng ghi lý do.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Lý do từ chối..."
            rows={3}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectReason.trim() || rejectMutation.isPending}
            >
              {rejectMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Từ chối
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa đơn đăng ký?</AlertDialogTitle>
            <AlertDialogDescription>
              Xóa vĩnh viễn đơn của <strong>{deleteTarget?.full_name}</strong>. Không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
