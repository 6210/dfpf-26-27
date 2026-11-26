import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { accents } from './lib/area-icons';

// Year ("2017") or year and month ("2017-10").
const yearMonth = z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/);

const accent = z.enum(accents);

const roles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/roles' }),
  schema: z.object({
    title: z.string(),
    department: z.string().optional(),
    company: z.string(),
    companyNote: z.string().optional(),
    // When the company joined another one: its earlier name, and when it became `company`.
    merger: z.object({ from: z.string(), on: yearMonth }).optional(),
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
    /** The home page h1. */
    title: z.string(),
    headline: z.string(),
    summary: z.string(),
    focusAreas: z.array(z.string()),
    // Published in "Get in touch" on every page; the built HTML only holds an encoded copy.
    contact: z.object({
      email: z.email(),
      // International format with spaces, for example "+27 66 272 3763".
      phone: z.string().regex(/^\+\d[\d ]+\d$/),
    }),
    // Versions of the CV, listed on the Downloads page. Each path is in public/; a version shows
    // "Coming soon" until its file exists.
    cv: z
      .array(
        z.object({
          href: z.string().regex(/^\/cv\/.+\.(pdf|docx)$/),
          label: z.string(),
        }),
      )
      .default([]),
  }),
});

// Shown by the Recommendations component. Entries marked as placeholders are labelled on the page.
const recommendations = defineCollection({
  loader: file('./src/content/recommendations.json'),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    company: z.string().optional(),
    relationship: z.string().optional(),
    quote: z.string(),
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { roles, profile, recommendations };
