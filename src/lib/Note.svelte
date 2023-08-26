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
	import NoteSwitcher from './NoteSwitcher.svelte';
	import { SvelteComponent, onMount } from 'svelte';
	import DevTools from './DevTools.svelte';

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

	$: handleAdd = () => {
		currentId.set(undefined);
	};

	$: noteIsEmpty = Boolean(!innerHTML.length);

	let noteElement: HTMLElement;
	$: if (noteIsEmpty && noteElement) {
		noteElement.focus();
	}

	// note viewer
	let open = false;

	$: {
		console.log('#notes', $sortedNotes.length);
		console.log('#note', $note);
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
<nav class="fixed bottom-0 right-6 top-0 flex flex-col justify-center">
	<div class="flex flex-col gap-2">
		<NoteSwitcher bind:open />
		<Button on:click={() => (open = !open)} color="yellow" class="w-32">Notes</Button>
		{#if !noteIsEmpty}<Button class="w-32" color="purple" on:click={handleAdd}>New</Button>{/if}
		<Button color="red" class="w-32" on:click={() => deleteNote($currentId)}>Delete</Button>
		<DevTools />
	</div>
</nav>
