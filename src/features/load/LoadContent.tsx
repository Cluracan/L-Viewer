import { Box } from "@mui/material";
import { FileUploader } from "./FileUploader";
import { useFileStore } from "../../store/useFileStore";
import { PlayerSaveList } from "./PlayerSaveList";
import { useRef, type ChangeEvent } from "react";
import { extractSaveEntries } from "./extractSaveEntries";

export const LoadContent = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const filesLoaded = useFileStore(
    (state) => Object.keys(state.fileStore).length > 0
  );
  const updateFiles = useFileStore((state) => state.updateFiles);

  const handleAddFiles = () => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    const results = await extractSaveEntries(e.target.files);
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
        <PlayerSaveList onAddFiles={handleAddFiles} />
      ) : (
        <FileUploader onAddFiles={handleAddFiles} />
      )}
    </Box>
  );
};
