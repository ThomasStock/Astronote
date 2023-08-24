<script lang="ts">
	export let html: string;
</script>

<svg
	class="h-96 max-h-[20vh] w-48 max-w-[50vw] select-none overflow-hidden bg-slate-50 bg-gradient-to-b text-sm font-light shadow hover:cursor-pointer ${$$restProps.class}} m-4 p-2"
	on:click
>
	<foreignObject class="pointer-events-none h-[150%] w-[150%] scale-75">
		{@html html}
	</foreignObject>
</svg>
