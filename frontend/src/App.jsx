import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Pages
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Inventory from './pages/Inventory';
import Transfers from './pages/Transfers';
import Centers from './pages/Centers';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/centers" element={<Centers />} />
        </Routes>
        <ToastContainer
          position="top-left"
          autoClose={3000}
          hideProgressBar={false}
          rtl={true}
        />
      </div>
    </Router>
  );
}

export default App;
