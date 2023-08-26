<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface $$Props extends HTMLButtonAttributes {
		color: 'purple' | 'yellow' | 'red';
	}

	export let color: 'purple' | 'yellow' | 'red';

	let colorStyles = '';
	switch (color) {
		case 'purple':
			colorStyles = 'outline-purple-200 hover:outline-purple-400 text-purple-500';
			break;
		case 'yellow':
			colorStyles = 'outline-yellow-200 hover:outline-yellow-400 text-yellow-500';
			break;
		case 'red':
			colorStyles = 'outline-red-300 hover:outline-red-400 text-red-500';
			break;
	}
</script>

<button
	{...$$restProps}
	on:click
	type="button"
	class={`rounded-lg bg-gradient-to-r px-3 py-2.5 text-center text-sm font-medium outline hover:bg-gradient-to-br ${colorStyles} ${$$props.class} `}
	><slot /></button
>
