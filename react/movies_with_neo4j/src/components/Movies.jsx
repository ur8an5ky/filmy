import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await apiClient.get('/movie'); // Endpoint do pobierania filmów
        setMovies(response.data.movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchFilms();
  }, []);

  return (
    <div>
      <h2>List of movies</h2>
      <ul>
        {movies.map((film) => (
          <li key={film.title}>{film.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Movies;