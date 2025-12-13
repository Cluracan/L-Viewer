import { Box, Paper, Typography } from "@mui/material";
import { useRef, useState, type DragEvent } from "react";
import {
  useFileStore,
  type DashboardSaveEntry,
  type DashboardSaveFile,
} from "../store/useFileStore";
import { FileHolder } from "./FileHolder";

// Helpers
function createKeyGenerator() {
  const counts = new Map();
  return (key: string) => {
    const newCount = (counts.get(key) ?? 0) + 1;
    counts.set(key, newCount);
    return `${key}-${newCount}`;
  };
}
const keygen = createKeyGenerator(); //https://www.reddit.com/r/react/comments/13k2foo/what_to_use_as_key_prop_if_there_is_no_unique_key/

export const FileUploader = () => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragAccept, setIsDragAccept] = useState(false);
  const [isDragReject, setisDragReject] = useState(false);
  const counter = useRef(0);

  const updateFileStore = useFileStore((state) => state.updateFileStore);

  const clearDragState = () => {
    setIsDragActive(false);
    setIsDragAccept(false);
    setisDragReject(false);
    counter.current = 0;
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isDragReject) {
      return;
    }
    clearDragState();
    const droppedFiles = Array.from(e.dataTransfer.files);

    const rawResults = await Promise.all(
      droppedFiles.map(async (file) => {
        const text = await readFileAsText(file);
        const json = parseJson(text);
        return validateSave(json);
      })
    );
    const results: DashboardSaveEntry[] = rawResults
      .filter((a) => a !== null)
      .map((save) => ({
        id: keygen(save.playerName),
        save,
      }));

    updateFileStore(results);
  };

  const handleDragover = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    counter.current++;
    if (
      counter.current === 1 &&
      (e.dataTransfer.types.length !== 1 || e.dataTransfer.types[0] !== "Files")
    ) {
      setisDragReject(true);
    }
    setIsDragActive(true);
  };
  const handleDragLeave = () => {
    counter.current--;
    if (counter.current === 0) {
      clearDragState();
    }
  };
  return (
    <Box
      onDrop={handleDrop}
      onDragOver={handleDragover}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      sx={{
        minWidth: 300,
        minHeight: 300,
      }}
    >
      <Paper>
        <Typography>Drag and drop files here</Typography>
        <FileHolder />

        <Typography>Entered:{isDragActive ? "yes" : "no"}</Typography>
        <Typography>Rejected: {isDragReject ? "Yes" : "No"}</Typography>
        <Typography>Accepted: {isDragAccept ? "Yes" : "No"}</Typography>
      </Paper>
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

function validateSave(obj: unknown): DashboardSaveFile | null {
  if (!obj || typeof obj !== "object") {
    return null;
  }
  if (
    !hasOwnProperty(obj, "gameName") ||
    obj.gameName !== GAME_NAME ||
    !hasOwnProperty(obj, "version") ||
    !isVersion(obj.version) ||
    obj.version.split(".")[0] !== MAJOR_VERSION ||
    !hasOwnProperty(obj, "gameData") ||
    obj.gameData === null
  ) {
    return null;
  }
  return obj.gameData as DashboardSaveFile;
}

const MAJOR_VERSION = "1";
const GAME_NAME = "L-A Mathemagical Adventure";
