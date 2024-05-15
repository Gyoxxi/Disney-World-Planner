import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import BuildStep1 from './pages/BuildStep1';
import BuildStep2 from './pages/BuildStep2';

import CalendarView from './pages/CalendarView'
import DayItinerary from "./pages/DayItinerary";

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: amber,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buildstep2/:selectedRides1?/:selectedRides2?/:selectedRides3?" element= {<BuildStep2 />} />
          <Route path="/buildstep1" element= {<BuildStep1 />} />
          <Route path="/calendar/:flightDelay?/:favoriteTemperature?/:maxWaitTime?/:selectedRides1?/:selectedRides2?/:selectedRides3?/:month?/:selectedAirport?" element={<CalendarView />} />
          <Route path="/dayitinerary" element={<DayItinerary />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}