export type ParticipantRole = "listener" | "speaker" | "vip";
export type RegistrationStatus = "pending" | "approved" | "rejected";

export interface EventRegistration {
	id: string;
	eventId: string;
	fullName: string;
	email: string;
	companyName?: string;
	role: ParticipantRole;
	wantsAfterparty: boolean;
	status: RegistrationStatus;
	createdAt: string;
}

export type RegistrationPayload = Omit<
	EventRegistration,
	"id" | "status" | "createdAt"
>;

export type DraftRegistration = Partial<RegistrationPayload>;

export type RegistrationFormErrors = Partial<
	Record<keyof RegistrationPayload, string>
>;

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	success: boolean;
}
