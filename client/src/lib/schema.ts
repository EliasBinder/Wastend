import { z } from 'zod';

export const registerSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(8),
		firstName: z.string().nonempty(),
		lastName: z.string().nonempty(),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match'
	});

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string()
});
