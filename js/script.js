//Thanks: https://github.com/mourner/suncalc (A tiny JavaScript library for calculating sun/moon positions and phases.)

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

  function toCelcius(temp) {
    temp -= 273.15;
    return temp.toFixed(0);
  }

  function toFahrenheit(temp) {
    temp = temp * 9 / 5 - 459.67;
    return temp.toFixed(0);
  }
  
  function getUserLocation(callback, callbackCallback) {
    function getCoordinates() {
      function geolocSuccess(position) {
        console.log("Latitude is " + position.coords.latitude);
        console.log("Longitude is " + position.coords.longitude);
        console.log(position);
        callback(callbackCallback, position);
      }

      function geolocError(error) {
        //console.log(error);
        switch (error.code) {
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
            console.log("Unknown geolocation error");
        }
      }

      navigator.geolocation.getCurrentPosition(geolocSuccess, geolocError, {
        timeout: 7000
      });
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

  function getWeather(callback, coordinates) {
    var apiKey = "a30715156be421b33a5c806dbda32111";
    var apiURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + coordinates.coords.latitude + "&lon=" + coordinates.coords.longitude + "139&appid=" + apiKey;
    var testJSONURL = "https://api.myjson.com/bins/1bm8o"

    $.getJSON(testJSONURL, function(data) {
      callback(data, coordinates);
    });
  }

  function updateHTMLCSS(weatherData, position) {

    var location = weatherData.name;
    var description = weatherData.weather[0].description;
    var iconID = weatherData.weather[0].id;
    var currentTempC = toCelcius(weatherData.main.temp);
    var currentTempF = toFahrenheit(weatherData.main.temp);
    var minTempC = toCelcius(weatherData.main.temp_min);
    var minTempF = toFahrenheit(weatherData.main.temp_min);
    var maxTempC = toCelcius(weatherData.main.temp_max);
    var maxTempF = toFahrenheit(weatherData.main.temp_max);
    var windSpeedKPH = (weatherData.wind.speed * 3.6).toFixed(0); //1 m/s : 3.6 km/h
    var windSpeedMPH = (weatherData.wind.speed * 2.237).toFixed(0); //1 m/s : 2.23694 mi/h
    var windDirection = weatherData.wind.deg.toFixed(0);
    var sunTimes = SunCalc.getTimes(new Date(), position.coords.latitude, position.coords.longitude);
    var sunsetTime = sunTimes.sunset.getTime(); //milliseconds
    var currentTime = new Date();
    var isItNight = false;
    var unitIndex = 0;
    console.log(weatherData);
    function changeUnits(){
      if (unitIndex == 0) {
        $(".currentTemperature").html(currentTempF + "&deg;<span style='color: yellow;'>F</span>");
        $(".minMaxTemperatures").html(minTempF + "&deg;F/" + maxTempF + "&deg;F");
        $(".windSpeed").text(windSpeedMPH + " mi/h");
        unitIndex = 1;
      } else {
        $(".currentTemperature").html(currentTempC + "&deg;<span style='color: yellow;'>C</span>");
        $(".minMaxTemperatures").html(minTempC + "&deg;C/" + maxTempC + "&deg;C");
        $(".windSpeed").text(windSpeedKPH + " km/h");
        unitIndex = 0;
      }
    }
    
    function changeBackground(){
      switch (isItNight){
        case false:
          if (currentTempC > 15){
            $("body").css("background-image", "url('images/DayA-tiny.jpg')");
          }
          if (currentTempC > 0 && currentTempC <= 15){
            $("body").css("background-image", "url('images/DayB-tiny.jpg')");
          }
          if (currentTempC <= 0){
            $("body").css("background-image", "url('images/DayC-tiny.jpg')");
          }
          break;
        case true:   
          if (currentTempC > 15){
            $("body").css("background-image", "url('images/NightA-tiny.jpg')");
          }
          if (currentTempC > 0 && currentTempC <= 15){
            $("body").css("background-image", "url('images/NightB-tiny.jpg')");
          }
          if (currentTempC <= 0){
            $("body").css("background-image", "url('images/NightC-tiny.jpg')");
          }
          break;
      }
    }
    
    $(".location").text(location); 
    $(".weatherIcon").attr("title", description);
    $(".weatherIcon i").addClass("wi wi-owm-" + iconID);
    $(".dayAndTime").text(getDateTime());
    $(".currentTemperature").html(currentTempC + "&deg;<span style='color: yellow;'>C</span>");
    $(".thermometer i").addClass("wi wi-thermometer");
    $(".minMaxTemperatures").html(minTempC + "&deg;C/" + maxTempC + "&deg;C");
    $(".windDirectionIcon i").addClass("wi wi-wind towards-" + windDirection + "-deg");
    $(".windSpeed").text(windSpeedKPH + " km/h");
    
    $(".currentTemperature").click(changeUnits);
    
    $(".translucentBG").css({"background-color":"rgba(0,0,0,0.75)", "border-radius":"1.5em"});
    
    if (currentTime.getTime() > sunsetTime){
      isItNight = true;
    }
    changeBackground();
    
}
  
  getUserLocation(getWeather, updateHTMLCSS);

});
