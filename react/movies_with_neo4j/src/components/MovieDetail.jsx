import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { TextField, Button, Paper, Box } from '@mui/material';

const MovieDetail = () => {
  const { movieId } = useParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [director, setDirector] = useState(null);

  useEffect(() => {
    const fetchDirector = async () => {
      try {
        const response = await apiClient.get(`/movies/${movieId}/director`);
        setDirector(response.data.director);
      } catch (error) {
        console.error('Error fetching director:', error);
      }
    };

    fetchDirector();
  }, [movieId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const directorResponse = await apiClient.post('/director', {
        first_name: firstName,
        last_name: lastName
      });
      const directorId = directorResponse.data.director_id;

      await apiClient.post('/directs', { director_id: directorId, movie_id: movieId });

      setFirstName('');
      setLastName('');
      alert('Director added to the movie successfully.');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 2, backgroundColor: 'white' }}>
        {director ? (
          <p>Director: {director.first_name} {director.last_name}</p>
        ) : (
          <>
            <h2>Add New Director to Movie</h2>
            <form onSubmit={handleSubmit}>
              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                sx={{ marginBottom: 2 }}
              />
              <Button type="submit" variant="contained" color="primary">
                Add Director
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default MovieDetail;