export const KEYS = {
	currentId: 'currentId'
};

export const isNoKey = (storageKey: string | undefined) =>
	KEYS[storageKey as keyof typeof KEYS] === undefined;
