import type { RegistrationPayload } from "./registration";

export type SanitizePayloadFn = (
	payload: RegistrationPayload,
) => RegistrationPayload;
