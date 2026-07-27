/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/app/(main)/ancestral-hall/ancestral-hall-content.tsx
 * @description State-of-the-art client component for ancestral hall — gallery, ceremony schedule, map, architecture
 * @version 2.0.0
 * @updated 2026-07-27
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Landmark, ImageIcon, Calendar, MapPin, BookOpen, 
  Sparkles, ExternalLink, Copy, Check, Navigation, 
  ShieldCheck, GitBranch, Youtube, Shield, Compass 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useClanSettings } from '@/hooks/use-clan-settings';
import { CLAN_NAME, CLAN_FULL_NAME } from '@/lib/clan-config';
import type { CeremonyScheduleItem } from '@/types';
import { getSolarFromLunarString } from '@/lib/lunar-calendar';

export function AncestralHallContent() {
  const { data: cs } = useClanSettings();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const defaultGalleryImages = [
    '/screenshots/tree-view.png',
    '/screenshots/people-list.png',
  ];

  const customImages = (cs?.ancestral_hall_images ?? []) as string[];
  const images = customImages.length > 0 ? customImages : defaultGalleryImages;
  const coords = (cs?.ancestral_hall_coordinates as { lat: number; lng: number } | null) || { lat: 15.9613, lng: 108.1889 };

  const defaultCeremonies: CeremonyScheduleItem[] = [
    { 
      title: 'Lễ Giỗ Tổ Niên Tự Tộc Phạm Văn', 
      lunar_date: '15/1', 
      solar_date: 'Rằm tháng Giêng', 
      description: 'Đại lễ giỗ tổ niên tự hàng năm tại Từ Đường Tộc, quy tụ đông đảo con cháu các Phái Chi khắp nơi về dâng hương bái tổ.' 
    },
    { 
      title: 'Lễ Tế Thu & Khuyến Học Dòng Họ', 
      lunar_date: '15/8', 
      solar_date: 'Rằm tháng Tám', 
      description: 'Lễ tế thu dòng họ kết hợp phát thưởng Quỹ khuyến học cho con cháu đạt thành tích học tập xuất sắc và đỗ đạt.' 
    },
    { 
      title: 'Lễ Tạ Niên & Dâng Hương Đón Xuân', 
      lunar_date: '25/12', 
      solar_date: 'Cuối tháng Chạp', 
      description: 'Lễ tạ niên cuối năm, tổng kết công tác quản trị gia phả và dâng hương cầu bình an cho gia tộc trước thềm năm mới.' 
    }
  ];

  const ceremonies = (cs?.ceremony_schedule && Array.isArray(cs.ceremony_schedule) && cs.ceremony_schedule.length > 0)
    ? (cs.ceremony_schedule as CeremonyScheduleItem[])
    : defaultCeremonies;

  const ancestralHistory = cs?.ancestral_hall_history || 'Nhà thờ Tộc Phạm Văn An Trạch là nơi phụng sự thờ tự Tiên tổ, quy tụ con cháu hàng năm vào các dịp giỗ tổ và lễ Tết truyền thống. Nơi đây gìn giữ gia phong, ghi nhớ công ơn đức trạch cha ông và là biểu tượng tinh thần kết nối các thế hệ dòng họ.';

  const ancestralAddress = cs?.ancestral_hall_address || 'An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng';

  const architectureFeatures = [
    {
      title: 'Chính Điện Thờ Tự Tiên Tổ',
      icon: Landmark,
      color: 'text-amber-400',
      desc: 'Nơi đặt ngai vị, bài vị thờ tự Thủy tổ và chư vị Tiên tổ dòng họ Phạm Văn An Trạch trang nghiêm, ấm cúng.',
    },
    {
      title: 'Bia Ký & Phả Thư Lưu Truyền',
      icon: BookOpen,
      color: 'text-emerald-400',
      desc: 'Lưu giữ các bản gia phả cổ, văn tế truyền thống và bia đá ghi danh công đức của các thế hệ cha ông.',
    },
    {
      title: 'Khuôn Viên & Sân Chầu',
      icon: Compass,
      color: 'text-cyan-400',
      desc: 'Không gian sân chầu rộng rãi, thoáng mát, nơi tổ chức các đại lễ tế tổ và gặp mặt con cháu hàng năm.',
    },
    {
      title: 'Gia Phong & Tập Quán Nghi Lễ',
      icon: Shield,
      color: 'text-purple-400',
      desc: 'Nề nếp tế lễ chuẩn mực, gìn giữ truyền thống hiếu kính tổ tiên và giáo dục thế hệ trẻ về cội nguồn.',
    },
  ];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(ancestralAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 text-slate-100">
      
      {/* ─── 1. Hero Header ─── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-950 to-amber-950 border border-emerald-500/30 p-8 sm:p-12 shadow-2xl text-center space-y-6">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Landmark className="h-4 w-4 text-emerald-400" />
            Di Sản & Từ Đường Dòng Họ
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
            Nhà Thờ Tộc Phạm Văn
          </h1>

          <p className="text-base sm:text-lg text-emerald-200/90 font-medium max-w-2xl mx-auto">
            {cs?.clan_full_name ?? CLAN_FULL_NAME}
          </p>

          {/* Traditional Couplet Banner */}
          <div className="max-w-2xl mx-auto my-4 px-6 py-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/40 shadow-lg backdrop-blur-md">
            <p className="text-amber-200 font-serif italic text-sm sm:text-base md:text-lg tracking-wide">
              “Mộc xuất thiên tầm do hữu bản — Thủy lưu vạn dặm khởi ư nguyên”
            </p>
            <p className="text-[11px] text-amber-400/80 font-semibold mt-1">
              (Nơi phụng sự thờ tự Tiên tổ &middot; Quy tụ con cháu dòng họ)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-md text-xs sm:text-sm transition-all" asChild>
              <Link href="/council">
                <ShieldCheck className="mr-2 h-4 w-4 text-amber-300" /> Hội Đồng Gia Tộc
              </Link>
            </Button>
            <Button variant="outline" className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all" asChild>
              <Link href="/tree">
                <GitBranch className="mr-2 h-4 w-4 text-emerald-400" /> Cây Gia Phả
              </Link>
            </Button>
            <Button variant="outline" className="border-red-500/40 text-red-300 hover:bg-red-500/10 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all" asChild>
              <Link href="/youtube">
                <Youtube className="mr-2 h-4 w-4" /> Kênh YouTube
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── 2. Photo Gallery ─── */}
      <section className="space-y-6">
        <div className="border-l-4 border-emerald-500 pl-4 py-1">
          <h2 className="text-xl font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-emerald-400" />
            Hình Ảnh Không Gian Từ Đường
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Hình ảnh điện thờ chính, khuôn viên và các hoạt động sinh hoạt tại Nhà thờ Tộc</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(url)}
              className="aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/60 transition-all shadow-xl group relative cursor-pointer"
            >
              <img 
                src={url} 
                alt={`Nhà thờ họ ${i + 1}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Từ Đường Tộc #{i + 1}
                </span>
                <Badge variant="outline" className="text-[10px] bg-black/40 text-slate-200 border-white/20">
                  Xem phóng to
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] space-y-2" onClick={e => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Nhà thờ họ phóng to"
              className="max-w-full max-h-[75vh] rounded-2xl border border-amber-500/40 shadow-2xl object-contain mx-auto"
            />
            <div className="text-center">
              <Button size="sm" variant="outline" onClick={() => setSelectedImage(null)} className="border-slate-700 text-slate-300 text-xs rounded-xl">
                Đóng ảnh
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. History & Heritage Significance ─── */}
      <section className="space-y-6">
        <div className="border-l-4 border-emerald-500 pl-4 py-1">
          <h2 className="text-xl font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            Lịch Sử & Ý Nghĩa Từ Đường
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Giá trị tâm linh và tinh thần gìn giữ cội nguồn qua các thế hệ</p>
        </div>

        <Card className="bg-slate-950/90 border-slate-800 text-slate-200 shadow-2xl">
          <CardContent className="py-6 text-sm leading-relaxed text-slate-300 space-y-4">
            <p className="whitespace-pre-line">{ancestralHistory}</p>
          </CardContent>
        </Card>
      </section>

      {/* ─── 4. Architecture Features ─── */}
      <section className="space-y-6">
        <div className="border-l-4 border-emerald-500 pl-4 py-1">
          <h2 className="text-xl font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Landmark className="h-5 w-5 text-amber-400" />
            Đặc Điểm Kiến Trúc & Thờ Tự
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Không gian văn hóa thờ tự truyền thống Tộc Phạm Văn An Trạch</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {architectureFeatures.map((f, i) => (
            <Card key={i} className="bg-slate-950/90 border-slate-800 shadow-xl hover:border-emerald-500/50 transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-2 shadow-inner">
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <CardTitle className="text-base font-bold text-white">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── 5. Ceremony Schedule ─── */}
      <section className="space-y-6">
        <div className="border-l-4 border-emerald-500 pl-4 py-1">
          <h2 className="text-xl font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-400" />
            Lịch Tế Lễ Hàng Năm Tại Từ Đường
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Các đợt tế lễ quan trọng quy tụ con cháu trong và ngoài nước về dâng hương</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ceremonies.map((c, i) => {
            const currentYear = new Date().getFullYear();
            const calcSolar = getSolarFromLunarString(c.lunar_date, currentYear);
            const solarDisplay = calcSolar ? `${calcSolar.formatted} DL` : (c.solar_date || 'Đang cập nhật');

            return (
              <Card key={i} className="bg-slate-950/90 border-slate-800 text-slate-100 shadow-xl hover:border-amber-500/50 transition-all flex flex-col justify-between">
                <CardHeader className="pb-2 pt-5 px-5 border-b border-slate-800/80">
                  <Badge variant="outline" className="w-fit text-[10px] bg-amber-500/10 text-amber-300 border-amber-500/30 font-bold mb-1">
                    Lễ Nghi Hàng Năm #{i + 1}
                  </Badge>
                  <CardTitle className="text-base font-bold text-amber-300 leading-tight">
                    {c.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 py-4 space-y-3">
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    {c.lunar_date && (
                      <p className="text-amber-400 font-semibold">
                        Âm lịch: <span className="text-white font-bold">{c.lunar_date} ÂL</span>
                      </p>
                    )}
                    <p className="text-emerald-300 font-semibold">
                      Dương lịch ({currentYear}): <span className="text-white font-bold">{solarDisplay}</span>
                    </p>
                  </div>
                  {c.description && (
                    <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ─── 6. Location & Interactive Map ─── */}
      <section className="space-y-6">
        <div className="border-l-4 border-emerald-500 pl-4 py-1">
          <h2 className="text-xl font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-400" />
            Địa Chỉ & Bản Đồ Vị Trí Từ Đường
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Vị trí địa lý Từ đường Tộc Phạm Văn tại thôn An Trạch</p>
        </div>

        <Card className="bg-slate-950/90 border-slate-800 text-slate-200 shadow-2xl">
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 font-medium">Địa chỉ Nhà thờ Tộc</span>
                  <p className="text-sm sm:text-base font-bold text-amber-200">{ancestralAddress}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCopyAddress} 
                  className="border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl"
                >
                  {copiedAddress ? <Check className="h-3.5 w-3.5 text-emerald-400 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  {copiedAddress ? 'Đã chép' : 'Sao chép'}
                </Button>
                <Button 
                  size="sm" 
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl" 
                  asChild
                >
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation className="h-3.5 w-3.5 mr-1" /> Chỉ đường
                  </a>
                </Button>
              </div>
            </div>

            {coords && (
              <div className="rounded-2xl overflow-hidden border border-slate-800 h-80 shadow-inner relative">
                <iframe
                  title="Bản đồ vị trí nhà thờ họ"
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

      {/* ─── 7. Navigation Footer Links ─── */}
      <div className="flex flex-wrap gap-4 justify-center pt-6 border-t border-slate-800/80 text-xs">
        <Link href="/welcome" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Trang chủ
        </Link>
        <span className="text-slate-700">&middot;</span>
        <Link href="/council" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Hội đồng gia tộc
        </Link>
        <span className="text-slate-700">&middot;</span>
        <Link href="/tree" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Cây gia phả
        </Link>
        <span className="text-slate-700">&middot;</span>
        <Link href="/youtube" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Kênh YouTube Tộc
        </Link>
      </div>

    </div>
  );
}
