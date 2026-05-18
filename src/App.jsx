import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import SearchResults from './pages/SearchResults';
import Checkout from './pages/Checkout';
import ReservationSuccess from './pages/ReservationSuccess';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/checkout/:roomId" element={<Checkout />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/reservation-success" element={<ReservationSuccess />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
