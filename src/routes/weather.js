var express = require('express');

var weatherHandlers = require('../handlers/weather');
var decorators = require('../handlers/decorators');

var router = express.Router();


// GET city list weather data
router.get('/weatherList', decorators.checkExpiryAndLoadData(weatherHandlers.cityListData));
// GET weather data for specific city
router.get('/:name', decorators.checkExpiryAndLoadData(weatherHandlers.cityDetailedData));


module.exports = router;
