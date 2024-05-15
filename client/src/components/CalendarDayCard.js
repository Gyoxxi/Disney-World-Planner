import {
  Card,
  CardHeader,
  CardContent,
  Link,
  CardActionArea,
  Box, useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'
import {amber} from "@mui/material/colors";

export default function CalendarDayCard({ width, day, score, rank, month, firstRide, secondRide, thirdRide, selectedAirport, itineraryId }) {

  let color = 'white';
  if (rank < 11){
    color = amber[300];
  }
  else if (rank < 21){
    color = amber[100];
  }
  else if (rank >= 21){
    color = amber[50];
  }

  // gets date to extract day to display on card
  let monthString = (month >= 10) ? month : "0" + month;

  let dateString = "2021-" + monthString + "-" + day;
  let date = new Date(dateString);
  let dayNum = date.getDay();
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let dayName = days[dayNum]

  const isSmallScreen = useMediaQuery('(max-width : 1000px)');


  // returns a CalendarDayCard that shows the date, day and the score with a background color
  return (
    <Box width={`${width}`}>
      <Link to='/dayitinerary' state={{ day: day, month: month, firstRide: firstRide, secondRide: secondRide, thirdRide: thirdRide, selectedAirport: selectedAirport, itineraryId: itineraryId }} component={RouterLink}>
        <Card sx={{ width: "100%", height: "100%", backgroundColor: color, borderRadius: '0pt', boxShadow: 0 }}>
          {isSmallScreen ? ( // Conditionally render CardActionArea based on view width
            <CardActionArea>
              <CardHeader title={day} />
            </CardActionArea>
          ) : (
            <CardActionArea>
              <CardHeader title={day} />
              <CardContent>
                {dayName} <br /> Score: {score}
              </CardContent>
            </CardActionArea>
          )}
        </Card>
      </Link>
    </Box>
  )
}