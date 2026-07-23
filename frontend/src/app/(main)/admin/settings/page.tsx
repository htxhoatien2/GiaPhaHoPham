/**
 * @project AncestorTree
 * @file src/app/(main)/admin/settings/page.tsx
 * @description Modern, premium UI/UX Admin settings page — dynamic clan configuration CRUD
 * @version 3.0.0
 * @updated 2026-03-25
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClanSettings, useUpdateClanSettings } from '@/hooks/use-clan-settings';
import { useAuth } from '@/components/auth/auth-provider';
import { ClanLogo } from '@/components/common/clan-logo';
import { ClanBanner } from '@/components/common/clan-banner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Settings,
  Globe,
  Database,
  Save,
  Loader2,
  Users,
  Landmark,
  Plus,
  Trash2,
  Calendar,
  Lock,
  BookOpen,
  Target,
  Sparkles,
  RefreshCw,
  Mail,
  Phone,
  Building,
  UserCheck,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { CLAN_NAME as ENV_CLAN_NAME, CLAN_FULL_NAME as ENV_CLAN_FULL_NAME } from '@/lib/clan-config';
import type { UpdateClanSettingsInput, CouncilMember, CeremonyScheduleItem, LoginMethod } from '@/types';

const isDesktop = process.env.NEXT_PUBLIC_DESKTOP_MODE === 'true';
const APP_VERSION = 'v3.0.0';

function deriveInitial(name: string): string {
  const parts = name.trim().split(' ');
  return parts.length > 1 ? (parts[parts.length - 1][0] ?? '?') : (parts[0][0] ?? '?');
}

function deriveSubtitle(fullName: string, shortName: string): string {
  return fullName.startsWith(shortName) ? fullName.slice(shortName.length).trim() : '';
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const { isEditor } = useAuth();
  const { data: clanSettings, isLoading, refetch } = useClanSettings();
  const updateMutation = useUpdateClanSettings();

  const [activeSection, setActiveSection] = useState<'clan' | 'council' | 'history' | 'hall' | 'login' | 'system'>('clan');

  const [clanName, setClanName] = useState('');
  const [clanFullName, setClanFullName] = useState('');
  const [foundingYear, setFoundingYear] = useState('');
  const [origin, setOrigin] = useState('');
  const [patriarch, setPatriarch] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  // Council + Ancestral Hall
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);
  const [clanHistory, setClanHistory] = useState('');
  const [clanMission, setClanMission] = useState('');
  const [hallAddress, setHallAddress] = useState('');
  const [hallHistory, setHallHistory] = useState('');
  const [ceremonies, setCeremonies] = useState<CeremonyScheduleItem[]>([]);
  // Login config
  const [loginMethods, setLoginMethods] = useState<LoginMethod[]>(['email_password', 'email_otp']);
  const [isSavingLogin, setIsSavingLogin] = useState(false);

  useEffect(() => {
    if (!clanSettings) return;
    setClanName(clanSettings.clan_name ?? '');
    setClanFullName(clanSettings.clan_full_name ?? '');
    setFoundingYear(clanSettings.clan_founding_year?.toString() ?? '');
    setOrigin(clanSettings.clan_origin ?? '');
    setPatriarch(clanSettings.clan_patriarch ?? '');
    setDescription(clanSettings.clan_description ?? '');
    setContactEmail(clanSettings.contact_email ?? '');
    setContactPhone(clanSettings.contact_phone ?? '');
    setCouncilMembers((clanSettings.council_members as CouncilMember[]) ?? []);
    setClanHistory(clanSettings.clan_history ?? '');
    setClanMission(clanSettings.clan_mission ?? '');
    setHallAddress(clanSettings.ancestral_hall_address ?? '');
    setHallHistory(clanSettings.ancestral_hall_history ?? '');
    setCeremonies((clanSettings.ceremony_schedule as CeremonyScheduleItem[]) ?? []);
    setLoginMethods(clanSettings.login_config?.methods ?? ['email_password', 'email_otp']);
  }, [clanSettings]);

  if (!isEditor) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <Card className="border-amber-200 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="py-12 text-center space-y-4">
            <Lock className="h-12 w-12 text-amber-600 dark:text-amber-400 mx-auto" />
            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200">Quyền truy cập bị giới hạn</h2>
            <p className="text-sm text-muted-foreground">
              Bạn cần tài khoản có quyền Admin hoặc Biên tập viên để truy cập trang cài đặt hệ thống.
            </p>
            <Button asChild className="mt-2">
              <Link href="/">Quay về trang chủ</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!clanSettings) return;
    if (!clanName.trim() || !clanFullName.trim()) {
      toast.error('Tên dòng họ không được để trống');
      return;
    }
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      toast.error('Email liên hệ không hợp lệ');
      return;
    }

    const cleanedCeremonies = ceremonies
      .filter(c => (c.title && c.title.trim().length > 0) || (c.lunar_date && c.lunar_date.trim().length > 0) || (c.solar_date && c.solar_date.trim().length > 0))
      .map(c => ({
        title: c.title?.trim() || 'Ngày lễ',
        lunar_date: c.lunar_date?.trim() || undefined,
        solar_date: c.solar_date?.trim() || undefined,
        description: c.description?.trim() || undefined,
      }));

    const cleanedCouncil = councilMembers
      .filter(m => m.name && m.name.trim().length > 0)
      .map(m => ({
        name: m.name.trim(),
        title: m.title?.trim() || 'Thành viên',
        phone: m.phone?.trim() || undefined,
      }));

    const input: UpdateClanSettingsInput = {
      clan_name: clanName.trim(),
      clan_full_name: clanFullName.trim(),
      clan_founding_year: foundingYear ? parseInt(foundingYear) : undefined,
      clan_origin: origin.trim() || undefined,
      clan_patriarch: patriarch.trim() || undefined,
      clan_description: description.trim() || undefined,
      contact_email: contactEmail.trim() || undefined,
      contact_phone: contactPhone.trim() || undefined,
      council_members: cleanedCouncil,
      clan_history: clanHistory.trim() || undefined,
      clan_mission: clanMission.trim() || undefined,
      ancestral_hall_address: hallAddress.trim() || undefined,
      ancestral_hall_history: hallHistory.trim() || undefined,
      ceremony_schedule: cleanedCeremonies,
    };

    try {
      await updateMutation.mutateAsync({ id: clanSettings.id, input });
      toast.success('Đã lưu thành công toàn bộ cài đặt dòng họ!');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi lưu cài đặt';
      toast.error(msg);
    }
  };

  const handleSaveLoginConfig = async () => {
    if (!clanSettings) return;
    if (loginMethods.length === 0) {
      toast.error('Phải bật ít nhất một phương thức đăng nhập');
      return;
    }
    setIsSavingLogin(true);
    try {
      await updateMutation.mutateAsync({
        id: clanSettings.id,
        input: {
          login_config: {
            methods: loginMethods,
            otp_expiry_minutes: clanSettings.login_config?.otp_expiry_minutes ?? 15,
          },
        },
      });
      toast.success('Đã cập nhật phương thức đăng nhập!');
    } catch {
      toast.error('Lỗi khi lưu cấu hình đăng nhập');
    } finally {
      setIsSavingLogin(false);
    }
  };

  const scrollToSection = (id: string, sectionKey: typeof activeSection) => {
    setActiveSection(sectionKey);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const previewInitial = deriveInitial(clanName || ENV_CLAN_NAME);
  const previewSubtitle = deriveSubtitle(clanFullName || ENV_CLAN_FULL_NAME, clanName || ENV_CLAN_NAME);

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-8 max-w-4xl pb-28">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Landmark className="h-64 w-64" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <Settings className="h-6 w-6 text-amber-200" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Cài đặt Hệ thống &amp; Dòng họ</h1>
                <p className="text-xs sm:text-sm text-amber-100/90">
                  Quản lý thông tin chung, Ban quản trị, Nhà thờ họ và các cấu hình vận hành
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur">
                {isDesktop ? 'Desktop Offline' : 'Web Online'}
              </Badge>
              <Badge className="bg-amber-400 text-amber-950 font-semibold">
                {APP_VERSION}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Section Navigation Pills */}
      <div className="sticky top-2 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-background/80 backdrop-blur border shadow-md overflow-x-auto">
        <button
          type="button"
          onClick={() => scrollToSection('sec-clan', 'clan')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            activeSection === 'clan'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          Dòng họ
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('sec-council', 'council')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            activeSection === 'council'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          Hội đồng ({councilMembers.length})
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('sec-history', 'history')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            activeSection === 'history'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Lịch sử &amp; Sứ mệnh
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('sec-hall', 'hall')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            activeSection === 'hall'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Landmark className="h-3.5 w-3.5" />
          Nhà thờ họ ({ceremonies.length} ngày lễ)
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('sec-login', 'login')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            activeSection === 'login'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('sec-system', 'system')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            activeSection === 'system'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          Hệ thống
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          {/* Card 1: Thông tin dòng họ */}
          <section id="sec-clan" className="scroll-mt-16">
            <Card className="border-amber-200/60 dark:border-amber-900/40 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="bg-amber-50/50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-600 text-white shadow-sm">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">1. Thông tin dòng họ chính</CardTitle>
                      <CardDescription className="text-xs">
                        Hiển thị trên Sidebar, tiêu đề hệ thống và gia phả sách
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs gap-1 border-amber-300 dark:border-amber-800">
                    <Sparkles className="h-3 w-3 text-amber-600" /> Đồng bộ toàn ứng dụng
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Tên dòng họ (ngắn) *</Label>
                    <Input
                      value={clanName}
                      onChange={e => setClanName(e.target.value)}
                      placeholder="VD: Họ Phạm Văn"
                      className="mt-1.5 focus:border-amber-500"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">Dùng hiển thị gọn trên Sidebar menu</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Năm thành lập</Label>
                    <Input
                      type="number"
                      value={foundingYear}
                      onChange={e => setFoundingYear(e.target.value)}
                      placeholder="1750"
                      min={1000}
                      max={2100}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Tên dòng họ (đầy đủ) *</Label>
                  <Input
                    value={clanFullName}
                    onChange={e => setClanFullName(e.target.value)}
                    placeholder="VD: Họ Phạm Văn làng An Trạch, Hòa Tiến"
                    className="mt-1.5"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Dùng trên Trang chủ, Trang Đăng nhập và Bìa Gia phả sách</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Thủy tổ</Label>
                    <Input
                      value={patriarch}
                      onChange={e => setPatriarch(e.target.value)}
                      placeholder="VD: Cụ Phạm Văn Tố"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Quê gốc / Tổ quán</Label>
                    <Input
                      value={origin}
                      onChange={e => setOrigin(e.target.value)}
                      placeholder="An Trạch, Hòa Tiến, Đà Nẵng"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold uppercase text-muted-foreground">Giới thiệu ngắn / Tóm tắt dòng họ</Label>
                  <Textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Mô tả tóm tắt dòng họ hiển thị ở trang giới thiệu..."
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> Email liên hệ Ban quản trị
                    </Label>
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="hoidong@giaphan.vn"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Số điện thoại liên hệ
                    </Label>
                    <Input
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                {/* Sidebar Preview Component */}
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/30 dark:bg-amber-950/20 dark:border-amber-900/40 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5" /> Xem trước giao diện Logo & Sidebar
                    </p>
                    <Badge variant="outline" className="text-[10px] bg-background">Live Preview</Badge>
                  </div>
                  <div className="p-3 bg-background rounded-lg border shadow-sm">
                    <ClanLogo name={clanName || ENV_CLAN_NAME} fullName={clanFullName || ENV_CLAN_FULL_NAME} size="md" clickable={false} />
                  </div>
                </div>

                {/* Banner Preview Component */}
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/30 dark:bg-amber-950/20 dark:border-amber-900/40 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5" /> Banner chính thức Từ đường Tộc Phạm Văn An Trạch
                    </p>
                    <Badge variant="outline" className="text-[10px] bg-background">Banner 2026</Badge>
                  </div>
                  <ClanBanner className="mt-2" />
                </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Card 2: Council members */}
          <section id="sec-council" className="scroll-mt-16">
            <Card className="border-blue-200/60 dark:border-blue-900/40 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-600 text-white shadow-sm">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">2. Ban quản trị / Hội đồng gia tộc</CardTitle>
                      <CardDescription className="text-xs">
                        Hiển thị danh sách ban quản trị công khai trên trang <Link href="/council" target="_blank" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">/council <ArrowUpRight className="h-3 w-3" /></Link>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {councilMembers.length} thành viên
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {councilMembers.length === 0 ? (
                  <div className="p-8 text-center border border-dashed rounded-xl space-y-3 bg-muted/20">
                    <UserCheck className="h-10 w-10 text-muted-foreground/50 mx-auto" />
                    <p className="text-sm text-muted-foreground">Chưa có thành viên Hội đồng gia tộc nào.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCouncilMembers([...councilMembers, { name: '', title: '' }])}
                      className="border-dashed"
                    >
                      <Plus className="h-4 w-4 mr-1.5" /> Thêm thành viên đầu tiên
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {councilMembers.map((m, i) => (
                      <div key={i} className="flex gap-2 items-center p-3 rounded-xl border bg-card hover:bg-muted/20 transition-colors group">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-bold text-xs shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <Input
                            placeholder="Họ tên thành viên *"
                            value={m.name}
                            onChange={e => {
                              const updated = [...councilMembers];
                              updated[i] = { ...updated[i], name: e.target.value };
                              setCouncilMembers(updated);
                            }}
                          />
                          <Input
                            placeholder="Chức vụ (VD: Chủ tịch, Trưởng ban)"
                            value={m.title}
                            onChange={e => {
                              const updated = [...councilMembers];
                              updated[i] = { ...updated[i], title: e.target.value };
                              setCouncilMembers(updated);
                            }}
                          />
                          <Input
                            placeholder="Số điện thoại (tùy chọn)"
                            value={m.phone ?? ''}
                            onChange={e => {
                              const updated = [...councilMembers];
                              updated[i] = { ...updated[i], phone: e.target.value || undefined };
                              setCouncilMembers(updated);
                            }}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive shrink-0 opacity-80 group-hover:opacity-100"
                          onClick={() => setCouncilMembers(councilMembers.filter((_, j) => j !== i))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCouncilMembers([...councilMembers, { name: '', title: '' }])}
                  className="mt-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50/50 text-blue-700 dark:text-blue-300"
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Thêm thành viên ban quản trị
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Card 3: History + Mission */}
          <section id="sec-history" className="scroll-mt-16">
            <Card className="border-purple-200/60 dark:border-purple-900/40 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="bg-purple-50/50 dark:bg-purple-950/20 border-b border-purple-100 dark:border-purple-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-purple-600 text-white shadow-sm">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">3. Lịch sử &amp; Sứ mệnh dòng họ</CardTitle>
                    <CardDescription className="text-xs">
                      Hiển thị nội dung trên trang Hội đồng gia tộc <Link href="/council" target="_blank" className="text-purple-600 hover:underline inline-flex items-center gap-0.5">/council <ArrowUpRight className="h-3 w-3" /></Link>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div>
                  <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5 mb-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-purple-600" /> Nguồn gốc &amp; Lịch sử phát triển dòng họ
                  </Label>
                  <Textarea
                    value={clanHistory}
                    onChange={e => setClanHistory(e.target.value)}
                    rows={4}
                    placeholder="Viết chi tiết về nguồn gốc xuất thân, các mốc lịch sử di cư, phát triển của dòng họ..."
                    className="focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5 mb-1.5">
                    <Target className="h-3.5 w-3.5 text-purple-600" /> Sứ mệnh &amp; Tầm nhìn gia tộc
                  </Label>
                  <Textarea
                    value={clanMission}
                    onChange={e => setClanMission(e.target.value)}
                    rows={3}
                    placeholder="Sứ mệnh gìn giữ gia phong, phát triển quỹ khuyến học, kết nối con cháu xa quê..."
                    className="focus:border-purple-500"
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Card 4: Ancestral Hall */}
          <section id="sec-hall" className="scroll-mt-16">
            <Card className="border-emerald-200/60 dark:border-emerald-900/40 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-sm">
                      <Landmark className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">4. Nhà thờ họ &amp; Lịch tế lễ hàng năm</CardTitle>
                      <CardDescription className="text-xs">
                        Hiển thị thông tin công khai trên trang Nhà thờ họ <Link href="/ancestral-hall" target="_blank" className="text-emerald-600 hover:underline inline-flex items-center gap-0.5">/ancestral-hall <ArrowUpRight className="h-3 w-3" /></Link>
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {ceremonies.length} ngày lễ
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Địa chỉ nhà thờ họ</Label>
                    <Input
                      value={hallAddress}
                      onChange={e => setHallAddress(e.target.value)}
                      placeholder="An Trạch, Hòa Tiến, Đà Nẵng"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Lịch sử xây dựng &amp; trùng tu</Label>
                    <Input
                      value={hallHistory}
                      onChange={e => setHallHistory(e.target.value)}
                      placeholder="Lịch sử xây dựng năm 1820, trùng tu 2015..."
                      className="mt-1.5"
                    />
                  </div>
                </div>

                {/* Ceremony schedule */}
                <div className="border-t pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="flex items-center gap-2 font-bold text-sm text-emerald-900 dark:text-emerald-300">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                        Danh sách Lịch tế lễ &amp; Ngày giỗ họ
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Thêm ngày lễ tế, giỗ tổ để hiển thị cho toàn bộ con cháu xem trên ứng dụng
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCeremonies([...ceremonies, { title: '', lunar_date: '', solar_date: '', description: '' }])}
                      className="border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-700 dark:text-emerald-300 text-xs gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" /> Thêm ngày lễ mới
                    </Button>
                  </div>

                  {ceremonies.length === 0 ? (
                    <div className="p-6 text-center border border-dashed rounded-xl space-y-2 bg-muted/20">
                      <Calendar className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                      <p className="text-sm text-muted-foreground">Chưa có lịch tế lễ nào được tạo.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {ceremonies.map((c, i) => (
                        <div key={i} className="flex gap-2 items-start border p-3.5 rounded-xl bg-card hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-colors shadow-xs">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 font-bold text-xs shrink-0 mt-6">
                            {i + 1}
                          </div>
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                            <div>
                              <Label className="text-[11px] font-medium text-muted-foreground">Tên ngày lễ *</Label>
                              <Input
                                placeholder="VD: Giỗ Tổ Chi II"
                                value={c.title}
                                onChange={e => {
                                  const updated = [...ceremonies];
                                  updated[i] = { ...updated[i], title: e.target.value };
                                  setCeremonies(updated);
                                }}
                                className="mt-1 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-[11px] font-medium text-muted-foreground">Ngày Âm lịch</Label>
                              <Input
                                placeholder="VD: 16/3 ÂL"
                                value={c.lunar_date ?? ''}
                                onChange={e => {
                                  const updated = [...ceremonies];
                                  updated[i] = { ...updated[i], lunar_date: e.target.value || undefined };
                                  setCeremonies(updated);
                                }}
                                className="mt-1 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-[11px] font-medium text-muted-foreground">Ngày Dương lịch</Label>
                              <Input
                                placeholder="VD: 25/04 DL"
                                value={c.solar_date ?? ''}
                                onChange={e => {
                                  const updated = [...ceremonies];
                                  updated[i] = { ...updated[i], solar_date: e.target.value || undefined };
                                  setCeremonies(updated);
                                }}
                                className="mt-1 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-[11px] font-medium text-muted-foreground">Ghi chú thêm</Label>
                              <Input
                                placeholder="VD: Cầu an tại nhà thờ"
                                value={c.description ?? ''}
                                onChange={e => {
                                  const updated = [...ceremonies];
                                  updated[i] = { ...updated[i], description: e.target.value || undefined };
                                  setCeremonies(updated);
                                }}
                                className="mt-1 text-sm"
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive shrink-0 mt-5"
                            onClick={() => setCeremonies(ceremonies.filter((_, j) => j !== i))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Sticky Bottom Floating Save Action Bar */}
          <div className="sticky bottom-4 z-30 flex items-center justify-between gap-4 p-4 rounded-2xl bg-background/90 backdrop-blur-md border shadow-2xl ring-1 ring-black/5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div className="hidden sm:block text-xs">
                <p className="font-semibold">Sẵn sàng lưu thay đổi</p>
                <p className="text-muted-foreground">Bấm nút bên cạnh để cập nhật tức thì lên hệ thống</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-1.5" /> Đặt lại
              </Button>
              <Button
                type="submit"
                size="default"
                disabled={updateMutation.isPending || !clanSettings}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md gap-2"
              >
                {updateMutation.isPending ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Đang lưu...</>
                ) : (
                  <><Save className="h-5 w-5" /> Lưu tất cả cấu hình</>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Card 5: Login config */}
      <section id="sec-login" className="scroll-mt-16">
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/40 border-b">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-slate-800 text-white shadow-sm">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base">5. Cấu hình phương thức đăng nhập</CardTitle>
                <CardDescription className="text-xs">
                  Thiết lập cách thức đăng nhập cho thành viên trên Web và Mobile
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Email + Password */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                loginMethods.includes('email_password')
                  ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-950/20'
                  : 'border-muted hover:border-muted-foreground/50'
              }`}>
                <input
                  type="checkbox"
                  checked={loginMethods.includes('email_password')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setLoginMethods((prev) => [...prev, 'email_password']);
                    } else {
                      setLoginMethods((prev) => prev.filter((m) => m !== 'email_password'));
                    }
                  }}
                  className="mt-1 h-4 w-4 accent-amber-600"
                />
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-sm">Email &amp; Mật khẩu</p>
                  <p className="text-xs text-muted-foreground">
                    Đăng nhập bằng Email và Mật khẩu truyền thống. Hỗ trợ xác thực 2 bước (TOTP/MFA).
                  </p>
                </div>
              </label>

              {/* OTP Email */}
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                loginMethods.includes('email_otp')
                  ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-950/20'
                  : 'border-muted hover:border-muted-foreground/50'
              }`}>
                <input
                  type="checkbox"
                  checked={loginMethods.includes('email_otp')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setLoginMethods((prev) => [...prev, 'email_otp']);
                    } else {
                      setLoginMethods((prev) => prev.filter((m) => m !== 'email_otp'));
                    }
                  }}
                  className="mt-1 h-4 w-4 accent-amber-600"
                />
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-sm">Mã OTP gửi về Email</p>
                  <p className="text-xs text-muted-foreground">
                    Đăng nhập không cần mật khẩu — nhận mã 6 chữ số qua Email. Phù hợp người cao tuổi.
                  </p>
                  <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300">
                    Miễn phí • Magic Link
                  </Badge>
                </div>
              </label>
            </div>

            {loginMethods.length === 0 && (
              <p className="text-xs text-destructive font-medium">⚠️ Vui lòng bật ít nhất một phương thức đăng nhập.</p>
            )}

            <Button
              type="button"
              size="sm"
              onClick={handleSaveLoginConfig}
              disabled={isSavingLogin || loginMethods.length === 0 || !clanSettings}
              className="mt-2"
            >
              {isSavingLogin ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Đang lưu...</>
              ) : (
                <><Save className="h-4 w-4 mr-2" /> Lưu cấu hình đăng nhập</>
              )}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Card 6: System Info */}
      <section id="sec-system" className="scroll-mt-16">
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/40 border-b">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-slate-700 text-white shadow-sm">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base">6. Thông tin hệ thống &amp; Môi trường</CardTitle>
                <CardDescription className="text-xs">Trạng thái vận hành của ứng dụng Gia Phả Điện Tử</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-xs text-muted-foreground">Phiên bản</span>
                <p className="font-bold text-sm">{APP_VERSION}</p>
              </div>
              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-xs text-muted-foreground">Chế độ vận hành</span>
                <p className="font-bold text-sm">{isDesktop ? 'Desktop (Offline)' : 'Web (Online)'}</p>
              </div>
              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-xs text-muted-foreground">Cơ sở dữ liệu</span>
                <p className="font-bold text-sm">{isDesktop ? 'SQLite Local' : 'PostgreSQL Cloud'}</p>
              </div>
            </div>

            {clanSettings?.updated_at && (
              <div className="flex justify-between items-center pt-4 mt-4 border-t text-xs text-muted-foreground">
                <span>Cấu hình cập nhật gần nhất</span>
                <span className="font-mono">
                  {new Date(clanSettings.updated_at).toLocaleDateString('vi-VN', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
