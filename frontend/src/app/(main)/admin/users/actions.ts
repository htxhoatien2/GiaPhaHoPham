/**
 * @project AncestorTree
 * @file src/app/(main)/admin/users/actions.ts
 * @description Server actions for admin user management.
 *              Supports service-role key Auth deletion as well as admin profile deletion fallback.
 * @version 1.1.0
 * @updated 2026-03-26
 */

'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createServiceRoleClient } from '@/lib/supabase';

/**
 * Delete a user account from Supabase Auth and/or profiles table.
 *
 * Resilience Strategy:
 * 1. Pre-cleans foreign key references (fund_transactions, scholarships, clan_articles, etc.)
 *    to avoid PostgreSQL FK constraint violations.
 * 2. If SUPABASE_SERVICE_ROLE_KEY is present: Deletes user from Supabase Auth (cascades to profile).
 * 3. Fallback (if SERVICE_ROLE_KEY missing or Auth delete fails): Deletes profile row directly from `profiles` table.
 */
export async function deleteUserAccount(
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: 'Cần cung cấp mã người dùng (userId)' };
    }

    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        error: 'Chưa cấu hình thông tin kết nối Supabase (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY)',
      };
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user: caller },
    } = await supabase.auth.getUser();
    if (!caller) {
      return { success: false, error: 'Chưa đăng nhập hoặc phiên làm việc đã hết hạn' };
    }

    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', caller.id)
      .single();

    if (callerProfile?.role !== 'admin') {
      return {
        success: false,
        error: 'Bạn không có quyền quản trị viên (Admin) để thực hiện thao tác này',
      };
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const dbClient = serviceRoleKey ? createServiceRoleClient() : supabase;

    // Find target profile ID for foreign key cleanup
    const { data: targetProfile } = await dbClient
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    // Clean up referencing foreign keys to avoid PostgreSQL FK constraint violations
    if (targetProfile) {
      await Promise.allSettled([
        dbClient
          .from('fund_transactions')
          .update({ created_by: null })
          .eq('created_by', targetProfile.id),
        dbClient
          .from('scholarships')
          .update({ approved_by: null })
          .eq('approved_by', targetProfile.id),
        dbClient
          .from('clan_articles')
          .update({ author_id: null })
          .eq('author_id', targetProfile.id),
        dbClient
          .from('member_registrations')
          .update({ reviewed_by: null })
          .eq('reviewed_by', userId),
        dbClient
          .from('clan_documents')
          .update({ uploaded_by: null })
          .eq('uploaded_by', userId),
        dbClient
          .from('clan_settings')
          .update({ updated_by: null })
          .eq('updated_by', userId),
      ]);
    }

    // 1. If serviceRoleKey is available, attempt deletion from Supabase Auth (Auth Admin API)
    if (serviceRoleKey) {
      const adminClient = createServiceRoleClient();
      const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(userId);
      if (!authDeleteError) {
        return { success: true };
      }
    }

    // 2. Fallback: delete profile row directly from `profiles` table
    const { error: profileDeleteError } = await dbClient
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (profileDeleteError) {
      return {
        success: false,
        error: `Xóa hồ sơ người dùng thất bại: ${profileDeleteError.message}`,
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
