/**
 * @project AncestorTree
 * @file src/components/home/clan-name.tsx
 * @description Client component that renders the dynamic clan full name.
 *              Uses useClanSettings() so the Supabase call is made from the
 *              browser (not the server), avoiding Docker networking issues
 *              where localhost:54321 is unreachable inside the container.
 * @version 1.0.0
 * @updated 2026-02-28
 */

'use client';

import { useClanSettings } from '@/hooks/use-clan-settings';
import { CLAN_FULL_NAME } from '@/lib/clan-config';
import { useAuth } from '@/components/auth/auth-provider';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

/** Renders the dynamic clan full name; falls back to env var while loading. */
export function ClanFullName() {
  const { data: cs } = useClanSettings();
  const { isAdmin } = useAuth();

  return (
    <span className="inline-flex items-center gap-2 group justify-center">
      <span>{cs?.clan_full_name ?? CLAN_FULL_NAME}</span>
      {isAdmin && (
        <Link 
          href="/admin/settings" 
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white inline-flex items-center justify-center cursor-pointer ml-1"
          title="Chỉnh sửa thông tin dòng họ"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      )}
    </span>
  );
}
