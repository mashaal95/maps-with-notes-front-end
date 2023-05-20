import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Map from './Pages/map'

function App() {
  return (
    <div className="App">
  <Router>
    <Routes>

        <Route path="/" element={<Map/>} />        
        {/* <Route path="/add-note" element={NoteForm} />
        <Route path="/notes" element={NoteList} />
        <Route path="/search" element={SearchBar} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
