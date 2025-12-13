import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import { useFileStore } from "../store/useFileStore";
import DeleteIcon from "@mui/icons-material/Delete";
export const FileHolder = () => {
  const fileStore = useFileStore((state) => state.fileStore);
  const deleteFile = useFileStore((state) => state.deleteFile);
  console.log(fileStore);
  const handleClick = (id: string) => {
    deleteFile(id);
  };

  return (
    <List>
      {fileStore?.map((entry) => (
        <ListItem
          key={entry.id}
          secondaryAction={
            <IconButton
              aria-label="delete"
              onClick={() => {
                handleClick(entry.id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText primary={entry.save.playerName} />
        </ListItem>
      ))}
    </List>
  );
};
