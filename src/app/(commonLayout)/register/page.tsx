// Replace "use client" directive if needed for Next.js client-side functionality.
"use client";

import React, { useState } from "react";
import Link from "next/link"; // Import Next.js's Link
import { useSignUpMutation } from "@/GlobalRedux/api/api"; // Import your mutation hook

const Reg: React.FC = () => {
  // Form state management
  interface SignUpError {
    data?: {
      message?: string;
    };
    error?: string;
  }
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user", // Role is set to user by default
    address: "",
  });

  // Local state to handle validation errors
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  // Local state to handle general error messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hook for signing up a user
  const [signUp, { isLoading, isSuccess }] = useSignUpMutation();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear the error when the user types
  };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    };

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      setErrorMessage(null); // Reset error message before submission
      await signUp({ user: formData }).unwrap(); // Send form data to backend
      alert("User registered successfully!");
    } catch (err) {
      // Type assertion to SignUpError
      const error = err as SignUpError; // Type assertion here
  
      // Check the error response and display appropriate error message
      if (error.data?.message) {
        setErrorMessage(error.data.message);
      } else if (error.error) {
        setErrorMessage(error.error);
      } else {
        setErrorMessage("Failed to register user. Please try again.");
      }
    }
  };
  

  return (
    <div className="bg-white pt-6 min-lg:h-[900px] shadow-xl lg:w-[800px] sm:w-[500px] md:w-[700px] mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <div className="divider"></div>
        <div className="space-y-6 w-full flex flex-col items-center">
          <h1 className="text-2xl font-medium" style={{ color: "#4F5C6E" }}>
            Create an Account to Escrow.com
          </h1>

          {/* Name Input */}
          <div className="w-full lg:w-[500px] flex flex-col items-center">
            <div className="space-y-2 w-full">
              <h1 className="text-sm text-start">
                PLEASE ENTER YOUR NAME
                <span style={{ color: "red" }}>* </span>
              </h1>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ border: "1px solid #A4B0B1", borderRadius: "4px" }}
                type="text"
                placeholder="Your name"
                className="hover:border-sky-700 input-bordered p-2 h-9 w-full"
              />
              {formErrors.name && (
                <p className="text-red-600">{formErrors.name}</p>
              )}
            </div>
          </div>

          {/* Email Input */}
          <div className="w-full lg:w-[500px] flex flex-col items-center">
            <div className="space-y-2 w-full">
              <h1 className="text-sm text-start">
                PLEASE ENTER YOUR EMAIL ADDRESS
                <span style={{ color: "red" }}>* </span>
              </h1>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ border: "1px solid #A4B0B1", borderRadius: "4px" }}
                type="email"
                placeholder="Your email"
                className="hover:border-sky-700 input-bordered p-2 h-9 w-full"
              />
              {formErrors.email && (
                <p className="text-red-600">{formErrors.email}</p>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="w-full lg:w-[500px] flex flex-col items-center">
            <div className="space-y-2 w-full">
              <h1 className="text-sm text-start">
                PLEASE ENTER YOUR PASSWORD
                <span style={{ color: "red" }}>* </span>
              </h1>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{ border: "1px solid #A4B0B1", borderRadius: "4px" }}
                type="password"
                placeholder="Your password"
                className="hover:border-sky-500 input-bordered p-2 h-9 w-full"
              />
              {formErrors.password && (
                <p className="text-red-600">{formErrors.password}</p>
              )}
            </div>
          </div>

          {/* Phone Input */}
          <div className="w-full lg:w-[500px] flex flex-col items-center">
            <div className="space-y-2 w-full">
              <h1 className="text-sm text-start">
                PLEASE ENTER YOUR PHONE NUMBER
                <span style={{ color: "red" }}>* </span>
              </h1>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{ border: "1px solid #A4B0B1", borderRadius: "4px" }}
                type="tel"
                placeholder="Your phone number"
                className="hover:border-sky-500 input-bordered p-2 h-9 w-full"
              />
              {formErrors.phone && (
                <p className="text-red-600">{formErrors.phone}</p>
              )}
            </div>
          </div>

          {/* Address Input */}
          <div className="w-full lg:w-[500px] flex flex-col items-center">
            <div className="space-y-2 w-full">
              <h1 className="text-sm text-start">
                PLEASE ENTER YOUR ADDRESS
                <span style={{ color: "red" }}>* </span>
              </h1>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={{ border: "1px solid #A4B0B1", borderRadius: "4px" }}
                type="text"
                placeholder="Your address"
                className="hover:border-sky-500 input-bordered p-2 h-9 w-full"
              />
              {formErrors.address && (
                <p className="text-red-600">{formErrors.address}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full lg:w-[500px] flex flex-col items-center">
            <div className="relative w-full">
              <input
                type="submit"
                value={isLoading ? "Signing Up..." : "Sign Up"}
                disabled={isLoading}
                className="input hover:bg-sky-500 h-9 font-semibold text-white w-full pl-10"
                style={{
                  backgroundColor: "#3CB95D",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-600 w-full lg:w-[500px] text-center">
              {errorMessage}
            </p>
          )}

          {/* Success Message */}
          {isSuccess && (
            <p className="text-green-600 w-full lg:w-[500px] text-center">
              User registered successfully!
            </p>
          )}

          <div className="w-full lg:w-[500px] flex justify-start items-start mt-3">
            <Link href="/login" className="text-blue-600 hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Reg;
