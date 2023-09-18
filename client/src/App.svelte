<script>
	import DevTools from './components/DevTools/DevTools.svelte';
	import Menu from './components/Menu.svelte';
	import Note from './components/Note.svelte';
</script>

<Note />
<Menu />
<nav aria-label="dev menu" class="fixed bottom-0 right-12 flex flex-col justify-center">
	<div class="flex flex-col items-end gap-2 p-4">
		<DevTools />
	</div>
</nav>
