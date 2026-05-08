import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookmarks from './pages/Bookmarks';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                color: '#888'
              }}>
                <p style={{ fontSize: '3rem' }}>404</p>
                <p style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  Page not found
                </p>
                <a href="/" style={{
                  color: '#ff6600',
                  fontWeight: 600,
                  marginTop: '1rem',
                  display: 'inline-block'
                }}>
                  ← Back to Home
                </a>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;