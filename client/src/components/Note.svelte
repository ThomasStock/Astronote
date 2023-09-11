<script lang="ts">
	import DevTools from './DevTools/DevTools.svelte';
	import { currentId } from 'store/currentId';
	import Menu from './Menu.svelte';
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
		console.log('handling user input');
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

	$: console.log('notes', $notesStore);
</script>

<main
	id="Note"
	contenteditable
	placeholder="Type or paste here ..."
	class="max-h-screen min-h-screen overflow-y-auto p-8 outline-none empty:text-xl empty:text-slate-300 empty:before:content-[attr(placeholder)]"
	bind:innerHTML
	on:input={handleUserInput}
/>

<Menu />
<nav aria-label="dev menu" class="fixed bottom-0 right-0 flex flex-col justify-center">
	<div class="flex flex-col items-end gap-2 p-4">
		<DevTools />
	</div>
</nav>
