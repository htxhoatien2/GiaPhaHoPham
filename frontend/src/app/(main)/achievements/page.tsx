/**
 * @project AncestorTree
 * @file src/app/(main)/achievements/page.tsx
 * @description Achievement honors page - Bảng vàng vinh danh thành tích dòng họ
 * @version 2.0.0
 * @updated 2026-07-21
 */

'use client';

import { useState, useMemo } from 'react';
import { useAchievements } from '@/hooks/use-achievements';
import { usePeople } from '@/hooks/use-people';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, GraduationCap, Briefcase, Heart, Star, Search, Sparkles, Award } from 'lucide-react';
import type { AchievementCategory, Achievement, Person } from '@/types';

const CATEGORIES: { value: AchievementCategory | 'all'; label: string; icon: typeof Trophy }[] = [
  { value: 'all', label: 'Tất cả', icon: Trophy },
  { value: 'hoc_tap', label: 'Học tập', icon: GraduationCap },
  { value: 'su_nghiep', label: 'Sự nghiệp', icon: Briefcase },
  { value: 'cong_hien', label: 'Cống hiến', icon: Heart },
];

function getCategoryIcon(cat: AchievementCategory) {
  switch (cat) {
    case 'hoc_tap': return <GraduationCap className="h-4 w-4" />;
    case 'su_nghiep': return <Briefcase className="h-4 w-4" />;
    case 'cong_hien': return <Heart className="h-4 w-4" />;
    default: return <Trophy className="h-4 w-4" />;
  }
}

function getCategoryLabel(cat: AchievementCategory) {
  switch (cat) {
    case 'hoc_tap': return 'Học tập';
    case 'su_nghiep': return 'Sự nghiệp';
    case 'cong_hien': return 'Cống hiến';
    default: return 'Khác';
  }
}

function AchievementCard({ achievement, person }: { achievement: Achievement; person?: Person }) {
  return (
    <div className="group relative rounded-2xl border border-amber-200/60 bg-gradient-to-b from-white to-amber-50/30 p-4 shadow-sm hover:shadow-lg hover:border-amber-400/80 transition-all duration-300">
      {achievement.is_featured && (
        <div className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-md ring-2 ring-white">
          <Star className="h-3.5 w-3.5 fill-current" />
        </div>
      )}
      <div className="flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md shadow-amber-900/10 group-hover:scale-110 transition-transform duration-300">
          {getCategoryIcon(achievement.category)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-900 transition-colors">
            {achievement.title}
          </h3>
          {person && (
            <p className="text-xs font-medium text-amber-900/80 mt-0.5 flex items-center gap-1.5">
              <span>{person.display_name}</span>
              <span className="text-slate-300">•</span>
              <span>Đời thứ {person.generation}</span>
              {person.chi ? (
                <>
                  <span className="text-slate-300">•</span>
                  <span>Chi {person.chi}</span>
                </>
              ) : null}
            </p>
          )}
          {achievement.description && (
            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{achievement.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="outline" className="text-[11px] font-semibold bg-white border-amber-300/80 text-amber-900 rounded-lg">
              {getCategoryLabel(achievement.category)}
            </Badge>
            {achievement.year && (
              <Badge className="text-[11px] bg-emerald-800 hover:bg-emerald-900 text-white font-medium rounded-lg">
                Năm {achievement.year}
              </Badge>
            )}
            {achievement.awarded_by && (
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Award className="h-3 w-3 text-slate-400" />
                {achievement.awarded_by}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState<AchievementCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const { data: achievements, isLoading } = useAchievements(
    activeCategory === 'all' ? undefined : activeCategory
  );
  const { data: people } = usePeople();

  const peopleMap = useMemo(() => {
    const map = new Map<string, Person>();
    for (const p of people || []) map.set(p.id, p);
    return map;
  }, [people]);

  const featured = useMemo(
    () => (achievements || []).filter(a => a.is_featured),
    [achievements]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return achievements || [];
    const q = search.toLowerCase();
    return (achievements || []).filter(a => {
      const person = peopleMap.get(a.person_id);
      return (
        a.title.toLowerCase().includes(q) ||
        person?.display_name.toLowerCase().includes(q) ||
        a.awarded_by?.toLowerCase().includes(q)
      );
    });
  }, [achievements, search, peopleMap]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-6xl">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-850 to-amber-900 p-8 text-white shadow-xl shadow-emerald-950/20">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-200 border border-amber-300/30 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Bảng Vàng Vinh Danh
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
              <Trophy className="h-8 w-8 text-amber-400 shrink-0" />
              Vinh Danh Con Cháu Dòng Họ
            </h1>
            <p className="text-emerald-100/90 text-sm mt-2 max-w-xl font-normal leading-relaxed">
              Ghi nhận và tri ân những thành tích xuất sắc trong học tập, sự nghiệp và những đóng góp quý báu cho dòng họ.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.value;
            return (
              <Button
                key={cat.value}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat.value)}
                className={`rounded-xl px-3.5 py-2 font-medium text-xs transition-all ${
                  isSelected 
                    ? 'bg-gradient-to-r from-emerald-800 to-amber-800 text-white shadow-md shadow-emerald-950/20 hover:from-emerald-900 hover:to-amber-900' 
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 mr-1.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                {cat.label}
              </Button>
            );
          })}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm theo tên, danh hiệu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-slate-200 text-xs shadow-inner focus-visible:ring-emerald-500"
          />
        </div>
      </div>

      {/* Featured Section */}
      {featured.length > 0 && (
        <Card className="rounded-2xl border-amber-300/60 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 shadow-md">
          <CardHeader className="pb-3 border-b border-amber-100">
            <CardTitle className="text-base font-bold text-amber-950 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              Thành Tích Nổi Bật
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(a => (
                <AchievementCard key={a.id} achievement={a} person={peopleMap.get(a.person_id)} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Danh sách vinh danh</span>
            <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-700 text-xs px-2.5 font-bold">
              {filtered.length}
            </Badge>
          </h2>
        </div>
        {filtered.length === 0 ? (
          <Card className="rounded-2xl border-slate-200">
            <CardContent className="py-16 text-center text-slate-500">
              <Trophy className="h-12 w-12 mx-auto mb-3 text-slate-300 stroke-[1.5]" />
              <p className="font-semibold text-slate-700">Chưa tìm thấy thành tích phù hợp</p>
              <p className="text-xs text-slate-400 mt-1">Thử thay đổi từ khóa hoặc bộ lọc danh mục.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(a => (
              <AchievementCard key={a.id} achievement={a} person={peopleMap.get(a.person_id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

