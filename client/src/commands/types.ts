export interface Command {
	type: 'typeCommand' | string;
	undoable: boolean;
	execute: () => void;
	timestamp: number;
	log: () => void;
	clearsUndoStack?: boolean;
}

export interface UndoableCommand extends Command {
	undoable: true;
	undo: () => void;
}

export const isUndoable = (command: Command | UndoableCommand): command is UndoableCommand =>
	command.undoable;

export type CommandSubscriber = (
	command: Command,
	meta?: { undo?: boolean; redo?: boolean }
) => void;
