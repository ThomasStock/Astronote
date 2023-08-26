<script lang="ts">
	import Button from './MyButton.svelte';
	import Preview from './Preview.svelte';
	import { sortedNotes, currentId } from './utils/store';

	export let open = false;
	export const toggle = () => {
		open = !open;
	};
</script>

{#if open}
	<div class="absolute bottom-4 right-32 top-4 mr-2 flex flex-col justify-center">
		<div class="flex h-auto max-h-full flex-col gap-2 overflow-y-auto rounded p-2">
			{#each $sortedNotes as note}
				<Preview
					class="shrink-0 rounded-lg shadow-md drop-shadow-lg"
					on:click={() => {
						currentId.set(note.key);
						open = false;
					}}
					html={note.value.html}
				/>
			{/each}
		</div>
	</div>
{/if}
