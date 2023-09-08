<script lang="ts">
	import DevTools from './DevTools/DevTools.svelte';
	import { currentId } from 'store/currentId';
	import Menu from './Menu.svelte';
	import { createNote } from 'store/createNote';
	import { notesStore } from 'store/notes';
	import { noteStore } from 'store/note';
	import type { FormEventHandler } from 'svelte/elements';
	import { typeNote } from 'store/typeNote';

	let nodeElement: HTMLElement | undefined;

	let innerHTML = $notesStore[$currentId!]?.html ?? '';
	noteStore.subscribe((note) => (innerHTML = note?.html ?? ''));

	$: if (!$currentId && innerHTML.length) {
		// When we are currently not on a note and the user starts typing, create the note instantly.
		createNote(innerHTML);
	}

	const handleUserInput: FormEventHandler<HTMLElement> = (e) => {
		if (!$currentId) {
			createNote(innerHTML);
		} else {
			typeNote(innerHTML);
		}
	};

	let textContent: string;
	$: noteIsEmpty = Boolean(!textContent?.length);
</script>

<main
	id="Note"
	contenteditable
	placeholder="Type or paste here ..."
	class="min-h-screen p-8 outline-none empty:text-xl empty:text-slate-300 empty:before:content-[attr(placeholder)]"
	bind:this={nodeElement}
	bind:textContent
	bind:innerHTML
	on:input={handleUserInput}
/>

<Menu {noteIsEmpty} />
<nav aria-label="dev menu" class="fixed bottom-0 right-0 flex flex-col justify-center">
	<div class="flex flex-col items-end gap-2 p-4">
		<DevTools />
	</div>
</nav>
