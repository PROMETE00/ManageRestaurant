import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx'


function App() {
  return (
    <Router>
      <div className="min-h-screen min-w-screen">
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
