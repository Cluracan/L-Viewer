import { Card, CardContent, Typography } from "@mui/material";
import { useRef, useState, type DragEvent } from "react";
import { useSaveFileStore } from "../../store/useSaveFileStore";
import { extractSaveEntries } from "./extractSaveEntries";

interface FileDropZoneProps {
  onOpenFilePicker: () => void;
}

export const FileDropZone = ({
  onOpenFilePicker: onClick,
}: FileDropZoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setisDragReject] = useState(false);
  const counter = useRef(0);

  const updateFiles = useSaveFileStore((state) => state.updateFiles);

  const clearDragState = () => {
    setIsDragActive(false);
    setisDragReject(false);
    counter.current = 0;
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isDragReject) {
      clearDragState();
      return;
    }
    clearDragState();

    const results = await extractSaveEntries(e.dataTransfer.files);
    updateFiles(results);
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
    <Card
      onDrop={handleDrop}
      onDragOver={handleDragover}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={onClick}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "30vw",
        height: "30vh",
      }}
    >
      <CardContent>
        <Typography>Drag and drop files here</Typography>
        <Typography>Or Click to load</Typography>
        <Typography>Entered:{isDragActive ? "yes" : "no"}</Typography>
        <Typography>Rejected: {isDragReject ? "Yes" : "No"}</Typography>
      </CardContent>
    </Card>
  );
};
