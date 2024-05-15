const mysql = require('mysql2')
const config = require('./config.json')

const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect((err) => err && console.log(err));


// Route 1: GET /itinerary_score
const itinerary_score = async function (req, res) {

    let waitTimePref = req.query.waitTimePref;
    let tempPref = req.query.tempPref;
    let delayPref = req.query.delayPref;
    let month = req.query.month;
    let firstRide = req.query.firstRide;
    let secondRide = req.query.SecondRide;
    let thirdRide = req.query.ThirdRide;

    try {

        const data = await new Promise((resolve, reject) => {
            connection.query(`
  WITH AVG_TEMP AS (
    SELECT DAY(date) as day, AVG((max_temp + min_temp) / 2) AS avg_temp
    FROM CLIMATE
    WHERE YEAR(date) NOT IN ('2021') AND MONTH(date) = ?
    GROUP BY day
 ),
 AVG_WAITTIME AS (
     SELECT DAY(date) as day, AVG(wait_time) AS avg_wait_time
     FROM WAIT_TIME
     WHERE ride_name IN (?, ?, ?) AND YEAR(date) NOT IN ('2021') AND MONTH(date) = ?
     GROUP BY day
 ),
 AVG_FD AS (
     SELECT DAY(date) as day, AVG(arrival_delay) as avg_delay
     FROM FLIGHTS
     WHERE origin_airport = 'ATL' AND YEAR(date) NOT IN ('2021') AND MONTH(date) = ?
     GROUP BY day
 ),
 
 SCORE AS (
 SELECT AT.day as Day, - (AW.avg_wait_time - ?) - ABS(AT.avg_temp - ?) - (AF.avg_delay - ?) AS Score
 FROM AVG_TEMP AT JOIN AVG_WAITTIME AW ON AT.day = AW.day JOIN AVG_FD AF ON AW.day = AF.day
 )
 
 SELECT Day, FORMAT(Score, '#') as Score, RANK() OVER (ORDER BY Score DESC) AS ScoreRank
 FROM SCORE
 ORDER BY Day

  `, [month, firstRide, secondRide, thirdRide, month, month, waitTimePref, tempPref, delayPref], (err, data) => {
                if (err || data.length === 0) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

        async function processInsertions() {
            for (let i = 0; i < data.length; i++) {
                try {

                    const result = await new Promise((resolve, reject) => {
                        connection.query(`
                        INSERT INTO ITINERARY (score, exposed_to)
                        VALUES (${data[i].Score}, '2021-${month}-${data[i].Day}');
                    `, {title: 'test'}, function (err, result, fields) {
                            if (err) reject(err);
                            resolve(result);
                        });
                    });

                    Object.defineProperty(data[i], 'ItineraryId', {
                        value: result.insertId,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                    console.log(result.insertId);

                } catch (err) {
                    console.error(err);
                }
            }
        }

        await processInsertions();

        console.log(data);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.json({});
    }

}

// Route 2: GET /flight_delay_rain_correlation
const flight_delay_rain_correlation = async function (req, res) {

    connection.query(`
  WITH likelihood_of_rain AS (
    SELECT WEEK(date) as week,
    AVG(precipitation) as avg_precipitation
 FROM CLIMATE
 WHERE YEAR(date) NOT IN ('2021')
 GROUP BY WEEK(date)
    ),
 avg_delay_by_week AS (
 SELECT WEEK(date) as week, AVG(arrival_delay) as avg_arrival_delay
 FROM FLIGHTS
 WHERE YEAR(date) NOT IN ('2021')
 GROUP BY WEEK(date)
    )
 SELECT avg_arrival_delay, avg_precipitation
 FROM avg_delay_by_week A JOIN likelihood_of_rain R ON A.week = R.week
 ORDER BY A.avg_arrival_delay
  `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            console.log(data);
            res.json(data);
        }
    });
}


// Route 3: GET /weather_for_a_date
const weather_for_a_date = async function (req, res) {

    // const song_id = req.params.song_id;
    let day = req.query.day;
    let month = req.query.month;

    connection.query(`
    SELECT YEAR(date) AS year, precipitation, min_temp, max_temp, (max_temp + min_temp) / 2 AS mean_temp
    FROM CLIMATE
    WHERE DAY(date) = ? AND MONTH(date) = ? AND YEAR(date) != 2021
  `, [day, month], (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            console.log(data);
            res.json(data);
        }
    });
}

// Route 4: GET /all_slides
const all_slides = async function (req, res) {

    connection.query(`
  SELECT *
  FROM RIDE_DETAILS
  ORDER BY name
  `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            console.log(data);
            res.json(data);
        }
    });
}

// Route 5: GET /slides_max_wait_by_month
const slides_max_wait_by_month = async function (req, res) {

    let ride_name = req.query.ride_name;
    connection.query(`
  SELECT
  AVG(wait_time) AS average_wait_time,
  ride_name,
  MONTH(date) AS month
  FROM WAIT_TIME
  WHERE time >= '8:00:00' AND time <= '20:00:00'
  AND date >= '2015-01-01' AND date < '2020-12-31'
  AND ride_name = ${ride_name}
  GROUP BY MONTH(date)
  ORDER BY average_wait_time DESC LIMIT 1
  `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            console.log(data);
            res.json(data);
        }
    });
}

