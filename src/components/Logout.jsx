export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <button
      onClick={handleLogout}
      className="bg-indigo-700 text-white px-4 py-2 rounded"
    >
      {" "}
      Logout{" "}
    </button>
  );
}
