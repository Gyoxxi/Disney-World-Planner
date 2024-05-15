import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle, List,
  ListItem, ListItemText
} from '@mui/material';
const config = require('../config.json');

const fieldDescriptions = {
  flight_number: "Flight Number",
  date: "Date",
  origin_airport: "From",
  destination: "To",
  scheduled_arrival_time: "Arrive",
  average_delay: "Average Delay (Minutes)",
  max_delay: "Longest Delay (Minutes)",
};
export default function FlightDetails({ selectedFlight, selectedDate, handleClose }) {
  const [flightData, setFlightData] = useState([{}]);
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/flight_details?flight_number=${selectedFlight}&date=${selectedDate}`)
    .then(res => res.json())
    .then(resJson => {
      setFlightData(resJson[0]);
    });
  }, []);

  // date, flight_number, origin_airport, scheduled_arrival_time, average_delay, max_delay
  return(
    <Dialog
      open={true}
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle id="alert-dialog-title">
        {"Flight Details"}
      </DialogTitle>
      <DialogContent>
        <List>
          {Object.keys(flightData).map(key => (
            <ListItem key={key}>
              <ListItemText primary={`${fieldDescriptions[key]}: ${flightData[key]}`} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>

  );
}