import React, { useState } from 'react';
import apiClient from '../api/apiClient';

const MovieForm = () => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await apiClient.post('/movie', { title, year });
      console.log(response.data);
      setTitle('');
      setYear('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Movie Title"
        required
      />
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Release Year"
      />
      <button type="submit">Add new movie</button>
    </form>
  );
};

export default MovieForm;