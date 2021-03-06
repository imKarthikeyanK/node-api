var mongodbutil = require('../utils/mongo');
var settings = require('../settings');


cityListData = async function (req, res) {
    var db = mongodbutil.getDb();

    processedData = [];

    const cities = settings.WEATHER_CITIES;

    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;

    const minTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000).getTime() - (8.5 * 60 * 60 * 1000)
    const maxTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000).getTime() + (8.5 * 60 * 60 * 1000)

    var promises = cities.map(function (city) {
        
        return new Promise((resolve, reject) => {
            db.collection('cityWiseData1').findOne({ 'city.name': city.toLowerCase() }, '', async (err, result) => {
                if (err) return console.log(err)

                if (result) {
                    var isProcessed = false

                    for (const item of result.list) {
                        const parsedTimestamp = item.dt * 1000;

                        if (parsedTimestamp > minTime && parsedTimestamp < maxTime) {
                            if (isProcessed) {
                                continue
                            }

                            processedData.push({
                                city: city,
                                temp: item.main.temp,
                                minTemp: item.main.temp_min,
                                maxTemp: item.main.temp_max,
                                weather: item.weather[0].main
                            })

                            isProcessed = true;
                        }
                    }
                }
                resolve('r')
            });
        });
    });

    await Promise.all(promises).then(async () => {
        res.send({
            "status": true,
            "data": processedData
        });
    })
}


cityDetailedData = function (req, res) {
    const city = req.params.name;
    var db = mongodbutil.getDb();

    db.collection('cityWiseData1').findOne({ 'city.name': city.toLowerCase() }, '', async (err, result) => {
        if (err) return console.log(err)
        res.send({
            "status": true,
            "data": result
        });
    });
}


module.exports = {
    cityListData,
    cityDetailedData
}
