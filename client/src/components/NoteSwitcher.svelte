<script lang="ts">
	import { onDestroy } from 'svelte';
	import Preview from './Preview.svelte';
	import LinkButton from './LinkButton.svelte';
	import { currentId } from 'store/currentId';
	import { sortedNotesStore } from 'store/sortedNotes';
	import { viewStore } from 'store/view';

	$: open = $viewStore === 'search';

	let containerElement: HTMLDivElement;

	const outsideClickHandeler: EventListener = (e) => {
		const clickedOutside = !containerElement.contains(e.target as Node);
		if (clickedOutside) {
			viewStore.set(undefined);
		}
	};

	$: if (open && containerElement) {
		window.addEventListener('click', outsideClickHandeler);
	} else {
		window.removeEventListener('click', outsideClickHandeler);
	}

	onDestroy(() => {
		window.removeEventListener('click', outsideClickHandeler);
	});
</script>

{#if open}
	<div
		class="fixed bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center backdrop-blur-sm"
	>
		<div
			class="absolute inset-12 rounded-xl bg-slate-200 p-4 outline outline-1 outline-slate-300 md:relative md:h-4/6 md:max-w-2xl"
		>
			<div
				bind:this={containerElement}
				class="flex h-auto max-h-full flex-col gap-4 overflow-y-auto rounded p-4"
			>
				<div>search input and close button here</div>
				{#each $sortedNotesStore as note}
					<Preview
						class="w-full shrink-0 rounded-lg shadow-md drop-shadow-lg "
						on:click={() => {
							currentId.set(note.key);
						}}
						html={note.value.html}
						id={note.key}
					/>
				{/each}
			</div>
		</div>
	</div>
{/if}
<LinkButton icon="search" view="search" class="bg-sky-300 hover:bg-sky-400"></LinkButton>
