import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Link } from '@mui/material';

const RideDetailsDialog = ({ openPopup, handleClosePopup, currentRideDetails, currentRideMonthDetails, currentRideMonthMinDetails, currentRideHourDetails }) => {
  return (
    <Dialog open={openPopup} onClose={handleClosePopup}>
      <DialogTitle>
        <Link href={currentRideDetails?.link}>{currentRideDetails?.name}</Link>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {currentRideDetails?.description}
          {currentRideMonthDetails?.map((detail, index) => (
            <div key={index}>
              <p>The month of the year that has the highest wait time is {detail.month} with the average wait time being {detail.average_wait_time} minutes</p>
            </div>
          ))}
          {currentRideMonthMinDetails?.map((detail, index) => (
            <div key={index}>
              <p>The month of the year that has the lowest wait time is {detail.month} with the average wait time being {detail.average_wait_time} minutes</p>
            </div>
          ))}
          {currentRideHourDetails?.map((detail, index) => (
            <div key={index}>
              <p>The hour of the day that has the highest wait time is {detail.max_hour} o' clock with the average wait time being {detail.max_time} minutes</p>
              <p>The hour of the day that has the lowest wait time is {detail.min_hour} o' clock' with the average wait time being {detail.min_time} minutes</p>
            </div>
          ))}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default RideDetailsDialog;
