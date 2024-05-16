# Disney World Planner
Disney World Planner is a planning tool that creates an optimized itinerary for a trip to Disney's Magic Kingdom Orlando based on user preferences. 

This is the open-source version using local MySQL database. 

## Key Features 
- List of rides in Disney World Orlando with ride information and historical statistics on wait time  
- User input forms on preferences for month, climate, rides, wait times, and probability of flight delays
- A proprietary algorithm to calculate a score to rank match user preferences 
- Generation of a visual monthly calendar to visualize results 
- Generation of a one-day itinerary with the proposed detailed schedule of rides
- Flight suggestions for the preferred date chosen by user and flight details 


## ER Diagram
<img width="1042" alt="ER diagram" src="/data/ER.png">

## File Directories
- data/disney_data: Consists of raw data of information related to Disney World Magic Kingdom Orlando between Jan 2015 to Dec 2021
- data/climate_data: Consists of raw data of information related to climate in Orlando between Jan 2015 to Dec 2021
- data/flight_date: Consists of raw data of information related to flights into and out of Orlando International Airport between Jan 2015 to Dec 2021
- client: Consists of front-end scripts and static files
- server: Consists of back-end APIs and embedded SQL queries

## Steps to Build
- Clone the Github
- Navigate to server folder and run 'npm install'. Once installed, run 'npm start'
- You can see the beautiful full stack application in http://localhost:8080/
