import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import sideBanner from "../assets/register_side_banner.png";

const Register = () => {
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

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

  const handleFormSubmission = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { shareData, ...userDetails } = formData;
      setUser(userDetails);
      navigate("/categories");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#09090b] text-white">

      {/* ── LEFT PANE — Side Banner Art (hidden on xs, shows md+) ── */}
      <div
        className="hidden md:flex w-full md:w-[45%] lg:w-[40%] min-h-screen bg-cover bg-center relative flex-col justify-end p-8 md:p-12 overflow-hidden border-r border-white/5"
        style={{ backgroundImage: `url(${sideBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />
        <div className="absolute inset-0 bg-black/20 z-0" />
        <div className="relative z-10 flex flex-col gap-3">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black font-heading leading-tight tracking-tight text-white drop-shadow-lg">
            Discover new things on{" "}
            <span className="text-accentNeon">Superapp</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-sm drop-shadow-md">
            Weather, rotating headlines, tools, and personalized recommendations — unified in one dashboard.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANE — Form (full width on mobile, 55% on desktop) ── */}
      <div className="w-full md:w-[55%] lg:w-[60%] flex items-center justify-center px-5 py-10 sm:px-10 md:px-12 lg:px-16 min-h-screen">
        <div className="w-full max-w-md flex flex-col gap-7">

          {/* Mobile-only hero text */}
          <div className="block md:hidden text-center mb-2">
            <div
              className="w-full h-36 rounded-2xl bg-cover bg-center mb-5 relative overflow-hidden"
              style={{ backgroundImage: `url(${sideBanner})` }}
            >
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-accentNeon text-3xl font-black font-heading tracking-widest">SUPER APP</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-accentNeon text-2xl sm:text-3xl font-heading font-bold tracking-widest mb-1 hidden md:block">
              SUPER APP
            </h2>
            <h3 className="text-gray-400 text-sm font-medium tracking-wide">
              Create your new account
            </h3>
          </div>

          <form onSubmit={handleFormSubmission} className="flex flex-col gap-4">
            {/* Name */}
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

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
              <input
                type="text"
                placeholder="alphanumeric_only"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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

            {/* Checkbox */}
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

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-accentNeon text-black font-bold text-sm rounded-full py-3.5 px-6 mt-3 hover:scale-[1.02] active:scale-[0.97] transition-all duration-300 shadow-[0_0_15px_rgba(29,248,169,0.25)]"
            >
              SIGN UP
            </button>
          </form>

          <p className="text-[11px] text-gray-600 leading-relaxed text-center mt-2">
            By signing up, you agree to Superapp{" "}
            <span className="text-accentNeon cursor-pointer hover:underline">Terms</span> &{" "}
            <span className="text-accentNeon cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
