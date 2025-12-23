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

type State = { fileStore: DashboardSaveEntry[] };

type Action = {
  updateFiles: (files: DashboardSaveEntry[]) => void;
  deleteFile: (id: string) => void;
};

export const useSaveFileStore = create<State & Action>((set) => ({
  fileStore: [],
  updateFiles: (files) =>
    set((state) => {
      const next = [...state.fileStore];
      for (const { id, save } of files) {
        if (!next.some((file) => file.id === id)) {
          next.push({ id, save });
        }
      }
      return { fileStore: next };
    }),
  deleteFile: (id) =>
    set((state) => {
      const next = [...state.fileStore].filter((file) => file.id !== id);

      return { fileStore: next };
    }),
}));
