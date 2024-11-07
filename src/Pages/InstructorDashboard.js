import React, { useEffect, useState } from "react";

const InstructorDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({
    date: "",
    startTime: "",
    endTime: "",
    status: "Available",
  });

  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userRole !== "Instructor") {
      alert("Access Denied: Instructor-only dashboard");
      window.location.href = "/instructor/signin";
    }
  }, [userRole]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/booking/instructor/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const sortedBookings = data.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          return 0;
        });
        setBookings(sortedBookings);
      })
      .catch((error) =>
        console.error("Error fetching instructor bookings:", error)
      );

    fetch(`${process.env.REACT_APP_BASE_URL}/slot/instructor/${userId}`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots))
      .catch((error) =>
        console.error("Error fetching instructor slots:", error)
      );
  }, [userId]);

  const handleConfirmBooking = (bookingId) => {
    fetch(`${process.env.REACT_APP_BASE_URL}/booking/confirm`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Booking confirmed successfully!");
        setBookings(
          bookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "Confirmed" }
              : booking
          )
        );
        const slotId = bookings.find((booking) => booking.id === bookingId).slotId;
        setSlots(
          slots.map((slot) =>
            slot.id === slotId ? { ...slot, status: "Booked" } : slot
          )
        );
      })
      .catch((error) => console.error("Error confirming booking:", error));
  };

  const handleCreateSlot = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_BASE_URL}/slot/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newSlot, instructorId: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Slot created successfully!");
        setSlots([...slots, data.slot]);
      })
      .catch((error) => console.error("Error creating slot:", error));
  };

  const convertToLocalTime = (utcSeconds) => {
    console.log(slots);
    const localDate = new Date(utcSeconds * 1000);

    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Instructor Dashboard
      </h1>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Slots</h2>
        <ul className="divide-y divide-gray-200">
          {slots.map((slot) => (
            <li key={slot.id} className="py-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Date:{" "}
                  {new Date(slot.date._seconds * 1000).toLocaleDateString()}
                </span>
                <span className="text-gray-600">
                  Start: {convertToLocalTime(slot.startTime._seconds)}
                </span>
                <span className="text-gray-600">Status: {slot.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Create a Slot
        </h2>
        <form onSubmit={handleCreateSlot} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-600">Date</label>
            <input
              type="date"
              className="p-2 border rounded-md"
              value={newSlot.date}
              onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600">Start Time</label>
            <input
              type="time"
              className="p-2 border rounded-md"
              value={newSlot.startTime}
              onChange={(e) =>
                setNewSlot({ ...newSlot, startTime: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600">End Time</label>
            <input
              type="time"
              className="p-2 border rounded-md"
              value={newSlot.endTime}
              onChange={(e) =>
                setNewSlot({ ...newSlot, endTime: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Create Slot
          </button>
        </form>
      </div>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Your Bookings
        </h2>
        <ul className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <li key={booking.id} className="py-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Date:{" "}
                  {new Date(
                    slots.find((slot) => slot.id === booking.slotId)?.date
                      ._seconds * 1000
                  ).toLocaleDateString()}
                </span>
                <span className="text-gray-600">
                  Start:{" "}
                  {convertToLocalTime(
                    slots.find((slot) => slot.id === booking.slotId)?.startTime
                      ._seconds
                  )}
                </span>
                <span className="text-gray-600">
                  End:{" "}
                  {convertToLocalTime(
                    slots.find((slot) => slot.id === booking.slotId)?.endTime
                      ._seconds
                  )}
                </span>

                <span className="text-gray-600">Status: {booking.status}</span>

                <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                onClick={() => handleConfirmBooking(booking.id)}>
                  Confirm Booking
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InstructorDashboard;
