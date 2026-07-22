/**
 * @project AncestorTree
 * @file src/app/(main)/fund/page.tsx
 * @description Education fund dashboard - Quỹ khuyến học
 * @version 1.0.0
 * @updated 2026-02-25
 */

'use client';

import { useState, useMemo } from 'react';
import { useFundTransactions, useFundBalance, useScholarships } from '@/hooks/use-fund';
import { usePeople } from '@/hooks/use-people';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  BookOpen, Wallet, ArrowDownCircle, ArrowUpCircle,
  GraduationCap, Award, Printer, Download,
} from 'lucide-react';
import { formatVND } from '@/lib/format';
import type { Person, FundTransaction, Scholarship, ScholarshipStatus, FundBalance } from '@/types';

function exportFundReport(
  balance: FundBalance | undefined,
  transactions: FundTransaction[],
  scholarships: Scholarship[],
  peopleMap: Map<string, Person>,
) {
  const lines: string[] = [];
  lines.push('BÁO CÁO QUỸ KHUYẾN HỌC - CHI TỘC ĐẶNG ĐÌNH');
  lines.push(`Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`);
  lines.push('');
  lines.push('=== TỔNG QUAN ===');
  lines.push(`Tổng thu: ${formatVND(balance?.income || 0)}`);
  lines.push(`Tổng chi: ${formatVND(balance?.expense || 0)}`);
  lines.push(`Số dư: ${formatVND(balance?.balance || 0)}`);
  lines.push('');
  lines.push('=== HỌC BỔNG & KHEN THƯỞNG ===');
  lines.push('Họ tên,Loại,Số tiền,Năm học,Trường,Khối/Lớp,Trạng thái');
  for (const s of scholarships) {
    const name = peopleMap.get(s.person_id)?.display_name || 'Không rõ';
    const type = s.type === 'hoc_bong' ? 'Học bổng' : 'Khen thưởng';
    const status = s.status === 'paid' ? 'Đã cấp' : s.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt';
    lines.push(`"${name}","${type}",${s.amount},"${s.academic_year}","${s.school || ''}","${s.grade_level || ''}","${status}"`);
  }
  lines.push('');
  lines.push('=== LỊCH SỬ GIAO DỊCH ===');
  lines.push('Ngày,Loại,Người/Mô tả,Số tiền,Năm học');
  for (const tx of transactions) {
    const date = new Date(tx.transaction_date).toLocaleDateString('vi-VN');
    const type = tx.type === 'income' ? 'Thu' : 'Chi';
    const desc = tx.donor_name || tx.description || '';
    lines.push(`"${date}","${type}","${desc}",${tx.amount},"${tx.academic_year || ''}"`);
  }

  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bao-cao-quy-khuyen-hoc-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function getStatusBadge(status: ScholarshipStatus) {
  switch (status) {
    case 'pending': return <Badge variant="outline" className="text-xs">Chờ duyệt</Badge>;
    case 'approved': return <Badge className="bg-blue-100 text-blue-800 text-xs">Đã duyệt</Badge>;
    case 'paid': return <Badge className="bg-green-100 text-green-800 text-xs">Đã cấp</Badge>;
    default: return <Badge variant="outline" className="text-xs">{status}</Badge>;
  }
}

export default function FundPage() {
  const [activeTab, setActiveTab] = useState('scholarships');

  const { data: balance, isLoading: balanceLoading } = useFundBalance();
  const { data: transactions, isLoading: txLoading } = useFundTransactions();
  const { data: scholarships, isLoading: schLoading } = useScholarships();
  const { data: people } = usePeople();

  const peopleMap = useMemo(() => {
    const map = new Map<string, Person>();
    for (const p of people || []) map.set(p.id, p);
    return map;
  }, [people]);

  const hocBong = useMemo(
    () => (scholarships || []).filter(s => s.type === 'hoc_bong'),
    [scholarships]
  );
  const khenThuong = useMemo(
    () => (scholarships || []).filter(s => s.type === 'khen_thuong'),
    [scholarships]
  );

  const donations = useMemo(
    () => (transactions || []).filter(t => t.type === 'income'),
    [transactions]
  );
  const isLoading = balanceLoading || txLoading || schLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-850 to-amber-900 p-8 text-white shadow-xl shadow-emerald-950/20">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-200 border border-amber-300/30 mb-3">
              <BookOpen className="h-3.5 w-3.5 text-amber-300" />
              Quỹ Dòng Họ & Khuyến Học
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              Quỹ Khuyến Học & Công Đức
            </h1>
            <p className="text-emerald-100/90 text-sm mt-2 max-w-xl font-normal leading-relaxed">
              Minh bạch tài chính dòng họ, khuyến khích con cháu phát triển học tập và cống hiến cho gia tộc.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportFundReport(balance, transactions || [], scholarships || [], peopleMap)}
              className="rounded-xl border-amber-300/40 bg-amber-500/20 text-white hover:bg-amber-500/30 font-semibold text-xs"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Xuất CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="rounded-xl border-amber-300/40 bg-amber-500/20 text-white hover:bg-amber-500/30 font-semibold text-xs"
            >
              <Printer className="h-4 w-4 mr-1.5" />
              In Báo Cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-emerald-200 bg-gradient-to-b from-white to-emerald-50/40 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Wallet className="h-5 w-5" />
            </div>
            <p className="text-xl font-black text-emerald-800 tracking-tight">{formatVND(balance?.balance || 0)}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Số dư hiện tại</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-blue-200 bg-gradient-to-b from-white to-blue-50/40 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <ArrowDownCircle className="h-5 w-5" />
            </div>
            <p className="text-xl font-black text-blue-700 tracking-tight">{formatVND(balance?.income || 0)}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Tổng quỹ công đức</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-rose-200 bg-gradient-to-b from-white to-rose-50/40 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <ArrowUpCircle className="h-5 w-5" />
            </div>
            <p className="text-xl font-black text-rose-700 tracking-tight">{formatVND(balance?.expense || 0)}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Tổng đã chi trả</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-purple-200 bg-gradient-to-b from-white to-purple-50/40 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
              <GraduationCap className="h-5 w-5" />
            </div>
            <p className="text-xl font-black text-purple-700 tracking-tight">{(scholarships || []).length}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Suất học bổng</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100/80 p-1 rounded-xl">
          <TabsTrigger value="scholarships" className="rounded-lg font-bold text-xs px-4">Học Bổng & Khen Thưởng</TabsTrigger>
          <TabsTrigger value="donations" className="rounded-lg font-bold text-xs px-4">Danh Sách Đóng Góp</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg font-bold text-xs px-4">Lịch Sử Giao Dịch</TabsTrigger>
        </TabsList>

        {/* Scholarships & Rewards */}
        <TabsContent value="scholarships" className="space-y-6 mt-4">
          {/* Scholarships */}
          <div>
            <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
              <GraduationCap className="h-4 w-4" />
              Học bổng ({hocBong.length})
            </h3>
            {hocBong.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có học bổng nào</p>
            ) : (
              <div className="space-y-2">
                {hocBong.map(s => {
                  const person = peopleMap.get(s.person_id);
                  return (
                    <Card key={s.id}>
                      <CardContent className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{person?.display_name || 'Không rõ'}</p>
                          <p className="text-xs text-muted-foreground">
                            {s.school && `${s.school} · `}{s.grade_level && `${s.grade_level} · `}
                            {s.academic_year}
                          </p>
                          {s.reason && <p className="text-xs text-muted-foreground mt-0.5">{s.reason}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{formatVND(s.amount)}</p>
                          {getStatusBadge(s.status)}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Rewards */}
          <div>
            <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
              <Award className="h-4 w-4" />
              Khen thưởng ({khenThuong.length})
            </h3>
            {khenThuong.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có khen thưởng nào</p>
            ) : (
              <div className="space-y-2">
                {khenThuong.map(s => {
                  const person = peopleMap.get(s.person_id);
                  return (
                    <Card key={s.id}>
                      <CardContent className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{person?.display_name || 'Không rõ'}</p>
                          <p className="text-xs text-muted-foreground">
                            {s.school && `${s.school} · `}{s.grade_level && `${s.grade_level} · `}
                            {s.academic_year}
                          </p>
                          {s.reason && <p className="text-xs text-muted-foreground mt-0.5">{s.reason}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{formatVND(s.amount)}</p>
                          {getStatusBadge(s.status)}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Donations */}
        <TabsContent value="donations" className="mt-4">
          <h3 className="text-base font-semibold mb-3">Danh sách đóng góp ({donations.length})</h3>
          {donations.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Chưa có đóng góp nào
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {donations.map(tx => {
                const person = tx.donor_person_id ? peopleMap.get(tx.donor_person_id) : undefined;
                return (
                  <Card key={tx.id}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{tx.donor_name || person?.display_name || 'Ẩn danh'}</p>
                        {tx.description && (
                          <p className="text-xs text-muted-foreground">{tx.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-emerald-600">+{formatVND(tx.amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.transaction_date).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="mt-4">
          <h3 className="text-base font-semibold mb-3">Lịch sử giao dịch ({(transactions || []).length})</h3>
          {!transactions || transactions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Chưa có giao dịch nào
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {transactions.map(tx => (
                <Card key={tx.id}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {tx.type === 'income' ? (
                        <ArrowDownCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                      ) : (
                        <ArrowUpCircle className="h-5 w-5 text-red-500 shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-sm">
                          {tx.donor_name || tx.description || (tx.type === 'income' ? 'Thu' : 'Chi')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(tx.transaction_date).toLocaleDateString('vi-VN')}
                          {tx.academic_year && ` · ${tx.academic_year}`}
                        </p>
                      </div>
                    </div>
                    <p className={`font-semibold text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatVND(tx.amount)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
