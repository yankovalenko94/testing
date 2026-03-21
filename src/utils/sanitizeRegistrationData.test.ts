import { describe, it, expect } from "vitest";
import { sanitizeRegistrationData } from "./sanitizeRegistrationData";
import type { RegistrationPayload } from "../types/registration";

describe("sanitizeRegistrationData", () => {
	const basePayload: RegistrationPayload = {
		fullName: "  John Doe  ",
		email: "  USER@Example.COM  ",
		role: "listener",
		wantsAfterparty: false,
		eventId: "event123",
	};

	it("trims fullName and email, lowercases email", () => {
		const sanitized = sanitizeRegistrationData(basePayload);
		expect(sanitized.fullName).toBe("John Doe");
		expect(sanitized.email).toBe("user@example.com");
	});

	it("sets companyName when role is speaker and trims value", () => {
		const payload: RegistrationPayload = {
			...basePayload,
			role: "speaker",
			companyName: "  Acme Corp  ",
		};
		const sanitized = sanitizeRegistrationData(payload);
		expect(sanitized.companyName).toBe("Acme Corp");
	});

	it("returns undefined companyName when role is not speaker", () => {
		const payload: RegistrationPayload = {
			...basePayload,
			role: "listener",
			companyName: "  Acme Corp  ",
		};
		const sanitized = sanitizeRegistrationData(payload);
		expect(sanitized.companyName).toBeUndefined();
	});

	it("preserves other fields unchanged", () => {
		const payload: RegistrationPayload = {
			...basePayload,
			wantsAfterparty: true,
			role: "vip",
		};
		const sanitized = sanitizeRegistrationData(payload);
		expect(sanitized.wantsAfterparty).toBe(true);
		expect(sanitized.role).toBe("vip");
	});
});
