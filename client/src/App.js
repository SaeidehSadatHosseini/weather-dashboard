import React, { useState }from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Favorites from "./components/Favorites";
import { useEffect } from "react";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

useEffect(() => {
    fetch("http://localhost:5050/favorites")
      .then(res => res.json())
      .then(data => setFavorites(data))
      .catch(err => console.error("⚠️ Failed to load favorites from server", err));
  }, []);

  // 🔍 Search for a city
  const handleSearch = async (city) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeatherData(data);
      } else {
        alert("City not found!");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  };


 // ⭐ Add to favorites (save to DB too)
const addFavorite = async (city) => {
  if (favorites.some((fav) => fav.city_name === city)) return;

  try {
    const res = await fetch("http://localhost:5050/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city_name: city }),
    });

    if (res.ok) {
      const newFav = await res.json(); // e.g. { id: 3, city_name: "Berlin" }
      setFavorites([...favorites, newFav]); // add to state
    }
  } catch (err) {
    console.error("⚠️ Failed to add favorite", err);
  }
};

// ❌ Remove from favorites (delete from DB too)
const removeFavorite = async (city) => {
  const favToRemove = favorites.find((fav) => fav.city_name === city);
  if (!favToRemove) return;

  try {
    const res = await fetch(`http://localhost:5050/favorites/${favToRemove.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setFavorites(favorites.filter((fav) => fav.id !== favToRemove.id));
    }
  } catch (err) {
    console.error("⚠️ Failed to delete favorite", err);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 flex flex-col items-center p-6 text-gray-800">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 drop-shadow">
        Weather Dashboard
      </h1>

      {/* 🔍 SearchBar */}
      <SearchBar onSearch={handleSearch} />

      {/* 🌤️ WeatherCard */}
      {weatherData && (
  <WeatherCard
    data={weatherData}
    onFavorite={addFavorite}
    removeFavorite={removeFavorite}
    isFavorite={favorites.some((fav) => fav.city_name === weatherData.name)}   // ✅ FIXED
  />
)}

      {/* ⭐ Favorites List */}
      <Favorites
        favorites={favorites}
        onSelect={handleSearch}
        onRemove={removeFavorite}
      />
    </div>
  );
}

export default App;
