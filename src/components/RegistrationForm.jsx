import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

const RegistrationForm = () => {
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const [isSignInMode, setIsSignInMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    shareData: false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const tempErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/;
    const namePattern = /^[a-zA-Z\s]+$/;
    const usernamePattern = /^[a-zA-Z0-9]+$/;

    if (!formData.name.trim()) {
      tempErrors.name = "Name field cannot be left blank.";
    } else if (!namePattern.test(formData.name)) {
      tempErrors.name = "Name must only contain alphabetic characters and spaces.";
    }
    if (!formData.username.trim()) {
      tempErrors.username = "Username field cannot be left blank.";
    } else if (!usernamePattern.test(formData.username)) {
      tempErrors.username = "Username must be alphanumeric with no spaces.";
    }
    if (!formData.email.trim()) {
      tempErrors.email = "Email field cannot be left blank.";
    } else if (!emailPattern.test(formData.email)) {
      tempErrors.email = "Please input a valid email formatting schema.";
    }
    if (!formData.mobile.trim()) {
      tempErrors.mobile = "Mobile field cannot be left blank.";
    } else if (!phonePattern.test(formData.mobile)) {
      tempErrors.mobile = "Mobile field must encompass exactly 10 digital characters.";
    }
    if (!formData.shareData) {
      tempErrors.shareData = "Check this box to share your registration data.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateSignIn = () => {
    const tempErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      tempErrors.username = "Username field cannot be left blank.";
    }
    if (!formData.email.trim()) {
      tempErrors.email = "Email field cannot be left blank.";
    } else if (!emailPattern.test(formData.email)) {
      tempErrors.email = "Please input a valid email formatting schema.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleUsernameChange = (val) => {
    setFormData((prev) => {
      const updated = { ...prev, username: val };
      
      // Auto-fill check in Sign Up/Register mode
      if (val.trim() && !isSignInMode) {
        try {
          const db = JSON.parse(localStorage.getItem("super_app_users_db") || "{}");
          const match = db[val.trim().toLowerCase()];
          if (match && match.user) {
            updated.name = match.user.name || "";
            updated.email = match.user.email || "";
            updated.mobile = match.user.mobile || "";
          }
        } catch (e) {
          console.error("Autofill lookup failure:", e);
        }
      }
      return updated;
    });
  };

  const handleFormSubmission = (event) => {
    event.preventDefault();
    if (isSignInMode) {
      if (validateSignIn()) {
        const db = JSON.parse(localStorage.getItem("super_app_users_db") || "{}");
        const usernameKey = formData.username.trim().toLowerCase();
        
        if (db[usernameKey]) {
          const userRecord = db[usernameKey];
          setUser(userRecord.user);
          useStore.getState().setCategories(userRecord.categories);
          useStore.getState().setNotes(userRecord.notes);
          useStore.getState().setApiKeys(userRecord.apiKeys);
          
          if (userRecord.categories.length >= 3) {
            navigate("/dashboard");
          } else {
            navigate("/categories");
          }
        } else if (usernameKey === "demo") {
          const demoUser = {
            name: "Demo User",
            username: "demo",
            email: formData.email.trim(),
            mobile: "9876543210",
          };
          setUser(demoUser);
          
          const demoCategories = ["Action", "Comedy", "Drama"];
          useStore.getState().setCategories(demoCategories);
          navigate("/dashboard");
        } else {
          setErrors({
            username: "Username not found. Try 'demo' or register a new account.",
          });
        }
      }
    } else {
      if (validateForm()) {
        const { shareData, ...userDetails } = formData;
        const db = JSON.parse(localStorage.getItem("super_app_users_db") || "{}");
        const usernameKey = userDetails.username.trim().toLowerCase();
        
        if (db[usernameKey]) {
          const userRecord = db[usernameKey];
          setUser(userRecord.user);
          useStore.getState().setCategories(userRecord.categories);
          useStore.getState().setNotes(userRecord.notes);
          useStore.getState().setApiKeys(userRecord.apiKeys);
          
          if (userRecord.categories.length >= 3) {
            navigate("/dashboard");
          } else {
            navigate("/categories");
          }
        } else {
          setUser(userDetails);
          navigate("/categories");
        }
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-7">
      <div>
        <h2 className="text-accentNeon text-2xl sm:text-3xl font-heading font-bold tracking-widest mb-1 hidden md:block">
          SUPER APP
        </h2>
        <h3 className="text-gray-400 text-sm font-medium tracking-wide">
          {isSignInMode ? "Sign in to your account" : "Create your new account"}
        </h3>
      </div>

      <form onSubmit={handleFormSubmission} className="flex flex-col gap-4">
        {/* Name */}
        {!isSignInMode && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full bg-[#18181b] border ${errors.name ? "border-red-500" : "border-white/10 focus:border-accentNeon"} rounded-xl py-3 px-4 text-sm font-medium text-white placeholder-gray-500 outline-none transition-all duration-300`}
            />
            {errors.name && <span className="text-red-500 text-xs font-semibold">{errors.name}</span>}
          </div>
        )}

        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
          <input
            type="text"
            placeholder={isSignInMode ? "e.g. demo" : "alphanumeric_only"}
            value={formData.username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            className={`w-full bg-[#18181b] border ${errors.username ? "border-red-500" : "border-white/10 focus:border-accentNeon"} rounded-xl py-3 px-4 text-sm font-medium text-white placeholder-gray-500 outline-none transition-all duration-300`}
          />
          {errors.username && <span className="text-red-500 text-xs font-semibold">{errors.username}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full bg-[#18181b] border ${errors.email ? "border-red-500" : "border-white/10 focus:border-accentNeon"} rounded-xl py-3 px-4 text-sm font-medium text-white placeholder-gray-500 outline-none transition-all duration-300`}
          />
          {errors.email && <span className="text-red-500 text-xs font-semibold">{errors.email}</span>}
        </div>

        {/* Mobile */}
        {!isSignInMode && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
            <input
              type="text"
              placeholder="10-digit number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className={`w-full bg-[#18181b] border ${errors.mobile ? "border-red-500" : "border-white/10 focus:border-accentNeon"} rounded-xl py-3 px-4 text-sm font-medium text-white placeholder-gray-500 outline-none transition-all duration-300`}
            />
            {errors.mobile && <span className="text-red-500 text-xs font-semibold">{errors.mobile}</span>}
          </div>
        )}

        {/* Checkbox */}
        {!isSignInMode && (
          <div className="flex flex-col gap-1.5 mt-1">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.shareData}
                onChange={(e) => setFormData({ ...formData, shareData: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded border-gray-600 bg-[#18181b] accent-accentNeon cursor-pointer flex-shrink-0"
              />
              <span className="text-xs text-gray-400 leading-relaxed">
                Share my registration data with Superapp
              </span>
            </label>
            {errors.shareData && <span className="text-red-500 text-xs font-semibold">{errors.shareData}</span>}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-accentNeon text-black font-bold text-sm rounded-full py-3.5 px-6 mt-3 hover:scale-[1.02] active:scale-[0.97] transition-all duration-300 shadow-[0_0_15px_rgba(29,248,169,0.25)]"
        >
          {isSignInMode ? "SIGN IN" : "SIGN UP"}
        </button>
      </form>

      <div className="text-center mt-2">
        {isSignInMode ? (
          <p className="text-xs text-gray-400 font-semibold">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignInMode(false);
                setErrors({});
              }}
              className="text-accentNeon hover:underline font-black cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        ) : (
          <p className="text-xs text-gray-400 font-semibold">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignInMode(true);
                setErrors({});
              }}
              className="text-accentNeon hover:underline font-black cursor-pointer"
            >
              Sign In
            </button>
          </p>
        )}
      </div>

      <p className="text-[11px] text-gray-600 leading-relaxed text-center mt-1">
        By signing up, you agree to Superapp{" "}
        <span className="text-accentNeon cursor-pointer hover:underline">Terms</span> &{" "}
        <span className="text-accentNeon cursor-pointer hover:underline">Privacy Policy</span>.
      </p>
    </div>
  );
};

export default RegistrationForm;
