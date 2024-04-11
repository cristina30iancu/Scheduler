import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NavigationAppBar from './components/NavigationAppBar';
import { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <NavigationAppBar />
      <AppRoutes />
    </AuthProvider>
  );
}

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="calendar" element={isLoggedIn ? <CalendarPage /> : <Login />} />
    </Routes>
  );
}

export default App;
