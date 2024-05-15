const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const path = require('path')

const app = express();
app.use(cors({
  origin: '*',
}));

const _dirname = path.dirname("")
const buildPath = path.join(_dirname  , "../client/build");

app.use(express.static(buildPath))
app.get('/itinerary_score', routes.itinerary_score);
app.get('/weather_for_a_date', routes.weather_for_a_date);
app.get('/flight_delay_rain_correlation', routes.flight_delay_rain_correlation);
app.get('/all_slides', routes.all_slides);
app.get('/itinerary/daily', routes.daily_itinerary);
app.get('/slides_max_wait_by_month', routes.slides_max_wait_by_month);
app.get('/slides_min_wait_by_month', routes.slides_min_wait_by_month);
app.get('/slides_wait_by_hour', routes.slides_wait_by_hour);
app.get('/iata_airports', routes.iata_airports);
app.get('/flights_for_a_date', routes.flights_for_a_date);
app.get('/flight_details', routes.flight_details);
app.get("/*", function(req, res){

    res.sendFile(
        path.join(__dirname, "../client/build/index.html"),
        function (err) {
          if (err) {
            res.status(500).send(err);
          }
        }
      );

})

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;