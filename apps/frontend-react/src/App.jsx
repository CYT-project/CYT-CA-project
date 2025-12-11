import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css'

function App() {

   return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />               
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
