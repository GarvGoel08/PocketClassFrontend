import { useState } from 'react';
import {useNavigate} from 'react-router-dom';

function StudentSignIn() {
  const [login, setLogin] = useState({
    Email: 'studenttest@test.com',
    Password: 'test1234',
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login),
    });

    const data = await response.json();
    if (data.message === 'User signed in successfully') {
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userRole', data.userRole);
      navigate('/student/dashboard');
    } else {
      alert('Error: ' + data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Student Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              name="Email"
              value={login.Email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              name="Password"
              value={login.Password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Sign In
          </button>
          <a href="/student/signup" className="block text-center text-blue-600 mt-2">Dont have an account? Sign Up</a>
        </form>
      </div>
    </div>
  );
}

export default StudentSignIn;
