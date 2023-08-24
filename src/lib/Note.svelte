<script lang="ts">
	import store from './utils/store';
	import { KEYS, isNoKey } from './utils/constants';
	import NoteCanvas from './NoteCanvas.svelte';
	import Button from './MyButton.svelte';

	interface Note {
		updatedOn: number;
		html: string;
	}

	function getSortedNotes() {
		return Object.keys(window.localStorage)
			.filter(isNoKey)
			.map<{ key: string; value: Note }>((_) => ({
				key: _,
				value: JSON.parse(localStorage.getItem(_)!)
			}))
			.sort((a, b) => a.value.updatedOn - b.value.updatedOn);
	}

	let currentId = store<string>(KEYS.currentId, crypto.randomUUID());

	$: note = store<Note>($currentId, { updatedOn: Date.now(), html: '' });

	$: sorted = note && getSortedNotes();

	$: currentIndex = sorted.findIndex((_) => _.key === $currentId);

	$: console.log(previousItem);

	$: isFirstItem = currentIndex === 0;
	$: previousItem = sorted[currentIndex - 1];
	$: goPrevious = isFirstItem ? undefined : () => currentId.set(previousItem.key);

	$: isLastItem = sorted.length - 1 === currentIndex;
	$: nextItem = sorted[currentIndex + 1];
	$: goNext = isLastItem ? undefined : () => currentId.set(nextItem.key);

	$: handleDelete = () => {
		if (sorted.length > 1) {
			window.localStorage.removeItem($currentId);
			const lastItem = sorted.findLast((_) => _.key !== $currentId) ?? { key: '' };
			currentId.set(lastItem.key);
		} else {
			$note.html = '';
		}
	};

	$: handleAdd = () => {
		$currentId = crypto.randomUUID();
	};
</script>

<main id="Note" contenteditable class="min-h-screen p-8 outline-none" bind:innerHTML={$note.html} />
<nav class="fixed bottom-1 left-1 right-1 flex flex-col gap-1">
	<div class="flex justify-between">
		{#if goPrevious}
			<NoteCanvas on:click={goPrevious} html={previousItem.value.html} />
		{:else}
			<div />
		{/if}
		{#if goNext}
			<NoteCanvas on:click={goNext} html={nextItem.value.html} />
		{:else}
			<div />
		{/if}
	</div>
</nav>
<nav class="fixed bottom-1/2 right-2 top-1/2 flex flex-col">
	<Button color="purple" on:click={handleAdd}>Add</Button>
	<Button color="red" on:click={handleDelete}>{sorted.length > 1 ? 'Delete' : 'Clear'}</Button>
</nav>
