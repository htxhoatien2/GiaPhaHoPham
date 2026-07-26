/**
 * @project AncestorTree
 * @file src/app/(landing)/ancestral-hall/ancestral-hall-content.tsx
 * @description Client component for ancestral hall — gallery, ceremony schedule, map
 * @version 1.1.0
 * @updated 2026-03-09
 */

'use client';

import { useState } from 'react';
import { useClanSettings } from '@/hooks/use-clan-settings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Landmark, ImageIcon, Calendar, MapPin, BookOpen } from 'lucide-react';
import Link from 'next/link';
import type { CeremonyScheduleItem } from '@/types';

export function AncestralHallContent() {
  const { data: cs, isLoading } = useClanSettings();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = (cs?.ancestral_hall_images ?? []) as string[];
  const coords = (cs?.ancestral_hall_coordinates as { lat: number; lng: number } | null) || { lat: 15.9613, lng: 108.1889 };

  const defaultCeremonies: CeremonyScheduleItem[] = [
    { title: 'Lễ Giỗ Tổ Niên Tự Tộc Phạm Văn', lunar_date: '15/1', solar_date: 'Rằm tháng Giêng', description: 'Lễ giỗ tổ niên tự hàng năm tại Từ Đường Tộc, quy tụ đông đảo con cháu các Phái Chi về dâng hương.' },
    { title: 'Lễ Tế Thu & Khuyến Học Dòng Họ', lunar_date: '15/8', solar_date: 'Rằm tháng Tám', description: 'Tế thu dòng họ và tổ chức lễ phát thưởng Quỹ khuyến học cho con cháu đạt thành tích xuất sắc.' }
  ];

  const ceremonies = (cs?.ceremony_schedule && Array.isArray(cs.ceremony_schedule) && cs.ceremony_schedule.length > 0)
    ? (cs.ceremony_schedule as CeremonyScheduleItem[])
    : defaultCeremonies;

  const ancestralHistory = cs?.ancestral_hall_history || 'Nhà thờ Tộc Phạm Văn An Trạch là nơi phụng sự thờ tự Tiên tổ, quy tụ con cháu hàng năm vào các dịp giỗ tổ và lễ Tết truyền thống. Nơi đây gìn giữ gia phong, ghi nhớ công ơn đức trạch cha ông.';

  const ancestralAddress = cs?.ancestral_hall_address || 'An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng';



  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12 text-slate-100">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Landmark className="h-4 w-4 text-emerald-400" />
          Di Sản & Từ Đường Dòng Họ
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex items-center justify-center gap-3">
          Nhà Thờ Tộc Phạm Văn
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          {cs?.clan_full_name ?? 'Gia Phả Điện Tử Tộc Phạm Văn An Trạch'}
        </p>
      </div>

      {/* Image gallery */}
      {images.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold uppercase tracking-wider text-amber-400 border-l-4 border-amber-500 pl-3 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-emerald-400" />
            Hình Ảnh Từ Đường
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(url)}
                className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/50 hover:opacity-95 transition-all shadow-lg group relative"
              >
                <img src={url} alt={`Nhà thờ họ ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Nhà thờ họ"
            className="max-w-full max-h-[85vh] rounded-2xl border border-amber-500/40 shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* Ancestral hall history */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-amber-400 border-l-4 border-amber-500 pl-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-400" />
          Lịch Sử Từ Đường
        </h2>
        <Card className="bg-slate-950/80 border-slate-800 text-slate-200 shadow-xl">
          <CardContent className="py-6 text-sm leading-relaxed text-slate-300">
            <p className="whitespace-pre-line">{ancestralHistory}</p>
          </CardContent>
        </Card>
      </section>

      {/* Annual ceremony schedule */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-amber-400 border-l-4 border-amber-500 pl-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-400" />
          Lịch Tế Lễ Hàng Năm
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ceremonies.map((c, i) => (
            <Card key={i} className="bg-slate-950/80 border-slate-800 text-slate-100 shadow-xl hover:border-amber-500/40 transition-all">
              <CardHeader className="pb-1 pt-4 px-5">
                <CardTitle className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {c.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <p className="text-xs text-slate-400 font-medium">
                  {c.lunar_date && <span className="text-amber-400 font-semibold">Âm lịch: {c.lunar_date} &middot; </span>}
                  Dương lịch: {c.solar_date}
                </p>
                {c.description && (
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{c.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-amber-400 border-l-4 border-amber-500 pl-3 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-400" />
          Địa Chỉ & Tọa Độ Từ Đường
        </h2>
        <Card className="bg-slate-950/80 border-slate-800 text-slate-200 shadow-xl">
          <CardContent className="py-5 space-y-4">
            <p className="text-sm font-medium text-amber-200">{ancestralAddress}</p>
            {coords && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 h-72 shadow-inner">
                <iframe
                  title="Bản đồ nhà thờ họ"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.01},${coords.lat - 0.01},${coords.lng + 0.01},${coords.lat + 0.01}&layer=mapnik&marker=${coords.lat},${coords.lng}`}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 justify-center pt-6 border-t border-slate-800/80 text-xs">
        <Link href="/welcome" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Trang chủ
        </Link>
        <span className="text-slate-700">&middot;</span>
        <Link href="/council" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Hội đồng gia tộc
        </Link>
        <span className="text-slate-700">&middot;</span>
        <Link href="/register-member" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Ghi danh trực tuyến
        </Link>
      </div>
    </div>
  );
}
