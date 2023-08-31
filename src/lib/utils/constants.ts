export const KEYS = {
	currentId: 'currentId',
	notes: 'notes',
	view: 'view'
};

export const isNoKey = (storageKey: string | undefined) =>
	KEYS[storageKey as keyof typeof KEYS] === undefined;
