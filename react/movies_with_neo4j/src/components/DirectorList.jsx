import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const DirectorList = () => {
  const [directors, setDirectors] = useState([]);

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const response = await apiClient.get('/directors'); 
        setDirectors(response.data);
      } catch (error) {
        console.error('Error fetching directors:', error);
      }
    };

    fetchDirectors();
  }, []);

  return (
    <div>
      <h2>List of Movie Directors</h2>
      <ul>
        {directors.map((director) => (
          <li key={director.id}>{director.first_name} {director.last_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default DirectorList;