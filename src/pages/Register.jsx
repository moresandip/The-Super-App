import React from "react";
import RegistrationForm from "../components/RegistrationForm";
import sideBanner from "../assets/register_side_banner.png";

const Register = () => {
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

          <RegistrationForm />

        </div>
      </div>
    </div>
  );
};

export default Register;