// Route 6: GET /slides_min_wait_by_month
const slides_min_wait_by_month = async function (req, res) {

    let ride_name = req.query.ride_name;
    connection.query(`
  SELECT
  AVG(wait_time) AS average_wait_time,
  ride_name,
  MONTH(date) AS month
  FROM WAIT_TIME
  WHERE time >= '8:00:00' AND time <= '20:00:00'
  AND date >= '2015-01-01' AND date < '2020-12-31'
  AND ride_name = ${ride_name}
  GROUP BY MONTH(date)
  ORDER BY average_wait_time LIMIT 1
  `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            console.log(data);
            res.json(data);
        }
    });
}

// Route 7: GET /slides_wait_by_hour
const slides_wait_by_hour = async function (req, res) {

    let ride_name = req.query.ride_name;
    connection.query(`
  WITH filtered_data AS (
    SELECT
      AVG(wait_time) AS average_wait_time,
      ride_name,
      HOUR(time) AS hour
    FROM WAIT_TIME
    WHERE time >= '08:00:00' AND time <= '20:00:00'
      AND date >= '2015-01-01' AND date < '2020-12-31'
      AND ride_name = 'Big Thunder Mountain Railroad'
    GROUP BY ride_name, HOUR(time)
  )
  SELECT
    DISTINCT fd.ride_name,
    MIN(fd.hour) OVER (PARTITION BY fd.ride_name) as min_hour,
    MAX(fd.hour) OVER (PARTITION BY fd.ride_name) as max_hour,
    MIN(fd.average_wait_time) OVER (PARTITION BY fd.ride_name) as min_time,
    MAX(fd.average_wait_time) OVER (PARTITION BY fd.ride_name) as max_time
  FROM filtered_data fd
  `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            console.log(data);
            res.json(data);
        }
    });
}

