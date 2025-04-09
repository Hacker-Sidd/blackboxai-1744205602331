import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Auth from './pages/Auth';
import VideoDetail from './pages/VideoDetail';

function App() {
  return (
    <div className="app">
      <Toaster position="bottom-center" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/video/:id" element={<VideoDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
