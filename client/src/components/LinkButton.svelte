<script lang="ts">
	import type { MouseEventHandler } from 'svelte/elements';
	import { type View, getUrlForView } from 'store/view';

	export let hidden = false;
	export let view: View | undefined = undefined;
	export let href: string | undefined = undefined;
	export let onClick: MouseEventHandler<HTMLAnchorElement> | undefined = undefined;
	export let icon: string;
</script>

<a
	aria-label={icon}
	href={view ? $getUrlForView(view) : href ?? '#'}
	on:click={(e) => {
		const openInNewTab = e.metaKey || e.ctrlKey;
		if (onClick && !openInNewTab) {
			onClick(e);
			e.preventDefault();
		}
	}}
	class={`mr-2 flex h-12 w-12 items-center justify-center rounded-full text-white shadow ${
		$$props.class
	} ${hidden ? 'invisible -z-10' : undefined}`}
	><span class="material-symbols-rounded text-2xl">{icon}</span></a
>
