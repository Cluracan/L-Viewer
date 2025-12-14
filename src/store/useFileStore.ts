import { create } from "zustand";

// Types
type EntryType = "input" | "description" | "action" | "warning";

type StoryLineEntry = {
  type: EntryType;
  text: string;
  isEncrypted: boolean;
};

export type DashboardSaveFile = {
  playerName: string;
  bathState: Record<string, boolean>;
  currentRoom: string;
  keyLocked: Record<string, boolean>;
  puzzleState: Record<string, Record<string, { puzzleCompleted: boolean }>>;
  stepCount: number;
  visitedRooms: string[];
  storyLine: StoryLineEntry[];
};

export type DashboardSaveEntry = {
  id: string;
  save: DashboardSaveFile;
};

type State = { fileStore: Record<string, DashboardSaveFile> };

type Action = {
  updateFiles: (files: DashboardSaveEntry[]) => void;
  deleteFile: (id: string) => void;
};

export const useFileStore = create<State & Action>((set) => ({
  fileStore: {},
  updateFiles: (files) =>
    set((state) => {
      const next = { ...state.fileStore };
      for (const { id, save } of files) {
        next[id] = save;
      }
      return { fileStore: next };
    }),
  deleteFile: (id) =>
    set((state) => {
      const next = { ...state.fileStore };
      delete next[id];
      return { fileStore: next };
    }),
}));
