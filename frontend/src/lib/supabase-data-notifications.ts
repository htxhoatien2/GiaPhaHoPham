/**
 * @project AncestorTree
 * @file src/lib/supabase-data-notifications.ts
 * @description Data layer for in-app notifications
 * @version 1.0.0
 * @updated 2026-03-09
 */

import { supabase } from './supabase';
import type { Notification } from '@/types';

export async function getNotifications(limit = 50): Promise<Notification[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getUnreadCount(): Promise<number> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  if (error) throw error;
  return count || 0;
}

export async function markAsRead(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

export async function markAllAsRead(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  if (error) throw error;
}

export async function deleteNotification(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

export interface CreateNotificationInput {
  user_id?: string;
  type: Notification['type'];
  title: string;
  body?: string | null;
  link?: string | null;
  actor_id?: string | null;
  reference_id?: string | null;
}

export async function createNotification(input: CreateNotificationInput): Promise<Notification | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && !input.user_id) return null;

  const targetUserId = input.user_id || user?.id;
  if (!targetUserId) return null;

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: targetUserId,
      type: input.type,
      title: input.title,
      body: input.body || null,
      link: input.link || null,
      actor_id: input.actor_id || user?.id || null,
      reference_id: input.reference_id || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
  return data;
}

/**
 * Helper to dispatch member page update notifications
 */
export async function notifyMemberUpdate(
  action: 'create' | 'update' | 'delete',
  personName: string,
  personId: string
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  let type: Notification['type'] = 'member_updated';
  let title = 'Cập nhật thành viên';
  let body = `Thông tin thành viên ${personName} đã được cập nhật.`;
  let link = `/people/${personId}`;

  if (action === 'create') {
    type = 'new_member';
    title = 'Thành viên mới';
    body = `Thành viên mới ${personName} đã được thêm vào gia phả.`;
  } else if (action === 'delete') {
    type = 'member_deleted';
    title = 'Xóa thành viên';
    body = `Thành viên ${personName} đã được xóa khỏi gia phả.`;
    link = '/people';
  }

  // DB triggers auto-broadcast on PostgreSQL/SQLite.
  // This helper can be called if explicit client-side notification dispatch is required.
  if (user) {
    try {
      await createNotification({
        user_id: user.id,
        type,
        title,
        body,
        link,
        actor_id: user.id,
        reference_id: personId,
      });
    } catch (err) {
      console.warn('DB trigger handles notification dispatch, fallback note:', err);
    }
  }
}

