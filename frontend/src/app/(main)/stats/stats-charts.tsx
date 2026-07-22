/**
 * @project AncestorTree
 * @file src/app/(main)/stats/stats-charts.tsx
 * @description Recharts chart components for stats dashboard (client-only)
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import type { DetailedStats } from '@/lib/stats-calculator';
import { BarChart3, PieChart as PieIcon, Layers, Users } from 'lucide-react';

const BLUE = '#3b82f6';
const PINK = '#ec4899';
const GREEN = '#10b981';
const GRAY = '#64748b';
const AMBER = '#f59e0b';

const GENDER_COLORS = [BLUE, PINK];
const LIVING_COLORS = [GREEN, GRAY];

interface StatsChartsProps {
  stats: DetailedStats;
}

export default function StatsCharts({ stats }: StatsChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Generation distribution */}
      <Card className="md:col-span-2 shadow-sm border-slate-200/80 dark:border-slate-800">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/40 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">Phân bố thành viên theo thế hệ (Đời)</CardTitle>
              <CardDescription className="text-xs">Số lượng con cháu ghi nhận qua từng thế hệ phả hệ</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stats.generationStats} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="label" stroke="#888888" fontSize={12} tickLine={false} />
              <YAxis allowDecimals={false} stroke="#888888" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill={BLUE} name="Số người" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Chi distribution */}
      {stats.chiStats.length > 0 && (
        <Card className="md:col-span-2 shadow-sm border-slate-200/80 dark:border-slate-800">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/40 border-b">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-600 text-white shadow-xs">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base">Phân bố thành viên theo Chi / Nhánh dòng họ</CardTitle>
                <CardDescription className="text-xs">Số lượng con cháu phân bổ theo từng Chi tộc</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={stats.chiStats} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="label" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill={AMBER} name="Số người" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Gender pie chart */}
      <Card className="shadow-sm border-slate-200/80 dark:border-slate-800">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/40 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs">
              <PieIcon className="h-4 w-4" />
            </div>
            <CardTitle className="text-base">Tỷ lệ Nam / Nữ</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.genderStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {stats.genderStats.map((_, idx) => (
                  <Cell key={idx} fill={GENDER_COLORS[idx % GENDER_COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Living/deceased pie chart */}
      <Card className="shadow-sm border-slate-200/80 dark:border-slate-800">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/40 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs">
              <BarChart3 className="h-4 w-4" />
            </div>
            <CardTitle className="text-base">Tỷ lệ Còn sống / Đã mất</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.livingStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {stats.livingStats.map((_, idx) => (
                  <Cell key={idx} fill={LIVING_COLORS[idx % LIVING_COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
