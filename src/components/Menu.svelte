<script lang="ts">
	import NoteSwitcher from './NoteSwitcher.svelte';
	import LinkButton from './LinkButton.svelte';
	import { currentId } from 'store/currentId';
	import { deleteNote } from 'store/deleteNote';
	import { rand, viewport } from 'store/visualViewport';

	export let noteIsEmpty: boolean;

	let menu: HTMLDivElement;
	let deltaY = 0;

	$: if (menu) {
		const undersize = menu.offsetTop + menu.clientHeight;
		if (undersize > $viewport) {
			deltaY = undersize - $viewport;
			deltaY = Math.max(0, Math.min(deltaY, menu.offsetTop));
		} else {
		}
	}

	$: handleAdd = (e: Event) => {
		currentId.set(undefined);
	};
</script>

<div class="fixed -z-50 opacity-0">{$rand}</div>
<nav aria-label="menu" class="fixed bottom-0 right-0 top-0 flex flex-col justify-center">
	<div
		bind:this={menu}
		style={`transform: translateY(${deltaY}px);`}
		class="flex flex-col items-end gap-6 p-4"
	>
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
