import { supabase } from './client';
import type { Event, EventSection, EventTheme } from '../../domain/event/Event';
import type { EventRepository } from '../../domain/event/EventRepository';

interface EventRow {
  id: string;
  slug: string;
  type: string;
  title: string;
  subtitle: string | null;
  event_date: string;
  theme: EventTheme;
  cover_image_url: string | null;
  sections: EventSection[];
  drive_script_url: string | null;
  drive_folder_id: string | null;
  is_active: boolean;
}

function mapRowToEvent(row: EventRow): Event {
  return {
    id: row.id,
    slug: row.slug,
    type: row.type as Event['type'],
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    event_date: new Date(row.event_date),
    theme: row.theme,
    cover_image_url: row.cover_image_url ?? undefined,
    sections: row.sections,
    drive_script_url: row.drive_script_url ?? undefined,
    drive_folder_id: row.drive_folder_id ?? undefined,
    is_active: row.is_active,
  };
}

export function createSupabaseEventRepository(): EventRepository {
  return {
    async findBySlug(slug: string): Promise<Event | null> {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error getting event:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return mapRowToEvent(data as EventRow);
    },
  };
}

