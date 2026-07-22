/**
 * @project AncestorTree
 * @file src/app/(main)/help/page.tsx
 * @description Modern UI/UX In-app help guide — detailed usage instructions for users
 * @version 2.0.0
 * @updated 2026-03-25
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  HelpCircle,
  BookOpen,
  GitBranch,
  Users,
  Contact,
  Calendar,
  ClipboardList,
  Award,
  CircleDollarSign,
  ScrollText,
  RotateCw,
  FileSpreadsheet,
  Shield,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Database,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/page-header';

const isDesktop = process.env.NEXT_PUBLIC_DESKTOP_MODE === 'true';

const navItems = [
  { name: 'Trang chủ', desc: 'Thống kê tổng quan: tổng thành viên, số đời, sự kiện sắp tới, hương ước.', icon: Sparkles, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
  { name: 'Cây phả hệ', desc: 'Sơ đồ cây gia phả tương tác 2D/3D, thu phóng, kéo thả, lọc nhánh linh hoạt.', icon: GitBranch, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
  { name: 'Thành viên', desc: 'Danh sách và quản lý thành viên: thêm, sửa, xóa, tìm kiếm thông tin cá nhân.', icon: Users, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
  { name: 'Danh bạ', desc: 'Thư mục liên lạc: SĐT, Email, Zalo (dành cho thành viên đã đăng nhập).', icon: Contact, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
  { name: 'Lịch cúng lễ', desc: 'Ngày giỗ, lễ tết theo Âm lịch. Tự động lặp lại hàng năm.', icon: Calendar, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
  { name: 'Đề xuất', desc: 'Gửi đóng góp, đề xuất chỉnh sửa thông tin để Ban quản trị phê duyệt.', icon: ClipboardList, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40' },
  { name: 'Vinh danh', desc: 'Bảng vinh danh thành tích: Học tập, Sự nghiệp, Cống hiến của con cháu.', icon: Award, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/40' },
  { name: 'Quỹ khuyến học', desc: 'Thu chi quỹ minh bạch, cấp học bổng khen thưởng con cháu ưu tú.', icon: CircleDollarSign, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' },
  { name: 'Hương ước', desc: 'Gia huấn, quy ước, lời dặn dò truyền thống của dòng họ.', icon: ScrollText, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
  { name: 'Cầu đương', desc: 'Phân công trách nhiệm cúng lễ xoay vòng giữa các gia đình công bằng.', icon: RotateCw, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40' },
  { name: 'Tài liệu', desc: 'Xuất gia phả dạng sách truyền thống xếp theo thế hệ.', icon: FileSpreadsheet, color: 'text-slate-500 bg-slate-50 dark:bg-slate-950/40' },
];

const workflows = [
  {
    title: '1. Thêm & Quản lý Thành viên mới',
    steps: [
      'Vào Thành viên → nhấn nút "Thêm thành viên" ở góc trên bên phải',
      'Bắt buộc nhập: Họ và tên, Giới tính',
      'Nên điền: Đời (Đời 1 = Thủy tổ), Năm sinh, Ngày mất âm lịch (để tự tính ngày giỗ)',
      'Chọn Cha / Mẹ từ danh sách — hệ thống tự động nối dây quan hệ trên Cây phả hệ',
      'Điền thêm: Tiểu sử, Nghề nghiệp, Thông tin liên lạc (SĐT, Zalo)',
    ],
    tip: 'Mẹo: Nhập theo thứ tự từ đời cao nhất (Thủy tổ) trở xuống để cây hiển thị chuẩn xác nhất.',
  },
  {
    title: '2. Thao tác xem Cây phả hệ',
    steps: [
      'Vào mục Cây phả hệ từ thanh menu chính',
      'Thu phóng: Cuộn chuột hoặc vuốt 2 ngón tay trên touchpad',
      'Di chuyển: Nhấp chuột trái và kéo rê trên màn hình',
      'Xem thông tin: Bấm trực tiếp vào ảnh/tên thành viên để mở card thông tin chi tiết',
      'Lọc nhánh: Nhấp vào thành viên → chọn "Xem cây từ đây" để chỉ xem dòng dõi nhánh đó',
    ],
    tip: 'Mẹo: Khi cây gia phả đông (>50 người), tính năng "Xem cây từ đây" sẽ giúp bạn tập trung dễ quan sát.',
  },
  {
    title: '3. Tự động hóa Lịch tế lễ & Ngày giỗ',
    steps: [
      'Ngày giỗ tự động tính dựa trên ngày mất Âm lịch của thành viên',
      'Thêm sự kiện thủ công: Nhấn "Thêm sự kiện"',
      'Phân loại: Ngày Giỗ, Lễ Tết (Tết Nguyên Đán, Rằm tháng 7…), Họp họ',
      'Nhập ngày Âm lịch (VD: 15/7 ÂL) và gán người liên quan',
      'Bật tùy chọn "Lặp lại hàng năm" để tự nhắc nhở',
    ],
    tip: 'Lưu ý: Hệ thống tự động quy đổi Âm lịch sang Dương lịch năm hiện tại để thông báo chính xác.',
  },
];

const desktopBackupWorkflow = {
  title: '4. Sao lưu & Bảo toàn Dữ liệu (Desktop)',
  steps: [
    'Dữ liệu gia phả được lưu tại thư mục ~/AncestorTree/ (data/ + media/)',
    'Sao lưu: Đóng ứng dụng → copy thư mục ~/AncestorTree/ ra USB hoặc Google Drive',
    'Khôi phục: Đóng app → chép thư mục backup đè về ~/AncestorTree/ → mở lại app',
    'Nên tiến hành sao lưu định kỳ ít nhất 1 lần / tháng',
  ],
  tip: 'Lưu ý: Cần sao lưu cả file dữ liệu .db lẫn ảnh thành viên trong thư mục media/.',
};

const roles = [
  { role: 'Admin', badge: 'Quản trị viên', color: 'bg-rose-500 text-white', desc: 'Toàn quyền: Thêm/sửa/xóa tất cả dữ liệu, phê duyệt đề xuất, quản lý người dùng & cài đặt hệ thống.' },
  { role: 'Editor', badge: 'Biên tập viên', color: 'bg-blue-600 text-white', desc: 'Thêm, chỉnh sửa thông tin thành viên, sự kiện, vinh danh, quỹ khuyến học, hương ước.' },
  { role: 'Viewer', badge: 'Thành viên', color: 'bg-emerald-600 text-white', desc: 'Xem tất cả thông tin gia phả (bao gồm danh bạ liên lạc), gửi đề xuất chỉnh sửa.' },
  { role: 'Guest', badge: 'Khách', color: 'bg-slate-500 text-white', desc: 'Xem thông tin công khai dòng họ, ẩn các dữ liệu cá nhân nhạy cảm.' },
];

const faqItems = [
  {
    q: 'Dữ liệu gia phả có bị mất khi cập nhật phần mềm không?',
    a: 'Hoàn toàn không. Dữ liệu được lưu trữ độc lập (SQLite trên Desktop hoặc PostgreSQL Cloud trên Web), không bị xóa khi cập nhật.',
  },
  {
    q: 'Ứng dụng hỗ trợ lưu trữ bao nhiêu thành viên?',
    a: 'Không giới hạn. Ứng dụng đã được thử nghiệm mượt mà với 1.000+ thành viên qua 15+ thế hệ.',
  },
  {
    q: 'Làm sao để thêm mối quan hệ vợ/chồng hoặc con cái?',
    a: 'Bạn mở trang Chi tiết thành viên → cuộn tới mục Quan hệ gia đình → bấm "Thêm quan hệ" → chọn "Thêm con" hoặc "Thêm vợ/chồng".',
  },
  {
    q: 'Chức năng Cầu đương tự động phân công như thế nào?',
    a: 'Cầu đương sử dụng thuật toán duyệt cây gia phả theo chiều sâu (DFS) để xoay vòng trách nhiệm làm cỗ cúng giữa các gia đình theo thứ tự đời, đảm bảo công bằng và minh bạch.',
  },
];

export default function HelpPage() {
  const allWorkflows = isDesktop
    ? [...workflows, desktopBackupWorkflow]
    : workflows;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-10 pb-24">
      {/* Hero Header Banner */}
      <PageHeader
        title="Center Hướng Dẫn Sử Dụng"
        description="Cẩm nang toàn tập hướng dẫn thao tác, quy trình và mẹo quản lý Gia Phả Điện Tử"
        icon={HelpCircle}
        badge="Cẩm nang nhanh"
        theme="indigo"
        breadcrumbs={[{ label: 'Hướng dẫn sử dụng' }]}
        actions={
          <Link href="/guide">
            <Button className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md">
              <BookOpen className="h-4 w-4 mr-1.5" /> Đọc Ebook Hướng Dẫn (v2.5.0)
            </Button>
          </Link>
        }
      />

      {/* Section 1: Overview Navigation */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
            <BookOpen className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold">1. Tổng quan các chức năng ứng dụng</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.name} className="hover:shadow-md transition-shadow border-border/80">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-sm text-foreground">{item.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section 2: Workflows */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold">2. Quy trình làm việc quan trọng</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allWorkflows.map((wf, idx) => (
            <Card key={idx} className="shadow-xs border-border/80">
              <CardHeader className="bg-muted/30 pb-3 border-b">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  {wf.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <ul className="space-y-2">
                  {wf.steps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2 text-xs text-foreground/90">
                      <ChevronRight className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-[11px] font-medium flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>{wf.tip}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 3: Roles & Permissions */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-600 text-white shadow-xs">
            <Shield className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold">3. Phân quyền &amp; Vai trò tài khoản</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {roles.map((r) => (
            <Card key={r.role} className="border-border/80 shadow-xs">
              <CardContent className="p-4 space-y-2">
                <Badge className={`${r.color} text-xs font-bold`}>{r.badge}</Badge>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">{r.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 4: FAQ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs">
            <HelpCircle className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold">4. Câu hỏi thường gặp (FAQ)</h2>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <Card key={idx} className="border-border/80 shadow-xs">
              <CardContent className="p-4 space-y-2">
                <p className="font-bold text-sm text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  {item.q}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6">{item.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
