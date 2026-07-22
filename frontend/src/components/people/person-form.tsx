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
import { Loader2, Save } from 'lucide-react';
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
    if (!deathDate) return;
    const parts = deathDate.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        try {
          const lunar = solarToLunar(day, month, year);
          // Set formatted value e.g. "15/7"
          form.setValue('death_lunar', `${lunar.day}/${lunar.month}`, { shouldValidate: true });
          
          // Sync death_year with the solar death year
          form.setValue('death_year', year, { shouldValidate: true });
        } catch (error) {
          console.error('Lỗi chuyển đổi lịch âm:', error);
        }
      }
    }
  }, [deathDate, form]);

  const computedLunarText = useMemo(() => {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên hiển thị *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
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
                    <FormLabel>Handle *</FormLabel>
                    <FormControl>
                      <Input placeholder="nguyen-van-a" {...field} />
                    </FormControl>
                    <FormDescription>URL-friendly, không dấu</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ</FormLabel>
                    <FormControl>
                      <Input placeholder="Đặng" {...field} />
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
                    <FormLabel>Tên đệm</FormLabel>
                    <FormControl>
                      <Input placeholder="Đình" {...field} />
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
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Tài" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pen_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên tự</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên tự (courtesy name)" {...field} />
                    </FormControl>
                    <FormDescription>Tên chữ dùng trong giao tiếp</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taboo_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên húy</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên húy (taboo name)" {...field} />
                    </FormControl>
                    <FormDescription>Tên thật, kiêng gọi trực tiếp</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính *</FormLabel>
                    <Select onValueChange={(v) => field.onChange(parseInt(v) as 1 | 2)} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormLabel>Đời *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        {...field}
                        disabled={lockedGeneration !== undefined}
                        className={lockedGeneration !== undefined ? 'bg-muted text-muted-foreground' : ''}
                      />
                    </FormControl>
                    {lockedGeneration !== undefined && (
                      <FormDescription className="text-xs text-amber-600">
                        Tự động từ đời cha/mẹ — không thể sửa
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
                    <FormLabel>Chi</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        max={10} 
                        {...field} 
                        value={field.value ?? ''} 
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
                    <FormLabel>Quyền riêng tư</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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

            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="is_living"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Còn sống</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_patrilineal"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">Chính tộc (dòng cha)</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Birth & Death */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sinh / Mất</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="birth_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Năm sinh</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1990" 
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>Nơi sinh</FormLabel>
                    <FormControl>
                      <Input placeholder="Đà Nẵng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!isLiving && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="death_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Năm mất</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2020" 
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="death_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày mất</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                      <FormLabel>Ngày giỗ (Âm)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: 15/7" {...field} />
                      </FormControl>
                      {computedLunarText ? (
                        <FormDescription className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50 inline-block mt-1">
                          {computedLunarText}
                        </FormDescription>
                      ) : (
                        <FormDescription>Tự động tính từ ngày mất</FormDescription>
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
                      <FormLabel>Nơi mất</FormLabel>
                      <FormControl>
                        <Input placeholder="Hà Nội" {...field} />
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
                  <FormLabel>Quê quán</FormLabel>
                  <FormControl>
                    <Input placeholder="An Trạch, Hòa Tiến, Đà Nẵng" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0912345678" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
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
                    <FormLabel>Zalo</FormLabel>
                    <FormControl>
                      <Input placeholder="0912345678" {...field} />
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
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/username" {...field} />
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
                  <FormLabel>Địa chỉ hiện tại</FormLabel>
                  <FormControl>
                    <Input placeholder="Số 01 Đường Đinh Thị Thôi, xã Hòa Tiến, TP. Đà Nẵng" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tiểu sử & Ghi chú</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nghề nghiệp</FormLabel>
                  <FormControl>
                    <Input placeholder="Giáo viên" {...field} />
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
                  <FormLabel>Tiểu sử</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Giới thiệu về người này..." {...field} />
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
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Ghi chú thêm..." {...field} />
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
                  <FormLabel>URL Ảnh đại diện</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
