import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NavigationAppBar from './components/NavigationAppBar';
import { AuthProvider, useAuth } from './components/AuthProvider';
import CalendarPage from './pages/CalendarPage';
import Activities from './pages/Activities';
import Calculator from './pages/Calculator';

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
      <Route path="calculator" element={isLoggedIn ? <Calculator /> : <Login />} />
      <Route path="calendar" element={isLoggedIn ? <CalendarPage /> : <Login />} />
      <Route path="activitati" element={isLoggedIn ? <Activities /> : <Login />} />
    </Routes>
  );
}

export default App;
