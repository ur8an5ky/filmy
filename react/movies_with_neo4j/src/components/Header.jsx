import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Movies with Neo4J
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/movies">
            Movies
          </Button>
          <Button color="inherit" component={RouterLink} to="/add-movie">
            Add Movie
          </Button>
          <Button color="inherit" component={RouterLink} to="/directors">
            Directors
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
