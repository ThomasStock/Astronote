<script lang="ts">
	import Button from './MyButton.svelte';
	import { onMount } from 'svelte';
	import type { Faker } from '@faker-js/faker';
	import { createNoteCommand } from '../../commands/createNoteCommand';
	import { generateId } from '../../store/generateId';
	import { run } from '../../commands/application';

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
	}}>Clear cache</Button
>
<Button
	color="red"
	class="w-32 font-mono text-xs"
	on:click={() => {
		for (let i = 0; i < 10; i++) {
			if (i % 2 === 0) {
				run(createNoteCommand(`<a href="#">${faker?.internet.url()}</a>`));
			} else {
				run(createNoteCommand(faker?.lorem.paragraphs({ min: 1, max: 3 }, '<br/><br/>')));
			}
		}
	}}>insert 10</Button
>
<Button
	color="red"
	class="w-32 font-mono text-xs"
	on:click={() => {
		history.pushState(null, '', '/' + generateId() + '?foo=' + Math.random());
	}}>url change</Button
>
