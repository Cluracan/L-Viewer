import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Dashboard } from "./components/Dashboard";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Dashboard />
      </ThemeProvider>
    </>
  );
}

export default App;
