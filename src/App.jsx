import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import SearchResults from './pages/SearchResults';
import Checkout from './pages/Checkout';
import ReservationSuccess from './pages/ReservationSuccess';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import AdminLayout from './layouts/AdminLayout';
import BookingNotifications from './pages/admin/BookingNotifications';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

// Placeholders for demo
const PlaceholderPage = ({ title }) => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-500">This section is currently under construction.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/checkout/:roomId" element={<Checkout />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/reservation-success" element={<ReservationSuccess />} />
        <Route path="/admin" element={<AdminLogin />} />
        
        {/* Admin Protected Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="rooms" element={<AdminDashboard />} />
                  <Route path="data" element={<PlaceholderPage title="Data Insights" />} />
                  <Route path="notifications" element={<BookingNotifications />} />
                </Routes>
              </AdminLayout>
            </ProtectedAdminRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
