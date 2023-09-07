<script lang="ts">
	import DevTools from './DevTools/DevTools.svelte';
	import { createNoteCommand } from '../commands/createNoteCommand';
	import { currentId } from 'store/currentId';
	import { noteStore } from 'store/note';
	import Menu from './Menu.svelte';
	import { debounce } from 'store/utils/debounce';
	import { run, subscribe } from '../commands/application';
	import { isTypeCommand, typeCommand } from '../commands/typeCommand';
	import { onMount } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';
	import { getSelectionOffset, setSelectionOffset } from './utils/selection';
	import { notesStore } from 'store/notes';
	import { get } from 'svelte/store';
	import type { TypeInfo } from './types';

	let nodeElement: HTMLElement | undefined;

	let innerHTML = get(noteStore)?.html ?? '';

	// Instead of updating the store on every keypress, we debounce until the user stops typing
	const debouncedType = debounce(({ input, offset }: TypeInfo, initialArgs?: TypeInfo) => {
		// Get current carret position offset
		const newOffset = getSelectionOffset(nodeElement);

		// Get the offset of when the user started typing. Used for undo'ing.
		const oldOffset = initialArgs?.offset ?? [0, 0];

		if ($currentId) {
			run(typeCommand($currentId, input, oldOffset, newOffset));
		}
		offset = newOffset;
	});

	$: if (!$currentId && innerHTML.length) {
		// When we are currently not on a note and the user starts typing, create the note instantly.
		run(createNoteCommand(innerHTML));
	}

	// React to $currentId changes: update screen to new note.
	$: innerHTML = ($currentId ? get(notesStore)[$currentId]?.html : '') ?? '';

	onMount(() => {
		subscribe((command, meta) => {
			const { undo, redo } = meta ?? {};
			const noteHtml = $noteStore?.html ?? '';
			innerHTML = noteHtml;
			if (isTypeCommand(command) && (undo || redo)) {
				// re-set carret after undo/redo typing
				if (undo) {
					setTimeout(() => {
						setSelectionOffset(nodeElement!, ...command.oldSelectionOffset);
					}, 0);
				} else {
					setSelectionOffset(nodeElement!, ...command.newSelectionOffset);
					setTimeout(() => {
						setSelectionOffset(nodeElement!, ...command.newSelectionOffset);
					}, 0);
				}
			}
		});
	});

	const editableChanged: ChangeEventHandler<HTMLElement> = (e) => {
		const input = e.currentTarget.innerHTML;
		const offset = getSelectionOffset(nodeElement);
		debouncedType({ input, offset });
	};

	let textContent: string;
	$: noteIsEmpty = Boolean(!textContent?.length);
</script>

<main
	id="Note"
	contenteditable
	placeholder="Type or paste here ..."
	on:input={editableChanged}
	class="min-h-screen p-8 outline-none empty:text-xl empty:text-slate-300 empty:before:content-[attr(placeholder)]"
	bind:this={nodeElement}
	bind:textContent
	bind:innerHTML
/>

<Menu {noteIsEmpty} />
<nav aria-label="dev menu" class="fixed bottom-0 right-0 flex flex-col justify-center">
	<div class="flex flex-col items-end gap-2 p-4">
		<DevTools />
	</div>
</nav>
