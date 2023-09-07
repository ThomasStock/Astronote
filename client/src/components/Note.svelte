<script lang="ts">
	import DevTools from './DevTools/DevTools.svelte';
	import { createNoteCommand } from '../commands/createNoteCommand';
	import { currentId } from 'store/currentId';
	import { noteStore } from 'store/note';
	import Menu from './Menu.svelte';
	import { debounce } from 'store/utils/debounce';
	import { actionsStore, run, subscribe } from '../commands/application';
	import { isTypeCommand, typeCommand } from '../commands/typeCommand';
	import { onMount } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';
	import { getSelectionOffset, setSelectionOffset } from './utils/selection';

	let nodeElement: HTMLElement | undefined;

	let innerHTML = '';

	// Instead of updating the store on every keypress, we debounce until the user stops typing
	const debouncedType = debounce(
		(
			{ input, offset }: { input: string; offset: [number, number] },
			initialArgs?: { input: string; offset: [number, number] }
		) => {
			const newOffset = getSelectionOffset(nodeElement);
			if ($currentId) {
				run(typeCommand($currentId!, input, initialArgs?.offset ?? [0, 0], newOffset));
			} else {
				run(createNoteCommand(input));
			}
			offset = newOffset;
		}
	);

	onMount(() => {
		innerHTML = $noteStore?.html ?? '';
		subscribe((command, meta) => {
			const { undo, redo } = meta ?? {};
			const noteHtml = $noteStore?.html ?? '';
			innerHTML = noteHtml;
			if (isTypeCommand(command) && (undo || redo)) {
				nodeElement?.focus();

				// re-set carret
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
		// if (e.currentTarget.innerHTML !== innerHTML) {
		let localoffset = getSelectionOffset(nodeElement);
		console.log('debouncing[' + e.currentTarget.innerHTML + ']', localoffset);
		debouncedType({ input: e.currentTarget.innerHTML, offset: localoffset });
		// }
	};

	let textContent: string;
	$: noteIsEmpty = Boolean(!textContent?.length);

	$: {
		// console.log('$noteStore?.html', $noteStore?.html);
		// console.log('historyIndex', $historyIndex);

		console.log('actions', $actionsStore);
	}
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
