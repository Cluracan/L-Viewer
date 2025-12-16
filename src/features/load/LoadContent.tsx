import { Box } from "@mui/material";
import { FileUploader } from "./FileUploader";
import { useFileStore } from "../../store/useFileStore";
import { FileHolder } from "./FileHolder";

export const LoadContent = () => {
  const filesLoaded = useFileStore(
    (state) => Object.keys(state.fileStore).length > 0
  );
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
      {filesLoaded ? <FileHolder /> : <FileUploader />}
    </Box>
  );
};