// Route 8: GET /daily_itinerary
const daily_itinerary = async function (req, res) {
    let month = req.query.month;
    let day = req.query.day;
    let first_ride = req.query.first_ride;
    let second_ride = req.query.second_ride;
    let third_ride = req.query.third_ride;
    let itinerary_id = req.query.itineraryId;

    try {

        const data = await new Promise((resolve, reject) => {
            const query = `
    WITH get_hour_per_ride AS (
        SELECT ride_name, HOUR(time) AS hour, wait_time
        FROM WAIT_TIME
        WHERE MONTH(date) = ?
          AND ride_name IN (?, ?, ?)
          AND HOUR(time) BETWEEN 8 AND 20
        ORDER BY wait_time
    ),
    first_hour AS (
        SELECT * FROM get_hour_per_ride WHERE ride_Name = ? LIMIT 1
    ),
    second_hour AS (
        SELECT * FROM get_hour_per_ride
        WHERE ride_name = ? AND hour NOT IN (SELECT hour FROM first_hour)
        LIMIT 1
    ),
    third_hour AS (
        SELECT * FROM get_hour_per_ride
        WHERE ride_name = ? AND hour NOT IN ((SELECT hour FROM first_hour) UNION (SELECT hour FROM second_hour))
        LIMIT 1
    ),
    selected_hours AS (
        (SELECT * FROM first_hour)
        UNION
        (SELECT * FROM second_hour)
        UNION
        (SELECT * FROM third_hour)
    ),
    daily_avg_wait_times_per_ride AS (
        SELECT ride_name, EXTRACT(DAY FROM date) AS day_of_month, HOUR(time) AS hour, AVG(wait_time) AS avg_wait_time
        FROM WAIT_TIME
        WHERE MONTH(date) = ? AND DAY(date) = ? AND YEAR(date) < 2021 AND ride_name IN (?, ?, ?)
        GROUP BY ride_name, day_of_month
    ),
    weekly_avg_wait_times_per_ride AS (
        SELECT ride_name, WEEK(date) AS week_num, HOUR(time) AS hour, AVG(wait_time) AS avg_wait_time
        FROM WAIT_TIME
        WHERE MONTH(date) = ? AND DAY(date) = ? AND YEAR(date) < 2021 AND ride_name IN (?, ?, ?)
        GROUP BY ride_name, week_num
    ),
    dates AS (
        SELECT DATE(CONCAT('2021-', LPAD(?, 2, '0'), '-', LPAD(?, 2, '0'))) AS date,
               ? AS day_of_month,
               WEEK(DATE(CONCAT('2021-', LPAD(?, 2, '0'), '-', LPAD(?, 2, '0')))) AS week_num
    ),
    ride_list AS (
        SELECT ? AS ride_name
        UNION ALL
        SELECT ?
        UNION ALL
        SELECT ?
    ),
    joined_dates AS (
        SELECT d.date, d.day_of_month, d.week_num, rs.ride_name
        FROM dates d
        CROSS JOIN ride_list rs
    ),
    combined_wait_times AS (
        SELECT d.date, d.day_of_month, d.week_num, weekly_avg.ride_name, 
               COALESCE(daily_avg.avg_wait_time, weekly_avg.avg_wait_time) AS effective_wait_times
        FROM joined_dates d
        LEFT JOIN daily_avg_wait_times_per_ride daily_avg ON d.day_of_month = daily_avg.day_of_month AND d.ride_name = daily_avg.ride_name
        LEFT JOIN weekly_avg_wait_times_per_ride weekly_avg ON d.week_num = weekly_avg.week_num AND d.ride_name = weekly_avg.ride_name
    )
    SELECT c.date, c.ride_name, s.hour, c.effective_wait_times
    FROM combined_wait_times c
    JOIN selected_hours s ON c.ride_name = s.ride_name
    ORDER BY c.date, s.hour;
    `;

            connection.query(query, [month, first_ride, second_ride, third_ride, first_ride, second_ride, third_ride,
                month, day, first_ride, second_ride, third_ride, month, day, first_ride, second_ride, third_ride,
                month, day, day, month, day, first_ride, second_ride, third_ride], (err, data) => {
                if (err || data.length === 0) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

        async function processInsertions() {
            for (let i = 0; i < data.length; i++) {
                try {

                    const result = await new Promise((resolve, reject) => {
                        connection.query(`
                        INSERT INTO INCLUDES (ride_name, itinerary_id, ranking, time_to_take_ride)
                        VALUES ('${data[i].ride_name}', ${itinerary_id}, ${i}, '${data[i].hour}:00:00');
                    `, {title: 'test'}, function (err, result, fields) {
                            if (err) reject(err);
                            resolve(result);
                        });
                    });

                    console.log(result.insertId);

                } catch (err) {
                    console.error(err);
                }
            }
        }

        await processInsertions();

        console.log(data);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.json({});
    }
}

// Route 9: GET /iata_airports
const iata_airports = async function (req, res) {
    connection.query(`
    SELECT distinct f.origin_airport, a.name
    FROM FLIGHTS f
    JOIN AIRPORTS a ON a.iata_code = f.origin_airport
  `, (err, data) => {
        if (err || data.length === 0) {
            console.log(err);
            res.json({});
        } else {
            res.json(data);
        }
    });
}


// Route 10: GET /flights_for_a_date
const flights_for_a_date = async function (req, res) {

    let year = '2021';
    let day = req.query.day.toString().padStart(2, '0');
    let month = req.query.month.toString().padStart(2, '0');
    let curr_day = `${year}-${month}-${day}`;
    let airport = req.query.origin_airport.toString();
    let itineraryId = req.query.itineraryId;


    try {

        const data = await new Promise((resolve, reject) => {
            connection.query(`
  SELECT date, scheduled_arrival_time, flight_number
  FROM FLIGHTS
  WHERE ((date='${curr_day}' AND TIME(scheduled_arrival_time) < '09:00')
  OR date=DATE_SUB('${curr_day}', INTERVAL 1 Day))
  AND origin_airport='${airport}'
  AND flight_number IN (
       SELECT flight_number
       FROM FLIGHTS
       WHERE YEAR(date) < 2021
       GROUP BY flight_number
       HAVING AVG(arrival_delay) < 20)
  ORDER BY date DESC, scheduled_arrival_time DESC

  `, (err, data) => {
                if (err || data.length === 0) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });

        async function processInsertions() {
            for (let i = 0; i < data.length; i++) {
                try {
                    const result = await new Promise((resolve, reject) => {
                        connection.query(`
                        INSERT INTO SUGGESTS (itinerary_id, flight_date, flight_number)
                        VALUES (${itineraryId}, '${curr_day}', '${data[i].flight_number}');
                    `, {title: 'test'}, function (err, result, fields) {
                            if (err) reject(err);
                            resolve(result);
                        });
                    });

                    // If you want to associate the insertId with your data object, you can do it here
                    // For example:
                    // data[i].ItineraryId = result.insertId;

                } catch (err) {
                    console.error(err);
                }
            }
        }

        await processInsertions();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.json({});
    }
}


// Route 11: GET /flight_details
const flight_details = async function (req, res) {

    let date = req.query.date.substring(0, 10);
    let flight_number = req.query.flight_number;

    connection.query(`
    WITH DELAY AS (
       SELECT ROUND(AVG(arrival_delay),0) as average_delay, ROUND(MAX(arrival_delay),0) as max_delay
       FROM FLIGHTS
       WHERE YEAR(date) < 2021
       AND flight_number='${flight_number}'
       GROUP BY flight_number
    )
    SELECT SUBSTRING(date, 1, 10) AS date, flight_number, origin_airport, 'MCO' as destination, SUBSTRING(scheduled_arrival_time, 1, 5) AS scheduled_arrival_time, average_delay, max_delay
    FROM FLIGHTS, DELAY
    WHERE date='${date}'
    AND flight_number='${flight_number}'
  `, (err, data) => {
        if (err || data.length === 0) {
            console.log("fail");
            res.json({});
        } else {
            console.log(data);
            res.json(data);
        }
    });
}


module.exports = {
    itinerary_score,
    weather_for_a_date,
    flight_delay_rain_correlation,
    all_slides,
    slides_max_wait_by_month,
    slides_min_wait_by_month,
    slides_wait_by_hour,
    daily_itinerary,
    iata_airports,
    flights_for_a_date,
    flight_details,
}
