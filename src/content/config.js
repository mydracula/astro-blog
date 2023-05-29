import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  schema: z
    .object({
      title: z.string().nonempty(),
      date: z.date(),
      abbrlink: z.number(),
      category: z.array(z.string()).default([])
    })
    .merge(
      z.object({
        [z.string()]: z.unknown()
      })
    )
})

export const collections = {
  posts
}
