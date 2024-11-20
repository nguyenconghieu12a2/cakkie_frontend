import React from "react";

function Sidebar({ setPriceRange, setRatingRange, resetFilters }) {
  return (
    <div className="bg-white p-4 shadow-md border-t border-gray-300">
      <div className="text-gray-800">
        <h3 className="text-lg font-semibold">Filters</h3>

        {/* Price Range Filter */}
        <div className="mt-4">
          <h4 className="font-semibold">Price</h4>
          <input
            type="range"
            min="0"
            max="1000000"
            step="1000"
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs">
            <span>0</span>
            <span>1,000,000</span>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mt-4">
          <h4 className="font-semibold">Rating</h4>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            onChange={(e) => setRatingRange(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-xs">
            <span>0</span>
            <span>5</span>
          </div>
        </div>

        {/* Reset Filters */}
        <button
          onClick={resetFilters}
          className="mt-4 px-4 py-2 text-white bg-red-600 rounded"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
