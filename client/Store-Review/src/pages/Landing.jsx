import { Link } from "react-router-dom";

export default function Landing() {
  const Card = ({ to, title, desc }) => (
    <Link
      to={to}
      className="block rounded-2xl shadow hover:shadow-lg transition p-6 bg-white border hover:border-blue-500"
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{desc}</p>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-6xl font-bold text-center mb-20">
          ROXILER SYSTEMS ASSIGNMENT   </h1>
        <h1 className="text-3xl font-bold text-center mb-8">
          Store Reviews
        </h1>
        <div className="grid sm:grid-cols-3 gap-4">
          <Card to="/login?as=user"  title="Login as User"  desc="Browse stores & leave ratings." />
          <Card to="/login?as=owner" title="Login as Owner" desc="See your store & received ratings." />
          <Card to="/login?as=admin" title="Login as Admin" desc="View platform stats." />
        </div>
        <p className="text-s text-gray-500 mt-4 text-center">
          (FYI: There is same login for all roles.)
        </p>
      </div>
    </div>
  );
}
