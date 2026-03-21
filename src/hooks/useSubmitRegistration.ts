import { useState } from "react";
import { z } from "zod";
import type {
	RegistrationPayload,
	EventRegistration,
	ApiResponse,
} from "../types/registration";
import { sanitizeRegistrationData } from "../utils/sanitizeRegistrationData";

export const eventRegistrationSchema: z.ZodType<EventRegistration> = z.object({
	id: z.string().uuid(),
	eventId: z.string(),
	fullName: z.string(),
	email: z.string().email(),
	role: z.enum(["listener", "speaker", "vip"]),
	companyName: z.string().optional(),
	wantsAfterparty: z.boolean(),
	status: z.enum(["pending", "approved", "rejected"]),
	createdAt: z.string().datetime(), // Проверяем, что это валидная ISO-дата
});

export const apiResponseSchema: z.ZodType<ApiResponse<EventRegistration>> =
	z.object({
		success: z.boolean(),
		data: eventRegistrationSchema.optional(),
		error: z.string().optional(),
	});

export const useSubmitRegistration = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const submit = async (
		rawPayload: RegistrationPayload,
	): Promise<ApiResponse<EventRegistration>> => {
		setIsLoading(true);
		setError(null);

		const payload = sanitizeRegistrationData(rawPayload);

		try {
			const response = await fetch(
				"http://localhost:3001/api/events/register",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);

			if (!response.ok) {
				throw new Error("Ошибка при отправке");
			}

			const rawJson = await response.json();

			const parsedResponse = apiResponseSchema.safeParse(rawJson);

			if (!parsedResponse.success) {
				console.error("Ошибка контракта API:", parsedResponse.error.format());
				throw new Error(
					"Сервер вернул данные в неожиданном формате. Мы уже чиним!",
				);
			}

			console.log("С данными от сервера все в порядке:", parsedResponse.data);

			const validData = parsedResponse.data;

			return validData;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Неизвестная ошибка";
			setError(errorMessage);
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	};

	return { submit, isLoading, error };
};
