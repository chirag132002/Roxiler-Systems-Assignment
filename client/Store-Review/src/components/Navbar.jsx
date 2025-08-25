import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isAuthed = !!localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <Link to={role === "admin" ? "/admin" : role === "owner" ? "/owner" : "/user"} className="font-semibold">
          StoreReview
        </Link>
        <div className="flex items-center gap-3">
          {role && <span className="text-xs px-2 py-1 rounded bg-gray-100 capitalize">{role}</span>}
          {role === "user" && <Link to="/user" className="text-sm hover:underline">User</Link>}
          {role === "owner" && <Link to="/owner" className="text-sm hover:underline">Owner</Link>}
          {role === "admin" && <Link to="/admin" className="text-sm hover:underline">Admin</Link>}
          {isAuthed ? (
            <button onClick={logout} className="text-sm bg-red-600 text-white px-3 py-1 rounded">Logout</button>
          ) : (
            <Link to="/login" className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
}
