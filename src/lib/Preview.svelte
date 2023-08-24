<script lang="ts">
	import type { HTMLBaseAttributes } from 'svelte/elements';

	export let html: string;

	type $$Props = HTMLBaseAttributes & { html: string };

	function extractContent(html: string) {
		return new DOMParser().parseFromString(html, 'text/html').documentElement.textContent;
	}
</script>

<span
	{...$$restProps}
	class={`h-96 max-h-[20vh] w-96 max-w-[50vw] overflow-hidden bg-slate-50 text-sm font-light drop-shadow ${$$restProps.class}} m-4 p-2`}
>
	{extractContent(html)}
</span>
