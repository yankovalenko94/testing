import { z } from "zod";

import type { RegistrationPayload } from "../../types/registration";

export const registrationSchema: z.ZodType<RegistrationPayload> = z
	.object({
		eventId: z.string().min(1, "ID мероприятия обязательно"),
		fullName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
		email: z.string().email("Некорректный формат email"),
		role: z.enum(["listener", "speaker", "vip"]).catch("listener"),
		companyName: z.string().optional(),
		wantsAfterparty: z.boolean(),
	})
	.superRefine((data, ctx) => {
		if (
			data.role === "speaker" &&
			(!data.companyName || data.companyName.trim() === "")
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Для спикеров необходимо указать компанию",
				path: ["companyName"],
			});
		}
	});
