<script lang="ts">
	import DevTools from './DevTools/DevTools.svelte';
	import { createNoteCommand } from '../commands/createNoteCommand';
	import { currentId } from 'store/currentId';
	import Menu from './Menu.svelte';
	import { debounce } from 'store/utils/debounce';
	import { actionsStore, run, subscribe } from '../commands/application';
	import { isTypeCommand, typeCommand } from '../commands/typeCommand';
	import { onMount } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';
	import { getSelectionOffset, setSelectionOffset } from './utils/selection';
	import { notesStore } from 'store/notes';
	import type { TypeInfo } from './types';
	import { noteStore } from 'store/note';

	let nodeElement: HTMLElement | undefined;
	const getNoteStoreHtml = () => $notesStore?.[$currentId!]?.html ?? '';

	let innerHTML = getNoteStoreHtml();

	noteStore.subscribe(() => (innerHTML = getNoteStoreHtml()));

	// Instead of updating the store on every keypress, we debounce until the user stops typing
	const debouncedType = debounce(({ input, offset }: TypeInfo, initialArgs?: TypeInfo) => {
		// Get current carret position offset
		const newOffset = getSelectionOffset(nodeElement);

		// Used for undo'ing.
		const oldOffset = initialArgs?.offset ?? [0, 0];
		const oldInput = initialArgs?.previousInput ?? '';

		console.log('old input', oldInput);

		if ($currentId) {
			run(typeCommand({ id: $currentId, input, oldOffset, newOffset, oldInput }));
		}
		offset = newOffset;
	});

	$: if (!$currentId && innerHTML.length) {
		// When we are currently not on a note and the user starts typing, create the note instantly.
		run(createNoteCommand(innerHTML));
	}

	onMount(() => {
		subscribe((command, meta) => {
			const { undo, redo } = meta ?? {};
			if (isTypeCommand(command) && (undo || redo)) {
				// re-set carret after undo/redo typing
				if (undo) {
					setTimeout(() => {
						setSelectionOffset(nodeElement!, ...command.oldSelectionOffset);
					}, 0);
				} else {
					setTimeout(() => {
						setSelectionOffset(nodeElement!, ...command.newSelectionOffset);
					}, 0);
				}
			}
		});
	});

	const editableChanged: ChangeEventHandler<HTMLElement> = (e) => {
		console.log('previousHtml', getNoteStoreHtml());
		const input = e.currentTarget.innerHTML;
		const offset = getSelectionOffset(nodeElement);
		debouncedType({ input, offset, previousInput: getNoteStoreHtml() });
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
	on:input={editableChanged}
/>

<Menu {noteIsEmpty} />
<nav aria-label="dev menu" class="fixed bottom-0 right-0 flex flex-col justify-center">
	<div class="flex flex-col items-end gap-2 p-4">
		<DevTools />
	</div>
</nav>
