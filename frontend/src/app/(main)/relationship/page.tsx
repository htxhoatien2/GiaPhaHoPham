/**
 * @project AncestorTree
 * @file src/app/(main)/relationship/page.tsx
 * @description Modern UI/UX Relationship finder page — select 2 people and find their connection
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSearchPeople } from '@/hooks/use-people';
import { useRelationship } from '@/hooks/use-pathfinding';
import { Search, X, Route, ArrowRight, GitBranch, Loader2, ArrowLeftRight, UserCheck, Sparkles, HelpCircle } from 'lucide-react';
import type { Person } from '@/types';

interface PersonComboboxProps {
  label: string;
  selected: Person | null;
  onSelect: (person: Person | null) => void;
  excludeId?: string;
}

function PersonCombobox({ label, selected, onSelect, excludeId }: PersonComboboxProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { data: results, isFetching } = useSearchPeople(query);

  const filtered = (results || []).filter((p) => p.id !== excludeId);

  const handleSelect = (person: Person) => {
    onSelect(person);
    setQuery('');
    setOpen(false);
  };

  const handleClear = () => {
    onSelect(null);
    setQuery('');
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
        <UserCheck className="h-3.5 w-3.5 text-blue-600" /> {label}
      </label>

      {selected ? (
        <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-blue-500/40 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-inner ${
              selected.gender === 1 ? 'bg-blue-600 text-white' : 'bg-pink-600 text-white'
            }`}
          >
            {selected.display_name.slice(-1)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-foreground">{selected.display_name}</p>
            <p className="text-xs text-muted-foreground">Đời thứ {selected.generation} {selected.birth_year ? `• Sinh năm ${selected.birth_year}` : ''}</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Nhập tên ${label.toLowerCase()}... (tối thiểu 2 ký tự)`}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(e.target.value.length >= 2);
              }}
              onFocus={() => query.length >= 2 && setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
              className="pl-10 text-xs focus:border-blue-500 rounded-xl"
            />
          </div>
          {open && (
            <div className="absolute z-50 w-full mt-1.5 bg-background border rounded-xl shadow-xl max-h-56 overflow-y-auto p-1">
              {isFetching && (
                <div className="p-3 text-xs text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang tìm kiếm...
                </div>
              )}
              {!isFetching && filtered.length === 0 && query.length >= 2 && (
                <p className="px-3 py-3 text-xs text-muted-foreground text-center">Không tìm thấy thành viên phù hợp</p>
              )}
              {filtered.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onMouseDown={() => handleSelect(person)}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      person.gender === 1
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-pink-100 text-pink-700'
                    }`}
                  >
                    {person.display_name.slice(-1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate">{person.display_name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Đời {person.generation}
                      {person.birth_year ? ` · Sinh năm ${person.birth_year}` : ''}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RelationshipPage() {
  const [personA, setPersonA] = useState<Person | null>(null);
  const [personB, setPersonB] = useState<Person | null>(null);
  const { result, isLoading } = useRelationship(personA?.id ?? null, personB?.id ?? null);

  const handleSwap = () => {
    const temp = personA;
    setPersonA(personB);
    setPersonB(temp);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6 pb-24">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <Route className="h-56 w-56" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
              <Route className="h-6 w-6 text-blue-200" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Tra Cứu Quan Hệ Huyết Thống</h1>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-0.5">
                Chọn 2 thành viên bất kỳ để tự động tính toán mối quan hệ họ hàng và tổ tiên chung
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selectors Card */}
      <Card className="border-blue-100 dark:border-blue-950 shadow-sm">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4 text-blue-600" />
            Chọn 2 thành viên để tìm mối quan hệ
          </CardTitle>
          <CardDescription className="text-xs">
            Hệ thống áp dụng thuật toán tìm đường đi ngắn nhất (Shortest Path &amp; LCA) trên cây gia phả
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 relative">
            <PersonCombobox
              label="Thành viên thứ nhất"
              selected={personA}
              onSelect={setPersonA}
              excludeId={personB?.id}
            />

            {/* Swap button */}
            {personA && personB && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden sm:block">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwap}
                  className="rounded-full h-8 w-8 p-0 bg-background shadow-md border-blue-200 hover:border-blue-500"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 text-blue-600" />
                </Button>
              </div>
            )}

            <PersonCombobox
              label="Thành viên thứ hai"
              selected={personB}
              onSelect={setPersonB}
              excludeId={personA?.id}
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {isLoading && personA && personB && (
        <Card className="border-blue-200 bg-blue-50/20">
          <CardContent className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-muted-foreground">Đang phân tích cây phả hệ và tính toán quan hệ...</p>
          </CardContent>
        </Card>
      )}

      {/* Result card */}
      {result && !isLoading && (
        <Card className="border-blue-200/80 shadow-md bg-card">
          <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-base">Kết quả Phân tích Quan hệ</CardTitle>
              </div>
              {result.found && (
                <Badge className="bg-emerald-600 text-white font-bold">
                  Khoảng cách: {result.distance} thế hệ / bậc
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Relationship summary banner */}
            <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 dark:bg-blue-950/30 p-5 space-y-2 text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-black text-blue-950 dark:text-blue-200 tracking-tight">
                {result.description}
              </p>
              {result.descriptionDetail && (
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {result.descriptionDetail}
                </p>
              )}
            </div>

            {/* Ancestor LCA info */}
            {result.lca && (
              <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-xl border bg-muted/20 text-xs sm:text-sm">
                <span className="font-semibold text-muted-foreground">Tổ tiên chung gần nhất (LCA):</span>
                <Link href={`/people/${result.lca.id}`} className="font-bold text-blue-700 dark:text-blue-300 hover:underline">
                  {result.lca.display_name}
                </Link>
                <Badge variant="outline" className="text-[10px]">
                  Đời thứ {result.lca.generation}
                </Badge>
              </div>
            )}

            {/* Path visualization */}
            {result.found && result.path.length > 0 && (
              <div className="space-y-3 border-t pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Sơ đồ đường đi huyết thống ({result.path.length} người):
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {result.path.map((person, idx) => (
                    <div key={person.id} className="flex items-center gap-2">
                      <Link
                        href={`/people/${person.id}`}
                        className="inline-flex items-center gap-2 rounded-xl border bg-background hover:bg-accent px-3 py-1.5 text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-inner ${
                            person.gender === 1 ? 'bg-blue-600' : 'bg-pink-600'
                          }`}
                        >
                          {person.display_name.slice(-1)}
                        </div>
                        <span>{person.display_name}</span>
                        <span className="text-[10px] text-muted-foreground">(Đời {person.generation})</span>
                      </Link>
                      {idx < result.path.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-blue-500 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View on tree button */}
            {result.found && personA && (
              <div className="pt-2 border-t flex justify-end">
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1.5">
                  <Link href={`/tree?root=${personA.id}`}>
                    <GitBranch className="h-4 w-4" /> Xem vị trí trên Cây phả hệ
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
