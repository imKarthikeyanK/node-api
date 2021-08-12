var express = require('express');

var router = express.Router();


// GET city list weather data
router.get('/weatherList', function(req, res, next){
    res.send({
        "status": true,
        "data": [{
            "chennai": {
                "1/1/2021": {
                    "a": "b"
                }
            }
        }]
    });
});


// GET weather data for specific city
router.get('/:name', function(req, res, next){
    res.send({
        "status": true,
        "data": [{
            "chennai": {
                "1/1/2021": {
                    "a": "b"
                }
            }
        }]
    });
});


module.exports = router;
