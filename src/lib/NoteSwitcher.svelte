<script lang="ts">
	import Button from './MyButton.svelte';
	import Preview from './Preview.svelte';
	import { sortedNotes, currentId } from './utils/store';

	let open = true;

	let containerElement: HTMLDivElement;

	const outsideClickHandeler: EventListener = (e) => {
		const clickedOutside = !containerElement.contains(e.target as Node);
		if (clickedOutside) {
			open = false;
		}
	};

	$: if (open) {
		window.addEventListener('click', outsideClickHandeler);
	} else {
		window.removeEventListener('click', outsideClickHandeler);
	}
</script>

{#if open}
	<div class="absolute bottom-4 right-32 top-4 mr-2 flex flex-col justify-center">
		<div
			bind:this={containerElement}
			class="flex h-auto max-h-full flex-col gap-4 overflow-y-auto rounded p-2"
		>
			{#each $sortedNotes as note}
				<Preview
					class="shrink-0 rounded-lg shadow-md drop-shadow-lg"
					on:click={() => {
						currentId.set(note.key);
						open = false;
					}}
					html={note.value.html}
					id={note.key}
				/>
			{/each}
		</div>
	</div>
{/if}
<Button
	on:click={(e) => {
		e.stopPropagation();
		open = !open;
	}}
	color="yellow"
	class="w-32">Notes</Button
>
