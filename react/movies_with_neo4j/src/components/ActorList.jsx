import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const ActorList = ({ movieId }) => {
  const [actors, setActors] = useState([]);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const response = await apiClient.get(`/movie/${movieId}/actors`);
        setActors(response.data);
      } catch (error) {
        console.error('Error fetching actors:', error);
      }
    };

    if (movieId) {
      fetchActors();
    }
  }, [movieId]);

  return (
    <div>
      <h2>List of Actors in Movie</h2>
      <ul>
        {actors.map((actor) => (
          <li key={actor.id}>{actor.first_name} {actor.last_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActorList;