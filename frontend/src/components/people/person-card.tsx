/**
 * @project AncestorTree
 * @file src/components/people/person-card.tsx
 * @description Modern, state-of-the-art Card component displaying person information
 * @version 2.0.0
 * @updated 2026-07-26
 */

'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { type Person, getZodiacYear } from '@/types';
import { User, MapPin, Calendar, ArrowRight, Heart } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  showDetails?: boolean;
}

export function PersonCard({ person, showDetails = true }: PersonCardProps) {
  const initials = person.display_name
    .split(' ')
    .map((n) => n[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  const genderBg = person.gender === 1
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
    : 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300';
  const statusBadge = person.is_living
    ? <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">💚 Còn sống</Badge>
    : <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px]">🕯️ Đã mất</Badge>;

  return (
    <Link href={`/people/${person.id}`}>
      <Card className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col justify-between">
        <CardContent className="p-5">
          <div className="flex items-start gap-3.5">
            <Avatar className="h-14 w-14 border-2 border-white shadow-md shrink-0 group-hover:scale-105 transition-transform">
              <AvatarImage src={person.avatar_url} alt={person.display_name} />
              <AvatarFallback className={`${genderBg} font-bold text-sm`}>
                {initials || <User className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                  {person.display_name}
                </h3>
                <span className="text-xs shrink-0 font-medium text-slate-400">
                  {person.gender === 1 ? '♂' : '♀'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <Badge variant="outline" className="text-[10px] bg-amber-50/80 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 font-bold">
                  Đời {person.generation}, Phái {person.phai ?? '—'}, Chi {person.chi ?? '—'}
                </Badge>
                {statusBadge}
              </div>

              {showDetails && (
                <div className="pt-2 space-y-1 text-xs text-slate-600 font-normal">
                  {person.birth_year && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        Năm sinh {person.birth_year}
                        {` (${getZodiacYear(person.birth_year)})`}
                        {person.death_year && ` - ${person.death_year}`}
                      </span>
                    </div>
                  )}
                  {person.hometown && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{person.hometown}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <div className="px-5 py-2.5 bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="group-hover:text-blue-600 transition-colors">Xem thông tin chi tiết</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </div>
      </Card>
    </Link>
  );
}

