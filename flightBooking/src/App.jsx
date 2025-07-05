import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

const BASE_URL = 'https://flightbookingbackend-gdkl.onrender.com/flights/FL100';


function App() {
  const [seats, setSeats] = useState([]);
  const [passenger, setPassenger] = useState('');
  const [seatId, setSeatId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/seats`);
      setSeats(res.data);
    } catch (err) {
      console.error('Failed to load seats', err);
    }
  };

  const handleBook = async () => {
    if (!seatId || !passenger) {
      setMessage('Please fill all fields');
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL}/book`, { seatId, passenger });
      setMessage(res.data);
      fetchSeats();
    } catch (err) {
      console.error('Booking failed', err);
      setMessage('Booking failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6" >
      <h1 className="text-2xl font-bold mb-4">✈️ Flight Seat Booking</h1>

      <div className="mb-4">
        <label className="block">Passenger Name</label>
        <input
          type="text"
          value={passenger}
          onChange={(e) => setPassenger(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block">Seat ID (e.g. A1, B2)</label>
        <input
          type="text"
          value={seatId}
          onChange={(e) => setSeatId(e.target.value.toUpperCase())}
          className="border p-2 rounded w-full"
        />
      </div>

      <button onClick={handleBook} className="bg-blue-600 text-white px-4 py-2 rounded">Book Seat</button>

      {message && <p className="mt-4 font-medium">✅ {message}</p>}

      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${seats[0]?.length || 0}, 1fr)` }}>
        {seats.flat().map((seat) => (
          <div
            key={seat.seatId}
            className={`p-2 border rounded text-center font-semibold ${seat.booked ? 'bg-red-300' : 'bg-green-200'}`}
          >
            {seat.booked ? 'X' : seat.seatId}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
