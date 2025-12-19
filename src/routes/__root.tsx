import {
  AppBar,
  Avatar,
  Box,
  createTheme,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import logo from "../assets/images/LogoL.svg";

const drawerWidth = 240;

const darkTheme = createTheme({
  typography: {
    // fontFamily: "Lucida Console",
  },
  palette: {
    mode: "dark",
    primary: {
      main: "hsla(66, 70%, 54%, 1.00)",
      light: "hsla(66, 70%, 63%, 1.00)",
      dark: "hsla(66, 61%, 37%, 1.00)",
      contrastText: "#211e08",
    },
  },
});

const RootLayout = () => (
  <>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Avatar alt="Logo" src={logo} variant="square" sx={{ mr: 2 }} />
            <Typography>Dashboard</Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/">
                  Home
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/load">
                  Load
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/map">
                  Map
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>

        <Outlet />
      </Box>
    </ThemeProvider>
  </>
);

export const Route = createRootRoute({ component: RootLayout });
