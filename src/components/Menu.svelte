<script lang="ts">
	import NoteSwitcher from './NoteSwitcher.svelte';
	import LinkButton from './LinkButton.svelte';
	import { currentId } from 'store/currentId';
	import { deleteNote } from 'store/deleteNote';
	import { rand, viewport } from 'store/visualViewport';
	import { canUndo, canRedo, undo, redo } from 'store/actions';

	export let noteIsEmpty: boolean;

	let menu: HTMLDivElement;
	let deltaY = 0;

	$: if (menu) {
		const menuDistanceFromBottom = menu.offsetTop + menu.clientHeight;
		if (menuDistanceFromBottom > $viewport) {
			deltaY = menuDistanceFromBottom - $viewport;
			deltaY = Math.max(0, Math.min(deltaY, menu.offsetTop));
		}
	}

	$: handleAdd = (e: Event) => {
		console.log('clicked add');
		currentId.set(undefined);
	};
</script>

<div class="fixed -z-50 opacity-0">{$rand}</div>
<nav
	aria-label="menu"
	class="fixed bottom-0 right-0 top-0 flex flex-col justify-center bg-green-200"
>
	<div
		bind:this={menu}
		style={`transform: translateY(${-deltaY}px);`}
		class="flex flex-col items-end gap-6 p-4 transition-transform"
	>
		<LinkButton
			icon="add"
			href={'/'}
			onClick={handleAdd}
			class={`bg-emerald-300 hover:bg-emerald-400 ${noteIsEmpty ? 'invisible' : undefined}`}
		></LinkButton>
		<NoteSwitcher />
		<LinkButton
			icon="delete"
			onClick={() => deleteNote($currentId)}
			class="bg-red-300 hover:bg-red-400"
		></LinkButton>
	</div>
</nav>
<nav aria-label="undo-menu" class="fixed right-28 top-0 flex">
	<LinkButton
		icon="undo"
		onClick={undo}
		class={`bg-yellow-200 hover:bg-yellow-300 ${$canUndo ? undefined : 'invisible'}`}
	></LinkButton>
	<LinkButton
		icon="redo"
		onClick={redo}
		class={`bg-yellow-200 hover:bg-yellow-300 ${$canRedo ? undefined : 'invisible'}`}
	></LinkButton>
</nav>
