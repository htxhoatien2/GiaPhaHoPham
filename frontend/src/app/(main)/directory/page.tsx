/**
 * @project AncestorTree
 * @file src/app/(main)/directory/page.tsx
 * @description Modern UI/UX Family directory with contacts, filters, search, and privacy controls
 * @version 2.5.0
 * @updated 2026-03-25
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePeople } from '@/hooks/use-people';
import { useAuth } from '@/components/auth/auth-provider';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  BookUser,
  Search,
  Phone,
  Mail,
  MapPin,
  Lock,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  X,
  Filter,
  Sparkles,
} from 'lucide-react';
import type { Person } from '@/types';

type FilterGender = 'all' | '1' | '2';
type FilterStatus = 'all' | 'living' | 'deceased';

function getContactDisplay(person: Person, isAuthenticated: boolean, isViewer: boolean, linkedPersonId?: string) {
  const maskedResult = { phone: null, email: null, address: null, zalo: null, facebook: null, masked: true };
  if (isViewer && person.id !== linkedPersonId) {
    return maskedResult;
  }
  if (person.privacy_level === 2 && person.id !== linkedPersonId) {
    return maskedResult;
  }
  if (person.privacy_level === 1 && !isAuthenticated) {
    return maskedResult;
  }
  return {
    phone: person.phone || null,
    email: person.email || null,
    address: person.address || person.hometown || null,
    zalo: person.zalo || null,
    facebook: person.facebook || null,
    masked: false,
  };
}

export default function DirectoryPage() {
  const { data: people, isLoading } = usePeople();
  const { user, profile } = useAuth();
  const isAuthenticated = !!user;
  const isViewer = profile?.role === 'viewer';

  const [search, setSearch] = useState('');
  const [generationFilter, setGenerationFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<FilterGender>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('living');

  const generations = useMemo(() => {
    if (!people) return [];
    return [...new Set(people.map(p => p.generation))].sort((a, b) => a - b);
  }, [people]);

  const filteredPeople = useMemo(() => {
    if (!people) return [];

    return people.filter(p => {
      if (statusFilter === 'living' && !p.is_living) return false;
      if (statusFilter === 'deceased' && p.is_living) return false;

      if (search) {
        const q = search.toLowerCase();
        const matchName = p.display_name.toLowerCase().includes(q);
        const canSeeContacts = !isViewer && isAuthenticated && p.privacy_level !== 2 && !(p.privacy_level === 1 && !isAuthenticated);
        const isSelf = p.id === profile?.linked_person;
        const searchContacts = canSeeContacts || isSelf;
        const matchPhone = searchContacts && p.phone?.toLowerCase().includes(q);
        const matchEmail = searchContacts && p.email?.toLowerCase().includes(q);
        const matchAddress = searchContacts && p.address?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchEmail && !matchAddress) return false;
      }

      if (generationFilter !== 'all' && p.generation !== Number(generationFilter)) return false;
      if (genderFilter !== 'all' && p.gender !== Number(genderFilter)) return false;

      return true;
    });
  }, [people, search, generationFilter, genderFilter, statusFilter, isViewer, isAuthenticated, profile?.linked_person]);

  const hasFilters = search || generationFilter !== 'all' || genderFilter !== 'all' || statusFilter !== 'living';

  const clearFilters = () => {
    setSearch('');
    setGenerationFilter('all');
    setGenderFilter('all');
    setStatusFilter('living');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6 pb-24">
      {/* Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <BookUser className="h-56 w-56" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <BookUser className="h-6 w-6 text-blue-200" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Danh Bạ Liên Lạc Gia Tộc</h1>
                <p className="text-xs sm:text-sm text-blue-100/90 mt-0.5">
                  Tra cứu số điện thoại, Email, địa chỉ và thông tin liên lạc thành viên
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-blue-400 text-blue-950 font-bold">
                {filteredPeople.length} danh bạ
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="border-blue-100 dark:border-blue-950 shadow-sm">
        <CardHeader className="pb-3 bg-muted/20 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              Bộ lọc Danh Bạ
            </CardTitle>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground hover:text-destructive h-7">
                <X className="h-3.5 w-3.5 mr-1" /> Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên, SĐT, Email, Địa chỉ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 text-sm focus:border-blue-500 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1 block">Thế hệ (Đời)</label>
              <Select value={generationFilter} onValueChange={setGenerationFilter}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Tất cả đời" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">Tất cả thế hệ</SelectItem>
                  {generations.map(gen => (
                    <SelectItem key={gen} value={gen.toString()} className="text-xs">
                      Đời thứ {gen}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1 block">Giới tính</label>
              <Select value={genderFilter} onValueChange={v => setGenderFilter(v as FilterGender)}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">Tất cả giới tính</SelectItem>
                  <SelectItem value="1" className="text-xs">Nam giới ♂</SelectItem>
                  <SelectItem value="2" className="text-xs">Nữ giới ♀</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1 block">Trạng thái thành viên</label>
              <Select value={statusFilter} onValueChange={v => setStatusFilter(v as FilterStatus)}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="living" className="text-xs">💚 Đang sống (Có danh bạ)</SelectItem>
                  <SelectItem value="all" className="text-xs">Tất cả thành viên</SelectItem>
                  <SelectItem value="deceased" className="text-xs">🕯️ Đã mất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Directory Table Card */}
      <Card className="shadow-sm overflow-hidden border-border/80">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredPeople.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-3">
              <BookUser className="h-12 w-12 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-medium">Không tìm thấy liên lạc phù hợp</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="font-bold text-xs">Họ &amp; Tên thành viên</TableHead>
                    <TableHead className="font-bold text-xs">Đời / Chi</TableHead>
                    <TableHead className="font-bold text-xs">Số điện thoại</TableHead>
                    <TableHead className="font-bold text-xs">Email</TableHead>
                    <TableHead className="font-bold text-xs">Địa chỉ sinh sống</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPeople.map(person => {
                    const contacts = getContactDisplay(person, isAuthenticated, isViewer, profile?.linked_person);
                    return (
                      <TableRow key={person.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-semibold text-sm">
                          <Link href={`/people/${person.id}`} className="text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1.5">
                            {person.display_name}
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          </Link>
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-[10px]">
                            Đời {person.generation} {person.chi ? `· Chi ${person.chi}` : ''}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {contacts.masked ? (
                            <span className="text-muted-foreground italic flex items-center gap-1 text-[11px]">
                              <Lock className="h-3 w-3 text-amber-500" /> Đã bảo mật
                            </span>
                          ) : contacts.phone ? (
                            <a href={`tel:${contacts.phone}`} className="text-emerald-700 dark:text-emerald-400 hover:underline font-mono font-medium flex items-center gap-1">
                              <Phone className="h-3 w-3 text-emerald-600" /> {contacts.phone}
                            </a>
                          ) : (
                            <span className="text-muted-foreground/60">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          {contacts.masked ? (
                            <span className="text-muted-foreground italic text-[11px]">Ẩn</span>
                          ) : contacts.email ? (
                            <a href={`mailto:${contacts.email}`} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {contacts.email}
                            </a>
                          ) : (
                            <span className="text-muted-foreground/60">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                          {contacts.address ? (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-rose-500 shrink-0" /> {contacts.address}
                            </span>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
