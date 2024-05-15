import React, {useEffect, useState} from 'react';
import {
  Container,
  Grid,
  Slider,
  Select,
  FormControl,
  MenuItem, Box, Stack,
} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import SearchSelect from "../components/SearchSelect";
import backgroundImage from '../static/minnie.jpg';
import CustomButton from "../components/CustomButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import BuildItineraryHeader from "../components/BuildItineraryHeader";
import {amber} from "@mui/material/colors";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const config = require('../config.json');


export default function SlidersPage() {

  const {selectedRides1, selectedRides2, selectedRides3} = useParams();

  const [airports, setAirports] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState('IATA - Airport');

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/iata_airports`)
      .then(res => res.json())
      .then(resJson => setAirports(resJson));
  }, []);

  useEffect(() => {
    if (airports.length > 0) {
      const options = airports.map(airport => `${airport.origin_airport} - ${airport.name}`);
      setAllOptions(options);
    }
  }, [airports]);

  const [flightDelay, setFlightDelay] = useState(30);
  const [favoriteTemperature, setFavoriteTemperature] = useState(68);
  const [maxWaitTime, setMaxWaitTime] = useState(60);

  const [month, setMonth] = useState(1);

  const [isScrolled, setIsScrolled] = useState(false);

  let navigate = useNavigate();

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    // Set isScrolled to true when the user scrolls beyond a certain point
    setIsScrolled(scrollPosition > 10);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSelectedAirport = (e) => {
    setSelectedAirport(e.target.value);
  }

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleFlightDelayChange = (event, newValue) => {
    setFlightDelay(newValue);
  };

  const handleFavoriteTemperatureChange = (event, newValue) => {
    setFavoriteTemperature(newValue);
  };

  const handleMaxWaitTimeChange = (event, newValue) => {
    setMaxWaitTime(newValue);
  };

  const monthOptions = Array.from({length: 12}, (_, index) => {
    const monthNumber = index + 1;
    const monthName = new Date(2022, index, 1).toLocaleString('en-US', {month: 'long'});
    const formattedMonth = `${monthNumber.toString().padStart(2, '0')} - ${monthName}`;
    return (
      <MenuItem key={monthNumber} value={monthNumber}>
        {formattedMonth}
      </MenuItem>
    );
  });

  const CalendarView = () => {
    navigate(`/calendar/${flightDelay}/${favoriteTemperature}/${maxWaitTime}/${selectedRides1}/${selectedRides2}/${selectedRides3}/${month}/${selectedAirport.substring(0, 3)}`);
  };

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };



  return (
    <Stack
      direction={"column"}
      sx={flexFormat}
    >
      <BuildItineraryHeader
        title="Build Your Itinerary"
        src={backgroundImage}
        bodyText="Prepare for your magical journey at Disney World.
         Choose your ideal flight delay, favorite weather, wait time, and month to make unforgettable memories."
        activeBox={2}
      />

      <Grid
        container
        direction={"column"}
        columnSpacing={"80px"}
        rowSpacing={"20px"}
        width="60%"
        sx={[flexFormat, {mb:"80px"}]}
      >
        <Grid item xs={12} md={10} lg={12}>
          <h4 style={{textAlign: "justify"}}>Which airport will you be flying from to embark on your adventure?</h4>
          <SearchSelect allOptions={allOptions} value={selectedAirport}
                        onChange={handleSelectedAirport}/>
        </Grid>

        <Grid item  xs={12} md={10} lg={6}>
          <h4 style={{textAlign: "justify"}}>If your flight is fashionably late, how many extra minutes can
            you handle?</h4>
          <Slider
            aria-label="Flight Delay"
            value={flightDelay}
            onChange={handleFlightDelayChange}
            valueLabelDisplay="auto"
            step={5}
            marks
            min={0}
            max={180}
            sx={{
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                backgroundColor: '#fff',
                '&::before': {
                  boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: 'none',
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={10} lg={6}>
          <h4 style={{textAlign: "justify"}}>What temperature (°F) suits your ideal Disney adventure?</h4>
          <Slider
            aria-label="Temperature"
            value={favoriteTemperature}
            onChange={handleFavoriteTemperatureChange}
            valueLabelDisplay="auto"
            step={2}
            marks
            min={30}
            max={110}
            sx={{
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                backgroundColor: '#fff',
                '&::before': {
                  boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: 'none',
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={10} lg={6}>
          <h4 style={{textAlign: "justify"}}>When it comes to waiting in lines, how many minutes are you cool
            with?</h4>
          <Slider
            aria-label="Wait Time"
            value={maxWaitTime}
            onChange={handleMaxWaitTimeChange}
            valueLabelDisplay="auto"
            step={10}
            marks
            min={10}
            max={240}
            sx={{
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                backgroundColor: 'white',
                '&::before': {
                  boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: 'none',
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={10} lg={6}>
          <h4 style={{textAlign: "justify"}}>What's your ideal month to experience the magic?</h4>
          <Select
            fullWidth
            variant={"standard"}
            value={month}
            IconComponent={(props) => (<ArrowDownwardIcon sx={{fill:amber[300]}} {...props}/>)}
            sx={{
              '&:before': {
                borderColor: amber[300],
                borderWidth:"2px"
              },
            }}
            onChange={handleMonthChange}>
            {monthOptions}
          </Select>
        </Grid>

      </Grid>


      <CustomButton
        onClick={CalendarView}
        disabled={selectedAirport === 'IATA - Airport'}
        fontSize="18pt"
        text="Next"
        icon={<KeyboardArrowRightIcon />}
        isScrolled={isScrolled}
      />
    </Stack>
  );
}