/**
 * @project AncestorTree
 * @file src/app/(main)/admin/users/actions.ts
 * @description Server actions for admin user management.
 *              Deletion requires the Supabase service-role key (admin API),
 *              which must not be exposed to the browser — hence a server action.
 * @version 1.0.0
 * @updated 2026-02-28
 */

'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createServiceRoleClient } from '@/lib/supabase';

/**
 * Permanently delete a user account from Supabase Auth.
 * The corresponding profiles row is removed automatically via ON DELETE CASCADE.
 *
 * Security:
 * - Only callable server-side (Next.js Server Action)
 * - Uses SUPABASE_SERVICE_ROLE_KEY — never exposed to browser
 * - Caller must be admin (ISS-02: authorization check)
 * - Desktop mode: not applicable (no real Supabase Auth in desktop)
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  if (!userId) throw new Error('Cần cung cấp mã người dùng (userId)');

  // ISS-02: Verify caller is admin before using service-role key
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Chưa cấu hình thông tin kết nối Supabase (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY)');
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    },
  );

  const { data: { user: caller } } = await supabase.auth.getUser();
  if (!caller) throw new Error('Chưa đăng nhập hoặc phiên làm việc đã hết hạn');

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', caller.id)
    .single();

  if (callerProfile?.role !== 'admin') {
    throw new Error('Bạn không có quyền quản trị viên (Admin) để thực hiện thao tác này');
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Không thể xóa tài khoản vì hệ thống chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trong biến môi trường server.');
  }

  const adminClient = createServiceRoleClient();

  // Find target profile ID for foreign key cleanup
  const { data: targetProfile } = await adminClient
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  // Clean up referencing foreign keys to avoid PostgreSQL FK constraint violations
  if (targetProfile) {
    await Promise.allSettled([
      adminClient.from('fund_transactions').update({ created_by: null }).eq('created_by', targetProfile.id),
      adminClient.from('scholarships').update({ approved_by: null }).eq('approved_by', targetProfile.id),
      adminClient.from('clan_articles').update({ author_id: null }).eq('author_id', targetProfile.id),
      adminClient.from('member_registrations').update({ reviewed_by: null }).eq('reviewed_by', userId),
      adminClient.from('clan_documents').update({ uploaded_by: null }).eq('uploaded_by', userId),
      adminClient.from('clan_settings').update({ updated_by: null }).eq('updated_by', userId),
    ]);
  }

  // Attempt delete from Supabase Auth
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);

  if (deleteError) {
    // If Auth user delete fails or user doesn't exist in Auth, try deleting profile directly
    const { error: profileDeleteError } = await adminClient
      .from('profiles')
      .delete()
      .eq('user_id', userId);

    if (profileDeleteError && deleteError) {
      throw new Error(`Xóa tài khoản thất bại: ${deleteError.message || profileDeleteError.message}`);
    }
  }
}
