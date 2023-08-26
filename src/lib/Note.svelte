<script lang="ts">
	import {
		createNote,
		notes,
		note,
		currentId,
		sortedNotes,
		currentIndex,
		deleteNote
	} from './utils/store';
	import Button from './MyButton.svelte';
	import Preview from './Preview.svelte';

	let innerHTML = '';

	note.subscribe((_) => {
		const newVal = $note?.html ?? '';
		if (innerHTML !== newVal) {
			innerHTML = $note?.html ?? '';
			console.log('I have set innerHTML to note.html', innerHTML, $note?.html);
		}
	});

	$: {
		const isTypingNewNote = !$note && innerHTML.length;
		if (isTypingNewNote) {
			console.log('creating note with', innerHTML);
			createNote(innerHTML);
		} else {
			// should we use !== or != ?
			const hasChangedNote = $note && innerHTML !== $note.html;
			if (hasChangedNote) {
				console.log('updating note to', innerHTML);
				notes.update((_) => {
					_[$currentId!].html = innerHTML;
					return _;
				});
			}
		}
	}

	$: previousItem = $sortedNotes[$currentIndex - 1];
	$: goPrevious = !previousItem ? undefined : () => currentId.set(previousItem.key);

	$: nextItem = $sortedNotes[$currentIndex + 1];
	$: goNext = !nextItem ? undefined : () => currentId.set(nextItem.key);

	$: handleAdd = () => {
		currentId.set(undefined);
	};

	$: noteIsEmpty = Boolean(!innerHTML.length);

	let noteElement: HTMLElement;
	$: if (noteIsEmpty && noteElement) {
		noteElement.focus();
	}

	$: {
		console.log('#notes', $sortedNotes.length);
		console.log('#note', $note);
		console.log('previousItem', previousItem);
		console.log('nextItem', nextItem);
		console.log('currentIndex', $currentIndex);
		console.log('currentId', $currentId);
	}
</script>

<main
	id="Note"
	contenteditable
	placeholder="Type or paste here ..."
	class="min-h-screen p-8 outline-none empty:text-xl empty:text-slate-300 empty:before:content-[attr(placeholder)]"
	bind:innerHTML
/>
<nav class="fixed bottom-1 left-1 right-1 flex flex-col gap-1">
	<div class="flex justify-between">
		{#if previousItem}
			<Preview on:click={goPrevious} html={previousItem.value.html} />
		{:else}
			<div />
		{/if}
		{#if nextItem}
			<Preview on:click={goNext} html={nextItem.value.html} />
		{:else}
			<div />
		{/if}
	</div>
</nav>
<nav class="fixed right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2">
	{#if !noteIsEmpty}<Button color="purple" on:click={handleAdd}>New</Button>{/if}
	<Button color="red" on:click={() => deleteNote($currentId)}>Delete</Button>
	<Button
		color="red"
		on:click={() => {
			window.localStorage.clear();
			location.reload();
		}}>Dev: Clear cache</Button
	>
</nav>
