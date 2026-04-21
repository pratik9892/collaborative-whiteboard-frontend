import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';
import DrawingCanvas from './components/DrawingCanvas';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          {/* User can access without login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ===== PROTECTED ROUTES ===== */}
          {/* User must be logged in to access */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoomJoin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <Whiteboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;