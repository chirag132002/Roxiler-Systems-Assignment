import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: "", address: "" });

  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch stores
  const fetchStores = async () => {
    try {
      const { data } = await API.get("/admin/stores", {
        params: search,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStores(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStores();
  }, []);

  // --- ✅ Validation ---
  const validateForm = () => {
    if (form.name.length < 20 || form.name.length > 60) {
      setMessage("❌ Name must be between 20 and 60 characters.");
      return false;
    }
    if (form.address.length > 400) {
      setMessage("❌ Address cannot exceed 400 characters.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setMessage("❌ Invalid email format.");
      return false;
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(form.password)) {
      setMessage("❌ Password must be 8–16 chars, include 1 uppercase and 1 special character.");
      return false;
    }
    setMessage("");
    return true;
  };

  // --- Submit new store ---
  const handleAddStore = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await API.post("/admin/stores", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessage("✅ Store added successfully!");
      setForm({ name: "", address: "", email: "", password: "" });
      fetchStores();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add store.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>

      {/* --- Add Store Form --- */}
      <div className="bg-white shadow p-4 rounded-lg border max-w-lg">
        <h3 className="font-bold text-lg mb-3">Add Store + Owner</h3>

        {message && (
          <div
            className={`mb-3 text-sm p-2 rounded ${
              message.includes("✅")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleAddStore} className="space-y-3">
          <input
            placeholder="Store Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Owner Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Owner Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Add Store
          </button>
        </form>
      </div>

      {/* --- Search Stores --- */}
      <div>
        <h3 className="text-lg font-bold mb-2">Search Stores</h3>
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Search name"
            value={search.name}
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            placeholder="Search address"
            value={search.address}
            onChange={(e) => setSearch({ ...search, address: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={fetchStores}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map((s) => (
            <div key={s.id} className="bg-white p-4 shadow rounded-lg border">
              <h4 className="font-bold">{s.name}</h4>
              <p className="text-sm">{s.address}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Users List --- */}
      <div>
        <h3 className="text-lg font-bold mb-2">All Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((u) => (
            <div key={u.id} className="bg-white p-4 shadow rounded-lg border">
              <h4 className="font-bold">{u.name}</h4>
              <p className="text-sm">{u.email}</p>
              <p className="text-xs text-gray-500">Role: {u.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
