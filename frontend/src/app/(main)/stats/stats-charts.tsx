/**
 * @project AncestorTree
 * @file src/app/(main)/stats/stats-charts.tsx
 * @description Recharts chart components for stats dashboard (client-only)
 * @version 2.0.0
 * @updated 2026-03-25
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { BarChart3, PieChart as PieIcon, Layers, Users, GitBranch, ShieldAlert } from 'lucide-react';

const BLUE = '#3b82f6';
const PINK = '#ec4899';
const GREEN = '#10b981';
const GRAY = '#64748b';
const AMBER = '#f59e0b';
const INDIGO = '#6366f1';

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
          <ResponsiveContainer width="100%" height={300}>
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

      {/* Phai distribution */}
      {stats.phaiStats.length > 0 && (
        <Card className="md:col-span-2 shadow-sm border-slate-200/80 dark:border-slate-800">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/40 border-b flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs">
                <GitBranch className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base">Thống kê theo Phái dòng họ</CardTitle>
                <CardDescription className="text-xs">Phân bổ con cháu theo từng Phái tộc trong gia phả</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200">
              {stats.phaiStats.length} Phái / Phân loại
            </Badge>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.phaiStats} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="label" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill={INDIGO} name="Số người" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Detailed Table for Phai */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="p-3">Tên Phái</th>
                    <th className="p-3 text-center">Số lượng</th>
                    <th className="p-3 text-center">Tỷ lệ</th>
                    <th className="p-3 text-center">Nam / Nữ</th>
                    <th className="p-3 text-center">Còn sống</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {stats.phaiStats.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-3 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                        {item.label}
                      </td>
                      <td className="p-3 text-center font-extrabold text-indigo-600 dark:text-indigo-400">{item.count} người</td>
                      <td className="p-3 text-center font-medium">{item.percentage}%</td>
                      <td className="p-3 text-center text-slate-600 dark:text-slate-400">{item.maleCount} Nam • {item.femaleCount} Nữ</td>
                      <td className="p-3 text-center text-emerald-600 dark:text-emerald-400 font-medium">{item.livingCount} người</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chi distribution */}
      {stats.chiStats.length > 0 && (
        <Card className="md:col-span-2 shadow-sm border-slate-200/80 dark:border-slate-800">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/40 border-b flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-600 text-white shadow-xs">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base">Phân bố thành viên theo Chi / Nhánh dòng họ</CardTitle>
                <CardDescription className="text-xs">Số lượng con cháu phân bổ chi tiết theo từng Chi tộc</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200">
              {stats.chiStats.length} Chi / Phân nhánh
            </Badge>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <ResponsiveContainer width="100%" height={280}>
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

            {/* Detailed Table for Chi */}
            <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-900 font-bold text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="p-3">Tên Chi / Nhánh</th>
                    <th className="p-3 text-center">Số lượng</th>
                    <th className="p-3 text-center">Tỷ lệ</th>
                    <th className="p-3 text-center">Nam / Nữ</th>
                    <th className="p-3 text-center">Còn sống</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {stats.chiStats.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="p-3 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        {item.label}
                      </td>
                      <td className="p-3 text-center font-extrabold text-amber-600 dark:text-amber-400">{item.count} người</td>
                      <td className="p-3 text-center font-medium">{item.percentage}%</td>
                      <td className="p-3 text-center text-slate-600 dark:text-slate-400">{item.maleCount} Nam • {item.femaleCount} Nữ</td>
                      <td className="p-3 text-center text-emerald-600 dark:text-emerald-400 font-medium">{item.livingCount} người</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
          <ResponsiveContainer width="100%" height={260}>
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
          <ResponsiveContainer width="100%" height={260}>
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
