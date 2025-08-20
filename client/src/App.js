import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";


function App() {
  const [favorites, setFavorites] = useState([]);
  const [weather, setWeather] = useState(null);



  // Handle search
  const handleSearch = (city) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => setWeather(data));
  };

 // Load favorites on app start
useEffect(() => {
  fetch("http://localhost:5050/favorites")   // ✅ FIXED
    .then(res => res.json())
    .then(data => setFavorites(data))
    .catch(err => console.error("⚠️ Failed to load favorites from server", err));
}, []);

// Add city
const addFavorite = (city) => {
  fetch("http://localhost:5050/favorites", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ city_name: city })
})
  .then(res => {
    if (!res.ok) throw new Error("Server error " + res.status);
    return res.json();
  })
  .then(() => setFavorites([...favorites, { city_name: city }]))
  .catch(err => console.error("⚠️ Add favorite failed:", err));

};


// Remove city
const removeFavorite = (city) => {
  fetch(`http://localhost:5050/favorites/${city}`, {   // ✅ FIXED
    method: "DELETE"
  })
    .then(() => setFavorites(favorites.filter(f => f.city_name !== city)));
};

  return (
        <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex flex-col items-center px-4 py-6">
           <h1 className="text-white text-3xl sm:text-4xl font-extrabold p-4 mt-2 drop-shadow-lg text-center">
          🌤 Weather Dashboard
        </h1>




      <SearchBar onSearch={handleSearch} />

      {weather && (
        <WeatherCard
          data={weather}
          onFavorite={addFavorite}
          removeFavorite={removeFavorite}
          isFavorite={favorites.some(f => f.city_name === weather.name)}
        />
      )}

     <div className="mt-6 w-full max-w-md">
  <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white drop-shadow">⭐ Favorites</h2>
  <ul className="space-y-2">
  {favorites.map((fav) => (
    <li
      key={fav.city_name}
      className="flex justify-between items-center bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg text-white text-sm sm:text-base"
    >
      <button
        onClick={() => handleSearch(fav.city_name)}
        className="font-semibold hover:underline hover:text-yellow-300 transition-colors"
      >
        {fav.city_name}
      </button>
      <button
        onClick={() => removeFavorite(fav.city_name)}
        className="text-red-400 hover:text-red-600"
      >
        ✖
      </button>
    </li>
  ))}
</ul>

</div>

    </div>
  );
}

export default App;
