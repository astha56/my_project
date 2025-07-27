import React from 'react';

export function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedCuisine,
  setSelectedCuisine,
  sortBy,
  setSortBy,
  cuisines
}) {
  return (
    <div className="filter-bar-wrapper">
      <input
        type="text"
        placeholder="Search restaurants..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        value={selectedCuisine}
        onChange={(e) => setSelectedCuisine(e.target.value)}
      >
        <option value="">All Cuisines</option>
        {cuisines.map((cuisine, index) => (
          <option key={index} value={cuisine}>{cuisine}</option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="rating">Sort by Rating</option>
        <option value="name">Sort by Name</option>
      </select>
    </div>
  );
}