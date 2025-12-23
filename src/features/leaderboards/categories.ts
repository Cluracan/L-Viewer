import type { DashboardSaveEntry } from "../../store/useSaveFileStore";

interface Category {
  title: string;
  subtitle: string;
  sort: (a: DashboardSaveEntry, b: DashboardSaveEntry) => number;
}

export const categories: Category[] = [
  {
    title: "Step Count",
    subtitle: "Who has walked the furthest around the map?",
    sort: (a, b) => a.save.stepCount - b.save.stepCount,
  },
];
