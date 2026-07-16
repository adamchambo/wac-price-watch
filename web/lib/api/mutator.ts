const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5204";

export async function apiMutator<T>(
	url: string,
	options?: RequestInit,
): Promise<T> {
	const requestUrl = new URL(url, API_BASE_URL);

	const response = await fetch(requestUrl, {
		...options,
		credentials: "include",
		headers: {
			Accept: "application/json",
			...options?.headers,
		},
	});

	if (!response.ok) {
		const errorBody = await response.text();
		throw new Error(getApiErrorMessage(response.status, errorBody));
	}

	if (response.status === 204) {
		return undefined as T;
	}

	const body = await response.text();

	if (!body) {
		return undefined as T;
	}

	return JSON.parse(body) as T;
}

function getApiErrorMessage(status: number, body: string) {
	if (!body) return `API request failed with status ${status}`;

	try {
		const parsedBody = JSON.parse(body) as {
			detail?: string;
			title?: string;
			errors?: Record<string, string[]>;
		};
		const validationMessages = parsedBody.errors
			? Object.values(parsedBody.errors).flat()
			: [];

		if (validationMessages.length > 0) {
			return validationMessages.join(" ");
		}

		return parsedBody.detail ?? parsedBody.title ?? `API request failed with status ${status}`;
	} catch {
		return body;
	}
}
