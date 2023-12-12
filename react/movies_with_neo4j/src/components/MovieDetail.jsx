import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { TextField, Button, Paper, Box, FormControl, InputLabel, Select, MenuItem, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Helmet } from 'react-helmet';

const MovieDetail = () => {
  const { movieId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [movieTitle, setMovieTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [director, setDirector] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [selectedDirector, setSelectedDirector] = useState('');

  const fetchDirector = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/movie/${movieId}/director`);
      if (response.data.director) {
        setDirector(response.data.director);
      } else {
        setDirector(null);
      }
    } catch (error) {
      console.error('Error fetching director:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const response = await apiClient.get('/director');
        setDirectors(response.data.directors);
      } catch (error) {
        console.error('Error fetching directors:', error);
      }
    };

    const fetchMovie = async () => {
      try {
        const response = await apiClient.get(`/movie/${movieId}`);
        setMovieTitle(response.data.movie.title); // Założenie, że endpoint zwraca obiekt z polem 'title'
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    };
    
    fetchDirector();
    fetchDirectors();
    fetchMovie();
  }, [movieId]);

  const handleDirectorChange = (event) => {
    setSelectedDirector(event.target.value);
  };

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

  const handleSelectSubmit = async (event) => {
    event.preventDefault();
    if (!selectedDirector) {
      alert('Please select a director.');
      return;
    }
  
    try {
      await apiClient.post('/directs', { director_id: selectedDirector, movie_id: movieId });
      alert('Director linked to the movie successfully.');
      fetchDirector(); // Ponownie pobierz informacje o reżyserze
    } catch (error) {
      console.error('Error linking director:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>{movieTitle}</title>
      </Helmet>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      ) : (
    <Box sx={{ padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 2, backgroundColor: 'white' }}>
      <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold', fontStyle: 'italic'}}>{movieTitle}</Typography>
        {director ? (
          <Typography variant="h6">Director: {director.first_name} {director.last_name}</Typography>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>Add Director From Database</Typography>
            <form onSubmit={handleSelectSubmit}>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="director-select-label">Select Director</InputLabel>
                <Select
                  labelId="director-select-label"
                  id="director-select"
                  value={selectedDirector}
                  onChange={handleDirectorChange}
                  label="Select Director"
                  variant="outlined"
                >
                  {directors.map((dir) => (
                    <MenuItem key={dir.director_id} value={dir.director_id}>
                      {dir.first_name} {dir.last_name}
                    </MenuItem>
                  ))}
                </Select>
                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                  Link Director
                </Button>
              </FormControl>
            </form>
            <Typography variant="h6" gutterBottom>or Add New Director to Movie</Typography>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  variant="outlined"
                />
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  variant="outlined"
                />
                <Button type="submit" variant="contained" color="primary">
                  Add Director
                </Button>
              </form>
            </FormControl>
          </>
        )}
      </Paper>
    </Box>
      )}  
    </>
  );
};

export default MovieDetail;