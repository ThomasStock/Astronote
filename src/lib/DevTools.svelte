<script lang="ts">
	import { createNote } from './utils/store';
	import Button from './MyButton.svelte';
	import { onMount } from 'svelte';
	import type { Faker } from '@faker-js/faker';

	// Delay load big lib
	// https://svelte.dev/repl/16b375da9b39417dae837b5006799cb4?version=3.25.0
	let faker: Faker;
	onMount(async () => {
		setTimeout(async () => {
			faker = (await import('@faker-js/faker')).faker;
		}, 1000);
	});
</script>

<Button
	color="red"
	class="w-32 font-mono text-xs"
	on:click={() => {
		window.localStorage.clear();
		location.reload();
	}}>Dev: Clear cache</Button
>
<Button
	color="red"
	class="w-32 font-mono text-xs"
	on:click={() => {
		for (let i = 0; i < 10; i++) {
			if (i % 2 === 0) {
				createNote(`<a href="#">${faker?.internet.url()}</a>`);
			} else {
				createNote(faker?.lorem.paragraphs({ min: 1, max: 3 }, '<br/><br/>'));
			}
		}
	}}>Dev: insert 10</Button
>
<Button
	color="red"
	class="w-32 font-mono text-xs"
	on:click={() => {
		location.replace();
	}}>Dev: url change</Button
>
