/**
 * @project AncestorTree
 * @file src/app/(auth)/register/actions.ts
 * @description Server action for robust user registration.
 *              Uses Server-Side Supabase client with admin fallback.
 * @version 1.0.0
 * @updated 2026-03-26
 */

'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createServiceRoleClient } from '@/lib/supabase';

export async function registerUserAction(input: {
  email: string;
  password: string;
  fullName: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { email, password, fullName } = input;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (fullName || '').trim();

    if (!cleanEmail || !password || !cleanName) {
      return { success: false, error: 'Vui lòng điền đầy đủ thông tin đăng ký' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' };
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

    // 1. Attempt standard signup via Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: cleanName },
      },
    });

    if (!signUpError && signUpData.user) {
      return { success: true };
    }

    // 2. Fallback: If standard signup fails (e.g. SMTP rate limit / email sending error)
    // and SUPABASE_SERVICE_ROLE_KEY is present, use admin.createUser
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey) {
      const adminClient = createServiceRoleClient();
      const { data: adminData, error: adminError } = await adminClient.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: true,
        user_metadata: { full_name: cleanName },
      });

      if (!adminError && adminData.user) {
        // Ensure profile row is created
        await adminClient.from('profiles').upsert(
          {
            user_id: adminData.user.id,
            email: cleanEmail,
            full_name: cleanName,
            role: 'viewer',
            is_verified: false,
          },
          { onConflict: 'user_id' },
        );

        // Dispatch notification to admins/editors
        const { data: adminProfiles } = await adminClient
          .from('profiles')
          .select('user_id')
          .in('role', ['admin', 'editor']);

        if (adminProfiles && adminProfiles.length > 0) {
          const notificationsToInsert = adminProfiles
            .filter(p => p.user_id && p.user_id !== adminData.user.id)
            .map(p => ({
              user_id: p.user_id,
              type: 'account_verified',
              title: 'Tài khoản đăng ký mới',
              body: `${cleanName} (${cleanEmail}) vừa đăng ký tài khoản mới trên hệ thống.`,
              link: '/admin/users',
              actor_id: adminData.user.id,
              reference_id: adminData.user.id,
            }));
          if (notificationsToInsert.length > 0) {
            await adminClient.from('notifications').insert(notificationsToInsert);
          }
        }

        return { success: true };
      }

      if (adminError) {
        return { success: false, error: adminError.message };
      }
    }

    if (signUpError) {
      return { success: false, error: signUpError.message || 'Đăng ký thất bại' };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Lỗi hệ thống khi đăng ký',
    };
  }
}
