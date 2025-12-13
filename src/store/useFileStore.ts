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

type State = { fileStore: DashboardSaveEntry[] | null };

type Action = {
  updateFileStore: (files: State["fileStore"]) => void;
  deleteFile: (id: string) => void;
};

export const useFileStore = create<State & Action>((set) => ({
  fileStore: null,
  updateFileStore: (files) => set(() => ({ fileStore: files })),
  deleteFile: (id) =>
    set((state) => ({
      fileStore: state.fileStore?.filter((entry) => entry.id !== id),
    })),
}));
