import { useState, type FC } from "react";
import type {
	RegistrationPayload,
	RegistrationFormErrors,
} from "../../types/registration";
import { useSubmitRegistration } from "../../hooks/useSubmitRegistration";

import { registrationSchema } from "./registrationSchema";

const INITIAL_STATE: RegistrationPayload = {
	eventId: "conf-2026",
	fullName: "",
	email: "",
	role: "listener",
	wantsAfterparty: false,
	companyName: "",
};

export const RegistrationForm: FC = () => {
	const [formData, setFormData] = useState<RegistrationPayload>(INITIAL_STATE);
	const [formErrors, setFormErrors] = useState<RegistrationFormErrors>({});
	const { submit, isLoading, error: serverError } = useSubmitRegistration();
	const [successMsg, setSuccessMsg] = useState("");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value, type } = e.target;
		const val =
			type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

		setFormData((prev) => ({ ...prev, [name]: val }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormErrors({});
		setSuccessMsg("");

		const validationResult = registrationSchema.safeParse(formData);

		// console.log(validationResult);

		if (!validationResult.success) {
			const fieldErrors = validationResult.error.flatten().fieldErrors;
			const newErrors: RegistrationFormErrors = {};

			(Object.keys(fieldErrors) as Array<keyof RegistrationPayload>).forEach(
				(key) => {
					newErrors[key] = fieldErrors[key]?.[0];
				},
			);

			// console.log(newErrors);

			setFormErrors(newErrors);
			return;
		}

		const result = await submit(validationResult.data);

		if (result.success) {
			setSuccessMsg(`Ура! Заявка №${result.data?.id} успешно принята.`);
			setFormData(INITIAL_STATE);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-md p-4 mx-auto border rounded "
		>
			<h2>Регистрация на IT-конференцию</h2>

			{serverError && <div className="my-2 text-red-500">{serverError}</div>}
			{successMsg && <div className="my-2 text-green-500">{successMsg}</div>}

			<div className="mb-4">
				<label>ФИО *</label>
				<input
					name="fullName"
					value={formData.fullName}
					onChange={handleChange}
					required
					className="block w-full p-2 border"
				/>
				{formErrors.fullName && (
					<p className="text-red-500 mt-1">{formErrors.fullName}</p>
				)}
			</div>

			<div className="mb-4">
				<label>Email *</label>
				<input
					name="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
					required
					className="block w-full p-2 border"
				/>
				{formErrors.email && (
					<p className="text-red-500 mt-1">{formErrors.email}</p>
				)}
			</div>

			<div className="mb-4">
				<label>Роль</label>
				<select
					name="role"
					value={formData.role}
					onChange={handleChange}
					className="block w-full p-2 border"
				>
					<option value="listener">Слушатель</option>
					<option value="speaker">Докладчик</option>
					<option value="vip">VIP</option>
				</select>
			</div>

			{formData.role === "speaker" && (
				<div className="mb-4">
					<label>Компания (только для спикеров)</label>
					<input
						name="companyName"
						value={formData.companyName || ""}
						onChange={handleChange}
						className="block w-full p-2 border"
					/>
					{formErrors.companyName && (
						<p className="text-red-500 mt-1">{formErrors.companyName}</p>
					)}
				</div>
			)}

			<div className="mb-4">
				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						name="wantsAfterparty"
						checked={formData.wantsAfterparty}
						onChange={handleChange}
					/>
					Хочу на афтерпати
				</label>
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className="px-4 py-2 text-white bg-blue-500 rounded disabled:opacity-50"
			>
				{isLoading ? "Отправка..." : "Зарегистрироваться"}
			</button>
		</form>
	);
};
