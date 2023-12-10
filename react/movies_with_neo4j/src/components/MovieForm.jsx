import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { TextField, Button, Paper, Box, FormControl } from '@mui/material';

const MovieForm = () => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await apiClient.post('/movie', { title, year: Number(year) });
      console.log(response.data);
      setTitle('');
      setYear('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, minWidth: '300px' }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Movie Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Release Year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Add new movie
            </Button>
          </form>
        </FormControl>
      </Paper>
    </Box>
  );
};

export default MovieForm;
