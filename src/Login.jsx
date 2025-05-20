import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import foodBackground from './assets/ImagenesLogin/foodBackground.jpg';
import foodLogin from './assets/ImagenesLogin/comidaLogin.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://example.com/api/Login", {
        email,
        password,
      });
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative">
      <img
        src={foodBackground}
        alt="Food Background"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      <div className="relative z-10 flex flex-row bg-black bg-opacity-90 rounded-xl shadow-2xl p-10">
        <div className="flex items-center justify-center p-8">
          <img
            src={foodLogin}
            alt="Food"
            className="w-[400px] rounded-lg shadow-xl h-120"
          />
        </div>
        <div className="p-12 bg-gray-900 text-white rounded-lg flex flex-col justify-center w-[350px]">
          <h2 className="text-4xl font-bold mb-8 text-center">Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-orange-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
            >
              Sign in
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400">
            Don’t have an account yet? <a href="#" className="text-orange-600 font-semibold">Register for free</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;