import React, { useState } from "react";
import axios from "axios";

export default function PnrChecker() {
  const [pnr, setPnr] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkPNR = async () => {
    if (pnr.length !== 10) {
      setError("PNR must be 10 digits");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await axios.get(
        "https://irctc1.p.rapidapi.com/api/v3/getPNRStatus",
        {
          params: { pnrNumber: pnr },
          headers: {
            "x-rapidapi-key": "f26035e2b6msh6b27648ba61d156p197288jsnaaa279893a1d",
            "x-rapidapi-host": "irctc1.p.rapidapi.com",
          },
        }
      );

      setData(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      setError("Failed to fetch PNR status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">PNR Status Checker</h2>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Enter 10-digit PNR"
          value={pnr}
          onChange={(e) => setPnr(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={checkPNR}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {data && (
        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="text-lg font-semibold text-gray-700">
              {data.TrainName} <span className="text-gray-500">({data.TrainNo})</span>
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              <strong>From:</strong> {data.BoardingStationName} → <strong>To:</strong> {data.ReservationUptoName}
            </p>
            <p className="text-sm text-gray-600"><strong>Journey:</strong> {data.Doj}</p>
            <p className="text-sm text-gray-600"><strong>Departure:</strong> {data.DepartureTime} | <strong>Arrival:</strong> {data.ArrivalTime}</p>
            <p className="text-sm text-gray-600"><strong>Duration:</strong> {data.Duration}</p>
            <p className="text-sm text-gray-600"><strong>Fare:</strong> ₹{data.TicketFare}</p>
            <p className="text-sm text-gray-600"><strong>Class:</strong> {data.Class} | <strong>Quota:</strong> {data.Quota}</p>
            <p className="text-sm text-gray-600"><strong>Chart Prepared:</strong> {data.ChartPrepared ? "Yes ✅" : "No ❌"}</p>
          </div>

          <h4 className="text-lg font-semibold text-gray-700 mt-6">Passenger Details</h4>
          <div className="overflow-x-auto mt-2">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="border px-2 py-2">Passenger</th>
                  <th className="border px-2 py-2">Booking Status</th>
                  <th className="border px-2 py-2">Current Status</th>
                  <th className="border px-2 py-2">Prediction</th>
                </tr>
              </thead>
              <tbody>
                {data.PassengerStatus?.map((p, i) => (
                  <tr key={i} className="text-center hover:bg-gray-100">
                    <td className="border px-2 py-2 font-medium">Passenger {i + 1}</td>
                    <td className="border px-2 py-2">{p.BookingStatus}</td>
                    <td className="border px-2 py-2">{p.CurrentStatus}</td>
                    <td className="border px-2 py-2">{p.Prediction} ({p.ConfirmTktStatus})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
