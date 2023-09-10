import './app.css';
import App from './App.svelte';

setTimeout(() => import('./api/syncer').then((m) => m.init()), 10);

const app = new App({
	target: document.getElementById('app')!
});

export default app;
