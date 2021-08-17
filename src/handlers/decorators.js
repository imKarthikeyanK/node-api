var mongodbutil = require('../utils/mongo');
var settings = require('../settings');

var service = require('../services/weatherService');


function checkExpiryAndLoadData(wrapped) {
    return async function () {
        var db = mongodbutil.getDb();

        const cities = settings.WEATHER_CITIES;

        let promises = cities.map(function (city) {
            return new Promise((resolve, reject) => {
                db.collection('cityWiseData1').findOne({ 'city.name': city.toLowerCase() }, '', async (err, result) => {
                    if (err) return console.log(err)
                    if (!result || Math.round((new Date().getTime() - result.expiry) / 60000) > settings.DATA_REFRESH_THRESHOLD_IN_MINS) {
                        await __loadData(city, resolver);
                    }
                    else {
                        resolve('r')
                    }
                });
                function resolver() {
                    resolve('r')
                }
            })
        });

        await Promise.all(promises).then(() => {
            const result = wrapped.apply(this, arguments)
            return result;
        })
    }
}

__loadData = async function (city, callback) {
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
                        console.log("[INFO] Inserted")
                        callback()
                    });
                })
            }
    });
}


module.exports = {
    checkExpiryAndLoadData
}
