import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-lg p-8 bg-gray-800 rounded-xl shadow-2xl text-center space-y-6 border border-gray-700">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Appointment Booking System
        </h1>
        <p className="text-lg text-gray-300">
          Welcome! Please log in or register to get started. 
        </p>
        <div className="pt-4 flex gap-4 justify-center">
          <Link 
            to="/login" 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow font-medium transition-colors"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-6 py-2 bg-transparent border border-gray-500 hover:bg-gray-700 rounded-lg shadow font-medium transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
