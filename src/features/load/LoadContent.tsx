import { Box } from "@mui/material";
import { FileUploader } from "./FileUploader";
import {
  useFileStore,
  type DashboardSaveEntry,
  type DashboardSaveFile,
} from "../../store/useFileStore";
import { FileHolder } from "./FileHolder";
import { useRef, type ChangeEvent } from "react";

export const LoadContent = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const filesLoaded = useFileStore(
    (state) => Object.keys(state.fileStore).length > 0
  );
  const updateFiles = useFileStore((state) => state.updateFiles);

  const handleChooseFileClick = () => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const droppedFiles = Array.from(e.target.files);
    const rawResults = await Promise.all(
      droppedFiles.map(async (file) => {
        const text = await readFileAsText(file);
        const json = parseJson(text);
        return validateSave(json);
      })
    );
    const results: DashboardSaveEntry[] = rawResults.filter((a) => a !== null);

    updateFiles(results);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".sav"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {filesLoaded ? (
        <FileHolder onClick={handleChooseFileClick} />
      ) : (
        <FileUploader onClick={handleChooseFileClick} />
      )}
    </Box>
  );
};

function hasOwnProperty<X extends object, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop); //https://eslint.org/docs/latest/rules/no-prototype-builtins
}

const isVersion = (version: unknown): version is string => {
  const versionRegex = /^\d+\.\d+\.\d+$/;
  return typeof version === "string" && versionRegex.test(version);
};

function readFileAsText(file: File): Promise<string> {
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
}

function parseJson(text: string) {
  try {
    const parsed: unknown = JSON.parse(text);
    return parsed;
  } catch (err) {
    console.error("Failed to parse save file", err);
    return null;
  }
}

function validateSave(obj: unknown): DashboardSaveEntry | null {
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
}

const MAJOR_VERSION = "1";
const GAME_NAME = "L-A Mathemagical Adventure";
