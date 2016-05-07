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
    return (temp - 273.15).toFixed(0);
  }

  function toFahrenheit(temp) {
    return (temp * 9 / 5 - 459.67).toFixed(0);
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
      callback(data);
    });
  }

  function updateHTMLCSS(weatherData) {

    $(".location").text(weatherData.name); 
    $(".weatherIcon").attr("title", weatherData.weather[0].description);
    $(".weatherIcon i").addClass("wi wi-owm-" + weatherData.weather[0].id);
    $(".dayAndTime").text(getDateTime());
    $(".currentTemperature").html(toCelcius(weatherData.main.temp) + "&deg;<span style='color: yellow;'>C</span>");
    $(".thermometer i").addClass("wi wi-thermometer");
    $(".minMaxTemperatures").html(toCelcius(weatherData.main.temp_min) + "&deg;C/" + toCelcius(weatherData.main.temp_max) + "&deg;C");

    var windSpeedKPH = (weatherData.wind.speed * 3.6).toFixed(0); //1 m/s : 3.6 km/h
    var windSpeedMPH = (weatherData.wind.speed * 2.237).toFixed(0); //1 m/s : 2.23694 mi/h
    $(".windDirectionIcon i").addClass("wi wi-wind towards-" + weatherData.wind.deg.toFixed(0) + "-deg");
    $(".windSpeed").text(windSpeedKPH + " km/h");
    
    var unitIndex = 0;
    $(".currentTemperature").click(function() {
      if (unitIndex == 0) {
        $(".currentTemperature").html(toFahrenheit(weatherData.main.temp) + "&deg;<span style='color: yellow;'>F</span>");
        $(".minMaxTemperatures").html(toFahrenheit(weatherData.main.temp_min) + "&deg;F/" + toFahrenheit(weatherData.main.temp_max) + "&deg;F");
        $(".windSpeed").text(windSpeedMPH + " mi/h");
        unitIndex = 1;
      } else {
        $(".currentTemperature").html(toCelcius(weatherData.main.temp) + "&deg;<span style='color: yellow;'>C</span>");
        $(".minMaxTemperatures").html(toCelcius(weatherData.main.temp_min) + "&deg;C/" + toCelcius(weatherData.main.temp_max) + "&deg;C");
        $(".windSpeed").text(windSpeedKPH + " km/h");
        unitIndex = 0;
      }
    });
    
    $(".translucentBG").css({"background-color":"rgba(0,0,0,0.75)", "border-radius":"1.5em"});
    
    /*var currentTime = new Date();
    var isItNight = false;
    
    if (currentTime.getTime() > weatherData.sys.sunset){
      isItNight = true;
    }
      
//    isItNight = true;
//    weatherData.main.temp = 20 + 273;
    alert("Current Time: " + currentTime.getTime() + " Sunset " + weatherData.sys.sunset);
    
    switch (isItNight){
      case false:
        if (toCelcius(weatherData.main.temp) > 15){
          $("body").css("background-image", "url('images/DayA-tiny.jpg')");
        }
        if (toCelcius(weatherData.main.temp) > 0 && toCelcius(weatherData.main.temp) <= 15){
          $("body").css("background-image", "url('images/DayB-tiny.jpg')");
        }
        if (toCelcius(weatherData.main.temp) <= 0){
          $("body").css("background-image", "url('images/DayC-tiny.jpg')");
        }
        break;
      case true:   
        if (toCelcius(weatherData.main.temp) > 15){
          $("body").css("background-image", "url('images/NightA-tiny.jpg')");
        }
        if (toCelcius(weatherData.main.temp) > 0 && toCelcius(weatherData.main.temp) <= 15){
          $("body").css("background-image", "url('images/NightB-tiny.jpg')");
        }
        if (toCelcius(weatherData.main.temp) <= 0){
          $("body").css("background-image", "url('images/NightC-tiny.jpg')");
        }
        break;
    }*/
    


}
  
  getUserLocation(getWeather, updateHTMLCSS);

});
