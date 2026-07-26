/**
 * @project AncestorTree
 * @file src/app/(main)/directory/page.tsx
 * @description Modern UI/UX Family directory with dual views (Cards vs Table), quick actions, and privacy controls
 * @version 3.0.0
 * @updated 2026-07-26
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BookUser,
  Search,
  Phone,
  Mail,
  MapPin,
  Lock,
  ExternalLink,
  ShieldCheck,
  User,
  X,
  Filter,
  LayoutGrid,
  List,
} from 'lucide-react';
import type { Person } from '@/types';

type FilterGender = 'all' | '1' | '2';
type FilterStatus = 'all' | 'living' | 'deceased';
type ViewMode = 'cards' | 'table';

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
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

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
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6 pb-24">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950 p-6 sm:p-10 text-white shadow-2xl border border-indigo-800/40">
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
          <BookUser className="h-64 w-64 text-indigo-200" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/20 shrink-0">
              <BookUser className="h-7 w-7 text-indigo-200" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Danh Bạ Liên Lạc Gia Tộc</h1>
                <Badge className="bg-teal-400 text-teal-950 font-bold px-3 py-1 rounded-full text-xs">
                  {filteredPeople.length} Liên Lạc
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-normal">
                Tra cứu SĐT, Email, địa chỉ và thông tin kết nối thành viên gia tộc với bảo mật quyền riêng tư
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur p-1.5 rounded-2xl border border-white/20 shrink-0">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className={`rounded-xl text-xs font-bold gap-1.5 ${viewMode === 'cards' ? 'bg-white text-slate-950 hover:bg-slate-100 shadow' : 'text-white hover:bg-white/10'}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Dạng Thẻ
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={`rounded-xl text-xs font-bold gap-1.5 ${viewMode === 'table' ? 'bg-white text-slate-950 hover:bg-slate-100 shadow' : 'text-white hover:bg-white/10'}`}
            >
              <List className="h-3.5 w-3.5" /> Dạng Bảng
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="rounded-3xl border border-slate-200/80 shadow-md bg-white">
        <CardHeader className="p-4 sm:p-5 pb-3 bg-slate-50/50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-slate-900">
              <Filter className="h-4 w-4 text-indigo-600" />
              Bộ Lọc Danh Bạ
            </CardTitle>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-slate-500 hover:text-destructive h-7">
                <X className="h-3.5 w-3.5 mr-1" /> Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Nhập tên thành viên, SĐT, Email, Địa chỉ sinh sống..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 text-sm focus:border-indigo-500 rounded-2xl border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Thế hệ (Đời)</label>
              <Select value={generationFilter} onValueChange={setGenerationFilter}>
                <SelectTrigger className="text-xs rounded-xl border-slate-200 bg-white">
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
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Giới tính</label>
              <Select value={genderFilter} onValueChange={v => setGenderFilter(v as FilterGender)}>
                <SelectTrigger className="text-xs rounded-xl border-slate-200 bg-white">
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
              <label className="text-[11px] font-bold text-slate-500 uppercase mb-1 block">Trạng thái thành viên</label>
              <Select value={statusFilter} onValueChange={v => setStatusFilter(v as FilterStatus)}>
                <SelectTrigger className="text-xs rounded-xl border-slate-200 bg-white">
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

      {/* Directory Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : filteredPeople.length === 0 ? (
        <Card className="border-dashed rounded-3xl">
          <CardContent className="py-16 text-center text-slate-500 space-y-3">
            <BookUser className="h-12 w-12 text-slate-300 mx-auto" />
            <p className="text-sm font-medium">Không tìm thấy thông tin liên lạc phù hợp</p>
          </CardContent>
        </Card>
      ) : viewMode === 'cards' ? (
        /* Contact Cards Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeople.map(person => {
            const contacts = getContactDisplay(person, isAuthenticated, isViewer, profile?.linked_person);
            const initials = person.display_name
              .split(' ')
              .map(n => n[0])
              .slice(-2)
              .join('')
              .toUpperCase();

            return (
              <Card key={person.id} className="group rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all flex flex-col justify-between overflow-hidden">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3.5">
                    <Avatar className="h-12 w-12 border border-slate-200 shadow-sm shrink-0">
                      <AvatarImage src={person.avatar_url} alt={person.display_name} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-800 font-bold text-xs">
                        {initials || <User className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Link href={`/people/${person.id}`} className="font-bold text-base text-slate-900 hover:text-indigo-700 transition-colors flex items-center gap-1">
                        <span className="truncate">{person.display_name}</span>
                        <ExternalLink className="h-3 w-3 text-slate-400 shrink-0" />
                      </Link>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-900 border-amber-300 font-bold">
                          Đời {person.generation}, Phái {person.phai ?? '—'}, Chi {person.chi ?? '—'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Items */}
                  <div className="space-y-2 text-xs pt-1 border-t border-slate-100">
                    {/* Phone */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-emerald-600" /> SĐT:
                      </span>
                      {contacts.masked ? (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Đã bảo mật
                        </span>
                      ) : contacts.phone ? (
                        <a href={`tel:${contacts.phone}`} className="font-mono font-bold text-emerald-700 hover:underline">
                          {contacts.phone}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">Chưa cập nhật</span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-blue-600" /> Email:
                      </span>
                      {contacts.masked ? (
                        <span className="text-slate-400 italic text-[11px]">Ẩn</span>
                      ) : contacts.email ? (
                        <a href={`mailto:${contacts.email}`} className="font-medium text-blue-700 hover:underline truncate max-w-[180px]">
                          {contacts.email}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">Chưa cập nhật</span>
                      )}
                    </div>

                    {/* Address */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" /> Nơi ở:
                      </span>
                      {contacts.address ? (
                        <span className="text-slate-700 font-normal text-right line-clamp-1">
                          {contacts.address}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Chưa cập nhật</span>
                      )}
                    </div>
                  </div>
                </CardContent>

                {/* Quick Action Footer */}
                {!contacts.masked && contacts.phone && (
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button asChild size="sm" variant="outline" className="w-full h-8 text-xs font-bold border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-xl">
                      <a href={`tel:${contacts.phone}`}>
                        <Phone className="h-3 w-3 mr-1" /> Gọi Điện Ngay
                      </a>
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        /* Compact Table Layout */
        <Card className="rounded-3xl border border-slate-200/80 shadow-md overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold text-xs text-slate-700">Họ &amp; Tên Thành Viên</TableHead>
                    <TableHead className="font-bold text-xs text-slate-700">Thế Hệ / Phái / Chi</TableHead>
                    <TableHead className="font-bold text-xs text-slate-700">Số Điện Thoại</TableHead>
                    <TableHead className="font-bold text-xs text-slate-700">Email</TableHead>
                    <TableHead className="font-bold text-xs text-slate-700">Địa Chỉ Sinh Sống</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPeople.map(person => {
                    const contacts = getContactDisplay(person, isAuthenticated, isViewer, profile?.linked_person);
                    return (
                      <TableRow key={person.id} className="hover:bg-slate-50/80 transition-colors">
                        <TableCell className="font-bold text-sm">
                          <Link href={`/people/${person.id}`} className="text-indigo-700 hover:underline flex items-center gap-1.5">
                            {person.display_name}
                            <ExternalLink className="h-3 w-3 text-slate-400" />
                          </Link>
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-900 border-amber-300 font-bold">
                            Đời {person.generation}, Phái {person.phai ?? '—'}, Chi {person.chi ?? '—'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {contacts.masked ? (
                            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold inline-flex items-center gap-1">
                              <Lock className="h-3 w-3" /> Bảo mật
                            </span>
                          ) : contacts.phone ? (
                            <a href={`tel:${contacts.phone}`} className="text-emerald-700 hover:underline font-mono font-bold flex items-center gap-1">
                              <Phone className="h-3 w-3 text-emerald-600" /> {contacts.phone}
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          {contacts.masked ? (
                            <span className="text-slate-400 italic text-[11px]">Ẩn</span>
                          ) : contacts.email ? (
                            <a href={`mailto:${contacts.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {contacts.email}
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 max-w-xs truncate">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}

