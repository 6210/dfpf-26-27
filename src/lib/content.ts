import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Role = CollectionEntry<'roles'>;

const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** Formats "2017" as "2017" and "2017-10" as "Oct 2017". */
export function formatYearMonth(value: string): string {
  if (value.length === 4) return value;
  return monthFormat.format(new Date(`${value}-01T00:00:00Z`));
}

/** Roles with the current (no end date) and most recent first. */
export async function getRoles(): Promise<Role[]> {
  const roles = await getCollection('roles');
  return roles.sort((a, b) => (b.data.end ?? '9999').localeCompare(a.data.end ?? '9999') || b.data.start.localeCompare(a.data.start));
}

export async function getProfile() {
  const entry = await getEntry('profile', 'profile');
  if (!entry) throw new Error('src/content/profile.json must contain an entry with id "profile".');
  return entry.data;
}

export interface PlatformUsage {
  name: string;
  uses: { area: string; role: string }[];
}

/** Every platform across all roles, with the areas that use it, in the order they first appear in the content. */
export async function getPlatforms(): Promise<PlatformUsage[]> {
  const platforms = new Map<string, PlatformUsage>();
  for (const role of await getRoles()) {
    for (const area of role.data.areas) {
      for (const name of area.platforms) {
        const usage = platforms.get(name) ?? { name, uses: [] };
        usage.uses.push({ area: area.title, role: `${role.data.title}, ${role.data.company}` });
        platforms.set(name, usage);
      }
    }
  }
  return [...platforms.values()];
}
