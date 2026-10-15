import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./redux/userslice.js";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/dashboard.jsx";
import { Loader2 } from "lucide-react";

// Guard Component for Protected Routes
const ProtectedRoute = ({ children }) => {
  const { user, isInitialized } = useSelector((state) => state.user);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-slate-400 space-x-3 font-sans">
        <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
        <span className="text-sm font-medium">Restoring secure session...</span>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;