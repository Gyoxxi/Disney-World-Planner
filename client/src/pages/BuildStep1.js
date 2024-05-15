import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid, Stack, Typography
} from '@mui/material';
import { useNavigate} from 'react-router-dom';
import Slide from "../components/Slide";
import RideDetailsDialog from "../components/RideDetailsDialog";
import titleBackground from '../static/TitleBackground.jpg';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CustomButton from "../components/CustomButton";
import BuildItineraryHeader from "../components/BuildItineraryHeader";

const config = require('../config.json');

export default function Build_Itinerary_1() {
  let navigate = useNavigate();

  const [all_slides, set_all_slides] = useState([]);
  const [selectedRides, setSelectedRides] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [currentRideDetails, setCurrentRideDetails] = useState(null);
  const [currentRideMonthDetails, setCurrentRideMonthDetails] = useState(null);
  const [currentRideMonthMinDetails, setCurrentRideMonthMinDetails] = useState(null);
  const [currentRideHourDetails, setCurrentRideHourDetails] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/all_slides`)
      .then(res => res.json())
      .then(resJson => set_all_slides(resJson));
  }, []);



  const handleCheckboxChange = (rideName, e) => {
    if (e.target.checked) {
      setSelectedRides(prev => [...prev, rideName]);
    } else {
      setSelectedRides(prev => prev.filter(ride => ride !== rideName));
    }
  };

  const handleRideClick = async (slide) => {
    try {

      let cleanedName = JSON.stringify(slide.name).replace(/^"|"$/g, '');

      const rideDetailResponse = await fetch(`http://${config.server_host}:${config.server_port}/slides_max_wait_by_month?ride_name=%22${cleanedName}%22`);
      const rideDetail = await rideDetailResponse.json();

      const rideMonthMinResponse = await fetch(`http://${config.server_host}:${config.server_port}/slides_min_wait_by_month?ride_name=%22${cleanedName}%22`);
      const rideMonthMin = await rideMonthMinResponse.json();

      console.log("Ride details received:", rideDetail);
      const rideDetailMinHourResponse = await fetch(`http://${config.server_host}:${config.server_port}/slides_wait_by_hour?ride_name=%22${cleanedName}%22`);
      const rideDetailMinHour = await rideDetailMinHourResponse.json();

      // Update state with the fetched data
      setCurrentRideDetails(slide);
      setCurrentRideMonthDetails(rideDetail); 
      setCurrentRideMonthMinDetails(rideMonthMin); 
      setCurrentRideHourDetails(rideDetailMinHour)

      setOpenPopup(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors or show a message to the user
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const BuildStep2 = () => {
    if (selectedRides.length === 3) {
      const selectedRidesParams = selectedRides.join('/');
      localStorage.setItem('selectedRides', JSON.stringify(selectedRides));
      navigate(`/buildstep2/${selectedRidesParams}`);
    } else {
      alert('Please select exactly three rides.');
    }
  };

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <div>
      <BuildItineraryHeader
        title="Pick Your Favorite Rides"
        src={titleBackground}
        bodyText='Explore amazing destinations and plan your perfect trip with 3 magical rides.
        Click on the image to learn more about each ride.'
        activeBox={1}
      />
      <Box
        sx={{
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        <Grid
          container
          spacing={3}
          sx={flexFormat}
          width="80%"
          >
          {all_slides.map((slide) => (
            <Grid item key={slide.name} xs={6} md={4} lg={3}>
              <Slide
                slide={slide}
                selectedRides={selectedRides}
                handleCheckboxChange={handleCheckboxChange}
                handleRideClick={handleRideClick}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <CustomButton
        onClick={BuildStep2}
        disabled={selectedRides.length !== 3}
        fontSize="18pt"
        text="Next"
        icon={<KeyboardArrowRightIcon />}
        isScrolled={isScrolled}
      />

      <RideDetailsDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        currentRideDetails={currentRideDetails}
        currentRideMonthDetails={currentRideMonthDetails}
        currentRideMonthMinDetails={currentRideMonthMinDetails}
        currentRideHourDetails={currentRideHourDetails}
      />

    </div>
  );
}
