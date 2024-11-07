import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InstructorSignIn from './Pages/InstructorSignin';
import InstructorSignUp from './Pages/InstuctorSignup';
import InstructorDashboard from './Pages/InstructorDashboard';
import StudentSignIn from './Pages/StudentSignIn';
import StudentSignUp from './Pages/StudentSignUp';
import StudentDashboard from './Pages/StudentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/instructor/signin" element={<InstructorSignIn />} />
        <Route path="/instructor/signup" element={<InstructorSignUp />} />
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path='/instructor' element={<InstructorDashboard />} />
        <Route path="/student/signin" element={<StudentSignIn />} />
        <Route path="/student/signup" element={<StudentSignUp />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path='/student' element={<StudentDashboard />}/>
        <Route path="/" element={<StudentDashboard/>} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
