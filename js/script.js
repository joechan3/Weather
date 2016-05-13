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
    temp = (temp - 32) * (5 / 9);
    return temp.toFixed(0);
  }

  function getUserLocation(callbackOne, callbackTwo, callbackThree) {
    var weatherHasLoaded = false;
    var timeoutID;

    function locationNotShared() {
      if (!weatherHasLoaded) {
        alert("Woof! You have not shared your location. Weather cannot be shown. Please refresh the window and share your location.");
      }
    }

    function getCoordinates() {
      function geolocSuccess(position) {
        weatherHasLoaded = true;
        callbackOne(position, callbackTwo, callbackThree);
      }

      function geolocError(error) {
        weatherHasLoaded = true;
        switch (error.code) {
          case error.TIMEOUT:
            alert("Woof! Geolocation timeout. Weather cannot be shown.");
            break;
          case error.PERMISSION_DENIED:
            alert("Woof! Geolocation permission denied. Weather cannot be shown.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Woof! Geolocation position is unavailable. Weather cannot be shown.");
            break;
          default:
            alert("Woof! Unknown geolocation error. Weather cannot be shown.");
        }
      }

      navigator.geolocation.getCurrentPosition(geolocSuccess, geolocError, {
        timeout: 7000
      });

      timeoutID = window.setTimeout(locationNotShared, 10000);
    }

    var geolocationSupported = Boolean(navigator.geolocation);
    if (geolocationSupported) {
      getCoordinates();
    } else {
      weatherHasLoaded = true;
      alert("Woof! Geolocation functionality is unavailable. Weather cannot be shown.");
      return;
    }
  }

  function getWeather(coordinates, callbackOne, callbackTwo) {
    var apiKey = "2befc703f46550fb43800fa4ca5516f2";
    var apiURL = "https://api.forecast.io/forecast/" + apiKey + "/" + coordinates.coords.latitude + "," + coordinates.coords.longitude + "?callback=?";
    $.getJSON(apiURL, function(data) {
      callbackOne(coordinates, data, callbackTwo);
    });
  }

  function reverseGeocoding(latLong, weatherData, callback) {
    var apiKey = "ppQrUyVhFEYA7Fgo3KOUkOMOZMeIMDAf";
    var apiURL = "https://open.mapquestapi.com/geocoding/v1/reverse?key=" + apiKey + "&location=" + latLong.coords.latitude + "," + latLong.coords.longitude + "&locale=en_US";
    var cityState = new Object();

    $.getJSON(apiURL, function(data) {
      cityState = {
        city: data.results[0].locations[0].adminArea5,
        state: data.results[0].locations[0].adminArea3
      };
      callback(cityState, weatherData);
    });

  }

  function updateHTMLCSS(place, weatherInfo) {

    var description = weatherInfo.currently.summary;
    var iconID = weatherInfo.currently.icon;
    var currentTempC = toCelcius(weatherInfo.currently.temperature);
    var currentTempF = (weatherInfo.currently.temperature).toFixed(0);
    var minTempC = toCelcius(weatherInfo.daily.data[0].temperatureMin);
    var minTempF = (weatherInfo.daily.data[0].temperatureMin).toFixed(0);
    var maxTempC = toCelcius(weatherInfo.daily.data[0].temperatureMax);
    var maxTempF = (weatherInfo.daily.data[0].temperatureMax).toFixed(0);
    var windSpeedKPH = (weatherInfo.currently.windSpeed * 1.61).toFixed(0); //1 mph : 1.60934 kph
    var windSpeedMPH = (weatherInfo.currently.windSpeed).toFixed(0);
    var windDirection = weatherInfo.currently.windBearing.toFixed(0);
    var sunTimes = SunCalc.getTimes(new Date(), weatherInfo.latitude, weatherInfo.longitude);
    var sunsetTime = sunTimes.sunset.getTime(); //milliseconds
    var sunriseTime = sunTimes.sunrise.getTime(); //milliseconds
    var currentTime = new Date();
    var isItNight = false;
    var unitIndex = 0;

    function changeUnits() {
      if (unitIndex === 0) {
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

    function changeBackground() {
      switch (isItNight) {
        case false:
          if (currentTempC > 15) {
            $("body").css("background-image", "url('images/DayA-tiny.jpg')");
          }
          if (currentTempC > 0 && currentTempC <= 15) {
            $("body").css("background-image", "url('images/DayB-tiny.jpg')");
          }
          if (currentTempC <= 0) {
            $("body").css("background-image", "url('images/DayC-tiny.jpg')");
          }
          if (iconID === "rain") {
            $("body").css("background-image", "url('images/Rain-tiny.jpg')");
          }
          break;
        case true:
          if (currentTempC > 15) {
            $("body").css("background-image", "url('images/NightA-tiny.jpg')");
          }
          if (currentTempC > 0 && currentTempC <= 15) {
            $("body").css("background-image", "url('images/NightB-tiny.jpg')");
          }
          if (currentTempC <= 0) {
            $("body").css("background-image", "url('images/NightC-tiny.jpg')");
          }
          break;
      }
    }

    //Maquest occasionally returns a blank string for the state location.
    if (place.state === "") {
      $(".location").text(place.city);
    } else {
      $(".location").text(place.city + ", " + place.state);
    }

    $(".weatherIcon").attr("title", description);
    $(".weatherIcon i").addClass("wi wi-forecast-io-" + iconID);
    $(".dayAndTime").text(getDateTime());
    $(".currentTemperature").html(currentTempC + "&deg;<span style='color: yellow;'>C</span>");
    $(".thermometer i").addClass("wi wi-thermometer");
    $(".minMaxTemperatures").html(minTempC + "&deg;C/" + maxTempC + "&deg;C");
    $(".windDirectionIcon i").addClass("wi wi-wind towards-" + windDirection + "-deg");
    $(".windSpeed").text(windSpeedKPH + " km/h");

    $(".currentTemperature").click(changeUnits);

    $(".fa-pulse").css("display", "none");
    $(".translucentBG").css({
      "background-color": "rgba(0,0,0,0.75)",
      "border-radius": "1.5em"
    });

    if (currentTime.getTime() > sunsetTime || currentTime.getTime() < sunriseTime) {
      isItNight = true;
    }

    changeBackground();
  }

  getUserLocation(getWeather, reverseGeocoding, updateHTMLCSS);

});