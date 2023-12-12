import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { TextField, Button, Paper, Box, FormControl, Snackbar, Alert } from '@mui/material';
import { Helmet } from 'react-helmet';

const MovieForm = () => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
      const response = await apiClient.post('/movie', { title, year: Number(year) });
      console.log(response.data);
      setTitle('');
      setYear('');
      handleOpenSnackbar('Movie added successfully.');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Movie</title>
      </Helmet>
      <Box>
        <Paper elevation={3} sx={{ p: 3, minWidth: '300px' }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <form onSubmit={handleSubmit}>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  label="Movie Title"
                  variant="outlined"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Release Year"
                  variant="outlined"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
              </Box>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Add new movie
              </Button>
            </form>
          </FormControl>
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
    </>
  );
};

export default MovieForm;
