/**
 * @project AncestorTree
 * @file src/lib/supabase-data-registrations.ts
 * @description Data layer for member registration requests
 * @version 1.0.0
 * @updated 2026-03-09
 */

import { supabase } from './supabase';
import type { MemberRegistration, CreateRegistrationInput } from '@/types';
import { sendRegistrationEmailAction } from '@/app/(main)/admin/registrations/actions';
import { addPersonToParentFamily } from './supabase-data';

const ALLOWED_CREATE_FIELDS = [
  'full_name', 'gender', 'birth_year', 'birth_place',
  'phone', 'email', 'parent_name', 'generation', 'chi',
  'relationship', 'notes', 'honeypot', 'user_id',
] as const;

/**
 * Submit a public member registration (no auth required).
 * Returns the created registration or throws on error.
 */
export async function submitRegistration(input: CreateRegistrationInput): Promise<MemberRegistration> {
  // Anti-spam: honeypot must be empty
  if (input.honeypot) {
    // Silently "succeed" to not reveal the honeypot to bots
    return { id: 'blocked', status: 'pending', full_name: '', gender: 1, created_at: '' } as MemberRegistration;
  }

  // Mass-assignment protection (OWASP A04)
  const sanitized: Record<string, unknown> = {};
  for (const key of ALLOWED_CREATE_FIELDS) {
    if (key === 'honeypot') continue; // never persist honeypot
    if (input[key] !== undefined && input[key] !== null && input[key] !== '') {
      sanitized[key] = input[key];
    }
  }

  if (!sanitized.full_name || typeof sanitized.full_name !== 'string' || (sanitized.full_name as string).trim().length < 2) {
    throw new Error('Họ tên không hợp lệ');
  }

  sanitized.full_name = (sanitized.full_name as string).trim();

  // Auto-link user_id if current user is logged in or email matches existing user profile
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      sanitized.user_id = user.id;
    } else if (sanitized.email && typeof sanitized.email === 'string') {
      const cleanEmail = (sanitized.email as string).trim().toLowerCase();
      const { data: matchedProfile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', cleanEmail)
        .maybeSingle();
      if (matchedProfile?.user_id) {
        sanitized.user_id = matchedProfile.user_id;
      }
    }
  } catch (e) {
    console.warn('Could not auto-link user_id during registration submit:', e);
  }

  const { error } = await supabase
    .from('member_registrations')
    .insert(sanitized);

  if (error) throw error;
  return { id: 'submitted', status: 'pending', ...sanitized } as unknown as MemberRegistration;
}

