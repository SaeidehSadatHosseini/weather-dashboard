import React from "react";

function WeatherCard({ data, onFavorite, removeFavorite, isFavorite }) {
  if (!data || data.cod !== 200) return null;
  const { name, main, weather } = data;

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 mt-6 w-full max-w-md text-white">
  <div className="flex justify-between items-center">
    <h2 className="text-xl sm:text-2xl font-bold">{name}</h2>
    <button
      onClick={() => (isFavorite ? removeFavorite(name) : onFavorite(name))}
      className={`text-2xl sm:text-3xl transition-transform hover:scale-110 ${
        isFavorite ? "text-yellow-400" : "text-gray-200"
      }`}
    >
      {isFavorite ? "★" : "☆"}
    </button>
  </div>
  <p className="text-center text-4xl sm:text-5xl font-extrabold mt-4 drop-shadow">
    {Math.round(main.temp)}°C
  </p>
  <p className="text-center text-base sm:text-lg capitalize">{weather[0].description}</p>
</div>


  );
}

export default WeatherCard;
