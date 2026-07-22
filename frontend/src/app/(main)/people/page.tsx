/**
 * @project AncestorTree
 * @file src/app/(main)/people/page.tsx
 * @description Modern UI/UX People list page with fuzzy search and generation grouping
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { usePeople, useStats } from '@/hooks/use-people';
import { useFuzzySearch } from '@/hooks/use-fuzzy-search';
import { PersonCard } from '@/components/people/person-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Users, Plus, X, Sparkles, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function PeoplePage() {
  const { isEditor } = useAuth();
  const { data: people, isLoading, error } = usePeople();
  const { data: stats } = useStats();

  const [search, setSearch] = useState('');
  const [generationFilter, setGenerationFilter] = useState<string>('all');
  const [chiFilter, setChiFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const generations = useMemo(() => {
    if (!people) return [];
    return [...new Set(people.map(p => p.generation))].sort((a, b) => a - b);
  }, [people]);

  const chiValues = useMemo(() => {
    if (!people) return [];
    return [...new Set(people.filter(p => p.chi).map(p => p.chi!))].sort((a, b) => a - b);
  }, [people]);

  const fuzzyResults = useFuzzySearch(people, search);

  const filteredPeople = useMemo(() => {
    return fuzzyResults.filter(person => {
      if (generationFilter !== 'all' && person.generation !== parseInt(generationFilter)) {
        return false;
      }
      if (chiFilter !== 'all' && person.chi !== parseInt(chiFilter)) {
        return false;
      }
      if (statusFilter === 'living' && !person.is_living) return false;
      if (statusFilter === 'deceased' && person.is_living) return false;
      return true;
    });
  }, [fuzzyResults, generationFilter, chiFilter, statusFilter]);

  const groupedByGeneration = useMemo(() => {
    const groups: Record<number, typeof filteredPeople> = {};
    for (const person of filteredPeople) {
      const gen = person.generation || 1;
      if (!groups[gen]) {
        groups[gen] = [];
      }
      groups[gen].push(person);
    }
    const sortedGens = Object.keys(groups)
      .map(Number)
      .sort((a, b) => a - b);
    return { groups, sortedGens };
  }, [filteredPeople]);

  const hasFilters = search || generationFilter !== 'all' || chiFilter !== 'all' || statusFilter !== 'all';

  const clearFilters = () => {
    setSearch('');
    setGenerationFilter('all');
    setChiFilter('all');
    setStatusFilter('all');
  };

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive font-semibold">Lỗi khi tải dữ liệu: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6 pb-24">
      {/* Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <Users className="h-56 w-56" />
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <Users className="h-6 w-6 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Thành Viên Dòng Họ</h1>
                {stats && (
                  <Badge className="bg-blue-400 text-blue-950 font-bold hidden sm:inline-flex">
                    {stats.totalPeople} thành viên
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-0.5">
                {stats ? `Danh sách đầy đủ ${stats.totalPeople} người qua ${stats.totalGenerations} thế hệ phả hệ` : 'Danh sách và tìm kiếm thành viên gia tộc'}
              </p>
            </div>
          </div>

          {isEditor && (
            <Button asChild className="bg-white text-blue-900 hover:bg-blue-50 font-bold shadow-md gap-2 text-xs sm:text-sm">
              <Link href="/people/new">
                <Plus className="h-4 w-4" /> Thêm thành viên mới
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Filters Card */}
      <Card className="border-blue-100 dark:border-blue-950 shadow-sm">
        <CardHeader className="pb-3 bg-muted/20 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              Bộ lọc &amp; Tìm kiếm thành viên
            </CardTitle>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground hover:text-destructive h-7">
                <X className="h-3.5 w-3.5 mr-1" /> Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nhập tên thành viên, tên gọi khác hoặc từ khóa cần tìm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 text-sm focus:border-blue-500 rounded-xl"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1 block">Lọc theo Đời</label>
              <Select value={generationFilter} onValueChange={setGenerationFilter}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Tất cả đời" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">Tất cả thế hệ (Đời)</SelectItem>
                  {generations.map(gen => (
                    <SelectItem key={gen} value={gen.toString()} className="text-xs">
                      Đời thứ {gen}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1 block">Lọc theo Chi / Nhánh</label>
              <Select value={chiFilter} onValueChange={setChiFilter}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Tất cả chi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">Tất cả chi tộc</SelectItem>
                  {chiValues.map(chi => (
                    <SelectItem key={chi} value={chi.toString()} className="text-xs">
                      Chi {chi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1 block">Trạng thái sống / mất</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">Tất cả trạng thái</SelectItem>
                  <SelectItem value="living" className="text-xs">💚 Còn sống</SelectItem>
                  <SelectItem value="deceased" className="text-xs">🕯️ Đã mất (Hưởng thọ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Listing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground font-medium">
            {isLoading ? 'Đang tải...' : `Tìm thấy ${filteredPeople.length} thành viên`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredPeople.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center space-y-3">
              <Users className="h-12 w-12 text-muted-foreground/40 mx-auto" />
              {hasFilters ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Không tìm thấy thành viên phù hợp với bộ lọc</p>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Xóa bộ lọc để xem tất cả
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Chưa có dữ liệu thành viên nào</p>
                  {isEditor && (
                    <Button asChild size="sm">
                      <Link href="/people/new">Thêm thành viên đầu tiên</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            {groupedByGeneration.sortedGens.map(gen => (
              <div key={gen} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-bold px-4 py-1.5 rounded-xl text-xs sm:text-sm shadow-sm tracking-wide flex items-center gap-2">
                    <UserCheck className="h-4 w-4" /> ĐỜI THỨ {gen}
                  </div>
                  <div className="flex-1 h-[1.5px] bg-border/80 rounded-full" />
                  <Badge variant="outline" className="text-xs font-semibold">
                    {groupedByGeneration.groups[gen].length} người
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedByGeneration.groups[gen].map(person => (
                    <PersonCard key={person.id} person={person} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
