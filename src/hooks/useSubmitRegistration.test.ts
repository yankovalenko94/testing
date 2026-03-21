import {
	describe,
	it,
	expect,
	vi,
	beforeEach,
	afterEach,
	type Mock,
} from "vitest";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { render, act } from "@testing-library/react";
import { useSubmitRegistration } from "./useSubmitRegistration";
import type {
	RegistrationPayload,
	EventRegistration,
	ApiResponse,
} from "../types/registration";

// helper to capture the submit function from hook
let submitFn: (
	p: RegistrationPayload,
) => Promise<ApiResponse<EventRegistration>>;
// eslint-disable-next-line
let lastError: string | null;
// eslint-disable-next-line
let lastLoading = false;

function HookAccessor() {
	const { submit, isLoading, error } = useSubmitRegistration();
	useEffect(() => {
		submitFn = submit;
		lastError = error;
		lastLoading = isLoading;
	});
	return null;
}

describe("useSubmitRegistration hook integration", () => {
	const validPayload: RegistrationPayload = {
		fullName: "Alice",
		email: "alice@example.com",
		role: "listener",
		wantsAfterparty: false,
		eventId: "event-1",
	};

	beforeEach(() => {
		// reset fetch mock before each test
		globalThis.fetch = vi.fn() as unknown as typeof fetch;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("handles successful submission and returns parsed data", async () => {
		const fakeResponse: ApiResponse<EventRegistration> = {
			success: true,
			data: {
				id: "00000000-0000-0000-0000-000000000000",
				eventId: "event-1",
				fullName: "Alice",
				email: "alice@example.com",
				role: "listener",
				wantsAfterparty: false,
				status: "pending",
				createdAt: new Date().toISOString(),
			},
		};

		(globalThis.fetch as unknown as Mock).mockResolvedValue({
			ok: true,
			json: async () => fakeResponse,
		});

		render(_jsx(HookAccessor, {}));
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let result: any;
		await act(async () => {
			result = await submitFn(validPayload);
		});

		expect(result).toEqual(fakeResponse);
	});

	it("returns error object when API contract fails schema validation", async () => {
		const badResponse = { success: true, data: { foo: "bar" } };

		(globalThis.fetch as unknown as Mock).mockResolvedValue({
			ok: true,
			json: async () => badResponse,
		});

		render(_jsx(HookAccessor, {}));

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let result: any;
		await act(async () => {
			result = await submitFn(validPayload);
		});

		expect(result.success).toBe(false);
		expect(result.error).toContain("неожиданном формате");
	});

	it("returns error object when network request fails", async () => {
		(globalThis.fetch as unknown as Mock).mockRejectedValue(
			new Error("network"),
		);

		render(_jsx(HookAccessor, {}));
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let result: any;
		await act(async () => {
			result = await submitFn(validPayload);
		});

		expect(result.success).toBe(false);
		expect(result.error).toBe("network");
	});
});
