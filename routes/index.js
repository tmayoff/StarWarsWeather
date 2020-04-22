var express = require('express');
var request = require('request');
var config = require('../config');
var planets = require('../planets');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  if ((req.query.lat == undefined || req.query.lat == undefined) && req.query.city == undefined) {
    next({message: "No location chosen"});
    return;
  }

  let url = "https://api.openweathermap.org/data/2.5/weather?";
  if (req.query.city) {
    url += `q=${req.query.city}`;
  } else {
    url += `lat=${req.query.lat}&lon=${req.query.long}`;
  }
  url += `&appid=${config.openweathermapApiKey}`;


  request(url, {json: true}, (wErr, wRes, wBody) => {
    if(wBody.cod == "404") {
      next(wBody);
      return;
    }

    let p = getPlanet(wBody.main.temp, wBody.main.humidity);
    res.render('index', { body: wBody, temp: kelvinToCelsius(wBody.main.temp), planet: p });

  });
});

module.exports = router;

function kelvinToCelsius (k) {
  return (k - 273.15).toFixed(2);
}

function getPlanet (temp, humidity) {
  

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