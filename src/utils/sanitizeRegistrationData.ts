import type { SanitizePayloadFn } from "../types/registrationUtils";

export const sanitizeRegistrationData: SanitizePayloadFn = (payload) => {
	return {
		...payload,
		fullName: payload.fullName.trim(),
		email: payload.email.trim().toLowerCase(),
		companyName:
			payload.role === "speaker" ? payload.companyName?.trim() : undefined,
	};
};
