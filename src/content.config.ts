import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Year ("2017") or year and month ("2017-10").
const yearMonth = z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/);

const accent = z.enum(['operations', 'campaigns', 'automation', 'analytics', 'seo', 'documentation']);

const roles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/roles' }),
  schema: z.object({
    title: z.string(),
    department: z.string().optional(),
    company: z.string(),
    companyNote: z.string().optional(),
    start: yearMonth,
    // Leave out for the current role.
    end: yearMonth.optional(),
    summary: z.string(),
    areas: z
      .array(
        z.object({
          title: z.string(),
          accent: accent.optional(),
          summary: z.string(),
          platforms: z.array(z.string()).default([]),
        }),
      )
      .default([]),
  }),
});

const profile = defineCollection({
  loader: file('./src/content/profile.json'),
  schema: z.object({
    name: z.string(),
    headline: z.string(),
    summary: z.string(),
    focusAreas: z.array(z.string()),
    // Path to a CV file in public/, for example "/cv/cv.pdf". Leave out until the file exists.
    cv: z
      .object({
        href: z.string().regex(/^\/.+\.(pdf|docx)$/),
        label: z.string(),
      })
      .optional(),
  }),
});

export const collections = { roles, profile };
