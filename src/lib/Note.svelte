<script lang="ts">
	import Button from './button.svelte';
	import store from './store';
	import { KEYS, isNoKey } from './utils/constants';

	let currentId = store<string>(KEYS.currentId, crypto.randomUUID());

	$: note = store($currentId, { updatedOn: Date.now(), html: '' });

	let sorted: { key: string; value: any }[] = [];
	$: if ($currentId) {
		sorted = Object.keys(window.localStorage)
			.filter(isNoKey)
			.map((_) => ({ key: _, value: JSON.parse(localStorage.getItem(_)!) }))
			.sort((a, b) => a.value.updatedOn - b.value.updatedOn);
	}

	$: console.log($note);
</script>

<main id="Note" contenteditable class="min-h-screen p-8 outline-none" bind:innerHTML={$note.html} />
<nav class="fixed bottom-16 right-16">
	<Button
		id="Add"
		color="purple"
		onClick={() => {
			$currentId = crypto.randomUUID();
		}}>Add</Button
	>
	<Button
		id="Delete"
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
</nav>
