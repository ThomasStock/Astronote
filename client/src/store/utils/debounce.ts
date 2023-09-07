export function debounce<
	T extends Function,
	A = T extends (args: infer A, initialArgs: infer A | undefined) => void ? A : never
>(cb: T, wait = 250) {
	let h = 0;
	let initialArgs: any;
	let callable = (args: A) => {
		clearTimeout(h);
		h = setTimeout(() => {
			cb(args, initialArgs);
			initialArgs = args;
			h = 0;
		}, wait) as any;
	};
	return callable as (args: A) => void;
}
