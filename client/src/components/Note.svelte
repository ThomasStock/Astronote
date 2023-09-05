<script lang="ts">
	import DevTools from './DevTools/DevTools.svelte';
	import { createNote } from 'store/createNote';
	import { currentId } from 'store/currentId';
	import { note } from 'store/note';
	import { notes } from 'store/notes';
	import Menu from './Menu.svelte';
	import { debounce } from 'store/utils/debounce';
	import { actions, historyIndex, run, subscribe } from '../commands/application';
	import { typeCommand } from '../commands/typeCommand';
	import { onMount } from 'svelte';

	let innerHTML = '';

	// Instead of updating the store on every keypress, we debounce until the user stops typing
	const debouncedType = debounce((input: string) => {
		if (input != $note?.html) {
			console.log(`x${input}y${$note?.html}z`);
			run(typeCommand($currentId!, input));
		}
	});

	$: debouncedType(innerHTML);

	onMount(() => {
		subscribe((command, undo) => {
			if (command.type !== 'typeCommand' || undo) {
				console.log('subbed and now setting html to ', command, $note?.html);
				innerHTML = $note?.html ?? '';
			}
		});
	});

	$: {
		// User typed a letter in a new note
		const typedNewNote = !$note && innerHTML.length;
		if (typedNewNote) {
			createNote(innerHTML);
		}
	}

	let textContent: string;
	$: noteIsEmpty = Boolean(!textContent?.length);

	let noteElement: HTMLElement;

	$: {
		console.log('$note?.html', $note?.html);
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
