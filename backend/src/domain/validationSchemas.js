const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email('A valid email address is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  role: z.enum(['ADMIN', 'QA_LEAD', 'VIEWER']).optional(),
});

const loginSchema = z.object({
  email: z.string().email('A valid email address is required.'),
  password: z.string().min(1, 'Password is required.'),
});

// Shape of a single parsed row from an uploaded Excel file, before saving.
const parsedRowSchema = z.object({
  Test_ID: z.union([z.string(), z.number()]).optional(),
  Test_Name: z.union([z.string(), z.number()]).optional(),
  Error_Log: z.union([z.string(), z.number()]).optional(),
});

module.exports = { registerSchema, loginSchema, parsedRowSchema };