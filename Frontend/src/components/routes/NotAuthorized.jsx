import React from "react";
import { Link } from "react-router-dom";

const NotAuthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center">
      <div>
        <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Not Authorized</h1>
        <p className="text-gray-700 mb-6">You don't have permission to access this page.</p>
        <Link to="/" className="text-blue-500 underline">Return to Homepage</Link>
      </div>
    </div>
  );
};

export default NotAuthorized;
