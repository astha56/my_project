import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { RestaurantCard } from '../components/RestaurantCard';
import { FilterBar } from '../components/FilterBar';
import './RestaurantsPage.css';

export function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/restaurants/')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch restaurants');
        return res.json();
      })
      .then(data => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Get unique cuisines from the restaurants for filter options
  const cuisines = useMemo(() => [...new Set(restaurants.map(r => r.cuisine))], [restaurants]);

  // Filter and sort restaurants based on search, cuisine, and sortBy
  const filteredAndSortedRestaurants = useMemo(() => {
    let filtered = restaurants.filter(restaurant => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCuisine = !selectedCuisine || restaurant.cuisine === selectedCuisine;

      // NO status filtering here
      return matchesSearch && matchesCuisine;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [restaurants, searchTerm, selectedCuisine, sortBy]);

  if (loading) return <p>Loading restaurants...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="restaurants-page">
      <div className="container">
        <h1 className="page-title">Restaurants</h1>

        <div className="filter-bar-wrapper">
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCuisine={selectedCuisine}
            setSelectedCuisine={setSelectedCuisine}
            sortBy={sortBy}
            setSortBy={setSortBy}
            cuisines={cuisines}
          />
        </div>

        <div className="results-count">
          <p>
            {filteredAndSortedRestaurants.length} restaurant
            {filteredAndSortedRestaurants.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="restaurants-grid">
          {filteredAndSortedRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {filteredAndSortedRestaurants.length === 0 && (
          <div className="no-results">
            <Search className="no-results-icon" />
            <p>No restaurants found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
