import { getDb } from '@/lib/db';

export function recordNotification(input: { type: string; title: string; message: string; relatedId?: string | number }) {
  const db = getDb();
  db.prepare('INSERT INTO admin_notifications (type, title, message, related_id) VALUES (?, ?, ?, ?)').run(
    input.type,
    input.title.slice(0, 120),
    input.message.slice(0, 400),
    input.relatedId == null ? null : String(input.relatedId),
  );
}
