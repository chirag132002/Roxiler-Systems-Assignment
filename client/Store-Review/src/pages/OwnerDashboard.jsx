import { useEffect, useState } from "react";
import API from "../api/axios";

export default function OwnerDashboard() {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Change password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch store
      const { data: storeData } = await API.get("/owner/store", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStore(storeData);

      // Fetch ratings
      const { data: ratingsData } = await API.get("/owner/store/ratings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRatings(ratingsData);

    } catch (err) {
      console.error(err);
      setStore(null);
      setRatings([]);
      setError(err.response?.data?.error || "Failed to load store data");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const { data } = await API.post(
        "/auth/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMsg(data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMsg(err.response?.data?.error || "Password change failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-6">My Store</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : !store ? (
          <p className="text-red-600">No store found for this owner.</p>
        ) : (
          <div className="space-y-6">
            {/* Store Info */}
            <div className="bg-white shadow rounded-lg p-4 border">
              <h3 className="font-bold text-lg">{store.name}</h3>
              <p className="text-sm text-gray-600">{store.address}</p>
              <p className="text-yellow-600 font-semibold mt-2">
                ⭐ {parseFloat(store.avgRating).toFixed(1)}
              </p>
            </div>

            {/* Ratings List */}
            <div className="bg-white shadow rounded-lg p-4 border">
              <h4 className="font-semibold mb-3">User Ratings</h4>
              {ratings.length === 0 ? (
                <p className="text-gray-500">No ratings yet.</p>
              ) : (
                <ul className="space-y-2">
                  {ratings.map((r, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between border-b pb-1 text-sm"
                    >
                      <span>
                        {r.name} ({r.email})
                      </span>
                      <span className="text-yellow-600 font-medium">
                        ⭐ {r.rating}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Change Password Section */}
      <div className="max-w-md bg-white p-6 rounded-xl shadow border">
        <h3 className="text-lg font-bold mb-3">Change Password</h3>
        {msg && (
          <div
            className={`mb-3 text-sm p-2 rounded ${
              msg.includes("success")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {msg}
          </div>
        )}
        <form className="space-y-3" onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
