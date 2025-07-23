import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/Authentication/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const {
    user,
    accessToken,
    refreshToken,
    logout,
    refreshTokens,
    protectedFetch,
    loading,
    showToast,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [protectedData, setProtectedData] = useState(null);

  useEffect(() => {
    if (!user && !refreshToken && !loading) {
      navigate("/login");
    }
  }, [user, refreshToken, loading, navigate]);

  const handleFetchProtectedData = async () => {
    setProtectedData(null);
    try {
      const response = await protectedFetch(
        "http://localhost:5000/api/auth/protected-resource"
      );

      if (response && response.ok) {
        const data = await response.json();
        setProtectedData(data);
        showToast("Protected data fetched successfully!");
      } else if (response) {
        console.error("Failed to fetch protected data:", response.status);
      }
    } catch (err) {
      console.error("Error fetching protected data:", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans p-4">
        <p className="text-xl text-gray-700">
          Loading user session or redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Hiring Platform Dashboard
        </h1>

        {loading && (
          <p className="text-blue-500 text-center mb-4">Loading...</p>
        )}

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Welcome, {user.name}!
          </h2>
          <p className="text-gray-700">ID: {user.id}</p>
          <p className="text-gray-700">Username: {user.username}</p>
          <p className="text-gray-700">Email: {user.email}</p>
          <p className="text-gray-700">
            Access Token: {accessToken ? "Present" : "Missing"}
          </p>
          <p className="text-gray-700">
            Refresh Token: {refreshToken ? "Present" : "Missing"}
          </p>

          <div className="mt-4 flex flex-col space-y-2">
            <button
              onClick={refreshTokens}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-200"
              disabled={loading}
            >
              Refresh Tokens
            </button>
            <button
              onClick={handleFetchProtectedData}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
              disabled={loading}
            >
              Fetch Protected Data
            </button>
            {protectedData && (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 overflow-auto max-h-40">
                <h3 className="font-semibold mb-1">Protected Data:</h3>
                <pre>{JSON.stringify(protectedData, null, 2)}</pre>
              </div>
            )}
            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
              disabled={loading}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
