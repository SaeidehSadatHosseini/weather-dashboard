import React from "react";

function Favorites({ favorites, onSelect, onRemove }) {
  return (
    <div className="mt-8 w-full max-w-md bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-4 text-white">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        ⭐ Favorite Cities
      </h3>

      {favorites.length === 0 ? (
        <p className="text-gray-300 text-center italic">No favorites yet</p>
      ) : (
        <ul className="space-y-2">
          {favorites.map((fav) => (
            <li
              key={fav.id}
              className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-2 hover:bg-white/20 transition"
            >
              {/* city name */}
              <button
                onClick={() => onSelect(fav.city_name)}
                className="text-lg font-medium hover:underline"
              >
                {fav.city_name}
              </button>

              {/* remove button */}
              <button
                onClick={() => onRemove(fav.city_name)}
                className="text-red-400 hover:text-red-600 text-sm font-bold"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorites;
