# node-api for Weather app

A simple and small backend server for storing and serving weather data from openweathermap.org. 

It provides two APIs for the following use cases respectively

1. Get City list with key weather data
2. Get detailed weather report for the next 5 days for a particular city

# To Run

To run the application in local <br>

- clone the repository
- install the dependencies using `npm install`
- Once dependencies installed, `cd` into `src`
- and run `DEBUG=myapp:* npm start`
- now, the server will be running on the below host and port <br>

`http://127.0.0.1:3001`

<br>
thats all, hit the API with the following endpoints <br>
- /weatherData/weatherList <br>
- /weatherData/:cityName
