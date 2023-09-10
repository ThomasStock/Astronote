import type { Note } from 'store/notes';
import { supabase } from './db';

export const note = {
	get: async (key: string) => {
		return await supabase.from('url').select('data').eq('id', key).maybeSingle();
	}
};
