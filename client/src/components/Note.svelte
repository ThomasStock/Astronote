<script lang="ts">
	import DevTools from './DevTools/DevTools.svelte';
	import { createNoteCommand } from '../commands/createNoteCommand';
	import { currentId } from 'store/currentId';
	import { noteStore } from 'store/note';
	import Menu from './Menu.svelte';
	import { debounce } from 'store/utils/debounce';
	import { actions, historyIndex, run, subscribe } from '../commands/application';
	import { typeCommand } from '../commands/typeCommand';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { notesStore } from 'store/notes';

	let innerHTML = '';

	// Instead of updating the store on every keypress, we debounce until the user stops typing
	const debouncedType = debounce((input: string) => {
		if (input && innerHTML) {
			// console.log(`x${input}y${$noteStore?.html}z`);
			run(typeCommand($currentId!, input));
		}
	});

	$: debouncedType(innerHTML);

	onMount(() => {
		innerHTML = $noteStore?.html ?? '';
		subscribe((command, undo) => {
			if (command.type === 'typeCommand' && undo) {
				const noteHtml = $noteStore?.html ?? '';
				if (noteHtml != innerHTML && noteHtml && innerHTML) {
					console.log(`typeCommand happened!${noteHtml}xxx${innerHTML}yy`);
					innerHTML = $noteStore?.html ?? '';
				}
			}
		});
	});

	$: {
		// react on currentId change
		$currentId;
		// use get() to make sure we ONLU react on currentID change
		const newHtml = ($currentId ? get(notesStore)[$currentId]?.html : '') ?? '';
		if (newHtml != innerHTML && newHtml && innerHTML) {
			console.log(`currentid changed!${newHtml}xxx${innerHTML}yy`);
			innerHTML = newHtml;
		}
	}

	$: {
		// User typed a letter in a new note
		const typedNewNote = !$noteStore && innerHTML.length;
		if (typedNewNote) {
			run(createNoteCommand());
		}
	}

	let textContent: string;
	$: noteIsEmpty = Boolean(!textContent?.length);

	let noteElement: HTMLElement;

	$: {
		console.log('$noteStore?.html', $noteStore?.html);
		console.log('historyIndex', $historyIndex);
		console.log('actions', $actions);
	}
</script>

<main
	id="Note"
	contenteditable
	placeholder="Type or paste here ..."
	class="min-h-screen p-8 outline-none empty:text-xl empty:text-slate-300 empty:before:content-[attr(placeholder)]"
	bind:this={noteElement}
	bind:textContent
	bind:innerHTML
/>

<Menu {noteIsEmpty} />
<nav aria-label="dev menu" class="fixed bottom-0 right-0 flex flex-col justify-center">
	<div class="flex flex-col items-end gap-2 p-4">
		<DevTools />
	</div>
</nav>
