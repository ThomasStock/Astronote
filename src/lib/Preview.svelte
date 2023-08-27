<script lang="ts">
	import type { HTMLBaseAttributes } from 'svelte/elements';
	import { getFirstInnerText } from './utils/selection';
	import { deleteNote } from './utils/store';
	import Icon from './icons/Icon.svelte';

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
	class={`group flex items-center justify-between bg-slate-50  shadow  drop-shadow transition-shadow hover:cursor-pointer hover:shadow-xl ${$$restProps.class}}`}
>
	<div class="flex flex-col gap-4 overflow-x-clip p-6">
		<span
			class="block select-none overflow-x-clip text-ellipsis whitespace-nowrap text-sm font-medium"
			>{extractContent(html) ?? ''}</span
		>

		<!-- <span class="self-start text-xs text-slate-400 hover:text-slate-600">/{id}</span> -->
	</div>
	<a
		class=""
		href="#"
		on:click={(e) => {
			e.preventDefault();
			e.stopPropagation();
			deleteNote(id);
		}}
		><Icon
			class="opacity-inactive group-hover:opacity-unfocused group-hover:hover:opacity-focused focus:opacity-focused mr-2 text-2xl"
			name="delete"
		/></a
	>
</div>
