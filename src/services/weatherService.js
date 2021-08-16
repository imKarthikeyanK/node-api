var axios = require('axios');

var settings = require('../settings');


const getData = async function (city) {
    const endpoint = `https://api.openweathermap.org/data/2.5/forecast?`;
    
    const params = {
        q: city,
        appid: settings.OPEN_WEATHER_API_KEY
    }
    try {
        const response = await axios.get(endpoint, { params: params });
        // response = {}
        return response;
    }
    catch (error) {
        return false;
    }
}


module.exports = {
    getData
}
