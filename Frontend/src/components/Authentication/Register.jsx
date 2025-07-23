import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle, X } from "lucide-react";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [passwordWarning, setPasswordWarning] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      if (value.length < 8 || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
        setPasswordWarning(
          "Password too weak. Use at least 8 characters, a number, and an uppercase letter."
        );
      } else {
        setPasswordWarning("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      showToast("Please enter your email.", "error");
      return;
    }
    // Simulated API call for demo
    console.log("Form submitted:", formData);
    showToast("Registration successful! Welcome aboard!", "success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-5 lg:px-0">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-screen-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl shadow-cyan-500/10 sm:rounded-2xl flex justify-center flex-1 overflow-hidden">
        {/* Left side - Logo and illustration */}
        <div className="flex-1 bg-gradient-to-br from-white via-cyan-50/50 to-blue-50/30 text-center hidden md:flex items-center justify-center relative">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-16 w-12 h-12 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 left-20 w-16 h-16 bg-blue-400 rounded-full animate-pulse delay-700"></div>
          </div>

          {/* Fixed placement consultant image */}
          <div className="relative w-full max-w-lg mx-auto px-8">
            <img
              src="https://www.teamob.ai/images/placement-consultant.png"
              alt="Placement Consultant"
              className="w-full h-auto max-h-[500px] xl:max-h-[600px] object-contain transform hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 20px 40px rgba(0, 189, 166, 0.15))",
              }}
            />
          </div>

          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-cyan-500/20 border border-white/30">
              <img
                src="http://uptoskills.com/wp-content/uploads/2023/04/hd-logo-iguru.png"
                alt="iGuru Logo"
                className="h-16 md:h-20 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right side - Registration form */}
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="flex flex-col items-center animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900 mb-3 bg-gradient-to-r from-blue-900 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
                <span className="text-[#00BDA6] drop-shadow-sm">Student</span>
                <span className="text-[#FF6D34] drop-shadow-sm"> Sign up</span>
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                Hey, enter your details to create your account
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-[#00BDA6] to-[#FF6D34] rounded-full mx-auto mt-3"></div>
            </div>

            <div className="w-full flex-1">
              <div className="mx-auto max-w-xs flex flex-col gap-5">
                <div className="space-y-5">
                  <div className="group">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl font-medium bg-gray-50 border-2 border-gray-200 transition-all duration-300 focus:border-[#00BDA6] focus:bg-white focus:shadow-lg focus:shadow-cyan-500/20 focus:outline-none group-hover:border-gray-300"
                      type="text"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="group">
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl font-medium bg-gray-50 border-2 border-gray-200 transition-all duration-300 focus:border-[#00BDA6] focus:bg-white focus:shadow-lg focus:shadow-cyan-500/20 focus:outline-none group-hover:border-gray-300"
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="group">
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl font-medium bg-gray-50 border-2 border-gray-200 transition-all duration-300 focus:border-[#00BDA6] focus:bg-white focus:shadow-lg focus:shadow-cyan-500/20 focus:outline-none group-hover:border-gray-300"
                      type="tel"
                      placeholder="Enter your mobile no"
                      maxLength={10}
                    />
                  </div>

                  <div className="relative group">
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-5 py-4 pr-12 rounded-xl font-medium bg-gray-50 border-2 border-gray-200 transition-all duration-300 focus:border-[#00BDA6] focus:bg-white focus:shadow-lg focus:shadow-cyan-500/20 focus:outline-none group-hover:border-gray-300"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a Password"
                    />

                    <div
                      className="absolute inset-y-0 right-4 flex items-center cursor-pointer transition-colors duration-200 hover:text-[#00BDA6]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500 hover:text-[#00BDA6] transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500 hover:text-[#00BDA6] transition-colors" />
                      )}
                    </div>
                  </div>
                </div>

                {passwordWarning && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-slide-down">
                    <p className="text-xs text-red-600 font-medium">
                      {passwordWarning}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  className="mt-6 font-semibold bg-gradient-to-r from-[#00BDA6] to-cyan-500 text-white w-full py-4 rounded-xl hover:from-[#FF6D34] hover:to-orange-500 transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 active:scale-95"
                >
                  <span className="ml-3 flex items-center justify-center">
                    Sign Up
                    <svg
                      className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>
                <p className="text-l text-gray-600 text-center">
                  Already have an account?{" "}
                  <Link to="/login">
                    <span className="text-[#00BDA6]  hover:text-[#FF6D34] font-semibold">
                      Sign In
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 max-w-sm w-full bg-white border-l-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out animate-slide-in ${
            toast.type === "success"
              ? "border-green-500"
              : toast.type === "error"
              ? "border-red-500"
              : "border-blue-500"
          }`}
        >
          <div className="flex items-center p-4">
            <div
              className={`flex-shrink-0 mr-3 ${
                toast.type === "success"
                  ? "text-green-500"
                  : toast.type === "error"
                  ? "text-red-500"
                  : "text-blue-500"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="w-6 h-6" />
              ) : toast.type === "error" ? (
                <X className="w-6 h-6" />
              ) : (
                <CheckCircle className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  toast.type === "success"
                    ? "text-green-800"
                    : toast.type === "error"
                    ? "text-red-800"
                    : "text-blue-800"
                }`}
              >
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RegistrationForm;
