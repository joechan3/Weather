$(document).ready(function() {
  "use strict";

  function getDateTime() {
    var dayOfWeek = new Date();
    var hours = new Date();
    var minutes = new Date();
    var meridiemSide = "a.m.";

    dayOfWeek = dayOfWeek.getDay();
    switch (dayOfWeek) {
      case 0:
        dayOfWeek = "Sunday";
        break;
      case 1:
        dayOfWeek = "Monday";
        break;
      case 2:
        dayOfWeek = "Tuesday";
        break;
      case 3:
        dayOfWeek = "Wednesday";
        break;
      case 4:
        dayOfWeek = "Thursday";
        break;
      case 5:
        dayOfWeek = "Friday";
        break;
      case 6:
        dayOfWeek = "Saturday";
        break;
    }

    hours = hours.getHours();
    if (hours >= 12) {
      meridiemSide = "p.m.";
    }
    if (hours > 12) {
      hours = hours - 12;
    }

    minutes = minutes.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return dayOfWeek.toUpperCase() + " " + hours + ":" + minutes + " " + meridiemSide;
  }

  function getUserLocation(callback, callbackCallback) {
    function getCoordinates() {
      function geolocSuccess(position){
        console.log("Latitude is " + position.coords.latitude);
        console.log("Longitude is " + position.coords.longitude);
        console.log(position);
        callback(callbackCallback,position);
      }
      
      function geolocError(error){
        //console.log(error);
        switch(error.code){
          case error.TIMEOUT:
            console.log("Geolocation timeout");
            break;
          case error.PERMISSION_DENIED:
            console.log("Geolocation permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("Geolocation position is unavailable");
            break;
          default:
            console.log("Unknown geolocation error")
        }
      }
      
      navigator.geolocation.getCurrentPosition(geolocSuccess, geolocError,{timeout:7000});
    }

    var geolocationSupported = Boolean(navigator.geolocation);
    if (geolocationSupported) {
      getCoordinates();
    } else {
      console.log("Geolocation functionality is unavailable.");
      //Some error page
      return;
    }
  }

  function getWeather(callback, coordinates){
    var apiKey = "a30715156be421b33a5c806dbda32111";
    var apiURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + coordinates.coords.latitude + "&lon=" + coordinates.coords.longitude + "139&appid=" + apiKey;
    var testJSONURL = "https://api.myjson.com/bins/1bm8o"
    
    
    console.log("getWeather function called!");
    $.getJSON(testJSONURL, function (data){
      callback(data);
    });
  }
  
  function updateHTMLCSS(weatherData){
    console.log("Update HTML CSS function called!");
        
    function toCelcius (temp){
      return (temp-273.15).toFixed(0);
    }
    
    function toFahrenheit (temp){
      return (temp * 9/5-459.67).toFixed(0);
    }
    
    //write function convert Units
    
    $(".currentTemperature").html(toCelcius(weatherData.main.temp) + "&deg;C");
    $(".minMaxTemperatures").html(toCelcius(weatherData.main.temp_min) + "&deg;C/" + toCelcius(weatherData.main.temp_max) + "&deg;C");
    var tempUnitIndex = 0;
    $(".currentTemperature").click(function convertUnits(){
      if (tempUnitIndex == 0){
        $(".currentTemperature").html(toFahrenheit(weatherData.main.temp) + "&deg;F");
        $(".minMaxTemperatures").html(toFahrenheit(weatherData.main.temp_min) + "&deg;F/" + toFahrenheit(weatherData.main.temp_max) + "&deg;F")
        tempUnitIndex = 1;
      } else {
        $(".currentTemperature").html(toCelcius(weatherData.main.temp) + "&deg;C");
        $(".minMaxTemperatures").html(toCelcius(weatherData.main.temp_min) + "&deg;C/" + toCelcius(weatherData.main.temp_max) + "&deg;C")
        tempUnitIndex = 0;
      }
    });
    
    $(".location").text(weatherData.name);
    $(".weatherIcon i").addClass("wi wi-owm-"+weatherData.weather[0].id);
    $(".dayAndTime").text(getDateTime());
    $(".windDirectionIcon i").addClass("wi wi-wind towards-" + weatherData.wind.deg.toFixed(0) +"-deg"); 
    
    var windSpeedIndex = 0; 
    var windSpeedKPH = (weatherData.wind.speed * 3.6).toFixed(0); //1 m/s : 3.6 km/h
    var windSpeedMPH = (weatherData.wind.speed * 2.237).toFixed(0); //1 m/s : 2.23694 mi/h
    var windSpeedKnots = (weatherData.wind.speed * 1.944).toFixed(0) //1 m/s : 1.94384 knots
    $(".windSpeed").text(windSpeedKPH + " km/h");
    $(".windSpeed").click(function(){
      switch (windSpeedIndex) {
        case 0:
          $(".windSpeed").text(windSpeedMPH + " mi/h"); 
          windSpeedIndex = 1;
          break;
        case 1:
          $(".windSpeed").text(windSpeedKnots + " knots"); 
          windSpeedIndex = 2;
          break;
        case 2:
          $(".windSpeed").text(windSpeedKPH + " km/h"); 
          windSpeedIndex = 0;
          break;
      }
    });
    
    
    $(".precipHeight").text(weatherData.rain["3h"] + " in.");
  }
  
  
  
  getUserLocation(getWeather,updateHTMLCSS);

});







//DEFINE FUNCTIONS HERE







// function updateHTMLCSS(){
// blah blah;
//}

//create test function for different weather conditions.
//maybe a form to enter values with?

//SEQUENCE
//determineDateTime();
//determineUserLocation(getWeather,updateHTMLCSS);


//Determine date and time
//  -Convert to string and store into variable.

//Determine user location(ASYNC) function determineUserLocation(callback)



//CALLBACK: request weather info(ASYNC) function getWeather(callback)
//  SEND
//  - user location
//  - API key
//  GET and store into object the following
//  - Weather type (cloud, sunny, etc.)
//  - Current temperature
//  - Wind speed
//  - Wind direction
//  - Minimum temp
//  - Maximum temp
//  - Precipitation height

//CALLBACK Update HTML and CSS function updateHTMLCSS()
//  -location
//  - Weather icon
//    - Use API mapping
//  - Current temperature
//  - Date and time
//  - Wind direction icon
//  - Wind speed
//  - Minimum temp
//  - Maximum temp
//  - Precipitation height
// Update CSS
//  - Determine current screen size and orientation
//  - Change background to appropriate picture
//  

// determineUserLocation(getWeather);
//getWeather(updateHTMLCSS);



//// Backup console.log so we can restore it later
//var ___log = console.log;
///**
// * Silences console.log
// * Undo this effect by calling unmute().
// */
//function mute() {
//    console.log = function(){};
//}
///**
// * Un-silences console.log
// */
//function unmute() {
//    console.log = ___log;
//}
//
//mute();
//MyClass.functionThatPrintsOutput();
//unmute();