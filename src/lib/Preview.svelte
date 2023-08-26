<script lang="ts">
	import type { HTMLBaseAttributes } from 'svelte/elements';
	import { getFirstInnerText } from './utils/selection';

	export let html: string;

	type $$Props = HTMLBaseAttributes & { html: string };

	function extractContent(html: string) {
		const node = new DOMParser().parseFromString(html, 'text/html').documentElement;
		console.log(node);
		return getFirstInnerText(node);
	}
</script>

<div
	{...$$restProps}
	on:click
	class={`w-96 max-w-[50vw] select-none overflow-x-clip text-ellipsis whitespace-nowrap bg-slate-50  text-sm font-medium  shadow drop-shadow hover:cursor-pointer ${$$restProps.class}} p-4`}
>
	{extractContent(html) ?? ''}
</div>
