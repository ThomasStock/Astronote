<script lang="ts">
	import DevTools from './DevTools/DevTools.svelte';
	import { createNote } from 'store/createNote';
	import { currentId } from 'store/currentId';
	import { note } from 'store/note';
	import { notes } from 'store/notes';
	import WindowData from './DevTools/WindowData.svelte';
	import Menu from './Menu.svelte';

	let innerHTML = '';

	note.subscribe((_) => {
		const newVal = $note?.html ?? '';
		if (innerHTML !== newVal) {
			innerHTML = $note?.html ?? '';
		}
	});

	$: {
		const isTypingNewNote = !$note && innerHTML.length;
		if (isTypingNewNote) {
			createNote(innerHTML);
		} else {
			// should we use !== or != ?
			const hasChangedNote = $note && innerHTML !== $note.html;
			if (hasChangedNote) {
				notes.update((_) => {
					_[$currentId!].html = innerHTML;
					return _;
				});
			}
		}
	}

	$: noteIsEmpty = Boolean(!innerHTML.length);

	let noteElement: HTMLElement;
	$: if (noteIsEmpty && noteElement) {
		noteElement.focus();
	}

	$: {
		// console.log('#notes', $sortedNotes.length);
		// console.log('#note', $note);
		// console.log('currentIndex', $currentIndex);
		// console.log('currentId', $currentId);
		// console.log('view', $view);
	}
</script>

<main
	id="Note"
	contenteditable
	placeholder="Type or paste here ..."
	class="min-h-screen p-8 outline-none empty:text-xl empty:text-slate-300 empty:before:content-[attr(placeholder)]"
	bind:innerHTML
/>

<Menu {noteIsEmpty} />

<nav aria-label="dev menu" class="fixed bottom-0 right-0 flex flex-col justify-center">
	<div class="flex flex-col items-end gap-2 p-4">
		<DevTools />
	</div>
</nav>
