import { create } from "zustand";
import type { RoomId } from "../assets/data/roomData";

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
  currentRoom: RoomId;
  keyLocked: Record<string, boolean>;
  puzzleState: Record<string, Record<string, { puzzleCompleted: boolean }>>;
  stepCount: number;
  visitedRooms: RoomId[];
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

export const useSaveFileStore = create<State & Action>((set) => ({
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
