<script lang="ts">
	import NoteSwitcher from './NoteSwitcher.svelte';
	import LinkButton from './LinkButton.svelte';
	import { currentId } from 'store/currentId';
	import { deleteNote } from 'store/deleteNote';
	import { rand, viewport } from 'store/visualViewport';
	import { canUndo, canRedo, undo, redo } from 'store/undo';
	import { startNewNote } from 'store/startNewNote';

	let menu: HTMLDivElement;
	let deltaY = 0;

	$: if (menu) {
		const menuDistanceFromBottom = menu.offsetTop + menu.clientHeight;
		if (menuDistanceFromBottom > $viewport) {
			deltaY = menuDistanceFromBottom - $viewport;
			deltaY = Math.max(0, Math.min(deltaY, menu.offsetTop));
		}
	}

	$: disableAddButton = Boolean(!$currentId);

	$: handleAdd = () => {
		startNewNote();
	};
</script>

<div class="fixed -z-50 opacity-0">{$rand}</div>
<nav
	aria-label="menu"
	class="fixed bottom-0 right-0 top-0 flex flex-col justify-center bg-[#002109] bg-[url('/public/leather.png')] px-4"
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
			class={`bg-emerald-300 hover:bg-emerald-400 ${disableAddButton ? 'invisible' : undefined}`}
		></LinkButton>
		<NoteSwitcher />
		<LinkButton
			icon="delete"
			onClick={() => deleteNote($currentId)}
			class="bg-red-300 hover:bg-red-400"
		></LinkButton>
	</div>
</nav>
<nav aria-label="action-menu" class="fixed right-28 top-4 flex">
	<LinkButton
		icon="undo"
		hidden={!$canUndo}
		onClick={undo}
		class={`bg-yellow-200 hover:bg-yellow-300`}
	></LinkButton>
	<LinkButton
		icon="redo"
		hidden={!$canRedo}
		onClick={redo}
		class={`bg-yellow-200 hover:bg-yellow-300`}
	></LinkButton>
</nav>
