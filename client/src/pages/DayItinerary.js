import {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {ScatterChart} from '@mui/x-charts';
import {
    Container,
    Link,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import backgroundImage from '../static/baloon.jpg';


import LazyTable from '../components/LazyTable';
import FlightDetails from "../components/FlightDetails";

const config = require('../config.json');

// Mapping airline codes to their full names for display
const airlineCode = new Map([
    ['AA', 'American Airlines'],
    ['AS', 'Alaska Airlines'],
    ['B6', 'JetBlue Airways'],
    ['DL', 'Delta Air Lines'],
    ['F9', 'Frontier Airlines'],
    ['NK', 'Spirit Airlines'],
    ['UA', 'United Airlines'],
    ['WN', 'Southwest Airlines']
]);


const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'repeat-y',
    opacity: 0.5, // Set the opacity you want for the background image here
    position: 'absolute', // Position it absolutely to cover the whole container
    top: 0,
    left: 0,
    width: '100%',
    height: '320%',
    zIndex: -1, // Send it to the back
  };

const useStyles = makeStyles((theme) => ({
    header: {
        padding: theme.spacing(5),
        textAlign: 'center',
    },
    tableSection: {
        margin: theme.spacing(4),
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        borderRadius: theme.shape.borderRadius,
    },
    chartSection: {
        margin: theme.spacing(4),
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        borderRadius: theme.shape.borderRadius,
    },
}));

// Component representing the itinerary for a specific day
export default function DayItinerary() {
    const classes = useStyles();

    // States for controlling the modal and selected data
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    // Handler for when a row in the flight details is clicked
    const handleRowClick = (row) => {
        setModalOpen(true);
        setSelectedFlight(row.flight_number);
        setSelectedDate(row.date);
    };

    // Handler for closing the flight details modal
    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedFlight(null);
        setSelectedDate(null);
    };


    // UseLocation hook to access the state passed from the navigation
    const location = useLocation();
    const {day, month, firstRide, secondRide, thirdRide, selectedAirport, itineraryId} = location.state

    const first_ride = firstRide;
    const second_ride = secondRide;
    const third_ride = thirdRide;
    const origin_airport = selectedAirport;

    // Columns configurations for the tables
    const flightColumns = [
        {
            field: 'airline',
            headerName: 'Airline',
            renderCell: (row) => <div>{airlineCode.get(row.flight_number.substring(0, 2))}</div>
        },
        {
            field: 'date',
            headerName: 'Date',
            renderCell: (row) => <div>{row.date.substring(0, 10)}</div>
        },
        {
            field: 'scheduled_arrival_time',
            headerName: 'Arrive',
            renderCell: (row) => <div>{row.scheduled_arrival_time.substring(0, 5)}</div>
        },
        {
            field: 'flight_number',
            headerName: 'Flight',
            renderCell: (row) => <Link onClick={() => handleRowClick(row)}>{row.flight_number}</Link>
        },
    ]

    const scheduleColumns = [
        {field: 'ride_name', headerName: 'Ride'},
        {field: 'hour', headerName: 'Hour'},
        {field: 'effective_wait_times', headerName: 'Estimated Wait Time (minutes)',
        renderCell: (row) => <div>{row.effective_wait_times.toFixed(2)}</div>},
    ]

    const weatherColumns = [
        {
            field: 'year',
            headerName: 'Year'
        },
        {
            field: 'precipitation',
            headerName: 'Precipitation (%)',
            renderCell: (row) => <div>{(row.precipitation * 100).toFixed(2)}%</div>
        },
        {
            field: 'min_temp',
            headerName: 'Lowest Temperature'
        },
        {
            field: 'max_temp',
            headerName: 'Highest Temperature'
        },
        {
            field: 'mean_temp',
            headerName: 'Average Temperature'
        },
    ];

    function getDaySuffix(day) {
        if (day > 3 && day < 21) return 'th'; // covers 4th to 20th
        switch (day % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    }

    // Fetching the correlation data between rain and flight delays
    const [rainFlightData, setRainFlightData] = useState([]);
    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/flight_delay_rain_correlation`)
            .then(
                res => res.json()
            )
            .then(
                resJson => setRainFlightData(resJson),
            );
    }, []);

    const monthsInEng = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const monthInEng = monthsInEng[month - 1]
    const dayWithSuffix = `${day}${getDaySuffix(day)}`;

    return (
        <Container>
            <div style={backgroundStyle}></div>
            <Typography variant="h3" className={classes.header}>
                {monthInEng} {dayWithSuffix}
            </Typography>
            <div className={classes.tableSection}>
                <Typography variant="h4">Ride Schedule</Typography>
            <LazyTable
                route={`http://${config.server_host}:${config.server_port}/itinerary/daily?month=${month}&day=${day}&first_ride=${encodeURIComponent(first_ride)}&second_ride=${encodeURIComponent(second_ride)}&third_ride=${encodeURIComponent(third_ride)}&itineraryId=${itineraryId}`}
                columns={scheduleColumns}
            />
            </div>
            <div className={classes.tableSection}>
                <Typography variant="h4">Historical Weather</Typography>
                <LazyTable
                    route={`http://${config.server_host}:${config.server_port}/weather_for_a_date?day=${day}&month=${month}`}
                    columns={weatherColumns}
                />
            </div>
            <div className={classes.tableSection}>
                <Typography variant="h4">Possible Flights</Typography>
                <LazyTable
                    route={`http://${config.server_host}:${config.server_port}/flights_for_a_date?day=${day}&month=${month}&origin_airport=${encodeURIComponent(origin_airport)}&itineraryId=${itineraryId}`}
                    columns={flightColumns}
                />
            </div>
            <Container style={{width: 'calc(100% - 65px)', borderRadius: '5px', padding: '1em', backgroundColor: 'white'}}>
                <h4>Correlation between likelihood of rain and flight delays in Orlando</h4>
                <p>X-axis: Flight delay (mins); Y-axis: Precipitation</p>

                <ScatterChart
                    width={600}
                    height={300}
                    series={[
                        {
                            data: rainFlightData.map((v) => ({x: v.avg_arrival_delay, y: v.avg_precipitation})),
                        }
                    ]}
                />

            </Container>

            {selectedFlight &&
                <FlightDetails
                    selectedFlight={selectedFlight}
                    selectedDate={selectedDate}
                    handleClose={handleModalClose}
                >
                </FlightDetails>}
        </Container>
    )
}