import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const Directors = () => {
  const [directors, setDirectors] = useState([]);

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const response = await apiClient.get('/director'); 
        setDirectors(response.data);
      } catch (error) {
        console.error('Error fetching directors:', error);
      }
    };

    fetchDirectors();
  }, []);

return (
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow sx={{ borderBottom: "2px solid" }}>
          <TableCell align="center">First Name</TableCell>
          <TableCell align="center">Last Name</TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {directors.map((director) => (
          <TableRow
            key={director.lastName}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell align="center" component="th" scope="director" sx={{ fontWeight: 'bold', fontStyle: 'italic' }}>
              {director.firstName}
            </TableCell>
            <TableCell align="center">{director.lastName}</TableCell>
            <TableCell align="right">
              <Button variant="contained" color="primary">
                Directed Movies
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
};

export default Directors;