# CIS 550 Group 9 Project Disney World Planner
Disney World Planner is a planning tool that creates an optimized itinerary for a trip to Disney's Magic Kingdom Orlando based on user preferences. 

The application can be accessed via: http://44.218.40.72/

## Key features 
- List of rides in Disney World Orlando with ride information and historical statistics on wait time  
- User input forms on preferences for month, climate, rides, wait times, and probability of flight delays
- A proprietary algorithm to calculate a score to rank match user preferences 
- Generation of a visual monthly calendar to visualize results 
- Generation of a one-day itinerary with the proposed detailed schedule of rides
- Flight suggestions for the preferred date chosen by user and flight details 

## Technologies
The application’s backend server is built on Node.js, frontend client is built on React.js, based on Homework 2’s framework. Datasets supporting the application are stored in a MYSQL database hosted on an AWS RDS instance. We built HTTPS APIs to enable communication between the backend server and frontend client. We deployed the application using AWS EC2. http://44.218.40.72/

## ER diagram
<img width="1042" alt="Screenshot 2023-12-13 at 9 04 15 PM" src="https://github.com/adatao219/DisneyWorldPlanner/assets/85789376/c474541b-09a0-492e-bf2d-6b1b756c287b">

## File directory explanation
- Disney Data: Consists of raw data of information related to Disney World Magic Kingdom Orlando between Jan 2015 to Dec 2021
- climate_data: Consists of raw data of information related to climate in Orlando between Jan 2015 to Dec 2021
- flight_date: Consists of raw data of information related to flights into and out of Orlando International Airport between Jan 2015 to Dec 2021
- DWP: Main application code

## How to build it locally 
- Clone the Github
- Navigate to DWP
- Navigate to server folder and run 'npm install'. Once installed, run 'npm start'
- You can see the beautiful full stack application in http://localhost:8080/