/** Get all registrations (admin/editor only). */
export async function getRegistrations(status?: string): Promise<MemberRegistration[]> {
  // Auto-sync any existing approved registrations that haven't been created in `people` table
  syncApprovedRegistrationsToPeople().catch(err => {
    console.warn('Auto sync approved registrations warning:', err);
  });

  let query = supabase
    .from('member_registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/** Get pending registration count (for admin badge). */
export async function getPendingRegistrationCount(): Promise<number> {
  const { count, error } = await supabase
    .from('member_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (error) throw error;
  return count || 0;
}

/** Approve a registration. */
/** Auto-sync any approved registration that hasn't been created in `people` table yet */
export async function syncApprovedRegistrationsToPeople(): Promise<number> {
  const { data: approvedList, error } = await supabase
    .from('member_registrations')
    .select('*')
    .eq('status', 'approved')
    .is('person_id', null);

  if (error || !approvedList || approvedList.length === 0) return 0;

  let createdCount = 0;
  for (const reg of approvedList) {
    try {
      const slug = reg.full_name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      const handle = `${slug || 'person'}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;

      const nameParts = reg.full_name.trim().split(/\s+/);
      const surname = nameParts.length > 1 ? nameParts[0] : undefined;
      const firstName = nameParts.length > 0 ? nameParts[nameParts.length - 1] : reg.full_name;
      const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : undefined;

      const { data: newPerson, error: personErr } = await supabase
        .from('people')
        .insert({
          handle,
          display_name: reg.full_name.trim(),
          surname,
          middle_name: middleName,
          first_name: firstName,
          gender: reg.gender === 2 ? 2 : 1,
          generation: reg.generation || 1,
          chi: reg.chi || null,
          birth_year: reg.birth_year || null,
          birth_place: reg.birth_place || null,
          phone: reg.phone || null,
          email: reg.email || null,
          address: reg.birth_place || null,
          notes: reg.notes || null,
          is_living: true,
          is_patrilineal: true,
          privacy_level: 0,
        })
        .select()
        .single();

      if (!personErr && newPerson) {
        await supabase
          .from('member_registrations')
          .update({ person_id: newPerson.id })
          .eq('id', reg.id);
        createdCount++;

        // Auto-connect to parent family if parent_name exists
        if (reg.parent_name && reg.parent_name.trim()) {
          try {
            const cleanParent = reg.parent_name.trim();
            const { data: matched } = await supabase
              .from('people')
              .select('id, gender')
              .ilike('display_name', `%${cleanParent}%`)
              .limit(1);

            if (matched && matched.length > 0) {
              const parent = matched[0];
              const fatherId = parent.gender === 1 ? parent.id : null;
              const motherId = parent.gender === 2 ? parent.id : null;
              await addPersonToParentFamily(fatherId, motherId, newPerson.id);
            }
          } catch (e) {
            console.warn('Could not auto-connect parent on sync:', e);
          }
        }
      }
    } catch (err) {
      console.error('Failed to sync registration to person:', err);
    }
  }

  // Also repair existing approved registrations that have a person_id but no parent family in children table
  try {
    const { data: approvedWithPerson } = await supabase
      .from('member_registrations')
      .select('id, person_id, parent_name')
      .eq('status', 'approved')
      .not('person_id', 'is', null)
      .not('parent_name', 'is', null);

    if (approvedWithPerson && approvedWithPerson.length > 0) {
      for (const reg of approvedWithPerson) {
        if (!reg.person_id || !reg.parent_name || !reg.parent_name.trim()) continue;

        const { data: childEntries } = await supabase
          .from('children')
          .select('family_id')
          .eq('person_id', reg.person_id);

        if (!childEntries || childEntries.length === 0) {
          const cleanParent = reg.parent_name.trim();
          const { data: matched } = await supabase
            .from('people')
            .select('id, gender')
            .ilike('display_name', `%${cleanParent}%`)
            .limit(1);

          if (matched && matched.length > 0) {
            const parent = matched[0];
            const fatherId = parent.gender === 1 ? parent.id : null;
            const motherId = parent.gender === 2 ? parent.id : null;
            await addPersonToParentFamily(fatherId, motherId, reg.person_id);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not repair approved person family connections:', err);
  }

  return createdCount;
}

/** Approve a registration and automatically insert into `people` table if missing. */
export async function approveRegistration(
  id: string,
  personId?: string,
  fatherId?: string,
  motherId?: string
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Fetch the registration record
  const { data: reg, error: fetchErr } = await supabase
    .from('member_registrations')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchErr || !reg) throw fetchErr || new Error('Không tìm thấy đơn ghi danh');

  let targetPersonId = personId || reg.person_id;

  // Auto-create a new person record if not yet linked
  if (!targetPersonId) {
    const slug = reg.full_name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const handle = `${slug || 'person'}-${Date.now().toString(36)}`;

    const nameParts = reg.full_name.trim().split(/\s+/);
    const surname = nameParts.length > 1 ? nameParts[0] : undefined;
    const firstName = nameParts.length > 0 ? nameParts[nameParts.length - 1] : reg.full_name;
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : undefined;

    const { data: newPerson, error: personErr } = await supabase
      .from('people')
      .insert({
        handle,
        display_name: reg.full_name.trim(),
        surname,
        middle_name: middleName,
        first_name: firstName,
        gender: reg.gender === 2 ? 2 : 1,
        generation: reg.generation || 1,
        chi: reg.chi || null,
        birth_year: reg.birth_year || null,
        birth_place: reg.birth_place || null,
        phone: reg.phone || null,
        email: reg.email || null,
        address: reg.birth_place || null,
        notes: reg.notes || null,
        is_living: true,
        is_patrilineal: true,
        privacy_level: 0,
      })
      .select()
      .single();

    if (personErr) {
      console.error('Lỗi khi tự động tạo hồ sơ thành viên:', personErr);
      throw personErr;
    }

    targetPersonId = newPerson.id;
  }

  // Link to parent family if fatherId or motherId provided OR try smart matching by parent_name
  if (targetPersonId) {
    let finalFatherId = fatherId || null;
    let finalMotherId = motherId || null;

    if (!finalFatherId && !finalMotherId && reg.parent_name && reg.parent_name.trim()) {
      try {
        const cleanParentStr = reg.parent_name.trim();
        const { data: matched } = await supabase
          .from('people')
          .select('id, gender, display_name')
          .ilike('display_name', `%${cleanParentStr}%`)
          .limit(1);

        if (matched && matched.length > 0) {
          const parent = matched[0];
          if (parent.gender === 1) finalFatherId = parent.id;
          else if (parent.gender === 2) finalMotherId = parent.id;
        }
      } catch (err) {
        console.warn('Smart parent matching failed:', err);
      }
    }

    if (finalFatherId || finalMotherId) {
      try {
        await addPersonToParentFamily(finalFatherId, finalMotherId, targetPersonId);
      } catch (err) {
        console.warn('Could not add person to parent family:', err);
      }
    }
  }

  const { error } = await supabase
    .from('member_registrations')
    .update({
      status: 'approved',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      person_id: targetPersonId,
    })
    .eq('id', id);

  if (error) throw error;

  // Auto-send response notification & email via Server Action
  try {
    if (reg.email) {
      sendRegistrationEmailAction({
        type: 'approved',
        toEmail: reg.email,
        fullName: reg.full_name,
        personId: targetPersonId,
      }).catch(err => {
        console.warn('[Email Action] Failed to send approval email:', err);
      });
    }

    let userIdToNotify = reg.user_id;
    if (!userIdToNotify && reg.email) {
      const { data: matchedProfile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', reg.email.trim().toLowerCase())
        .maybeSingle();
      if (matchedProfile?.user_id) {
        userIdToNotify = matchedProfile.user_id;
      }
    }

    if (userIdToNotify) {
      await supabase.from('notifications').insert({
        user_id: userIdToNotify,
        type: 'registration_approved',
        title: '🎉 Đơn ghi danh đã được phê duyệt!',
        body: `Chúc mừng! Đơn ghi danh gia nhập dòng họ của bạn (${reg.full_name}) đã được Ban quản trị duyệt và đưa vào Cây Gia Phả.`,
        link: targetPersonId ? `/people/${targetPersonId}` : '/tree',
        actor_id: user.id,
        reference_id: id,
      });
    }
  } catch (e) {
    console.warn('Could not dispatch approval response notification:', e);
  }
}

/** Reject a registration with reason. */
export async function rejectRegistration(id: string, reason: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: reg } = await supabase
    .from('member_registrations')
    .select('*')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('member_registrations')
    .update({
      status: 'rejected',
      reject_reason: reason.trim(),
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;

  // Send rejection response notification & email via Server Action
  try {
    if (reg?.email) {
      sendRegistrationEmailAction({
        type: 'rejected',
        toEmail: reg.email,
        fullName: reg.full_name,
        reason: reason.trim(),
      }).catch(err => {
        console.warn('[Email Action] Failed to send rejection email:', err);
      });
    }

    let userIdToNotify = reg?.user_id;
    if (!userIdToNotify && reg?.email) {
      const { data: matchedProfile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', reg.email.trim().toLowerCase())
        .maybeSingle();
      if (matchedProfile?.user_id) {
        userIdToNotify = matchedProfile.user_id;
      }
    }

    if (userIdToNotify && reg) {
      await supabase.from('notifications').insert({
        user_id: userIdToNotify,
        type: 'system',
        title: 'Cập nhật đơn ghi danh gia phả',
        body: `Đơn ghi danh của bạn (${reg.full_name}) chưa được duyệt. Lý do: ${reason.trim()}`,
        link: '/register-member',
        actor_id: user.id,
        reference_id: id,
      });
    }
  } catch (e) {
    console.warn('Could not dispatch rejection response notification:', e);
  }
}

/** Delete a registration (admin only). */
export async function deleteRegistration(id: string): Promise<void> {
  const { error } = await supabase
    .from('member_registrations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
