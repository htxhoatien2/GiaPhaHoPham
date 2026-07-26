/**
 * @project AncestorTree
 * @file src/app/(main)/admin/users/actions.ts
 * @description Server actions for admin user management.
 *              Requires SUPABASE_SERVICE_ROLE_KEY for admin deletion.
 * @version 1.2.0
 * @updated 2026-03-26
 */

'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createServiceRoleClient } from '@/lib/supabase';

/**
 * Permanently delete a user account from Supabase Auth and profiles.
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

    // 1. Verify caller is authenticated
    const {
      data: { user: caller },
    } = await supabase.auth.getUser();
    if (!caller) {
      return { success: false, error: 'Chưa đăng nhập hoặc phiên làm việc đã hết hạn' };
    }

    // 2. Verify caller has admin role
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

    // 3. Check for SUPABASE_SERVICE_ROLE_KEY
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return {
        success: false,
        error:
          'Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trên Vercel. Bạn cần thêm biến SUPABASE_SERVICE_ROLE_KEY vào Vercel Settings -> Environment Variables và Redeploy lại ứng dụng để thực hiện xóa tài khoản.',
      };
    }

    const adminClient = createServiceRoleClient();

    // 4. Find target profile ID for foreign key cleanup
    const { data: targetProfile } = await adminClient
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    // 5. Clean up referencing foreign keys to avoid PostgreSQL FK constraint violations
    if (targetProfile) {
      await Promise.allSettled([
        adminClient
          .from('fund_transactions')
          .update({ created_by: null })
          .eq('created_by', targetProfile.id),
        adminClient
          .from('scholarships')
          .update({ approved_by: null })
          .eq('approved_by', targetProfile.id),
        adminClient
          .from('clan_articles')
          .update({ author_id: null })
          .eq('author_id', targetProfile.id),
        adminClient
          .from('member_registrations')
          .update({ reviewed_by: null })
          .eq('reviewed_by', userId),
        adminClient
          .from('clan_documents')
          .update({ uploaded_by: null })
          .eq('uploaded_by', userId),
        adminClient
          .from('clan_settings')
          .update({ updated_by: null })
          .eq('updated_by', userId),
      ]);
    }

    // 6. Delete from Supabase Auth (Auth Admin API)
    const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(userId);

    // 7. Delete profile row explicitly to guarantee removal from profiles table
    const { error: profileDeleteError } = await adminClient
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (authDeleteError && profileDeleteError) {
      return {
        success: false,
        error: `Xóa tài khoản thất bại: ${authDeleteError.message || profileDeleteError.message}`,
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
