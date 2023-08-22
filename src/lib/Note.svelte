<script lang="ts">
	import Button from './button.svelte';
	import store from './store';
	import { KEYS, isNoKey } from './utils/constants';

	let currentId = store<string>(KEYS.currentId, crypto.randomUUID());

	$: note = store($currentId, { updatedOn: Date.now(), html: '' });

	let sorted: { key: string; value: any }[] = [];
	let currentIndex: number;
	let isLastItem: boolean;
	let isFirstItem: boolean;
	$: {
		sorted = Object.keys(window.localStorage)
			.filter(isNoKey)
			.map((_) => ({ key: _, value: JSON.parse(localStorage.getItem(_)!) }))
			.sort((a, b) => a.value.updatedOn - b.value.updatedOn);

		currentIndex = sorted.findIndex((_) => _.key === $currentId);
		isLastItem = sorted.length - 1 === currentIndex;
		isFirstItem = currentIndex === 0;
	}
</script>

<main id="Note" contenteditable class="min-h-screen p-8 outline-none" bind:innerHTML={$note.html} />
<nav class="fixed bottom-16 right-16 flex flex-col gap-2">
	<div class="flex flex-auto justify-evenly gap-2">
		{#if !isFirstItem}
			<Button
				color="yellow"
				onClick={() => {
					currentId.set(sorted[currentIndex - 1].key);
				}}>{'<<'}</Button
			>
		{/if}
		<Button color="yellow" onClick={() => {}}>{$currentId}</Button>
		{#if !isLastItem}
			<Button
				color="yellow"
				onClick={() => {
					currentId.set(sorted[currentIndex + 1].key);
				}}>{'>>'}</Button
			>
		{/if}
	</div>
	<div class="flex flex-auto justify-evenly gap-2">
		<Button
			color="purple"
			onClick={() => {
				$currentId = crypto.randomUUID();
			}}>Add</Button
		>
		<Button
			color="red"
			onClick={() => {
				if (sorted.length > 1) {
					window.localStorage.removeItem($currentId);
					const last = sorted.findLast((_) => _.key !== $currentId) ?? { key: '' };
					currentId.set(last.key);
				} else {
					$note.html = '';
				}
			}}>{sorted.length > 1 ? 'Delete' : 'Clear'}</Button
		>
	</div>
</nav>
