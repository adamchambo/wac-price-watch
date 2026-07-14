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
		throw new Error(`API request failed with status ${response.status}`);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json() as Promise<T>;
}
