import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="h-[100vh]  items-center flex justify-center px-5 lg:px-0">
      <div className="max-w-screen-xl bg-white shadow-xs shadow-[#00BDA6] sm:rounded-lg flex justify-center flex-1">
        <div className="hidden md:block md:w-1/2 lg:w-1/2 xl:w-7/12">
          <div></div>
          <div
            className="h-full w-full bg-cover  rounded-2xl"
            style={{
              backgroundImage:
                "url(https://static.vecteezy.com/system/resources/previews/008/415/006/non_2x/employment-agency-for-recruitment-or-placement-job-service-with-skilled-and-experienced-career-laborers-in-flat-cartoon-illustration-vector.jpg)",
            }}
          ></div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="flex flex-col items-center">
            <div className="text-center">
              <h1 className="text-4xl xl:text-4xl font-extrabold text-blue-900">
                <span className="text-[#00BDA6]">Student</span>{" "}
                <span className="text-[#FF6D34]">Login</span>
              </h1>
              <p className="text-[16px] text-gray-500">
                Enter your details to login
              </p>
            </div>

            <div className="w-full flex-1 mt-8">
              <form className="mx-auto max-w-xs flex flex-col gap-4">
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Enter registered email-id"
                  required
                />
                <div className="relative w-full">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-[#FF6D34] text-gray-100 w-full py-4 rounded-lg hover:bg-[#00BDA6] transition-all duration-100 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">Login</span>
                </button>

                <p className=" text-l text-gray-600 text-center">
                  Don't have an account?{" "}
                  <Link to="/">
                    <span className="text-[#00BDA6]  hover:text-[#FF6D34] font-semibold">
                      Sign up
                    </span>
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 text-center hidden md:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(https://www.mahindrauniversity.edu.in/wp-content/uploads/2023/04/why20is20training2020placement20cell20important1.png)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
