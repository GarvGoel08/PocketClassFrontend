import { useEffect, useState } from 'react';

function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);

  const baseURL = `${process.env.REACT_APP_BASE_URL}`;

  const convertToLocalTime = (utcSeconds) => {
    console.log(slots);
    const localDate = new Date(utcSeconds * 1000);
  
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
  
    return `${hours}:${minutes}`;
  };
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'Student') {
      alert('You do not have permission to view this page');
      window.location.href = '/student/signin';
    }
    if (userId) {
      fetchStudentInfo(userId);
      fetchBookings(userId);
    }
    fetchInstructors();
  }, []);

  const fetchStudentInfo = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/user/getInfo/${userId}`);
      const data = await response.json();
      setStudentInfo(data);
    } catch (error) {
      console.error('Error fetching student info:', error);
    }
    setLoading(false);
  };

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/user/getInstructors`);
      const data = await response.json();
      setInstructors(data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
    setLoading(false);
  };

  const fetchBookings = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/booking/user/${userId}`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
    setLoading(false);
  };

  const handleInstructorSelection = async (e) => {
    const instructorId = e.target.value;
    setSelectedInstructor(instructorId);
    setSelectedSlot('');
    setSlots([]);
    if (instructorId) {
      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/slot/instructor/${instructorId}`);
        const data = await response.json();
        setSlots(data.slots.filter(slot => slot.status === 'Available'));
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
      setLoading(false);
    }
  };

  const handleSlotSelection = (e) => {
    setSelectedSlot(e.target.value);
  };

  const handleBooking = async () => {
    if (!selectedInstructor || !selectedSlot) {
      alert('Please select an instructor and a slot');
      return;
    }
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`${baseURL}/slot/block`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: userId, instructorId: selectedInstructor, slotId: selectedSlot }),
      });
      const data = await response.json();
      if (data.message === 'Slot blocked and booking created successfully') {
        alert('Booking successful!');
        fetchBookings(userId);
      } else {
        alert('Error creating booking: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Student Dashboard</h1>
      
      {loading && <p className="text-center text-blue-600">Loading...</p>}

      {studentInfo && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
          <p><strong>Name:</strong> {studentInfo.Name}</p>
          <p><strong>Email:</strong> {studentInfo.Email}</p>
          <p><strong>Phone:</strong> {studentInfo.Phone}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Book an Instructor</h2>
        <select
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          onChange={handleInstructorSelection}
          value={selectedInstructor}
        >
          <option value="">Select an Instructor</option>
          {instructors.map((instructor) => (
            <option key={instructor.InstructorID} value={instructor.InstructorID}>
              {instructor.Name} - {instructor.Subjects}
            </option>
          ))}
        </select>

        {selectedInstructor && slots.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Available Slots</h3>
            <select
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              onChange={handleSlotSelection}
              value={selectedSlot}
            >
              <option value="">Select a Slot</option>
              {slots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {convertToLocalTime(slot.startTime._seconds)} - {convertToLocalTime(slot.endTime._seconds)}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleBooking}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Book
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <ul>
            {bookings.map((booking) => (
              <li key={booking.id} className="mb-2">
                Booking Data Here(This is currently a prototype to show how many bookings the student has made, the actual data will be fetched from the backend)
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
