/**
 * @project AncestorTree
 * @file src/app/(main)/events/page.tsx
 * @description Memorial calendar and events page with lunar date support
 * @version 2.1.0
 * @updated 2026-02-25
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useEvents, useDeleteEvent } from '@/hooks/use-events';
import { usePeople } from '@/hooks/use-people';
import { useAuth } from '@/components/auth/auth-provider';
import { parseLunarString, getNextLunarOccurrence, formatLunarDate, solarToLunar } from '@/lib/lunar-calendar';
import { CalendarGrid } from '@/components/events/calendar-grid';
import { AddEventDialog } from '@/components/events/add-event-dialog';
import { EVENT_TYPE_LABELS, MONTHS_VI } from '@/components/events/event-constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import type { Event, Person } from '@/types';
import { toast } from 'sonner';

interface UpcomingEvent {
  event: Event;
  person?: Person;
  nextDate: Date;
  daysUntil: number;
  lunarDisplay: string;
  isAuto: boolean;
}

export default function EventsPage() {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: people, isLoading: peopleLoading } = usePeople();
  const { isEditor } = useAuth();
  const deleteEvent = useDeleteEvent();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const isLoading = eventsLoading || peopleLoading;

  // Compute upcoming events (next 60 days)
  const upcomingEvents = useMemo<UpcomingEvent[]>(() => {
    if (!events || !people) return [];

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const results: UpcomingEvent[] = [];

    for (const event of events) {
      let nextDate: Date | null = null;
      let lunarDisplay = '';

      if (event.event_lunar) {
        const parsed = parseLunarString(event.event_lunar);
        if (parsed) {
          nextDate = getNextLunarOccurrence(parsed.day, parsed.month, now);
          lunarDisplay = formatLunarDate(parsed.day, parsed.month);
        }
      } else if (event.event_date) {
        nextDate = new Date(event.event_date);
        const lunar = solarToLunar(nextDate.getDate(), nextDate.getMonth() + 1, nextDate.getFullYear());
        lunarDisplay = formatLunarDate(lunar.day, lunar.month);
      }

      if (!nextDate) continue;

      const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil > 60) continue;

      const person = event.person_id ? people.find(p => p.id === event.person_id) : undefined;
      results.push({ event, person, nextDate, daysUntil, lunarDisplay, isAuto: false });
    }

    return results.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [events, people]);

  // Auto-generate giỗ events from deceased people with death_lunar (fix m2: mark as isAuto)
  const autoGioEvents = useMemo<UpcomingEvent[]>(() => {
    if (!people || !events) return [];

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const existingPersonIds = new Set(events.filter(e => e.person_id).map(e => e.person_id));
    const results: UpcomingEvent[] = [];

    for (const person of people) {
      if (person.is_living || !person.death_lunar || existingPersonIds.has(person.id)) continue;

      const parsed = parseLunarString(person.death_lunar);
      if (!parsed) continue;

      const nextDate = getNextLunarOccurrence(parsed.day, parsed.month, now);
      const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil > 60) continue;

      results.push({
        event: {
          id: `gio-auto-${person.id}`,
          title: `Giỗ ${person.display_name}`,
          event_type: 'gio',
          event_lunar: person.death_lunar,
          person_id: person.id,
          recurring: true,
          created_at: new Date().toISOString(),
        },
        person,
        nextDate,
        daysUntil,
        lunarDisplay: formatLunarDate(parsed.day, parsed.month),
        isAuto: true,
      });
    }

    return results.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [people, events]);

  const allUpcoming = useMemo(() => {
    const merged = [...upcomingEvents, ...autoGioEvents];
    return merged.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [upcomingEvents, autoGioEvents]);

  // Filtered events for list view
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (typeFilter === 'all') return events;
    return events.filter(e => e.event_type === typeFilter);
  }, [events, typeFilter]);

  const navigateMonth = (dir: number) => {
    let m = calendarMonth + dir;
    let y = calendarYear;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setCalendarMonth(m);
    setCalendarYear(y);
  };

  // Fix m4: delete with confirmation is handled by AlertDialog below
  const handleDelete = async (id: string) => {
    try {
      await deleteEvent.mutateAsync(id);
      toast.success('Đã xóa sự kiện');
    } catch {
      toast.error('Lỗi khi xóa sự kiện');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-850 to-amber-900 p-8 text-white shadow-xl shadow-emerald-950/20">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-200 border border-amber-300/30 mb-3">
              <Calendar className="h-3.5 w-3.5 text-amber-300" />
              Lịch Cúng Lễ & Sự Kiện
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              Lịch Cúng Lễ Dòng Họ
            </h1>
            <p className="text-emerald-100/90 text-sm mt-2 max-w-xl font-normal leading-relaxed">
              Quản lý ngày giỗ chạp, lễ tết, dâng hương và các sự kiện truyền thống gia tộc.
            </p>
          </div>
          {isEditor && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold rounded-xl shadow-lg shadow-amber-950/20 border border-amber-300/50">
                  <Plus className="h-4 w-4" /> Thêm sự kiện
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="font-bold text-lg">Thêm sự kiện mới</DialogTitle>
                  <DialogDescription>Thêm ngày giỗ, lễ tết hoặc sự kiện truyền thống dòng họ</DialogDescription>
                </DialogHeader>
                <AddEventDialog
                  onClose={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Upcoming events banner */}
      {allUpcoming.length > 0 && (
        <Card className="rounded-2xl border-amber-300/70 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 shadow-md">
          <CardHeader className="pb-3 border-b border-amber-100/80">
            <CardTitle className="text-base font-bold text-amber-950 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-amber-600" />
                Sự Kiện Sắp Tới ({allUpcoming.length} sự kiện trong 60 ngày)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2.5">
              {allUpcoming.slice(0, 5).map(({ event, person, nextDate, daysUntil, lunarDisplay, isAuto }) => {
                const typeInfo = EVENT_TYPE_LABELS[event.event_type];
                const TypeIcon = typeInfo.icon;
                return (
                  <div key={event.id} className="flex items-center justify-between gap-3 bg-white border border-slate-200/80 hover:border-amber-300 rounded-xl p-3 shadow-2xs transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold shadow-2xs ${typeInfo.color}`}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-slate-900 truncate flex items-center gap-1.5">
                          <span>{event.title}</span>
                          {isAuto && <span className="text-[11px] text-slate-400 font-normal">(tự động)</span>}
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span className="text-emerald-900 font-semibold">{nextDate.toLocaleDateString('vi-VN')}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-amber-900 font-medium">{lunarDisplay}</span>
                          {person && (
                            <>
                              <span className="text-slate-300">•</span>
                              <Link href={`/people/${person.id}`} className="text-emerald-800 hover:underline font-semibold">
                                {person.display_name}
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={`shrink-0 rounded-lg px-3 py-1 font-bold text-xs ${
                        daysUntil === 0
                          ? 'bg-rose-600 text-white animate-pulse'
                          : daysUntil <= 7
                          ? 'bg-amber-500 text-amber-950 font-extrabold'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {daysUntil === 0 ? 'Hôm nay' : `Còn ${daysUntil} ngày`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="calendar">
        <TabsList className="bg-slate-100/80 p-1 rounded-xl">
          <TabsTrigger value="calendar" className="rounded-lg font-bold text-xs px-4">Lịch xem dạng tháng</TabsTrigger>
          <TabsTrigger value="list" className="rounded-lg font-bold text-xs px-4">Danh sách sự kiện</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-base">
                  {MONTHS_VI[calendarMonth - 1]} {calendarYear}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <CalendarGrid
                  month={calendarMonth}
                  year={calendarYear}
                  events={events || []}
                  people={people || []}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>
                  {isLoading ? 'Đang tải...' : `${filteredEvents.length} sự kiện`}
                </CardDescription>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {Object.entries(EVENT_TYPE_LABELS).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  Chưa có sự kiện nào
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.map(event => {
                    const typeInfo = EVENT_TYPE_LABELS[event.event_type];
                    const TypeIcon = typeInfo.icon;
                    const person = event.person_id ? people?.find(p => p.id === event.person_id) : undefined;
                    return (
                      <div
                        key={event.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${typeInfo.color}`}>
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.event_lunar && <span>{event.event_lunar} (ÂL)</span>}
                            {event.event_date && (
                              <span>
                                {event.event_lunar && ' · '}
                                {new Date(event.event_date).toLocaleDateString('vi-VN')}
                              </span>
                            )}
                            {event.location && ` · ${event.location}`}
                            {person && (
                              <>
                                {' · '}
                                <Link href={`/people/${person.id}`} className="hover:underline">
                                  {person.display_name}
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline">{typeInfo.label}</Badge>
                          {event.recurring && (
                            <Badge variant="secondary" className="text-xs">Hàng năm</Badge>
                          )}
                          {isEditor && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xóa sự kiện</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc muốn xóa &ldquo;{event.title}&rdquo;? Hành động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(event.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
