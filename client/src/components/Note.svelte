<script lang="ts">
	import { currentId } from 'store/currentId';
	import { createNote } from 'store/createNote';
	import { notesStore } from 'store/notes';
	import { noteStore } from 'store/note';
	import type { FormEventHandler } from 'svelte/elements';
	import { typeNote } from 'store/typeNote';

	let innerHTML = $notesStore[$currentId!]?.html ?? '';
	noteStore.subscribe((note) => {
		innerHTML = note?.html ?? '';
	});

	const handleUserInput: FormEventHandler<HTMLElement> = (e) => {
		const noKeyWasChosenYet = !$currentId;
		const noteWithKeyDoesNotExistYet = !$noteStore;
		if (noKeyWasChosenYet) {
			createNote(innerHTML);
		} else if (noteWithKeyDoesNotExistYet) {
			createNote(innerHTML, $currentId);
		} else {
			typeNote(innerHTML);
		}
	};
</script>

<main
	class="bg2 relative grow bg-slate-100 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0"
>
	<div
		id="Note"
		contenteditable
		placeholder="Type or paste here ..."
		bind:innerHTML
		on:input={handleUserInput}
		class="relative p-8 outline-none empty:text-xl empty:text-slate-300 empty:before:content-[attr(placeholder)]"
	></div>
</main>
