/**
 * @project AncestorTree
 * @file src/app/(main)/people/page.tsx
 * @description Modern, scientific, state-of-the-art People list page with fuzzy search, generation pills, and filters
 * @version 3.0.0
 * @updated 2026-07-26
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
import { Search, Filter, Users, Plus, X, UserCheck, Layers } from 'lucide-react';
import Link from 'next/link';

export default function PeoplePage() {
  const { isEditor } = useAuth();
  const { data: people, isLoading, error } = usePeople();
  const { data: stats } = useStats();

  const [search, setSearch] = useState('');
  const [generationFilter, setGenerationFilter] = useState<string>('all');
  const [phaiFilter, setPhaiFilter] = useState<string>('all');
  const [chiFilter, setChiFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const generations = useMemo(() => {
    if (!people) return [];
    return [...new Set(people.map(p => p.generation))].sort((a, b) => a - b);
  }, [people]);

  const phaiValues = useMemo(() => {
    if (!people) return [];
    return [...new Set(people.filter(p => p.phai != null).map(p => p.phai!))].sort((a, b) => a - b);
  }, [people]);

  const chiValues = useMemo(() => {
    if (!people) return [];
    return [...new Set(people.filter(p => p.chi != null).map(p => p.chi!))].sort((a, b) => a - b);
  }, [people]);

  const fuzzyResults = useFuzzySearch(people, search);

  const filteredPeople = useMemo(() => {
    return fuzzyResults.filter(person => {
      if (generationFilter !== 'all' && person.generation !== parseInt(generationFilter, 10)) {
        return false;
      }
      if (phaiFilter !== 'all' && person.phai !== parseInt(phaiFilter, 10)) {
        return false;
      }
      if (chiFilter !== 'all' && person.chi !== parseInt(chiFilter, 10)) {
        return false;
      }
      if (statusFilter === 'living' && !person.is_living) return false;
      if (statusFilter === 'deceased' && person.is_living) return false;
      return true;
    });
  }, [fuzzyResults, generationFilter, phaiFilter, chiFilter, statusFilter]);

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

  const hasFilters = search || generationFilter !== 'all' || phaiFilter !== 'all' || chiFilter !== 'all' || statusFilter !== 'all';

  const clearFilters = () => {
    setSearch('');
    setGenerationFilter('all');
    setPhaiFilter('all');
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
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6 pb-24">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 p-6 sm:p-10 text-white shadow-2xl border border-blue-800/40">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <Users className="h-64 w-64 text-blue-200" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/20 shrink-0">
              <Users className="h-7 w-7 text-blue-200" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Thành Viên Dòng Họ</h1>
                {stats && (
                  <Badge className="bg-blue-400 text-blue-950 font-bold px-3 py-1 rounded-full text-xs">
                    {stats.totalPeople} Thành Viên
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-xl">
                {stats ? `Tra cứu thông tin danh sách ${stats.totalPeople} thành viên qua ${stats.totalGenerations} thế hệ phả hệ` : 'Danh sách và tìm kiếm thành viên gia tộc'}
              </p>
            </div>
          </div>

          {isEditor && (
            <Button asChild className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-amber-950 font-bold shadow-lg rounded-2xl h-11 px-5 text-xs sm:text-sm shrink-0">
              <Link href="/people/new">
                <Plus className="h-4 w-4 mr-1.5" /> Thêm Thành Viên Mới
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Quick Generation Navigation Pills */}
      {generations.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <Layers className="h-3.5 w-3.5" /> Nhanh:
          </span>
          <button
            onClick={() => setGenerationFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              generationFilter === 'all'
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Tất cả đời ({people?.length || 0})
          </button>
          {generations.map(gen => {
            const count = (people || []).filter(p => p.generation === gen).length;
            return (
              <button
                key={gen}
                onClick={() => setGenerationFilter(gen.toString())}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  generationFilter === gen.toString()
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Đời {gen} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Filters Card */}
      <Card className="rounded-3xl border border-slate-200/80 shadow-md bg-white">
        <CardHeader className="p-4 sm:p-5 pb-3 bg-slate-50/50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-slate-900">
              <Filter className="h-4 w-4 text-blue-600" />
              Bộ Lọc &amp; Tìm Kiếm Thành Viên Nâng Cao
            </CardTitle>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-slate-500 hover:text-destructive h-7">
                <X className="h-3.5 w-3.5 mr-1" /> Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Nhập họ tên thành viên, tên gọi khác hoặc thông tin cần tìm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 text-sm focus:border-blue-500 rounded-2xl border-slate-200"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Lọc theo Đời</label>
              <Select value={generationFilter} onValueChange={setGenerationFilter}>
                <SelectTrigger className="text-xs rounded-xl border-slate-200 bg-white">
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
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Lọc theo Phái tộc</label>
              <Select value={phaiFilter} onValueChange={setPhaiFilter}>
                <SelectTrigger className="text-xs rounded-xl border-slate-200 bg-white">
                  <SelectValue placeholder="Tất cả phái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">Tất cả phái tộc</SelectItem>
                  {phaiValues.map(phai => (
                    <SelectItem key={phai} value={phai.toString()} className="text-xs">
                      Phái {phai}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Lọc theo Chi tộc</label>
              <Select value={chiFilter} onValueChange={setChiFilter}>
                <SelectTrigger className="text-xs rounded-xl border-slate-200 bg-white">
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
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Trạng thái sống / mất</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-xs rounded-xl border-slate-200 bg-white">
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
          <p className="text-xs font-semibold text-slate-500">
            {isLoading ? 'Đang tải dữ liệu...' : `Tìm thấy ${filteredPeople.length} thành viên phù hợp`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-4 rounded-2xl">
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
          <Card className="border-dashed rounded-3xl">
            <CardContent className="py-16 text-center space-y-3">
              <Users className="h-12 w-12 text-slate-300 mx-auto" />
              {hasFilters ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Không tìm thấy thành viên phù hợp với bộ lọc</p>
                  <Button variant="outline" size="sm" onClick={clearFilters} className="rounded-xl">
                    Xóa bộ lọc để xem tất cả
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Chưa có dữ liệu thành viên nào</p>
                  {isEditor && (
                    <Button asChild size="sm" className="rounded-xl">
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
                  <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-black px-4 py-1.5 rounded-2xl text-xs sm:text-sm shadow-md tracking-wider flex items-center gap-2">
                    <UserCheck className="h-4 w-4" /> ĐỜI THỨ {gen}
                  </div>
                  <div className="flex-1 h-[1.5px] bg-slate-200 rounded-full" />
                  <Badge variant="outline" className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border-slate-200">
                    {groupedByGeneration.groups[gen].length} Thành viên
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

