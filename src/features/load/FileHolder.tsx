import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useFileStore } from "../../store/useFileStore";
import DeleteIcon from "@mui/icons-material/Delete";
export const FileHolder = () => {
  const fileStore = useFileStore((state) => state.fileStore);
  const deleteFile = useFileStore((state) => state.deleteFile);
  console.log(fileStore);
  const handleClick = (id: string) => {
    deleteFile(id);
  };

  return (
    <Card>
      <CardContent>
        <CardHeader title="Player list" />
        <List sx={{ width: "30vw", height: "30vh" }}>
          {/* <ListItem>
            <ListItemText primary="Players" />
          </ListItem> */}
          {Object.entries(fileStore)?.map(([id, save]) => (
            <ListItem
              key={id}
              secondaryAction={
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    handleClick(id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemText primary={save.playerName} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
