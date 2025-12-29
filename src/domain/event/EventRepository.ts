import type { Event } from './Event';

// Output port - defines what operations the domain needs
export interface EventRepository {
  findBySlug(slug: string): Promise<Event | null>;
}

