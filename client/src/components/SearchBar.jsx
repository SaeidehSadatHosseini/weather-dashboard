import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      onSearch(city);
      setCity("");
    }
  };

  return (
   <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md mt-4">
  <input
    type="text"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    placeholder="Enter city..."
    className="flex-grow px-4 py-3 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base sm:text-lg"
  />
  <button
    type="submit"
    className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 sm:px-5 py-2 sm:py-3 rounded-2xl font-semibold shadow-lg text-sm sm:text-base"
  >
    🔍
  </button>
</form>


  );
}

export default SearchBar;
