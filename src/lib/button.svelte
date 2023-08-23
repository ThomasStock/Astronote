<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface $$Props extends HTMLButtonAttributes {
		color: 'purple' | 'yellow' | 'red';
	}

	export let color: 'purple' | 'yellow' | 'red';

	let colorStyles = '';
	switch (color) {
		case 'purple':
			colorStyles = 'from-purple-500 via-purple-600 to-purple-700';
			break;
		case 'yellow':
			colorStyles = 'from-yellow-500 via-yellow-600 to-yellow-700';
			break;
		case 'red':
			colorStyles = 'from-red-500 via-red-600 to-red-700';
			break;
	}
</script>

<button
	{...$$props}
	type="button"
	class={`mb-2 mr-2 rounded-lg bg-gradient-to-r px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none ${colorStyles} ${$$props.class} `}
	><slot /></button
>
