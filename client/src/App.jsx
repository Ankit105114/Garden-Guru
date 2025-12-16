import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PlantLibrary from './pages/PlantLibrary';
import PlantDetails from './pages/PlantDetails';
import AddPlant from './pages/AddPlant';
import GardenDetails from './pages/GardenDetails';
import Reminders from './pages/Reminders';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/plants" element={<PlantLibrary />} />
        <Route path="/plants/:id" element={<PlantDetails />} />

        <Route element={<PrivateRoute />}>
          <Route path="/add-plant" element={<AddPlant />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/garden/:id" element={<GardenDetails />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      {!hideFooter && <Footer />}
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
