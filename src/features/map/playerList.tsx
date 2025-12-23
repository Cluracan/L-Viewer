import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import type { DashboardSaveFile } from "../../store/useSaveFileStore";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CircleIcon from "@mui/icons-material/Circle";

interface PlayerListProps {
  selectedPlayers: [string, DashboardSaveFile][];
  level: string;
  handleIncreaseLevel: () => void;
  handleDecreaseLevel: () => void;
}

// Helpers
const uuidToColor = (uuid: string) => {
  const hexDigits = uuid.replaceAll("-", "").slice(0, 6);
  return `#${hexDigits}`;
};

export const PlayerList = ({
  selectedPlayers,
  level,
  handleDecreaseLevel,
  handleIncreaseLevel,
}: PlayerListProps) => {
  return (
    <Card>
      <CardContent
        sx={{ display: "flex", flexDirection: "column", height: "50vh" }}
      >
        <CardHeader
          title={
            <Stack direction={"row"} sx={{ alignItems: "center", gap: 2 }}>
              <IconButton onClick={handleDecreaseLevel}>
                <NavigateBeforeIcon />
              </IconButton>
              <Typography variant="h5">{level}</Typography>
              <IconButton onClick={handleIncreaseLevel}>
                <NavigateNextIcon />
              </IconButton>
            </Stack>
          }
        />

        <List sx={{ flexGrow: 1, overflowY: "auto" }}>
          {selectedPlayers.map(([id, save]) => {
            return (
              <ListItem key={id}>
                <ListItemIcon>
                  <CircleIcon sx={{ color: uuidToColor(id) }} />
                </ListItemIcon>
                <ListItemText primary={save.playerName} />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};
