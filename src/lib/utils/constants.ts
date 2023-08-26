export const KEYS = {
	currentId: 'currentId',
	notes: 'notes'
};

export const isNoKey = (storageKey: string | undefined) =>
	KEYS[storageKey as keyof typeof KEYS] === undefined;
