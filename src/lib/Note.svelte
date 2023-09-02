<script lang="ts">
	import { createNote, notes, note, currentId, deleteNote, view } from './utils/store';
	import NoteSwitcher from './NoteSwitcher.svelte';
	import DevTools from './DevTools.svelte';
	import LinkButton from './LinkButton.svelte';

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

	$: handleAdd = (e: Event) => {
		currentId.set(undefined);
	};

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

<nav aria-label="menu" class="fixed bottom-0 right-0 top-0 flex flex-col justify-center">
	<div class="flex flex-col items-end gap-6 p-4">
		<NoteSwitcher />

		{#if !noteIsEmpty}
			<LinkButton
				icon="add"
				href={'/'}
				onClick={handleAdd}
				class="bg-emerald-300 hover:bg-emerald-400"
			></LinkButton>
		{/if}
		<LinkButton
			icon="delete"
			onClick={() => deleteNote($currentId)}
			class="bg-red-300 hover:bg-red-400"
		></LinkButton>
	</div>
</nav>

<nav aria-label="dev menu" class="fixed bottom-0 right-0 flex flex-col justify-center">
	<div class="flex flex-col items-end gap-2 p-4">
		<DevTools />
	</div>
</nav>
