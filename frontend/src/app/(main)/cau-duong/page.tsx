/**
 * @project AncestorTree
 * @file src/app/(main)/cau-duong/page.tsx
 * @description Modern UI/UX Trang Lịch Cầu đương — xem danh sách xoay vòng và lịch phân công
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { useState } from 'react';
import { useCauDuongPools, useCauDuongAssignments, useEligibleMembers } from '@/hooks/use-cau-duong';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Users, RotateCcw, CheckCircle2, Clock, AlertCircle, Sparkles, Flame, ShieldCheck } from 'lucide-react';
import { CAU_DUONG_CEREMONY_LABELS, CAU_DUONG_CEREMONY_ORDER, type CauDuongStatus } from '@/types';

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);

const STATUS_LABELS: Record<CauDuongStatus, string> = {
  scheduled: 'Đã phân công',
  completed: 'Đã hoàn thành',
  delegated: 'Đã ủy quyền',
  rescheduled: 'Đổi ngày',
  cancelled: 'Đã hủy',
};

const STATUS_VARIANT: Record<CauDuongStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  scheduled: 'secondary',
  completed: 'default',
  delegated: 'outline',
  rescheduled: 'outline',
  cancelled: 'destructive',
};

export default function CauDuongPage() {
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: pools, isLoading: poolsLoading } = useCauDuongPools();
  const firstPool = pools?.[0];
  const poolId = firstPool?.id;

  const { data: assignments, isLoading: assignmentsLoading } = useCauDuongAssignments(poolId, selectedYear);
  const { data: eligibleMembers, isLoading: eligibleLoading } = useEligibleMembers(poolId, currentYear);

  if (poolsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!pools || pools.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <Card className="border-amber-200 bg-amber-50/40 text-center p-8 space-y-4">
          <RotateCcw className="h-12 w-12 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-amber-900">Chưa thiết lập Lịch Cầu Đương</h2>
          <p className="text-sm text-muted-foreground">
            Quản trị viên cần khởi tạo danh sách nhóm Cầu đương trong mục Quản trị hệ thống.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6 pb-24">
      {/* Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <RotateCcw className="h-56 w-56" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <RotateCcw className="h-6 w-6 text-amber-200" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Lịch Cầu Đương Dòng Họ</h1>
                <p className="text-xs sm:text-sm text-amber-100/90">
                  Phân công xoay vòng chủ lễ các ngày cúng giỗ chính theo truyền thống phong tục
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-amber-100">Chọn năm:</span>
              <Select value={selectedYear.toString()} onValueChange={v => setSelectedYear(Number(v))}>
                <SelectTrigger className="w-32 bg-white/20 hover:bg-white/30 text-white border-white/20 font-bold backdrop-blur text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEAR_OPTIONS.map(y => (
                    <SelectItem key={y} value={y.toString()} className="text-xs font-medium">Năm {y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Pool rules info card */}
      {firstPool && (
        <Card className="border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
              <span className="font-bold text-amber-950 dark:text-amber-200">{firstPool.name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <Badge variant="outline" className="text-[10px] bg-background">Đời {firstPool.min_generation} trở xuống</Badge>
              <Badge variant="outline" className="text-[10px] bg-background">Dưới {firstPool.max_age_lunar} tuổi âm</Badge>
              <Badge variant="outline" className="text-[10px] bg-background">Nam giới đã lập gia đình</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className="bg-muted/60 p-1 rounded-xl">
          <TabsTrigger value="schedule" className="flex items-center gap-1.5 text-xs font-semibold rounded-lg">
            <Calendar className="h-4 w-4 text-amber-600" />
            Lịch phân công Năm {selectedYear}
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-1.5 text-xs font-semibold rounded-lg">
            <Users className="h-4 w-4 text-blue-600" />
            Danh sách xoay vòng ({eligibleMembers?.length ?? '...'})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Schedule */}
        <TabsContent value="schedule" className="space-y-4">
          {assignmentsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {CAU_DUONG_CEREMONY_ORDER.map(ceremonyType => {
                const assignment = assignments?.find(a => a.ceremony_type === ceremonyType);
                return (
                  <Card
                    key={ceremonyType}
                    className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                      assignment ? 'border-amber-200/60 dark:border-amber-900/40 bg-card' : 'border-dashed opacity-60 bg-muted/20'
                    }`}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                            assignment?.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                            assignment ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {assignment?.status === 'completed' ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : assignment ? (
                              <Clock className="h-5 w-5" />
                            ) : (
                              <AlertCircle className="h-5 w-5" />
                            )}
                          </div>

                          <div className="space-y-1">
                            <h2 className="font-bold text-sm text-foreground">{CAU_DUONG_CEREMONY_LABELS[ceremonyType]}</h2>
                            {assignment ? (
                              <div className="text-xs space-y-1">
                                <p className="text-foreground">
                                  <span className="font-bold text-amber-800 dark:text-amber-300 text-sm">
                                    {assignment.host_person?.display_name ?? '—'}
                                  </span>
                                  {assignment.actual_host_person && assignment.actual_host_person.id !== assignment.host_person?.id && (
                                    <span className="ml-2 text-muted-foreground">
                                      (Ủy quyền cho: <span className="font-semibold text-foreground">{assignment.actual_host_person.display_name}</span>)
                                    </span>
                                  )}
                                </p>
                                {assignment.reason && (
                                  <p className="text-muted-foreground italic">Lý do: {assignment.reason}</p>
                                )}
                                {assignment.scheduled_date && (
                                  <p className="text-muted-foreground">
                                    Ngày cúng dự kiến: <span className="font-mono">{new Date(assignment.scheduled_date).toLocaleDateString('vi-VN')}</span>
                                  </p>
                                )}
                                {assignment.actual_date && assignment.actual_date !== assignment.scheduled_date && (
                                  <p className="text-amber-600 dark:text-amber-400 font-medium">
                                    Thực hiện thực tế: <span className="font-mono">{new Date(assignment.actual_date).toLocaleDateString('vi-VN')}</span>
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground italic">Chưa phân công chủ lễ</p>
                            )}
                          </div>
                        </div>

                        {assignment && (
                          <Badge variant={STATUS_VARIANT[assignment.status]} className="self-start sm:self-center font-bold text-xs">
                            {STATUS_LABELS[assignment.status]}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Eligible Members */}
        <TabsContent value="members">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Thứ tự xoay vòng Cầu đương dòng họ
              </CardTitle>
              <CardDescription className="text-xs">
                Sắp xếp theo chiều sâu phả hệ (DFS Preorder) — Đời cao trước, thứ tự gia đình trong từng thế hệ
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {eligibleLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-12 w-full rounded-xl" />
                  ))}
                </div>
              ) : !eligibleMembers || eligibleMembers.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  Chưa có thành viên nào đáp ứng đủ tiêu chuẩn Cầu đương
                </p>
              ) : (
                <div className="space-y-2">
                  {eligibleMembers.map((member, idx) => (
                    <div
                      key={member.person.id}
                      className="flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{member.person.display_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Đời thứ {member.person.generation}
                            {member.person.chi ? ` • Chi ${member.person.chi}` : ''}
                            {member.person.hometown ? ` • ${member.person.hometown}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        {member.ageLunar > 0 && <span className="font-semibold text-amber-700 dark:text-amber-300">{member.ageLunar} tuổi âm</span>}
                        {member.person.birth_year && (
                          <p className="text-muted-foreground text-[11px]">Sinh năm {member.person.birth_year}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
