import React, { useState } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Map from './Pages/map'
import { ThemeProvider, createTheme } from '@mui/material';
import Login from './Login';

function App() {


  const theme = createTheme();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (username : string) => {
    setIsLoggedIn(true);
    setUsername(username);

  };

  return (
    <div className="App">

<ThemeProvider theme={theme}>
      {!isLoggedIn && <Login handleLogin={handleLogin} />}
      {isLoggedIn && <Map username={username} />}
    </ThemeProvider>
  {/* <Router>
    <Routes> 
        <Route path="/" element={<Map/>} />        
        <Route path="/login" element={<Login handleLogin={handleLogin}/>} />        
    
         </Routes>
      </Router> */}
    </div>
  );
}

export default App;
