/**
 * @project AncestorTree
 * @file src/app/(main)/guide/page.tsx
 * @description Interactive Ebook User Manual Page — Complete guide for AncestorTree v2.5.0
 * @version 2.5.0
 * @updated 2026-07-23
 */

'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  Search,
  Download,
  Printer,
  ChevronRight,
  Shield,
  Sparkles,
  Users,
  GitBranch,
  Calendar,
  RotateCcw,
  ClipboardList,
  Award,
  CircleDollarSign,
  ScrollText,
  FileSpreadsheet,
  MessageSquare,
  Route,
  BarChart3,
  Bell,
  Settings,
  UserCog,
  Database,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Info,
  Laptop,
  Check,
  Share2,
} from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';

interface Chapter {
  id: string;
  part: number;
  partTitle: string;
  title: string;
  badge?: string;
  icon: typeof BookOpen;
  summary: string;
  content: React.ReactNode;
}

export default function GuideEbookPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPart, setSelectedPart] = useState<number | 'all'>('all');
  const [copied, setCopied] = useState(false);

  const parts = [
    { id: 1, name: 'Phần I: Tổng quan & Phân quyền' },
    { id: 2, name: 'Phần II: Cổng thông tin công khai' },
    { id: 3, name: 'Phần III: Phân hệ Thành viên (Main App)' },
    { id: 4, name: 'Phần IV: Quản trị viên (Admin Panel)' },
    { id: 5, name: 'Phần V: Ứng dụng Desktop Offline' },
    { id: 6, name: 'Phần VI: FAQ & Xử lý sự cố' },
  ];

  const chapters: Chapter[] = [
    {
      id: 'chap-1-1',
      part: 1,
      partTitle: 'PHẦN I: GIỚI THIỆU TỔNG QUAN & PHÂN QUYỀN HỆ THỐNG',
      title: '1.1 Giới thiệu Hệ thống AncestorTree v2.5.0',
      icon: Sparkles,
      summary: 'Tầm nhìn chuyển đổi số phả hệ Chi tộc Phạm Văn, An Trạch, Hòa Tiến, Đà Nẵng.',
      content: (
        <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
          <p>
            <strong>AncestorTree (Gia Phả Điện Tử)</strong> là giải pháp chuyển đổi số toàn diện cho công tác lưu trữ phả hệ, gắn kết tình thân và quản trị dòng họ <strong>Chi tộc Phạm Văn (An Trạch, Hòa Tiến, Đà Nẵng)</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
              <h4 className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" /> 1. Nền tảng Web Cloud
              </h4>
              <p className="text-xs text-muted-foreground">
                Xây dựng trên công nghệ Next.js 16 và Supabase. Giúp bà con dòng họ ở khắp nơi trên thế giới dễ dàng truy cập bằng điện thoại, máy tính bảng hay máy tính.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-2">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <Laptop className="h-4 w-4 text-emerald-600" /> 2. Ứng dụng Desktop Offline
              </h4>
              <p className="text-xs text-muted-foreground">
                Đóng gói Electron 34 và SQLite local. Hoạt động độc lập 100% không cần Internet, bảo mật an toàn tuyệt đối khi Ban quản trị làm việc tại Nhà thờ tộc.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'chap-1-2',
      part: 1,
      partTitle: 'PHẦN I: GIỚI THIỆU TỔNG QUAN & PHÂN QUYỀN HỆ THỐNG',
      title: '1.2 Cấu trúc 4 cấp phân quyền (Roles & Permissions)',
      icon: Shield,
      summary: 'Bảng phân quyền bảo mật Row Level Security (RLS): Guest, Viewer, Editor, Admin.',
      content: (
        <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
          <p>Hệ thống thiết lập 4 cấp độ truy cập nhằm bảo vệ dữ liệu cá nhân của dòng họ:</p>
          <div className="overflow-x-auto rounded-xl border border-border/80 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 font-bold border-b border-border/80">
                <tr>
                  <th className="p-3">Cấp Quyền</th>
                  <th className="p-3">Mã Quyền</th>
                  <th className="p-3">Đối Tượng</th>
                  <th className="p-3">Quyền Hạn Chính</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-3 font-semibold text-slate-600">Khách</td>
                  <td className="p-3"><Badge variant="outline">Guest</Badge></td>
                  <td className="p-3">Công khai / Chưa đăng nhập</td>
                  <td className="p-3">Xem Trang chào mừng, Lịch sử nhà thờ họ, gửi Đơn đăng ký gia nhập dòng họ (`/register-member`).</td>
                </tr>
                <tr className="bg-emerald-50/40 dark:bg-emerald-950/10">
                  <td className="p-3 font-semibold text-emerald-600">Thành viên</td>
                  <td className="p-3"><Badge className="bg-emerald-600 text-white">Viewer</Badge></td>
                  <td className="p-3">Con cháu đã được duyệt tài khoản</td>
                  <td className="p-3">Xem Cây phả hệ 2D/3D, **Danh bạ liên lạc gia tộc** (SĐT, Zalo), Bảng tin / Feed, gửi **Đề xuất chỉnh sửa**.</td>
                </tr>
                <tr className="bg-blue-50/40 dark:bg-blue-950/10">
                  <td className="p-3 font-semibold text-blue-600">Biên tập viên</td>
                  <td className="p-3"><Badge className="bg-blue-600 text-white">Editor</Badge></td>
                  <td className="p-3">Ban biên soạn phả hệ</td>
                  <td className="p-3">Thêm mới, sửa thông tin thành viên phả hệ, quản lý sự kiện, vinh danh, quỹ khuyến học, gia phả sách.</td>
                </tr>
                <tr className="bg-rose-50/40 dark:bg-rose-950/10">
                  <td className="p-3 font-semibold text-rose-600">Quản trị viên</td>
                  <td className="p-3"><Badge className="bg-rose-600 text-white">Admin</Badge></td>
                  <td className="p-3">Trưởng tộc & Ban quản trị</td>
                  <td className="p-3">Phân quyền người dùng, gộp trùng lặp (`Merge Wizard`), tự động phân công **Cầu đường DFS**, Sao lưu CSDL & Nhập/Xuất GEDCOM 7.0.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: 'chap-1-3',
      part: 1,
      partTitle: 'PHẦN I: GIỚI THIỆU TỔNG QUAN & PHÂN QUYỀN HỆ THỐNG',
      title: '1.3 Đăng ký, Đăng nhập & Bảo mật 2 lớp (MFA)',
      icon: CheckCircle2,
      summary: 'Quy trình tạo tài khoản, chờ xác minh danh tính và cài đặt TOTP QR Code.',
      content: (
        <div className="space-y-3 text-sm text-foreground/90">
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Tất cả tài khoản đăng ký mới sẽ trải qua bước <strong>Chờ xác minh (pending_verification)</strong> để Ban quản trị đối chiếu thân nhân dòng họ trước khi mở quyền Viewer.</span>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-xs">
            <li><strong>Đăng ký tài khoản:</strong> Vào `/register` → Điền Họ tên, Email, Mật khẩu, SĐT và Mã thành viên (nếu có).</li>
            <li><strong>Chờ duyệt:</strong> BQT đối chiếu thông tin trong phả hệ và bấm Phê duyệt tài khoản.</li>
            <li><strong>Kích hoạt MFA (Bảo mật 2 lớp):</strong> Vào `/settings/security` → Quét mã QR bằng <em>Google Authenticator</em> → Nhập mã 6 số để xác nhận.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'chap-2-1',
      part: 2,
      partTitle: 'PHẦN II: CỔNG THÔNG TIN CÔNG KHAI (LANDING PAGES)',
      title: '2.1 Trang Chào Mừng Dòng Họ (/welcome)',
      icon: Sparkles,
      summary: 'Trang chủ công khai giới thiệu truyền thống, thế thứ và thành tích dòng họ.',
      content: (
        <div className="space-y-2 text-xs text-foreground/90">
          <p>Cung cấp cái nhìn đầu tiên cho độc giả và con cháu xa quê:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Bài thơ thế thứ truyền thống Chi tộc Phạm Văn.</li>
            <li>Thống kê nhanh số đời, tổng thành viên, công trình nhà thờ.</li>
            <li>Bảng vàng khuyến học và danh sách vinh danh mới nhất.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'chap-2-2',
      part: 2,
      partTitle: 'PHẦN II: CỔNG THÔNG TIN CÔNG KHAI (LANDING PAGES)',
      title: '2.2 Nhà Thờ Họ Virtual Tour (/ancestral-hall)',
      icon: Users,
      summary: 'Không gian tâm linh ảo, lịch sử nhà thờ, lịch lễ tế và tọa độ GPS dẫn đường.',
      content: (
        <div className="space-y-2 text-xs text-foreground/90">
          <p>Giúp bà con ở xa luôn hướng về nguồn cội:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Bộ sưu tập hình ảnh:</strong> Xem toàn cảnh nhà thờ tộc, điện thờ, cổng tam quan.</li>
            <li><strong>Lịch sử tôn tạo:</strong> Bài viết ghi chép qua các thời kỳ xây dựng.</li>
            <li><strong>Chỉ đường GPS:</strong> Tích hợp Google Maps chỉ đường trực tiếp tới Nhà thờ tộc tại An Trạch, Hòa Tiến, Đà Nẵng.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'chap-2-3',
      part: 2,
      partTitle: 'PHẦN II: CỔNG THÔNG TIN CÔNG KHAI (LANDING PAGES)',
      title: '2.3 Hội Đồng Gia Tộc & Đăng Ký Nhập Phả (/council & /register-member)',
      icon: UserCog,
      summary: 'Cơ cấu tổ chức Hội đồng gia tộc và Đơn ghi danh gia nhập dòng họ cho con cháu ở xa.',
      content: (
        <div className="space-y-3 text-xs text-foreground/90">
          <p><strong>Cơ cấu Hội đồng gia tộc (`/council`):</strong> Giới thiệu Trưởng tộc, Ban Chấp hành và 5 Tiểu ban (Nội vụ, Khuyến học, Cầu đường, Tế lễ, Tài chính).</p>
          <p><strong>Đăng ký thành viên trực tuyến (`/register-member`):</strong> Con cháu xa quê điền thông tin cá nhân, tên cha/mẹ thuộc dòng họ và gửi đơn để Admin đối chiếu đưa vào Cây phả hệ.</p>
        </div>
      ),
    },
    {
      id: 'chap-3-1',
      part: 3,
      partTitle: 'PHẦN III: HƯỚNG DẪN SỬ DỤNG PHÂN HỆ THÀNH VIÊN (MAIN APP)',
      title: '3.1 Trang Chủ & Bảng Điều Khiển (/)',
      icon: Sparkles,
      summary: 'Thống kê số lượng thành viên, thế hệ, lịch giỗ chạp trong 30 ngày và tin tức.',
      content: (
        <div className="space-y-2 text-xs text-foreground/90">
          <p>Trang tổng quan cá nhân hóa dành cho thành viên:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Thẻ chỉ số: Tổng thành viên, Nam/Nữ, Còn sống/Đã mất, Số thế hệ.</li>
            <li>Sự kiện Giỗ chạp tự động quy đổi từ Âm lịch sang Dương lịch năm hiện tại.</li>
            <li>Thông tin hộ gia đình đang chịu trách nhiệm <strong>Cầu đường</strong> cúng lễ.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'chap-3-2',
      part: 3,
      partTitle: 'PHẦN III: HƯỚNG DẪN SỬ DỤNG PHÂN HỆ THÀNH VIÊN (MAIN APP)',
      title: '3.2 Cây Phả Hệ Tương Tác 2D & 3D (/tree)',
      icon: GitBranch,
      summary: 'Sơ đồ cây phả hệ đa chiều, thu phóng, lọc thế hệ, xem nhánh trực hệ và xuất ảnh.',
      content: (
        <div className="space-y-3 text-xs text-foreground/90">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 text-blue-900 dark:text-blue-200">
            <strong>Mẹo thao tác Cây phả hệ:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li><strong>Chuyển 2D/3D:</strong> Dùng nút chuyển đổi góc trên phải.</li>
              <li><strong>Thu phóng / Di chuyển:</strong> Cuộn chuột hoặc vuốt 2 ngón touchpad. Nhấp rê chuột để Pan.</li>
              <li><strong>Căn giữa (Fit view):</strong> Bấm nút Fit View để tự động căn toàn bộ cây vào màn hình.</li>
              <li><strong>Xem cây từ người này (Focus Subtree):</strong> Nhấp vào thẻ thành viên → Chọn "Xem cây từ người này" để tập trung quan sát dòng dõi riêng.</li>
              <li><strong>Xuất sơ đồ:</strong> Bấm nút Export để tải về ảnh PNG, SVG hoặc PDF in ấn.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'chap-3-3',
      part: 3,
      partTitle: 'PHẦN III: HƯỚNG DẪN SỬ DỤNG PHÂN HỆ THÀNH VIÊN (MAIN APP)',
      title: '3.3 Quản Lý Thành Viên & Tìm Kiếm Fuse.js (/people)',
      icon: Users,
      summary: 'Danh sách dạng Bảng/Grid, tìm kiếm gõ không dấu Fuzzy Search và sơ đồ gia đình.',
      content: (
        <div className="space-y-2 text-xs text-foreground/90">
          <p><strong>Tìm kiếm thông minh (Fuzzy Search):</strong> Công nghệ Fuse.js cho phép gõ từ khóa không dấu (VD: <em>"Tuan"</em> hệ thống tìm ra <em>"Tuấn"</em>, <em>"Toàn"</em>...).</p>
          <p><strong>Hồ sơ chi tiết (`/people/[id]`):</strong> Xem đầy đủ ngày sinh/mất Âm lịch, nơi an táng, tiểu sử, bộ sưu tập ảnh và sơ đồ cây quan hệ gia đình (Cha, Mẹ, Vợ/Chồng, Con cái).</p>
        </div>
      ),
    },
    {
      id: 'chap-3-4',
      part: 3,
      partTitle: 'PHẦN III: HƯỚNG DẪN SỬ DỤNG PHÂN HỆ THÀNH VIÊN (MAIN APP)',
      title: '3.4 Danh Bạ Gia Tộc Bảo Mật (/directory)',
      icon: BookOpen,
      summary: 'Thư mục liên lạc bảo mật: Số điện thoại, Zalo, Email, địa chỉ thường trú.',
      content: (
        <div className="space-y-2 text-xs text-foreground/90">
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-rose-900 dark:text-rose-200 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>Tính năng bảo mật: Chỉ các tài khoản đã được BQT duyệt quyền <strong>Viewer</strong> mới xem được Danh bạ.</span>
          </div>
          <p>Hỗ trợ nhấp gọi điện trực tiếp, mở chat Zalo hoặc lọc danh bạ theo Tỉnh/Thành phố sinh sống.</p>
        </div>
      ),
    },
    {
      id: 'chap-3-5',
      part: 3,
      partTitle: 'PHẦN III: HƯỚNG DẪN SỬ DỤNG PHÂN HỆ THÀNH VIÊN (MAIN APP)',
      title: '3.5 Lịch Tế Lễ, Ngày Giỗ & Phân Công Cầu Đường (/events & /cau-duong)',
      icon: Calendar,
      summary: 'Chuyển đổi lịch Âm-Dương tự động và quy chế phân công Cầu đường cúng lễ.',
      content: (
        <div className="space-y-3 text-xs text-foreground/90">
          <p><strong>Lịch Giỗ tự động (`/events`):</strong> Khi khai báo ngày mất Âm lịch của thành viên, hệ thống tự động tính ngày Dương lịch năm hiện tại và thông báo trước 3 ngày.</p>
          <p><strong>Cầu đường (`/cau-duong`):</strong> Hiển thị danh sách hộ gia đình chịu trách nhiệm chuẩn bị cỗ cúng tại Nhà thờ tộc xoay vòng công bằng theo từng kỳ lễ.</p>
        </div>
      ),
    },
    {
      id: 'chap-3-6',
      part: 3,
      partTitle: 'PHẦN III: HƯỚNG DẪN SỬ DỤNG PHÂN HỆ THÀNH VIÊN (MAIN APP)',
      title: '3.6 Đóng Góp, Vinh Danh & Quỹ Khuyến Học (/contributions, /achievements, /fund)',
      icon: Award,
      summary: 'Gửi đề xuất cập nhật phả hệ, bảng vàng vinh danh và minh bạch quỹ dòng họ.',
      content: (
        <div className="space-y-2 text-xs text-foreground/90">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Đóng góp (`/contributions`):</strong> Thành viên Viewer gửi yêu cầu bổ sung/sửa đổi thông tin để BQT phê duyệt.</li>
            <li><strong>Vinh danh (`/achievements`):</strong> Biểu dương con cháu đạt thành tích Học tập (Đại học, Tiến sĩ...), Sự nghiệp & Cống hiến.</li>
            <li><strong>Quỹ khuyến học (`/fund`):</strong> Báo cáo minh bạch thu/chi quỹ, danh sách nhà tài trợ và lịch sử trao học bổng.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'chap-3-7',
      part: 3,
      partTitle: 'PHẦN III: HƯỚNG DẪN SỬ DỤNG PHÂN HỆ THÀNH VIÊN (MAIN APP)',
      title: '3.7 Gia Phả Sách, Kho Tài Liệu & Bảng Tin (/documents & /feed)',
      icon: FileSpreadsheet,
      summary: 'Tự động dàn trang gia phả dạng sách điện tử, lưu trữ sắc phong và mạng xã hội nội bộ.',
      content: (
        <div className="space-y-2 text-xs text-foreground/90">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Gia phả sách (`/documents/book`):</strong> Xuất toàn bộ dữ liệu dòng họ thành cuốn sách điện tử xếp theo từng Đời chuẩn phả hệ truyền thống.</li>
            <li><strong>Kho tư liệu (`/documents/library`):</strong> Số hóa sắc phong cổ, video lễ tế, văn cúng.</li>
            <li><strong>Góc giao lưu (`/feed`):</strong> Mạng xã hội dòng họ cho phép chia sẻ bài viết, hình ảnh, thông báo tin hỷ/buồn, thả tim và bình luận.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'chap-3-8',
      part: 3,
      partTitle: 'PHẦN III: HƯỚNG DẪN SỬ DỤNG PHÂN HỆ THÀNH VIÊN (MAIN APP)',
      title: '3.8 Tra Cứu Quan Hệ & Xưng Hào (/relationship)',
      icon: Route,
      summary: 'Tính toán đường đi ngắn nhất trên cây gia phả giữa 2 người và gợi ý cách xưng hô.',
      content: (
        <div className="space-y-2 text-xs text-foreground/90">
          <p>Chọn 2 người bất kỳ trên cây gia phả → Bấm Tra cứu. Hệ thống sẽ trực quan hóa đường đi qua tổ tiên chung và đưa ra gợi ý cách xưng hô chuẩn mực truyền thống Việt Nam (VD: <em>Bác - Cháu</em>, <em>Cụ - Cháu</em>, <em>Anh/Chị em họ thứ...</em>).</p>
        </div>
      ),
    },
    {
      id: 'chap-4-1',
      part: 4,
      partTitle: 'PHẦN IV: HƯỚNG DẪN DÀNH CHO QUẢN TRỊ VIÊN (ADMIN PANEL)',
      title: '4.1 Quản Lý Người Dùng & Duyệt Đơn Ghi Danh (/admin/users & /admin/registrations)',
      icon: Settings,
      summary: 'Phân quyền tài khoản, duyệt thành viên mới và thao tác hàng loạt.',
      content: (
        <div className="space-y-3 text-xs text-foreground/90">
          <p><strong>Quản lý Người dùng (`/admin/users`):</strong> Phê duyệt tài khoản `pending_verification`, phân quyền (Admin, Editor, Viewer), tạm khóa hoặc xóa tài khoản vi phạm.</p>
          <p><strong>Duyệt Đơn ghi danh (`/admin/registrations`):</strong> Kiểm tra đơn xin gia nhập dòng họ từ bà con ở xa gửi về, bấm "Phê duyệt & Nhập phả" để tự động khởi tạo hồ sơ thành viên.</p>
        </div>
      ),
    },
    {
      id: 'chap-4-2',
      part: 4,
      partTitle: 'PHẦN IV: HƯỚNG DẪN DÀNH CHO QUẢN TRỊ VIÊN (ADMIN PANEL)',
      title: '4.2 Công Cụ Gộp Trùng Lặp Hồ Sơ (Merge Wizard - /admin/duplicates)',
      icon: Database,
      summary: 'Phát hiện thành viên trùng tên/năm sinh và gộp hồ sơ tự động.',
      content: (
        <div className="space-y-2 text-xs text-foreground/90">
          <p>Thuật toán tự động quét dữ liệu và đưa ra gợi ý các cặp trùng khớp (&gt;80%). Admin sử dụng <strong>Trình gộp Merge Wizard</strong> để so sánh 2 cột thông tin, chọn dữ liệu chuẩn nhất và hoàn tất gộp để làm sạch CSDL.</p>
        </div>
      ),
    },
    {
      id: 'chap-4-3',
      part: 4,
      partTitle: 'PHẦN IV: HƯỚNG DẪN DÀNH CHO QUẢN TRỊ VIÊN (ADMIN PANEL)',
      title: '4.3 Vận Hành Thuật Toán Cầu Đường DFS (/admin/cau-duong)',
      icon: RotateCcw,
      summary: 'Tự động hóa xoay vòng phân công Cầu đường cúng lễ theo cây gia phả.',
      content: (
        <div className="space-y-2 text-xs text-foreground/90">
          <p>Sử dụng thuật toán <strong>Depth-First Search (DFS)</strong> duyệt cây gia phả để tự động sắp xếp lịch phân công trách nhiệm cúng lễ xoay vòng giữa các hộ gia đình theo đúng quy tắc thế thứ và cành nhánh truyền thống.</p>
        </div>
      ),
    },
    {
      id: 'chap-4-4',
      part: 4,
      partTitle: 'PHẦN IV: HƯỚNG DẪN DÀNH CHO QUẢN TRỊ VIÊN (ADMIN PANEL)',
      title: '4.4 Sao Lưu CSDL & Quản Lý GEDCOM 7.0 (/admin/backup & /admin/import-export)',
      icon: Database,
      summary: 'Nhập/Xuất chuẩn phả hệ GEDCOM 7.0 quốc tế và lập lịch sao lưu tự động.',
      content: (
        <div className="space-y-2 text-xs text-foreground/90">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>GEDCOM 7.0:</strong> Cho phép Xuất/Nhập file phả hệ `.ged` chuẩn quốc tế để chia sẻ hoặc lưu trữ lâu dài.</li>
            <li><strong>Backup Schedule:</strong> Lập lịch tự động tạo bản sao lưu CSDL theo ngày/tần suất tuần.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'chap-5-1',
      part: 5,
      partTitle: 'PHẦN V: HƯỚNG DẪN PHẦN MỀM DESKTOP (OFFLINE APP)',
      title: '5.1 Vận Hành Offline & Thư Mục Dữ Liệu ~/AncestorTree/',
      icon: Laptop,
      summary: 'Sử dụng SQLite local không cần Internet và quy trình sao lưu an toàn.',
      content: (
        <div className="space-y-3 text-xs text-foreground/90">
          <p>Phiên bản Desktop chạy độc lập trên máy tính với CSDL SQLite lưu tại <code>C:\Users\&lt;Ten_May&gt;\AncestorTree\</code>.</p>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-900 dark:text-emerald-200">
            <strong>Quy trình sao lưu thủ công an toàn 100%:</strong>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Đóng phần mềm AncestorTree Desktop.</li>
              <li>Copy toàn bộ thư mục <code>~/AncestorTree/</code> ra USB hoặc Google Drive.</li>
              <li>Khi cài lại máy: Cài app mới → Chép đè thư mục <code>AncestorTree</code> đã lưu vào thư mục User → Mở app dữ liệu phục hồi 100%.</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'chap-6-1',
      part: 6,
      partTitle: 'PHẦN VI: CÂU HỎI THƯỜNG GẶP (FAQ) & XỬ LÝ SỰ CỐ',
      title: '6.1 Giải Đáp Thắc Mắc Phổ Biến (FAQ)',
      icon: HelpCircle,
      summary: 'Trả lời các câu hỏi về mất dữ liệu, Âm lịch, phân quyền và mật khẩu.',
      content: (
        <div className="space-y-3 text-xs text-foreground/90">
          <div className="space-y-2">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              1. Dữ liệu phả hệ có bị mất khi cập nhật phần mềm không?
            </p>
            <p className="text-muted-foreground pl-5">Hoàn toàn không. Dữ liệu được lưu trữ độc lập trên PostgreSQL Cloud hoặc file CSDL SQLite nằm riêng trong thư mục người dùng.</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              2. Ngày giỗ tính theo Âm lịch hay Dương lịch?
            </p>
            <p className="text-muted-foreground pl-5">Ngày giỗ được lưu chuẩn Âm lịch. Hệ thống tự quy đổi sang Dương lịch năm hiện tại để thông báo chính xác.</p>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              3. Khi Cây phả hệ đông người làm sao xem không bị rối?
            </p>
            <p className="text-muted-foreground pl-5">Hãy dùng tính năng "Lọc theo Đời" hoặc nhấp chọn một thành viên và bấm "Xem cây từ người này" (Focus Subtree).</p>
          </div>
        </div>
      ),
    },
  ];

  const filteredChapters = useMemo(() => {
    return chapters.filter((chap) => {
      const matchPart = selectedPart === 'all' || chap.part === selectedPart;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        chap.title.toLowerCase().includes(q) ||
        chap.summary.toLowerCase().includes(q) ||
        chap.partTitle.toLowerCase().includes(q);
      return matchPart && matchQuery;
    });
  }, [searchQuery, selectedPart]);

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = `# EBOOK HƯỚNG DẪN SỬ DỤNG HỆ THỐNG GIA PHẢ ĐIỆN TỬ ANCESTOR TREE (v2.5.0)
Chi tộc Phạm Văn – An Trạch, Hòa Tiến, Đà Nẵng`;
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AncestorTree_Ebook_HDSD_v2.5.0.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl space-y-8 pb-24">
      {/* Top Banner */}
      <PageHeader
        title="Ebook Hướng Dẫn Sử Dụng Toàn Tập"
        description="Cẩm nang tra cứu và hướng dẫn chi tiết từng trang, từng chức năng, quy trình vận hành phả hệ dành cho con cháu dòng họ và Ban quản trị AncestorTree."
        icon={BookOpen}
        badge="Ebook v2.5.0"
        theme="indigo"
        breadcrumbs={[{ label: 'Ebook Hướng dẫn' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleDownloadMarkdown}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" /> Tải về Ebook (.md)
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => window.print()}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur text-xs"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5" /> In tài liệu
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopyShareLink}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur text-xs"
            >
              {copied ? <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5 mr-1.5" />}
              {copied ? 'Đã sao chép link' : 'Chia sẻ trang này'}
            </Button>
          </div>
        }
      />

      {/* Filter & Search Bar */}
      <div className="space-y-4 bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm chủ đề, từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Button
              size="sm"
              variant={selectedPart === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedPart('all')}
              className="text-xs h-8 rounded-lg"
            >
              Tất cả ({chapters.length})
            </Button>
            {parts.map((p) => (
              <Button
                key={p.id}
                size="sm"
                variant={selectedPart === p.id ? 'default' : 'outline'}
                onClick={() => setSelectedPart(p.id)}
                className="text-xs h-8 rounded-lg"
              >
                P.{p.id}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left TOC Navigation */}
        <div className="hidden lg:block space-y-2">
          <div className="sticky top-20 bg-card border border-border/80 rounded-2xl p-4 space-y-3 max-h-[calc(100vh-6rem)] overflow-y-auto shadow-xs">
            <div className="flex items-center gap-2 font-bold text-sm border-b pb-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span>Mục Lục Ebook</span>
            </div>
            <nav className="space-y-1 text-xs">
              {filteredChapters.map((chap) => (
                <a
                  key={chap.id}
                  href={`#${chap.id}`}
                  className="block p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors line-clamp-1"
                >
                  {chap.title}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Content Stream */}
        <div className="lg:col-span-3 space-y-6">
          {filteredChapters.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground space-y-2">
              <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground/60" />
              <p className="font-semibold text-sm">Không tìm thấy nội dung phù hợp với từ khóa "{searchQuery}"</p>
              <p className="text-xs">Vui lòng thử lại với từ khóa khác hoặc bấm nút "Tất cả".</p>
            </Card>
          ) : (
            filteredChapters.map((chap) => {
              const Icon = chap.icon;
              return (
                <Card key={chap.id} id={chap.id} className="scroll-mt-24 border-border/80 shadow-xs hover:shadow-md transition-shadow">
                  <CardHeader className="bg-muted/30 pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {chap.partTitle}
                      </Badge>
                      {chap.badge && <Badge className="bg-blue-600 text-[10px]">{chap.badge}</Badge>}
                    </div>
                    <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground pt-1">
                      <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      {chap.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {chap.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5">
                    {chap.content}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
