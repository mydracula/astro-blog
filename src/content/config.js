import {
  z,
  defineCollection
} from 'astro:content';

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string().nonempty(),
    date: z.date(),
    abbrlink: z.number()
  }).merge(z.object({
    [z.string()]: z.unknown()
  })),
});


export const collections = {
  'blog': blogCollection,
};