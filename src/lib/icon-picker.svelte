<script lang="ts">
	import Icon from '@iconify/svelte';
	import { browser } from '$app/environment';
	import { IconifySearchError, searchIcons } from './iconify-search.js';

	const DEBOUNCE_MS = 300;

	let {
		value,
		prefixes,
		pageSize = 64,
		onselect
	}: {
		value?: string;
		prefixes?: string[];
		pageSize?: number;
		onselect?: (icon: string) => void;
	} = $props();

	let query = $state('');
	let debouncedQuery = $state('');
	let icons = $state<string[]>([]);
	let total = $state(0);
	let page = $state(0);
	let loading = $state(false);
	let error = $state('');

	const effectivePageSize = $derived(Math.max(32, pageSize));
	const pageCount = $derived(Math.max(1, Math.ceil(total / effectivePageSize)));
	const showPagination = $derived(total > effectivePageSize);

	$effect(() => {
		const currentQuery = query;
		const timeout = setTimeout(() => {
			debouncedQuery = currentQuery;
		}, DEBOUNCE_MS);

		return () => clearTimeout(timeout);
	});

	$effect(() => {
		query;
		prefixes?.join(',');
		page = 0;
	});

	$effect(() => {
		debouncedQuery;
		prefixes?.join(',');
		page;
		effectivePageSize;

		if (!browser) {
			return;
		}

		const trimmed = debouncedQuery.trim();
		if (!trimmed) {
			icons = [];
			total = 0;
			loading = false;
			error = '';
			return;
		}

		const controller = new AbortController();
		loading = true;
		error = '';

		searchIcons({
			query: trimmed,
			prefixes,
			limit: effectivePageSize,
			start: page * effectivePageSize,
			signal: controller.signal
		})
			.then((result) => {
				icons = result.icons;
				total = result.total;
			})
			.catch((err: unknown) => {
				if (err instanceof DOMException && err.name === 'AbortError') {
					return;
				}

				error =
					err instanceof IconifySearchError
						? err.message
						: 'Icon search failed';
				icons = [];
				total = 0;
			})
			.finally(() => {
				if (!controller.signal.aborted) {
					loading = false;
				}
			});

		return () => controller.abort();
	});

	function goToPage(nextPage: number) {
		page = Math.min(Math.max(0, nextPage), pageCount - 1);
	}
</script>

<div class="flex w-64 flex-col gap-2">
	<input
		type="search"
		bind:value={query}
		placeholder="Search icons…"
		class="rounded border bg-transparent px-2 py-1"
	/>

	<div class="min-h-32">
		{#if !debouncedQuery.trim()}
			<p class="text-sm text-gray-500">Type to search icons</p>
		{:else if loading}
			<p class="text-sm text-gray-500">Searching…</p>
		{:else if error}
			<p class="text-sm text-red-600">{error}</p>
		{:else if icons.length === 0}
			<p class="text-sm text-gray-500">No icons found</p>
		{:else}
			<div class="grid grid-cols-6 gap-1">
				{#each icons as iconId (iconId)}
					<button
						type="button"
						title={iconId}
						onclick={() => onselect?.(iconId)}
						class={[
							'flex items-center justify-center rounded border p-1',
							iconId === value ? 'border-gray-900 ring-2 ring-gray-900' : 'border-gray-300'
						]}
					>
						<Icon icon={iconId} />
					</button>
				{/each}
			</div>
		{/if}
	</div>

	{#if showPagination && !loading && !error}
		<div class="flex items-center justify-between text-sm">
			<button
				type="button"
				disabled={page === 0}
				onclick={() => goToPage(page - 1)}
				class="rounded border px-2 py-1 disabled:opacity-40"
			>
				Previous
			</button>
			<span>{page + 1} / {pageCount}</span>
			<button
				type="button"
				disabled={page >= pageCount - 1}
				onclick={() => goToPage(page + 1)}
				class="rounded border px-2 py-1 disabled:opacity-40"
			>
				Next
			</button>
		</div>
	{/if}
</div>
