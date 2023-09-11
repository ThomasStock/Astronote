import type { Note } from 'store/notes';
import { supabase } from './db';
import type { Json } from './types/supabase';

let ac = new AbortController();
export const noteApi = {
	get: async (key: string) => {
		return await supabase.from('url').select().eq('id', key).maybeSingle();
	},
	update: async (note: Note) => {
		ac.abort();
		ac = new AbortController();
		return await supabase
			.from('url')
			.upsert({ id: note.id, data: note as any as Json })
			.abortSignal(ac.signal)
			.select()
			.single();
	}
};
