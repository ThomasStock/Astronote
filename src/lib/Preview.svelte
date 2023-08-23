<script lang="ts">
	import type { HTMLBaseAttributes } from 'svelte/elements';

	type $$Props = HTMLBaseAttributes;
</script>

<div
	{...$$restProps}
	class={`w-24 max-w-[1/3vw] text-ellipsis text-left text-xs font-thin ${$$restProps.class}}`}
>
	<slot />
</div>
