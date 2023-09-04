import { writable } from 'svelte/store';

const vpHeight = visualViewport?.height ?? window.innerHeight;
function viewportHandler(event: Event) {
	viewport.set(visualViewport!.height);
}

visualViewport?.addEventListener('scroll', viewportHandler);
visualViewport?.addEventListener('resize', viewportHandler);

setInterval(() => {
	viewport.set(visualViewport!.height);
	rand.set(Math.random());
}, 1000);

export const viewport = writable(vpHeight);

// dealing with weird ass safari ios bug
export const rand = writable(Math.random());
