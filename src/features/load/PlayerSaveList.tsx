import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSaveFileStore } from "../../store/useSaveFileStore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
interface PlayerSaveListProps {
  onOpenFilePicker: () => void;
}

export const PlayerSaveList = ({
  onOpenFilePicker: onClick,
}: PlayerSaveListProps) => {
  const fileStore = useSaveFileStore((state) => state.fileStore);
  const deleteFile = useSaveFileStore((state) => state.deleteFile);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const itemsSelected = selected.size > 0;
  const allPlayersSelected = selected.size === Object.keys(fileStore).length;
  const handleClick = (id: string) => {
    deleteFile(id);
  };

  const handleSelect = (id: string) => {
    const nextSelected = new Set([...selected]);
    if (nextSelected.has(id)) {
      nextSelected.delete(id);
    } else {
      nextSelected.add(id);
    }
    setSelected(nextSelected);
  };

  const handleSelectAll = () => {
    const allPlayers = Object.keys(fileStore);
    const nextSelected = new Set<string>();
    if (selected.size < allPlayers.length) {
      for (const id of Object.keys(fileStore)) {
        nextSelected.add(id);
      }
    }
    setSelected(nextSelected);
  };

  const handleDeleteSelected = () => {
    for (const id of selected) {
      deleteFile(id);
    }
  };

  return (
    <Card
      sx={{
        height: "clamp(30vh,40vh,80vh)",
        width: "clamp(30vw, 40vw,50vw)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        title={
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 2, mx: 2, my: 1 }}
          >
            <Checkbox
              edge="start"
              disableRipple
              onChange={handleSelectAll}
              checked={allPlayersSelected}
            />
            <Typography variant="h5">Player List</Typography>
            {itemsSelected && (
              <Tooltip
                title={allPlayersSelected ? "Remove All" : "Remove Selected"}
              >
                <IconButton onClick={handleDeleteSelected} color="primary">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
        action={
          <Tooltip title="Add files">
            <IconButton onClick={onClick} sx={{}}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        }
        sx={{
          "& .MuiCardHeader-action": {
            alignSelf: "center",
            mr: 2,
          },
        }}
      />
      <Divider />
      <CardContent
        sx={{
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <List>
          {Object.entries(fileStore)?.map(([id, save]) => {
            return (
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
                <ListItemButton onClick={() => handleSelect(id)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selected.has(id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={save.playerName} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};
