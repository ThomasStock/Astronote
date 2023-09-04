<script lang="ts">
	import { onMount } from 'svelte';

	let viewportProp = window.visualViewport;
	let height = viewportProp?.height;
	let rand: any;
	function viewportHandler(event: Event) {
		// var vp = event.target as VisualViewport;
		console.log('handling', viewportProp?.height.toString());
		height = viewportProp?.height;
	}

	onMount(() => {
		window.visualViewport?.addEventListener('scroll', viewportHandler);
		window.visualViewport?.addEventListener('resize', viewportHandler);

		setInterval(() => {
			const newViewport = viewportProp?.height.toString();
			console.log('new:', newViewport, 'old:', height);
			height = viewportProp?.height;
			rand = Math.random();
		}, 500);
	});
</script>

<div class="fixed left-0 top-0">
	{height}
	<div class="opacity-0">{rand}</div>
</div>
