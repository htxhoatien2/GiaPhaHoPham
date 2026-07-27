/**
 * @project AncestorTree
 * @file src/app/(landing)/register-member/register-member-form.tsx
 * @description Client component — public registration form with honeypot
 * @version 1.0.0
 * @updated 2026-03-09
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, CheckCircle, Loader2 } from 'lucide-react';
import { useSubmitRegistration } from '@/hooks/use-registrations';
import { useClanSettings } from '@/hooks/use-clan-settings';
import Link from 'next/link';

export function RegisterMemberForm() {
  const { data: cs } = useClanSettings();
  const submitMutation = useSubmitRegistration();
  const [submitted, setSubmitted] = useState(false);

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<string>('');
  const [birthYear, setBirthYear] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [generation, setGeneration] = useState('');
  const [phai, setPhai] = useState('');
  const [chi, setChi] = useState('');
  const [relationship, setRelationship] = useState('');
  const [notes, setNotes] = useState('');
  // Honeypot — hidden from real users, bots fill it
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !gender) return;

    try {
      await submitMutation.mutateAsync({
        full_name: fullName.trim(),
        gender: parseInt(gender) as 1 | 2,
        birth_year: birthYear ? parseInt(birthYear) : undefined,
        birth_place: birthPlace.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        parent_name: parentName.trim() || undefined,
        generation: generation ? parseInt(generation) : undefined,
        chi: chi ? parseInt(chi) : undefined,
        phai: phai ? parseInt(phai) : undefined,
        relationship: relationship.trim() || undefined,
        notes: notes.trim() || undefined,
        honeypot,
      });
      setSubmitted(true);
    } catch {
      // Error handled by mutation state
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-6 text-slate-100">
        <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto" />
        <h1 className="text-3xl font-extrabold text-white">Ghi Danh Thành Công!</h1>
        <p className="text-slate-300 leading-relaxed">
          Thông tin của bạn đã được gửi đến Ban quản trị {cs?.clan_name ?? 'Tộc Phạm Văn'}.
          Sau khi đối chiếu và xét duyệt, bạn sẽ được đưa vào Cây Gia Phả.
        </p>
        <div className="flex gap-4 justify-center pt-4 text-xs font-medium text-slate-400">
          <Link href="/welcome" className="hover:text-amber-300 transition-colors">
            Về trang chủ
          </Link>
          <span>&middot;</span>
          <Link href="/council" className="hover:text-amber-300 transition-colors">
            Xem Hội đồng gia tộc
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-slate-100">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <UserPlus className="h-4 w-4 text-cyan-400" />
          Ghi Danh Thành Viên Trực Tuyến
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Đăng Ký Gia Nhập Nhập Phả
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-sm">
          Dành cho con cháu {cs?.clan_name ?? 'Tộc Phạm Văn'} sống xa muốn ghi danh vào Cây gia phả điện tử
        </p>
      </div>

      <Card className="bg-slate-950/80 border-slate-800 text-slate-100 shadow-2xl">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <CardTitle className="text-base text-amber-300 font-bold uppercase tracking-wider">Thông Tin Ghi Danh Cá Nhân</CardTitle>
          <CardDescription className="text-slate-400 text-xs">
            Vui lòng điền đầy đủ thông tin bên dưới. Ban quản trị sẽ đối chiếu và duyệt đơn. Trường có dấu (*) là bắt buộc.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot — hidden from real users */}
            <div className="absolute -left-[9999px] opacity-0 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="hp_check_website">Website</label>
              <input
                id="hp_check_website"
                name="hp_check_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-slate-300">Họ và tên *</Label>
                <Input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Phạm Văn A"
                  required
                  className="mt-1.5 bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-300">Giới tính *</Label>
                <Select value={gender} onValueChange={setGender} required>
                  <SelectTrigger className="mt-1.5 bg-slate-900 border-slate-800 text-white rounded-xl text-sm">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-white">
                    <SelectItem value="1">Nam</SelectItem>
                    <SelectItem value="2">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-slate-300">Năm sinh</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={birthYear}
                  onChange={e => setBirthYear(e.target.value.replace(/\D/g, ''))}
                  placeholder="1990"
                  className="mt-1.5 bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-300">Nơi sinh / Quê quán</Label>
                <Input
                  value={birthPlace}
                  onChange={e => setBirthPlace(e.target.value)}
                  placeholder="An Trạch, Đà Nẵng..."
                  className="mt-1.5 bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-slate-300">Số điện thoại</Label>
                <Input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="mt-1.5 bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-300">Địa chỉ Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="mt-1.5 bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-300">Tên cha / mẹ (để đối chiếu)</Label>
              <Input
                value={parentName}
                onChange={e => setParentName(e.target.value)}
                placeholder="Con ông Phạm Văn B, cháu cụ Phạm Văn C..."
                className="mt-1.5 bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
              />
            </div>

            {/* Hierarchy: Đời -> Phái -> Chi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs font-bold text-slate-300">Đời thứ (tự khai)</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={generation}
                  onChange={e => setGeneration(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ví dụ: 5"
                  className="mt-1.5 bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-amber-300">Phái tộc (tự khai)</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={phai}
                  onChange={e => setPhai(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ví dụ: 1"
                  className="mt-1.5 bg-slate-900 border-amber-500/40 text-white rounded-xl text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-emerald-300">Chi tộc (tự khai)</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={chi}
                  onChange={e => setChi(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ví dụ: 2"
                  className="mt-1.5 bg-slate-900 border-emerald-500/40 text-white rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-300">Ghi chú & Quan hệ gia đình</Label>
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Cung cấp thêm thông tin gia đình, nhánh chi hoặc câu hỏi..."
                className="mt-1.5 bg-slate-900 border-slate-800 text-white rounded-xl text-sm"
              />
            </div>

            {submitMutation.isError && (
              <p className="text-xs text-red-400 font-semibold bg-red-950/60 p-3 rounded-xl border border-red-800/60">
                Lỗi khi gửi đơn. Vui lòng kiểm tra kết nối và thử lại.
              </p>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3 rounded-xl shadow-lg border border-emerald-600/40 transition-all" disabled={submitMutation.isPending || !fullName.trim() || !gender}>
              {submitMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Đang gửi đơn ghi danh...</>
              ) : (
                <><UserPlus className="h-4 w-4 mr-2" />Gửi Đơn Ghi Danh Trực Tuyến</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 justify-center text-xs font-medium text-slate-400">
        <Link href="/welcome" className="hover:text-amber-300 transition-colors">
          Trang chủ
        </Link>
        <span>&middot;</span>
        <Link href="/council" className="hover:text-amber-300 transition-colors">
          Hội đồng gia tộc
        </Link>
        <span>&middot;</span>
        <Link href="/ancestral-hall" className="hover:text-amber-300 transition-colors">
          Nhà thờ Tộc
        </Link>
      </div>
    </div>
  );
}
