import { useEffect, useState } from "react";
import API from "../api/axios";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: "", address: "" });
  const [loading, setLoading] = useState(false);

  // Change password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const fetchStores = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/user/stores", {
        params: search,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStores(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (storeId, rating) => {
    try {
      await API.post(
        `/user/ratings/${storeId}`,
        { rating },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchStores(); // refresh after rating
    } catch (err) {
      console.error(err);
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
    fetchStores();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-4">Browse Stores</h2>

        {/* Search Bar */}
        <div className="flex gap-2 mb-6">
          <input
            placeholder="Search name"
            value={search.name}
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
            className="border px-3 py-2 rounded w-1/3"
          />
          <input
            placeholder="Search address"
            value={search.address}
            onChange={(e) => setSearch({ ...search, address: e.target.value })}
            className="border px-3 py-2 rounded w-1/3"
          />
          <button
            onClick={fetchStores}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Store Cards */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((s) => (
              <div
                key={s.id}
                className="bg-white p-4 shadow rounded-lg border flex flex-col"
              >
                <h3 className="font-bold text-lg">{s.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{s.address}</p>
                <p className="text-yellow-600 font-semibold">
                  ⭐ {parseFloat(s.avgRating).toFixed(1)}
                </p>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRating(s.id, r)}
                      className={`px-2 py-1 rounded ${
                        s.userRating === r
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            ))}
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
