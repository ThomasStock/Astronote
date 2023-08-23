<script lang="ts">
	import Button from './Button.svelte';
	import store from './utils/store';
	import { KEYS, isNoKey } from './utils/constants';
	import Preview from './Preview.svelte';

	let currentId = store<string>(KEYS.currentId, crypto.randomUUID());

	$: note = store($currentId, { updatedOn: Date.now(), html: '' });

	$: sorted = Object.keys(window.localStorage)
		.filter(isNoKey)
		.map((_) => ({ key: _, value: JSON.parse(localStorage.getItem(_)!) }))
		.sort((a, b) => a.value.updatedOn - b.value.updatedOn);

	$: currentIndex = sorted.findIndex((_) => _.key === $currentId);

	$: isFirstItem = currentIndex === 0;
	$: goPrevious = isFirstItem ? () => currentId.set(sorted[currentIndex - 1].key) : undefined;

	$: isLastItem = sorted.length - 1 === currentIndex;
	$: goNext = () => (isLastItem ? currentId.set(sorted[currentIndex + 1].key) : undefined);

	$: handleDelete = () => {
		if (sorted.length > 1) {
			window.localStorage.removeItem($currentId);
			const last = sorted.findLast((_) => _.key !== $currentId) ?? { key: '' };
			currentId.set(last.key);
		} else {
			$note.html = '';
		}
	};

	$: handleAdd = () => ($currentId = crypto.randomUUID());
</script>

<main id="Note" contenteditable class="min-h-screen p-8 outline-none" bind:innerHTML={$note.html} />
<nav class="fixed bottom-1 right-1 flex flex-col gap-1">
	<div class="flex flex-auto justify-evenly gap-1">
		{#if goPrevious}
			<Button color="yellow" on:click={goPrevious} class="flex"
				>{'<<'}
				<Preview>{sorted[currentIndex]}</Preview></Button
			>
		{/if}
		<Button color="yellow" on:click={() => {}}
			><Preview>
				{$currentId}
			</Preview></Button
		>
		{#if goNext}
			<Button color="yellow" on:click={goNext} class="flex">
				<Preview>asdad</Preview>
				<div>>></div></Button
			>
		{/if}
	</div>
	<div class="flex flex-auto justify-evenly">
		<Button color="purple" on:click={handleAdd}>Add</Button>
		<Button color="red" on:click={handleDelete}>{sorted.length > 1 ? 'Delete' : 'Clear'}</Button>
	</div>
</nav>
