import { PublicHeader } from '@/components/layout/public-header';
import { AppFooter } from '@/components/layout/app-footer';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased flex flex-col">
      <PublicHeader />
      <main className="pt-16 flex-1 bg-slate-900 text-slate-100">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
