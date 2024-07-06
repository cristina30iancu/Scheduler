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
import Notes from './pages/Notes';
import Statistici from './pages/Statistici';

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
      <Route path="notite" element={isLoggedIn ? <Notes /> : <Login />} />
      <Route path="statistici" element={isLoggedIn ? <Statistici /> : <Login />} />
    </Routes>
  );
}

export default App;
