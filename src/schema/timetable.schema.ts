import { z } from 'zod';

export const timetableSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  academic_session: z.string()
    .min(1, 'Academic session is required')
    .regex(
      /^\d{4}-\d{4}$/, 
      'Academic session must be in format YYYY-YYYY (e.g., 2023-2024)'
    )
    .refine(
      (val) => {
        const [startYear, endYear] = val.split('-').map(Number);
        return endYear === startYear + 1;
      },
      'End year must be exactly one year after start year'
    ),
  semester: z.enum(['first', 'second']),
  level: z.string().min(1, 'Level is required'),
  type: z.enum(['exam', 'lecture']),
  is_published: z.boolean()
})

export type TimetableFormData = z.infer<typeof timetableSchema>;