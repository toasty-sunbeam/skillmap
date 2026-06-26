const API_URL = 'https://api.iconify.design/search';
const MIN_LIMIT = 32;
const MAX_LIMIT = 999;
const DEFAULT_LIMIT = 64;

export interface SearchIconsOptions {
	query: string;
	prefixes?: string[];
	limit?: number;
	start?: number;
	signal?: AbortSignal;
}

export interface IconifySearchResult {
	icons: string[];
	total: number;
	limit: number;
	start: number;
}

export class IconifySearchError extends Error {
	constructor(
		message: string,
		readonly status?: number
	) {
		super(message);
		this.name = 'IconifySearchError';
	}
}

const EMPTY_RESULT: IconifySearchResult = {
	icons: [],
	total: 0,
	limit: DEFAULT_LIMIT,
	start: 0
};

function clampLimit(limit: number): number {
	return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, limit));
}

export async function searchIcons(options: SearchIconsOptions): Promise<IconifySearchResult> {
	const query = options.query.trim();
	if (!query) {
		return EMPTY_RESULT;
	}

	const limit = clampLimit(options.limit ?? DEFAULT_LIMIT);
	const start = Math.max(0, options.start ?? 0);

	const params = new URLSearchParams({
		query,
		limit: String(limit),
		start: String(start)
	});

	if (options.prefixes?.length) {
		params.set('prefixes', options.prefixes.join(','));
	}

	const response = await fetch(`${API_URL}?${params}`, { signal: options.signal });

	if (!response.ok) {
		throw new IconifySearchError(`Icon search failed (${response.status})`, response.status);
	}

	const data = (await response.json()) as IconifySearchResult;

	return {
		icons: data.icons ?? [],
		total: data.total ?? 0,
		limit: data.limit ?? limit,
		start: data.start ?? start
	};
}
