var mongodbutil = require('../utils/mongo');
var settings = require('../settings');

var service = require('../services/weatherService');


function checkExpiryAndLoadData(wrapped) {
    return function () {
        var db = mongodbutil.getDb();

        const cities = settings.WEATHER_CITIES;

        cities.map(function (city) {
            db.collection('cityWiseData1').findOne({ 'city.name': city.toLowerCase() }, '', async (err, result) => {
                if (err) return console.log(err)
                if (!result || Math.round((new Date().getTime() - result.expiry) / 60000) > settings.DATA_REFRESH_THRESHOLD_IN_MINS) {
                    await __loadData(city);
                }
            });
        });

        const result = wrapped.apply(this, arguments)
        return result;
    }
}

__loadData = async function (city) {
    var db = mongodbutil.getDb();

    let weatherData = service.getData(city);

    weatherData.then((res) => {
        if (res)
            if (res.status == 200) {
                db.collection('cityWiseData1').deleteOne({ 'city.name': city.toLowerCase() }, function () {
                    res.data.expiry = new Date().getTime();
                    res.data.city.name = res.data.city.name.toLowerCase();
                    db.collection('cityWiseData1').insertOne(res.data, (err, results) => {
                        if (err) return console.log(err)
                    });
                })
            }
    });
}


module.exports = {
    checkExpiryAndLoadData
}
