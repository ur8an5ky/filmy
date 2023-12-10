import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MovieForm from './components/MovieForm';
import Movies from './components/Movies';
import Directors from './components/Directors.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieDetail from './components/MovieDetail';
// import { UserProvider } from './UserContext';
// import { ThemeProvider } from '@material-ui/core/styles';

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
    {/* <ThemeProvider theme={theme}> */}
      <Router>
        {/* <UserProvider> */}
          {/* <Header /> */}
          <Routes>
            <Route path="/" element={<App />} />

            <Route path="/add-movie" element={<MovieForm />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/directors" element={<Directors />} />

            <Route path="/movies/:movieId/details" element={<MovieDetail />} />
          
          </Routes>
          {/* <Footer /> */}
        {/* </UserProvider> */}
      </Router>
    {/* </ThemeProvider> */}
  </React.StrictMode>
)
