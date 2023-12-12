import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, CircularProgress  } from '@mui/material';
import { Helmet } from 'react-helmet';

const DirectorMovies = () => {
  const { directorId } = useParams();
  const [director, setDirector] = useState({});
  const [movies, setMovies] = useState([]);
  const [helmetTitle, setHelmet] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDirectorMovies = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/director/${directorId}/movies`);
        setMovies(response.data.movies);
        setDirector(response.data.director);
        setHelmet(response.data.director.last_name + "\'s Movies");
      } catch (error) {
        console.error('Error fetching director\'s movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectorMovies();
  }, [directorId]);

return (
    <>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Typography variant="h4" gutterBottom sx={{ padding: 2, textAlign: 'center' }}>
            Movies Directed by <strong><em>{director.first_name}</em></strong> <strong>{director.last_name}</strong>
          </Typography>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ borderTop: "1px solid", borderBottom: "2px solid" }}>
                <TableCell>Title</TableCell>
                <TableCell align="right">Release Year</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map((movie) => (
                <TableRow
                  key={movie.title}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="movie" sx={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                    {movie.title}
                  </TableCell>
                  <TableCell align="right">{movie.year}</TableCell>
                  <TableCell align="right">
                    <Link to={`/movies/${movie.movie_id}/details`}>
                      <Button variant="contained" color="primary">
                        Details
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

export default DirectorMovies;
