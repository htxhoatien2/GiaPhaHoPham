/**
 * @project AncestorTree
 * @file src/app/(main)/contributions/page.tsx
 * @description Modern UI/UX Contribution form for members to suggest edits & ideas
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { usePeople } from '@/hooks/use-people';
import { useContributions, useCreateContribution } from '@/hooks/use-contributions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ClipboardList,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import type { ChangeType, ContributionStatus } from '@/types';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<ContributionStatus, { label: string; icon: typeof Clock; variant: 'default' | 'secondary' | 'destructive' }> = {
  pending: { label: 'Chờ duyệt', icon: Clock, variant: 'default' },
  approved: { label: 'Đã phê duyệt', icon: CheckCircle2, variant: 'secondary' },
  rejected: { label: 'Từ chối', icon: XCircle, variant: 'destructive' },
};

const CHANGE_TYPE_LABELS: Record<ChangeType, string> = {
  create: 'Thêm thành viên mới',
  update: 'Cập nhật thông tin',
  delete: 'Đề xuất xóa',
};

const FIELD_OPTIONS = [
  { value: 'display_name', label: 'Họ tên' },
  { value: 'phone', label: 'Số điện thoại' },
  { value: 'email', label: 'Email' },
  { value: 'address', label: 'Địa chỉ' },
  { value: 'birth_year', label: 'Năm sinh' },
  { value: 'death_year', label: 'Năm mất' },
  { value: 'death_lunar', label: 'Ngày giỗ (ÂL)' },
  { value: 'occupation', label: 'Nghề nghiệp' },
  { value: 'biography', label: 'Tiểu sử' },
  { value: 'notes', label: 'Ghi chú thêm' },
] as const;

function getFieldLabel(key: string): string {
  return FIELD_OPTIONS.find(f => f.value === key)?.label || key;
}

function NewContributionDialog({ onClose }: { onClose: () => void }) {
  const { profile } = useAuth();
  const { data: people } = usePeople();
  const createContribution = useCreateContribution();

  const [changeType, setChangeType] = useState<ChangeType>('update');
  const [targetPerson, setTargetPerson] = useState('');
  const [reason, setReason] = useState('');

  const [fieldName, setFieldName] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [changes, setChanges] = useState<Record<string, string>>({});

  const addChange = () => {
    if (!fieldName.trim() || !fieldValue.trim()) {
      toast.error('Vui lòng chọn trường và nhập giá trị thay đổi');
      return;
    }
    setChanges(prev => ({ ...prev, [fieldName.trim()]: fieldValue.trim() }));
    setFieldName('');
    setFieldValue('');
  };

  const removeChange = (key: string) => {
    setChanges(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast.error('Vui lòng đăng nhập để gửi đề xuất');
      return;
    }
    if (!targetPerson) {
      toast.error('Vui lòng chọn thành viên liên quan');
      return;
    }
    if (Object.keys(changes).length === 0) {
      toast.error('Vui lòng thêm ít nhất một trường thay đổi');
      return;
    }

    try {
      await createContribution.mutateAsync({
        author_id: profile.id,
        target_person: targetPerson,
        change_type: changeType,
        changes,
        reason: reason || undefined,
      });
      toast.success('Đã gửi đề xuất chỉnh sửa thành công! Ban quản trị sẽ phê duyệt.');
      onClose();
    } catch {
      toast.error('Lỗi khi gửi đề xuất');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">Loại đề xuất *</Label>
        <Select value={changeType} onValueChange={v => setChangeType(v as ChangeType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="update">Cập nhật thông tin thành viên có sẵn</SelectItem>
            <SelectItem value="create">Đề xuất thêm thành viên mới vào gia phả</SelectItem>
            <SelectItem value="delete">Đề xuất đính chính / xóa thông tin sai</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">Thành viên liên quan *</Label>
        <Select value={targetPerson} onValueChange={setTargetPerson}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn thành viên trong dòng họ..." />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {people?.map(p => (
              <SelectItem key={p.id} value={p.id}>
                {p.display_name} (Đời thứ {p.generation})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Changes builder */}
      <div className="space-y-2 border-t pt-3">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">Nội dung thay đổi đề xuất *</Label>
        
        {Object.entries(changes).length > 0 && (
          <div className="space-y-2 mb-3">
            {Object.entries(changes).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg p-2.5 text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  {getFieldLabel(key)}:
                </span>
                <span className="flex-1 truncate text-foreground">{val}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => removeChange(key)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Select value={fieldName} onValueChange={setFieldName}>
            <SelectTrigger className="w-[150px] shrink-0 text-xs">
              <SelectValue placeholder="Chọn trường..." />
            </SelectTrigger>
            <SelectContent>
              {FIELD_OPTIONS.map(f => (
                <SelectItem key={f.value} value={f.value} className="text-xs">{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Giá trị mới..."
            value={fieldValue}
            onChange={e => setFieldValue(e.target.value)}
            className="text-xs flex-1"
          />
          <Button type="button" variant="outline" size="sm" onClick={addChange} className="text-xs shrink-0">
            <Plus className="h-3.5 w-3.5 mr-1" /> Thêm
          </Button>
        </div>
      </div>

      <div className="space-y-1.5 border-t pt-3">
        <Label className="text-xs font-semibold uppercase text-muted-foreground">Lý do / Ghi chú cho Ban quản trị</Label>
        <Textarea
          placeholder="Nhập lý do hoặc nguồn thông tin (VD: Cập nhật theo giấy khai sinh mới...)"
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={3}
          className="text-xs"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Hủy bỏ
        </Button>
        <Button type="submit" size="sm" disabled={createContribution.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
          <Send className="h-3.5 w-3.5" /> Gửi đề xuất
        </Button>
      </div>
    </form>
  );
}

export default function ContributionsPage() {
  const { profile } = useAuth();
  const { data: people } = usePeople();
  const { data: contributions, isLoading } = useContributions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | ContributionStatus>('all');

  const myContributions = contributions?.filter(c => c.author_id === profile?.id) || [];
  const filteredList = myContributions.filter(c => statusFilter === 'all' || c.status === statusFilter);

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <Card className="border-amber-200 bg-amber-50/30 text-center p-8 space-y-4">
          <ShieldCheck className="h-12 w-12 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-amber-900">Yêu cầu đăng nhập</h2>
          <p className="text-sm text-muted-foreground">
            Vui lòng đăng nhập tài khoản thành viên để gửi và quản lý các đề xuất chỉnh sửa thông tin gia phả.
          </p>
          <Button asChild className="mt-2"><Link href="/login">Đăng nhập ngay</Link></Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6 pb-24">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <ClipboardList className="h-52 w-52" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <ClipboardList className="h-6 w-6 text-emerald-200" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Đề xuất Chỉnh sửa &amp; Ý kiến</h1>
                <p className="text-xs sm:text-sm text-emerald-100/90">
                  Đóng góp thông tin thành viên, đính chính sai sót để Ban quản trị phê duyệt
                </p>
              </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold shadow-md gap-2 text-xs sm:text-sm">
                  <Plus className="h-4 w-4" /> Tạo đề xuất mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" /> Tạo đề xuất chỉnh sửa
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    Nội dung sẽ được Ban quản trị duyệt trước khi tự động cập nhật vào cây gia phả.
                  </DialogDescription>
                </DialogHeader>
                <NewContributionDialog onClose={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b pb-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setStatusFilter('all')}
          className="rounded-full text-xs"
        >
          Tất cả ({myContributions.length})
        </Button>
        <Button
          variant={statusFilter === 'pending' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setStatusFilter('pending')}
          className="rounded-full text-xs gap-1"
        >
          ⏳ Chờ duyệt ({myContributions.filter(c => c.status === 'pending').length})
        </Button>
        <Button
          variant={statusFilter === 'approved' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setStatusFilter('approved')}
          className="rounded-full text-xs gap-1"
        >
          ✅ Đã duyệt ({myContributions.filter(c => c.status === 'approved').length})
        </Button>
        <Button
          variant={statusFilter === 'rejected' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setStatusFilter('rejected')}
          className="rounded-full text-xs gap-1"
        >
          ❌ Từ chối ({myContributions.filter(c => c.status === 'rejected').length})
        </Button>
      </div>

      {/* Main content list */}
      <Card>
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-base flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            Lịch sử đề xuất của bạn
          </CardTitle>
          <CardDescription className="text-xs">
            Theo dõi tiến độ xét duyệt các đóng góp thông tin của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredList.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-3 border-2 border-dashed rounded-xl">
              <ClipboardList className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-medium">Bạn chưa có đề xuất nào trong danh mục này</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredList.map(c => {
                const statusInfo = STATUS_CONFIG[c.status];
                const StatusIcon = statusInfo.icon;
                const person = people?.find(p => p.id === c.target_person);

                return (
                  <div key={c.id} className="rounded-xl border p-4 hover:shadow-md transition-shadow bg-card space-y-3">
                    <div className="flex items-start justify-between gap-3 border-b pb-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-5 w-5 ${
                          c.status === 'approved' ? 'text-emerald-600' :
                          c.status === 'rejected' ? 'text-rose-600' :
                          'text-amber-600'
                        }`} />
                        <span className="font-bold text-sm text-foreground">
                          {CHANGE_TYPE_LABELS[c.change_type]}
                        </span>
                        {person && (
                          <Link href={`/people/${person.id}`} className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5">
                            {person.display_name} <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>

                      <Badge variant={statusInfo.variant} className="text-xs font-semibold">
                        {statusInfo.label}
                      </Badge>
                    </div>

                    {/* Proposed changes chips */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase">Thay đổi đề xuất:</span>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(c.changes).map(([key, val]) => (
                          <Badge key={key} variant="outline" className="text-xs bg-muted/50 border-primary/20">
                            <span className="font-semibold text-primary mr-1">{getFieldLabel(key)}:</span> {String(val)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {c.reason && (
                      <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border">
                        <span className="font-semibold">Lý do:</span> {c.reason}
                      </p>
                    )}

                    {c.review_notes && (
                      <p className="text-xs text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900">
                        <span className="font-semibold">Phản hồi Ban quản trị:</span> {c.review_notes}
                      </p>
                    )}

                    <div className="flex justify-end pt-1 text-[11px] text-muted-foreground">
                      <span>Ngày gửi: {new Date(c.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
