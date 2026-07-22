/**
 * @project AncestorTree
 * @file src/components/people/person-form.tsx
 * @description Person edit/create form component
 * @version 1.1.0
 * @updated 2026-02-25
 */

'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personSchema, type PersonFormData, defaultPersonValues } from '@/lib/validations/person';
import { solarToLunar } from '@/lib/lunar-calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Save, User, Calendar, Phone, FileText, Heart, Shield, Sparkles } from 'lucide-react';
import type { Person } from '@/types';

interface PersonFormProps {
  person?: Person;
  defaultValues?: Partial<PersonFormData>;
  lockedGeneration?: number; // when set, generation field is auto-filled and read-only
  onSubmit: (data: PersonFormData) => Promise<void>;
  isLoading?: boolean;
}

export function PersonForm({ person, defaultValues: extraDefaults, lockedGeneration, onSubmit, isLoading }: PersonFormProps) {
  const form = useForm<PersonFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(personSchema) as any,
    defaultValues: person ? {
      handle: person.handle,
      display_name: person.display_name,
      first_name: person.first_name || '',
      middle_name: person.middle_name || '',
      surname: person.surname || '',
      pen_name: person.pen_name || '',
      taboo_name: person.taboo_name || '',
      gender: person.gender,
      generation: person.generation,
      chi: person.chi || undefined,
      birth_date: person.birth_date || '',
      birth_year: person.birth_year || undefined,
      birth_place: person.birth_place || '',
      death_date: person.death_date || '',
      death_year: person.death_year || undefined,
      death_place: person.death_place || '',
      death_lunar: person.death_lunar || '',
      is_living: person.is_living,
      is_patrilineal: person.is_patrilineal,
      phone: person.phone || '',
      email: person.email || '',
      zalo: person.zalo || '',
      facebook: person.facebook || '',
      address: person.address || '',
      hometown: person.hometown || '',
      occupation: person.occupation || '',
      biography: person.biography || '',
      notes: person.notes || '',
      avatar_url: person.avatar_url || '',
      privacy_level: person.privacy_level,
    } : { ...defaultPersonValues, ...extraDefaults },
  });

  const isLiving = form.watch('is_living');
  const deathDate = form.watch('death_date');

  // Auto-convert solar death date to lunar date
  useEffect(() => {
    console.log("DEBUG: deathDate changed to:", deathDate);
    if (!deathDate) return;
    const parts = deathDate.split('-');
    console.log("DEBUG: split parts of deathDate:", parts);
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      console.log("DEBUG: Parsed values:", { day, month, year });
      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        try {
          const lunar = solarToLunar(day, month, year);
          console.log("DEBUG: Calculated Lunar date:", lunar);
          
          // Set formatted value e.g. "15/7"
          form.setValue('death_lunar', `${lunar.day}/${lunar.month}`, { shouldValidate: true, shouldDirty: true });
          
          // Sync death_year with the solar death year
          form.setValue('death_year', year, { shouldValidate: true, shouldDirty: true });
          
          console.log("DEBUG: Successfully called form.setValue for death_lunar and death_year");
        } catch (error) {
          console.error('Lỗi chuyển đổi lịch âm:', error);
        }
      }
    }
  }, [deathDate, form]);

  const computedLunarText = useMemo(() => {
    console.log("DEBUG: computedLunarText recalculating for:", deathDate);
    if (!deathDate) return '';
    const parts = deathDate.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        try {
          const lunar = solarToLunar(day, month, year);
          return `Âm lịch: Ngày ${lunar.day} tháng ${lunar.month} năm ${lunar.year}${lunar.leap ? ' (Nhuận)' : ''}`;
        } catch {
          return '';
        }
      }
    }
    return '';
  }, [deathDate]);

  // Sync lockedGeneration into form whenever parent selection changes
  useEffect(() => {
    if (lockedGeneration !== undefined) {
      form.setValue('generation', lockedGeneration, { shouldValidate: true });
    }
  }, [lockedGeneration, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto pb-12">
        {/* Basic Info */}
        <Card className="rounded-2xl border-slate-200/80 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100/80 px-6 py-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-700" />
              Thông Tin Cơ Bản
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Tên hiển thị *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: Đặng Đình A" {...field} className="rounded-xl border-slate-200 focus-visible:ring-emerald-500 text-sm shadow-2xs" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="handle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Handle *</FormLabel>
                    <FormControl>
                      <Input placeholder="dang-dinh-a" {...field} className="rounded-xl border-slate-200 focus-visible:ring-emerald-500 text-sm shadow-2xs" />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400">Đường dẫn thân thiện (chỉ dùng chữ thường, số, gạch ngang)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Họ</FormLabel>
                    <FormControl>
                      <Input placeholder="Đặng" {...field} className="rounded-xl bg-white border-slate-200 focus-visible:ring-emerald-500 text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Tên đệm</FormLabel>
                    <FormControl>
                      <Input placeholder="Đình" {...field} className="rounded-xl bg-white border-slate-200 focus-visible:ring-emerald-500 text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="A" {...field} className="rounded-xl bg-white border-slate-200 focus-visible:ring-emerald-500 text-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="pen_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Tên tự</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: Minh Đức" {...field} className="rounded-xl border-slate-200 focus-visible:ring-emerald-500 text-sm" />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400">Tên chữ dùng khi trưởng thành / giao tiếp rộng</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taboo_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Tên húy</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên cúng cơm / Tên thật" {...field} className="rounded-xl border-slate-200 focus-visible:ring-emerald-500 text-sm" />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400">Tên thật trong gia tộc (tránh gọi trực tiếp)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Giới tính *</FormLabel>
                    <Select onValueChange={(v) => field.onChange(parseInt(v) as 1 | 2)} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-slate-200 focus:ring-emerald-500 text-sm">
                          <SelectValue placeholder="Chọn" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1">Nam</SelectItem>
                        <SelectItem value="2">Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="generation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Đời thứ *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        {...field}
                        disabled={lockedGeneration !== undefined}
                        className={`rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500 ${lockedGeneration !== undefined ? 'bg-slate-100 text-slate-500 font-bold border-slate-200' : ''}`}
                      />
                    </FormControl>
                    {lockedGeneration !== undefined && (
                      <FormDescription className="text-[10px] font-semibold text-amber-800">
                        Thừa kế từ cha/mẹ
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Chi tộc</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        max={10} 
                        {...field} 
                        value={field.value ?? ''} 
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privacy_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Quyền riêng tư</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-slate-200 focus:ring-emerald-500 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="0">Công khai</SelectItem>
                        <SelectItem value="1">Thành viên</SelectItem>
                        <SelectItem value="2">Riêng tư</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-8 pt-3 border-t border-slate-100">
              <FormField
                control={form.control}
                name="is_living"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/80 transition-colors">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="rounded" />
                    </FormControl>
                    <FormLabel className="font-semibold text-slate-700 text-sm cursor-pointer">Còn sống</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_patrilineal"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100/80 transition-colors">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="rounded" />
                    </FormControl>
                    <FormLabel className="font-semibold text-slate-700 text-sm cursor-pointer">Chính tộc (dòng cha)</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Birth & Death */}
        <Card className="rounded-2xl border-slate-200/80 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100/80 px-6 py-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-700" />
              Thông Tin Sinh / Mất
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="birth_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Năm sinh</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ví dụ: 1990" 
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Ngày sinh</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birth_place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Nơi sinh</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: Đà Nẵng" {...field} className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!isLiving && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-300/30 space-y-4 md:space-y-0">
                <FormField
                  control={form.control}
                  name="death_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Ngày mất (Dương lịch)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-emerald-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="death_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Năm mất</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ví dụ: 2026" 
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          className="rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-emerald-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="death_lunar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Ngày giỗ (Âm)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: 15/7" {...field} className="rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-emerald-500" />
                      </FormControl>
                      {computedLunarText ? (
                        <FormDescription className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200/50 inline-block mt-1">
                          {computedLunarText}
                        </FormDescription>
                      ) : (
                        <FormDescription className="text-xs text-slate-400">Tự động tính từ ngày mất</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="death_place"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Nơi mất</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: Hà Nội" {...field} className="rounded-xl bg-white border-slate-200 text-sm focus-visible:ring-emerald-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="hometown"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">Quê quán</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng" {...field} className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="rounded-2xl border-slate-200/80 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100/80 px-6 py-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Phone className="h-5 w-5 text-emerald-700" />
              Thông Tin Liên Hệ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: 0912345678" {...field} className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@mail.com" {...field} className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zalo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Zalo</FormLabel>
                    <FormControl>
                      <Input placeholder="Số điện thoại Zalo" {...field} className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-slate-700">Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="Đường dẫn trang cá nhân" {...field} className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">Địa chỉ thường trú hiện tại</FormLabel>
                  <FormControl>
                    <Input placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố" {...field} className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Bio & Autobiography */}
        <Card className="rounded-2xl border-slate-200/80 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100/80 px-6 py-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-700" />
              Tiểu Sử & Ghi Chú
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">Nghề nghiệp / Học vị</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: Kỹ sư, Nhà báo, Giáo viên..." {...field} className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">Tiểu sử tóm tắt</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Ghi nhận tóm tắt về cuộc đời, thành tích công hiến..." {...field} className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">Ghi chú thêm</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Thông tin bổ sung khác..." {...field} className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-slate-700">Đường dẫn Ảnh đại diện (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} className="rounded-xl border-slate-200 text-sm focus-visible:ring-emerald-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Action buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="rounded-xl px-8 py-5 text-sm font-bold bg-gradient-to-r from-emerald-800 to-amber-800 hover:from-emerald-900 hover:to-amber-900 text-white shadow-md shadow-emerald-950/20 hover:scale-102 transition-all duration-200">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-amber-300" />
                Đang Lưu Thông Tin...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2 text-amber-300" />
                Lưu Thành Viên
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
