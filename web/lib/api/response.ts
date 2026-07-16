export function unwrapApiData<T>(response: T | { data: T }): T {
	if (
		response &&
		typeof response === "object" &&
		"data" in response &&
		(response as { data?: unknown }).data !== undefined
	) {
		return (response as { data: T }).data;
	}

	return response as T;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
	return error instanceof Error ? error.message : fallback;
}
