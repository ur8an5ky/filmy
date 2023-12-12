import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { TextField, Button, Paper, Box, FormControl, InputLabel, Select, MenuItem, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import { Helmet } from 'react-helmet';

const MovieDetail = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [movieTitle, setMovieTitle] = useState('');
  const [releaseYear, setYear] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [director, setDirector] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [selectedDirector, setSelectedDirector] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
        setMovieTitle(response.data.movie.title);
        setYear(response.data.movie.year);
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

  const handleOpenSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const directorResponse = await apiClient.post('/director', {
        first_name: firstName,
        last_name: lastName
      });
      const directorId = directorResponse.data.director_id;

      const directsResponse = await apiClient.post('/directs', { director_id: directorId, movie_id: movieId });

      if (directsResponse.status === 201) {
        setFirstName('');
        setLastName('');
        await fetchDirector();
        handleOpenSnackbar('Director added to the movie successfully.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectSubmit = async (event) => {
    event.preventDefault();
    if (!selectedDirector) {
      handleOpenSnackbar('Please select a director.');
      return;
    }
  
    try {
      await apiClient.post('/directs', { director_id: selectedDirector, movie_id: movieId });
      handleOpenSnackbar('Director linked to the movie successfully.');
      fetchDirector();
    } catch (error) {
      console.error('Error linking director:', error);
    }
  };
  
  const handleDeleteMovie = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
    if (confirmDelete) {
      try {
        await apiClient.delete(`/movie/${movieId}`);
        handleOpenSnackbar('Movie deleted successfully.');
        navigate('/movies/');
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
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
          <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold', fontStyle: 'italic', padding: 2, textAlign: 'center'}}>{movieTitle}</Typography>
            {director ? (
              <Box>
                <Box display="flex">
                  <Typography variant="h6" component="span" sx={{ minWidth: '150px', display: 'inline-block' }}>
                    Director:
                  </Typography>
                  <Typography variant="h6" component="span">
                    <strong><em>{director.first_name}</em></strong> <strong>{director.last_name}</strong>
                  </Typography>
                </Box>
                <Box display="flex">
                  <Typography variant="h6" component="span" sx={{ minWidth: '150px', display: 'inline-block' }}>
                    Release year:
                  </Typography>
                  <Typography variant="h6" component="span">
                    <strong>{releaseYear}</strong>
                  </Typography>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="h6" gutterBottom sx={{padding: 2, textAlign: 'center'}}>Add Director From Database</Typography>
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
                <Typography variant="h6" gutterBottom sx={{padding: 1, textAlign: 'center'}}>or Add New Director to Movie</Typography>
                  <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <form onSubmit={handleSubmit}>
                    <Box display="flex" gap={2} mb={2}>
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
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Add Director
                    </Button>
                  </form>
                </FormControl>
              </>
            )}
          <Box display="flex" justifyContent="center" mt={2} sx={{ marginTop: 3 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteMovie}
              sx={{ width: '50%' }}
            >
              Delete Movie
            </Button>
          </Box>
          </Paper>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      )}  
    </>
  );
};

export default MovieDetail;