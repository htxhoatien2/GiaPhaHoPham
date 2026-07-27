/**
 * @project AncestorTree / Gia Phả Tộc Phạm Văn An Trạch
 * @file src/app/(landing)/youtube/youtube-content.tsx
 * @description Client component for YouTube channel page — videos, playlists, channel info
 * @version 1.0.0
 * @updated 2026-07-27
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Youtube, Play, ExternalLink, Share2, Sparkles, Video, 
  Award, Calendar, Landmark, ShieldCheck, Check, BookOpen, Film 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useClanSettings } from '@/hooks/use-clan-settings';
import { CLAN_NAME, CLAN_FULL_NAME, CLAN_YOUTUBE_URL } from '@/lib/clan-config';

interface VideoItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  youtubeId?: string; // e.g. YouTube video ID if available
}

export function YoutubeContent() {
  const { data: cs } = useClanSettings();
  const [copied, setCopied] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const clanFullName = cs?.clan_full_name ?? CLAN_FULL_NAME;
  const youtubeUrl = cs?.clan_youtube_url || CLAN_YOUTUBE_URL;

  // Video catalog curated for the clan
  const videoCategories = [
    {
      title: 'Lễ Tế & Giỗ Tổ Hàng Năm',
      icon: Landmark,
      color: 'text-amber-400',
      badge: 'Nghi Lễ Dòng Họ',
      description: 'Hình ảnh và video ghi lại các đại lễ cúng tế, đọc văn tế và không khí thiêng liêng tại Từ đường Tộc Phạm Văn An Trạch.',
    },
    {
      title: 'Vinh Danh & Quỹ Khuyến Học',
      icon: Award,
      color: 'text-emerald-400',
      badge: 'Truyền Thống Hiếu Học',
      description: 'Lễ phát thưởng cho con cháu đạt thành tích học tập xuất sắc, đỗ đạt đại học và ghi nhận công đức hiến gia tộc.',
    },
    {
      title: 'Tư Liệu & Ký Sự Dòng Họ',
      icon: Film,
      color: 'text-cyan-400',
      badge: 'Thước Phim Lịch Sử',
      description: 'Các đoạn phim tư liệu về lịch sử hình thành, sự phát triển qua các thế hệ và nét đẹp gia phong Tộc Phạm Văn.',
    },
    {
      title: 'Hướng Dẫn Tra Cứu Gia Phả',
      icon: Video,
      color: 'text-purple-400',
      badge: 'Chuyển Đổi Số',
      description: 'Các video clip hướng dẫn con cháu xa quê tra cứu cây gia phả điện tử, tìm quan hệ họ hàng và ghi danh thành viên.',
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(youtubeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 text-slate-100">
      
      {/* Top Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border border-red-500/30 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider">
              <Youtube className="h-4 w-4 text-red-500" />
              Kênh YouTube Chính Thức
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Kênh YouTube <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300">{CLAN_NAME}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Nơi lưu giữ những thước phim tư liệu quý giá về Lễ Giỗ Tổ, Lễ Tế Thu, Vinh danh Khuyến học và các sự kiện sinh hoạt văn hóa của {clanFullName}.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-2xl shadow-lg border border-red-400/40 flex items-center gap-2 text-sm transition-all"
                asChild
              >
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-5 w-5" />
                  Đăng Ký Theo Dõi Kênh
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </a>
              </Button>

              <Button 
                variant="outline" 
                size="lg"
                onClick={handleCopyLink}
                className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold px-5 py-2.5 rounded-2xl text-sm flex items-center gap-2 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    Đã sao chép link!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 text-amber-400" />
                    Chia sẻ Kênh
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* YouTube Play Icon Badge */}
          <div className="shrink-0 flex items-center justify-center">
            <a 
              href={youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-2xl border border-red-400/40 hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="absolute inset-0 rounded-3xl bg-red-500/20 animate-ping" />
              <Play className="h-16 w-16 text-white fill-white group-hover:scale-110 transition-transform" />
            </a>
          </div>

        </div>
      </div>

      {/* Featured Video Player Embed Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-amber-400 border-l-4 border-amber-500 pl-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          Video Nổi Bật Dòng Họ
        </h2>
        
        <Card className="bg-slate-950/90 border-slate-800 text-slate-100 shadow-2xl overflow-hidden">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-inner flex items-center justify-center">
              {activeVideoId ? (
                <iframe
                  title="YouTube Video Player"
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-center p-6 space-y-4 max-w-md">
                  <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 mx-auto flex items-center justify-center">
                    <Youtube className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="font-bold text-white text-lg">Xem Các Thước Phim Truyền Thống Trên YouTube</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Truy cập kênh YouTube chính thức của dòng họ để xem toàn bộ danh sách phát video Tế lễ, Giỗ tổ và Hội họp con cháu.
                  </p>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs px-5 py-2 inline-flex items-center gap-2"
                    asChild
                  >
                    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                      Mở Kênh YouTube <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Video Content Categories */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-amber-400 border-l-4 border-amber-500 pl-3 flex items-center gap-2">
          <Film className="h-5 w-5 text-emerald-400" />
          Chủ Đề Video Trên Kênh
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videoCategories.map((cat, i) => (
            <Card key={i} className="bg-slate-950/80 border-slate-800 text-slate-100 shadow-xl hover:border-amber-500/40 transition-all duration-300">
              <CardHeader className="pb-3 border-b border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
                      <cat.icon className={`h-5 w-5 ${cat.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-white">{cat.title}</CardTitle>
                      <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                        {cat.badge}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {cat.description}
                </p>
                <div className="pt-2">
                  <a 
                    href={youtubeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Youtube className="h-4 w-4 text-red-500" />
                    Xem danh sách video chủ đề này &rarr;
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits & Call to Action */}
      <section className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h3 className="text-xl font-bold text-white">Kết Nối Với Dòng Họ Qua Thước Phim Sống Động</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dù con cháu ở xa hay gần, kênh YouTube dòng họ sẽ luôn là nhịp cầu nối tinh thần, ghi dấu những ký ức thiêng liêng của Tộc Phạm Văn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-center space-y-2">
            <Calendar className="h-6 w-6 text-amber-400 mx-auto" />
            <h4 className="font-bold text-xs text-white">Cập Nhật Thường Xuyên</h4>
            <p className="text-[11px] text-slate-400">Video các đợt cúng tế giỗ tổ hàng năm đều được tải lên đầy đủ.</p>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-center space-y-2">
            <Award className="h-6 w-6 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-xs text-white">Ghi Nhận Thành Tích</h4>
            <p className="text-[11px] text-slate-400">Lưu giữ khoảnh khắc vinh danh con cháu đỗ đạt và khuyến học.</p>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 text-center space-y-2">
            <BookOpen className="h-6 w-6 text-cyan-400 mx-auto" />
            <h4 className="font-bold text-xs text-white">Lưu Giữ Cho Thế Hệ Sau</h4>
            <p className="text-[11px] text-slate-400">Di sản hình ảnh sống động truyền lại cho con cháu mai sau.</p>
          </div>
        </div>
      </section>

      {/* Navigation Footer Links */}
      <div className="flex flex-wrap gap-4 justify-center pt-6 border-t border-slate-800/80 text-xs">
        <Link href="/welcome" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Trang chủ
        </Link>
        <span className="text-slate-700">&middot;</span>
        <Link href="/council" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Hội đồng gia tộc
        </Link>
        <span className="text-slate-700">&middot;</span>
        <Link href="/ancestral-hall" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Nhà thờ Tộc
        </Link>
        <span className="text-slate-700">&middot;</span>
        <Link href="/register-member" className="text-slate-400 hover:text-amber-300 transition-colors font-medium">
          Ghi danh trực tuyến
        </Link>
      </div>

    </div>
  );
}
