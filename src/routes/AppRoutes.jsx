import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import Register from "../pages/Register";
import Categories from "../pages/Categories";
import Dashboard from "../pages/Dashboard";
import Movies from "../pages/Movies";

// Guard for pages that require registration details (name, email, etc.)
const RegistrationGuard = ({ children }) => {
  const user = useStore((state) => state.user);
  const isRegistered = user.name && user.username && user.email && user.mobile;
  
  if (!isRegistered) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Guard for pages that require registration AND category selection (dashboard and movies)
const CategoryGuard = ({ children }) => {
  const user = useStore((state) => state.user);
  const categories = useStore((state) => state.categories);
  const isRegistered = user.name && user.username && user.email && user.mobile;
  
  if (!isRegistered) {
    return <Navigate to="/" replace />;
  }
  
  if (categories.length < 3) {
    return <Navigate to="/categories" replace />;
  }
  
  return children;
};

// Guard to prevent registered users from going back to registration or categories unnecessarily
const PublicOnlyRoute = ({ children }) => {
  const user = useStore((state) => state.user);
  const categories = useStore((state) => state.categories);
  const isRegistered = user.name && user.username && user.email && user.mobile;
  
  if (isRegistered) {
    if (categories.length >= 3) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/categories" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } 
        />
        <Route 
          path="/categories" 
          element={
            <RegistrationGuard>
              <Categories />
            </RegistrationGuard>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <CategoryGuard>
              <Dashboard />
            </CategoryGuard>
          } 
        />
        <Route 
          path="/movies" 
          element={
            <CategoryGuard>
              <Movies />
            </CategoryGuard>
          } 
        />
        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
