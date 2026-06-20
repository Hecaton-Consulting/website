import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    banner: z.object({
      tagline: z.string(),
      subhead: z.string(),
      primary_cta: z.object({
        label: z.string(),
        link: z.string(),
      }),
      secondary_cta: z.object({
        label: z.string(),
        link: z.string(),
      }),
    }),
    proof_strip: z.object({
      heading: z.string(),
      disclaimer: z.string(),
      metrics: z.array(
        z.object({
          metric: z.string(),
          context: z.string(),
        }),
      ),
    }),
    engagement_teasers: z.object({
      heading: z.string(),
      intro: z.string().optional(),
      shapes: z.array(
        z.object({
          slug: z.string(),
          title: z.string(),
          premise: z.string(),
          link: z.string().default("/engagements/"),
        }),
      ),
    }),
    about_teaser: z.object({
      heading: z.string(),
      intro: z.string(),
      portrait: z.string(),
      credentials: z.array(z.string()),
      principal_line: z.string(),
      cta_label: z.string().default("More about Jaime"),
      cta_link: z.string().default("/about/"),
    }),
    final_cta: z.object({
      heading: z.string(),
      sub: z.string(),
      button_label: z.string(),
      button_link: z.string(),
    }),
  }),
});

const engagementsCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/engagements" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    intro: z.string(),
    capacity_note: z.string(),
    shapes: z.array(
      z.object({
        slug: z.string(),
        title: z.string(),
        premise: z.string(),
        best_for: z.string(),
        scope: z.array(z.string()),
        duration: z.string(),
        outcome: z.string(),
        cta: z.object({
          label: z.string().default("Book a call"),
          link: z.string().default("/contact/"),
        }),
      }),
    ),
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),
  }),
});

const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    portrait: z.string(),
    intro: z.string(),
    credentials_strip: z.array(z.string()),
    career_narrative: z.array(z.string()),
    track_record: z.array(
      z.object({
        metric: z.string(),
        role: z.string(),
        employer_shape: z.string(),
      }),
    ),
    how_i_work: z.array(z.string()),
    writing_links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        }),
      )
      .default([]),
    final_cta: z.object({
      heading: z.string(),
      button_label: z.string(),
      button_link: z.string(),
    }),
  }),
});

const contactCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heading: z.string(),
    sub: z.string(),
    cal_event_url: z.string(),
    cal_link_label: z.string(),
    form_heading: z.string(),
    form_intro: z.string(),
    email_line: z.string(),
  }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  homepage: homepageCollection,
  engagements: engagementsCollection,
  about: aboutCollection,
  contact: contactCollection,
  pages: pagesCollection,
};
