var express = require('express');
var request = require('request');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  if (req.query.lat == undefined || req.query.lat == undefined) {
    next({message: "No location chosen"});
    return;
  }

  request(`https://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.long}&appid=2df1975fad489b5fbdbaa315e2b67d0e`, {json: true}, (wErr, wRes, wBody) => {
    console.log(wBody);
    let p = getPlanet(wBody.main.temp, wBody.main.humidity);
    res.render('index', { body: wBody, temp: kelvinToCelsius(wBody.main.temp), planet: p });

  });
});

module.exports = router;

function kelvinToCelsius (k) {
  return (k - 273.15).toFixed(2);
}

function getPlanet (temp, humidity) {
  let planets = [ {
      name: 'hoth',
      min_temp: 0,
      max_temp: 263.15,
      img: '/images/hoth.jpg',
      color: 'dark'
    }, {
      name: 'jakku',
      min_temp: 293.15,
      max_temp: 304.15,
      img: '/images/jakku.jpg',
      color: 'dark'
    }, {
      name: 'degobah',
      min_temp: 263.15,
      max_temp: 283.15,
      min_humidity: 80,
      img: '/degobah.jpg',
      color: 'dark'
    }, {
      name: 'endor',
      min_temp: 263.15,
      max_temp: 293.15,
      img: '/images/endor.jpg',
      color: 'dark'
    }
  ]

  let currentPlanet;
  planets.forEach(planet => {
    // Temperature
    if (temp < planet.min_temp || temp > planet.max_temp) {
      return;
    }

    // Humidity
    if (planet.min_humidity && humidity < planet.min_humidity) {
      return;
    }

    currentPlanet = planet;
  });

  if (!currentPlanet) {
    planets.forEach(planet => {
      // Temperature
      if (temp < planet.min_temp || temp > planet.max_temp) {
        return;
      }
  
      currentPlanet = planet;
    });
  }

  return currentPlanet;
}