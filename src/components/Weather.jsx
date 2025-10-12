import React, { useState } from "react";
import ErrorComponent from "./ErrorComponent.jsx";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import drizzle_icon from "../assets/drizzle.png";
import cloud_icon from "../assets/cloud.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function Weather() {
  const [city, setCity] = useState("");

  const [weatherData, setWeatherData] = useState(false); // state to store data coming fromo API

  const [cityNotFound, setCityNotFound] = useState(false);

  const [loading, setLoading] = useState(false);

  const [lastSearchedCity, setLastSearchedCity] = useState("");

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  // fn to call api
  const fetchWeather = async () => {
    if (city === "") {
      alert("Enter City Name!");
      return;
    }

    setLoading(true); // Start loading
    setLastSearchedCity(city); // Save the city being searched

    try {
      const API_KEY = import.meta.env.VITE_APP_ID;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

      const response = await fetch(url); // using fetch api, to get data frov this url

      if (!response.ok) {
        if (response.status === 404) {
          setCityNotFound(true);
          setWeatherData(false); // Clear previous weather data
        } else {
          console.log(`Error: ${response.status}`);
        }
        setLoading(false); // Stop loading on error
        return;
      }

      const data = await response.json(); // converts response using json method
      console.log(data);
      setCityNotFound(false);

      const icons = allIcons[data.weather[0].icon] || clear_icon;
      // icon id passes in [], ||clear_icon is for if icon code not available in[]

      // Data getting from API is storing in weatherData State using setWeatherData fun [storing data in one object]
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        location: data.name,
        temperature: data.main.temp,
        icon: icons,
        // iconID: data.weather[0].icon,
      });
    } catch (error) {
      setWeatherData(false);
      console.error("Error in Fetching Weather Data: ", error);
    } finally {
      setLoading(false); // Stop loading after fetch completes
    }
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchWeather();
    }
  };
  const handleOnclick = () => {
    fetchWeather();
  };

  return (
    <div className="weather">
      <h1 className="heading">Weather App</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter City"
          value={city}
          onChange={handleCityChange}
          onKeyDown={handleKeyPress}
        />
        <img src={search_icon} alt="" onClick={handleOnclick} />
      </div>

      {loading && city === lastSearchedCity ? (
        <>
        <Skeleton circle={true} height={150} width={150} style={{ margin: '20px auto' }} />
        <Skeleton height={40} width={150} style={{ margin: '10px auto' }} />
        <Skeleton height={30} width={200} style={{ margin: '10px auto' }} />
        <div className="weather-data">
          <div className="col">
            <Skeleton circle={true} height={40} width={40} />
            <div>
              <Skeleton height={20} width={60} />
              <Skeleton height={15} width={80} />
            </div>
          </div>
          <div className="col">
            <Skeleton circle={true} height={40} width={40} />
            <div>
              <Skeleton height={20} width={60} />
              <Skeleton height={15} width={80} />
            </div>
          </div>
        </div>
      </>
      ) : weatherData && city === lastSearchedCity ? (
        <>
          <img src={weatherData.icon} alt="" className="weather-icon" />
          {/* <img
                src={`https://openweathermap.org/img/wn/${weatherData.iconID}@2x.png`}
                alt="weather icon" className="weather-icon"
              /> */}
          <p className="temperature">{weatherData.temperature} °c</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {cityNotFound && city === lastSearchedCity ? (
        <>
          <ErrorComponent />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
export default Weather;
