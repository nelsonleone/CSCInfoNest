import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  date_time: z.string().min(1, 'Date and time is required'),
  location: z.string().min(1, 'Location is required').max(200, 'Location must be less than 200 characters'),
  category: z.string().optional(),
  is_published: z.boolean()
})

export type EventFormData = z.infer<typeof eventSchema>;