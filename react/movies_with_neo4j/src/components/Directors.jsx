import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, CircularProgress } from '@mui/material';
import { Helmet } from 'react-helmet';

const Directors = () => {
  const [directors, setDirectors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/director'); 
        setDirectors(response.data.directors);
      } catch (error) {
        console.error('Error fetching directors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectors();
  }, []);

return (
  <>
    <Helmet>
      <title>Directors</title>
    </Helmet>
    {isLoading ? (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    ) : (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ borderBottom: "2px solid" }}>
              <TableCell align="center">Name</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {directors.map((director) => (
              <TableRow
                key={director.director_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center" component="th" scope="director" sx={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                  {director.first_name} {director.last_name}
                </TableCell>
                <TableCell align="right">
                  <Link to={`/directors/${director.director_id}/movies`} style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary">
                      Directed Movies
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </>
);
};

export default Directors;