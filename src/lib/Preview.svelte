<script lang="ts">
	import type { HTMLBaseAttributes } from 'svelte/elements';
	import { getFirstInnerText } from './utils/selection';
	import { deleteNote } from './utils/store';

	export let html: string;
	export let id: string;

	type $$Props = HTMLBaseAttributes & { html: string; id: string };

	function extractContent(html: string) {
		const node = new DOMParser().parseFromString(html, 'text/html').documentElement;
		return getFirstInnerText(node);
	}
</script>

<div
	{...$$restProps}
	on:click
	class={` flex w-96 max-w-[50vw] select-none items-center justify-between  bg-slate-50  shadow drop-shadow hover:cursor-pointer ${$$restProps.class}}`}
>
	<div class=" overflow-x-clip text-ellipsis whitespace-nowrap p-4 text-sm font-medium">
		{extractContent(html) ?? ''}
	</div>
	<a
		class="shrink-0"
		href="#"
		on:click={(e) => {
			e.preventDefault();
			e.stopPropagation();
			deleteNote(id);
		}}
		><img src="/delete_FILL0_wght400_GRAD0_opsz48.svg" alt="delete" class="h-6 text-slate-500" /></a
	>
</div>
