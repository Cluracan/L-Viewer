import type {
  DashboardSaveEntry,
  DashboardSaveFile,
} from "../../store/useFileStore";

// Constants
const MAJOR_VERSION = "1";
const GAME_NAME = "L-A Mathemagical Adventure";

// Helpers
const hasOwnProperty = <X extends object, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> => {
  return Object.prototype.hasOwnProperty.call(obj, prop); //https://eslint.org/docs/latest/rules/no-prototype-builtins
};

const isVersion = (version: unknown): version is string => {
  const versionRegex = /^\d+\.\d+\.\d+$/;
  return typeof version === "string" && versionRegex.test(version);
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      const result = target?.result;
      if (typeof result !== "string") {
        reject("Unexpected FileReader result");
      } else {
        resolve(result);
      }
    };
    reader.onerror = () => {
      reject("File read error");
    };
    reader.readAsText(file, "UTF-8");
  });
};

const parseJson = (text: string) => {
  try {
    const parsed: unknown = JSON.parse(text);
    return parsed;
  } catch (err) {
    console.error("Failed to parse save file", err);
    return null;
  }
};

const validateSave = (obj: unknown): DashboardSaveEntry | null => {
  if (!obj || typeof obj !== "object") {
    return null;
  }
  if (
    !hasOwnProperty(obj, "gameName") ||
    obj.gameName !== GAME_NAME ||
    !hasOwnProperty(obj, "version") ||
    !isVersion(obj.version) ||
    obj.version.split(".")[0] !== MAJOR_VERSION ||
    !hasOwnProperty(obj, "id") ||
    typeof obj.id !== "string" ||
    !hasOwnProperty(obj, "gameData") ||
    obj.gameData === null
  ) {
    return null;
  }
  return { save: obj.gameData as DashboardSaveFile, id: obj.id };
};

// Main function
export const extractSaveEntries = async (files: FileList) => {
  const droppedFiles = Array.from(files);
  const rawResults = await Promise.all(
    droppedFiles.map(async (file) => {
      const text = await readFileAsText(file);
      const json = parseJson(text);
      return validateSave(json);
    })
  );
  const results: DashboardSaveEntry[] = rawResults.filter((a) => a !== null);

  return results;
};
