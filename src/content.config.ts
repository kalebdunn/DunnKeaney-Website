import { defineCollection, z } from 'astro:content';

const newsletter = defineCollection({
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        excerpt: z.string(),
        draft: z.boolean().optional().default(false)
    })
});

export const collections = {
    newsletter
};
