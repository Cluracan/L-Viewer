import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useSaveFileStore } from "../../store/useSaveFileStore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
interface PlayerSaveListProps {
  onOpenFilePicker: () => void;
}

export const PlayerSaveList = ({
  onOpenFilePicker: onClick,
}: PlayerSaveListProps) => {
  const fileStore = useSaveFileStore((state) => state.fileStore);
  const deleteFile = useSaveFileStore((state) => state.deleteFile);
  console.log(fileStore);
  const handleClick = (id: string) => {
    deleteFile(id);
  };

  return (
    <Card>
      <CardContent>
        <CardHeader
          title="Player list"
          action={
            <IconButton onClick={onClick}>
              <AddIcon />
            </IconButton>
          }
        />
        <Divider />
        <List sx={{ width: "30vw", height: "30vh" }}>
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
