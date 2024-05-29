import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './App.css';
import Login from './components/Login';
import PermanentDrawerComponent from './components/PermanentDrawerComponent';

function App() {

  const { isAuthenticated } = useAuth0();

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
          <Route path="/home" element={isAuthenticated ? <PermanentDrawerComponent /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
