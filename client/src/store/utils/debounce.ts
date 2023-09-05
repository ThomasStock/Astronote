export function debounce<T extends Function>(cb: T, wait = 500) {
	let h = 0;
	let callable = (...args: any) => {
		clearTimeout(h);
		h = setTimeout(() => cb(...args), wait) as any;
	};
	return <T>(<any>callable);
}
