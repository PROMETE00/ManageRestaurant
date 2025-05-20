import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login.jsx';


function App() {
  return (
    <Router>
      <div className="min-h-screen min-w-screen">
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
