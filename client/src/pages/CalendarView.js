import React, {useEffect, useState} from 'react';
import {
  Container,
  Card,
  CardContent,
  CircularProgress,
  Box, Stack
} from '@mui/material';
import {useParams} from 'react-router-dom';
import backgroundImage from '../static/pastel.jpg';

import CalendarDayCard from '../components/CalendarDayCard';
import BuildItineraryHeader from "../components/BuildItineraryHeader";
import {amber} from "@mui/material/colors";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";


const config = require('../config.json');

export default function CalendarView() {

  // extracts parameters from previous page
  const {
    flightDelay,
    favoriteTemperature,
    maxWaitTime,
    selectedRides1,
    selectedRides2,
    selectedRides3,
    month,
    selectedAirport
  } = useParams();

  // gets the metrics that were chosen by the user
  const firstRide = JSON.stringify(selectedRides1).replace(/^"|"$/g, '');
  const secondRide = JSON.stringify(selectedRides2).replace(/^"|"$/g, '');
  const thirdRide = JSON.stringify(selectedRides3).replace(/^"|"$/g, '');
  const waitTimePref = maxWaitTime;
  const tempPref = favoriteTemperature;
  const delayPref = flightDelay;

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // makes an API call to the backend to calculate scores for the month based on user preferences
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/itinerary_score?waitTimePref=${waitTimePref}` +
      `&tempPref=${tempPref}&delayPref=${delayPref}&month=${month}` +
      `&firstRide=${firstRide}&secondRide=${secondRide}&thirdRide=${thirdRide}`)
      .then(
        res => res.json()
      )
      .then(resJson => {
        setScores(resJson);
        setLoading(false); // Set loading to false after fetching data
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, []);

  const flexFormat = { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' };
  const legendFormat = {
    width: "calc(100% / 3)",
    height: "40pt",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize:{ xs: '8pt', sm: '10pt', md: '12pt', lg: '12pt' },
    fontWeight:"80",
  };

  // used to display the month chosen by the user
  const monthsInEng = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const monthInEng = monthsInEng[month - 1];

  const cardsPerRow = 7;
  const remainingCardsInLastRow = scores.length % cardsPerRow;


  const Legend = () => {
    return (
      <Stack
        height={"40pt"}
        width={"100%"}
        direction={"row"}
        sx={[flexFormat, {borderRadius: '20pt', mb:'40pt'}]}
      >
        <Box
          sx={[legendFormat, {borderBottomLeftRadius:'20pt', borderTopLeftRadius:'20pt'}]}
          bgcolor={amber[300]}
        >
          best for you
        </Box>
        <Box
          sx={legendFormat}
          bgcolor={amber[200]}
        >
          still works
        </Box>
        <Box
          sx={[legendFormat, {borderBottomRightRadius:'20pt', borderTopRightRadius:'20pt'}]}
          bgcolor={amber[50]}
        >
          least suitable
        </Box>
      </Stack>
    );
  }

  // shows a page with a monthly calendar showing the various days within the chosen month
  // and the relative score for each day
  return (
    <div style={flexFormat}>
      <BuildItineraryHeader
        title={`${monthInEng} 2021`}
        src={backgroundImage}
        bodyText="Here are our recommendations based on your preferences.
         Click on your preferred date to see a proposed day itinerary and more information."
        activeBox={3}
      />

      <Stack direction={"column"} sx={[flexFormat, {width:"70%", alignItems:"center"}]}>
        <Legend/>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            marginBottom:"60pt",
            paddingY:'20pt',
            borderWidth:'5pt',
            borderColor:'red',
            borderRadius:'20pt',
            backgroundColor:'white',
            width: '100%',
          }}
        >
          {loading ? (
            // Render the loading indicator while data is being fetched
            <CircularProgress size={80} value={50} thickness={7.2} sx={flexFormat}/>
          ) : (
            // Render the content when data is loaded
            scores.map((row, idx) => (
              <CalendarDayCard
                key={idx}
                day={idx + 1}
                score={row.Score}
                rank={row.ScoreRank}
                month={month}
                firstRide={firstRide}
                secondRide={secondRide}
                thirdRide={thirdRide}
                selectedAirport={selectedAirport}
                itineraryId={row.ItineraryId}
                width={"calc(100%/7)"}
                className={idx >= scores.length - remainingCardsInLastRow ? 'last-row-card' : 'upper-row-card'}
              />
            ))
          )}
        </Box>

      </Stack>

    </div>
  );
};