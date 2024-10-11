"use client"; // Ensures this is a client component in Next.js

import GoogleLoginBtn from "../components/page/shared/GoogleLoginBtn";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router instead of useNavigate
import { setUser } from "@/GlobalRedux/features/auth/authSlice";
import { toast } from "sonner";
import { verifyToken } from "@/utils/verify";
import { useLogInMutation } from "@/GlobalRedux/api/api";
import Link from "next/link"; // Next.js Link for navigation
import { useDispatch } from "react-redux";
import { setCookie } from "nookies";
type ApiError = {
  status?: number;
  message?: string;
};

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter(); // Next.js router
  const [LogIn] = useLogInMutation();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState<LoginForm>({
    email: "user4@gmail.com",
    password: "user",
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message

    try {
      const response: any = await LogIn(formData).unwrap(); // Ensure type safety with 'unwrap'

      if (response.token) {
        const user = verifyToken(response.token); // Ensure this function is properly defined
        dispatch(setUser({ user: user, token: response.token }));
        setCookie(null, "token", response.token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days expiry
          path: "/", // Cookie is accessible across the entire site
        });
        
        // Set user cookie (you may want to serialize the user data if it's an object)
        setCookie(null, "user", JSON.stringify(user), {
          maxAge: 30 * 24 * 60 * 60, // 30 days expiry
          path: "/", // Cookie is accessible across the entire site
        });


        toast.success("Login successful!");
        router.push("/"); // Use router.push instead of navigate()

        console.log("Login successful:", response.token);
      } else {
        setErrorMessage("Wrong email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);

      const apiError = error as ApiError;

      if (apiError.status === 500 || apiError.status === 400) {
        setErrorMessage("Wrong email or password.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white pt-6 p-10 min-lg:h-[900px] shadow-xl lg:w-[700px] sm:w-[500px] md:w-[700px] mx-auto">
      <div className="divider"></div>
      <GoogleLoginBtn />
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full flex flex-col items-center"
      >
        <h1 className="text-2xl font-medium" style={{ color: "#4F5C6E" }}>
          Login to Escrow.com
        </h1>

        <div className="flex flex-col items-center space-y-5 w-full">
          <div className="w-full lg:w-[500px] flex flex-col items-center">
            <div className="space-y-2 w-full">
              <h1 className="text-sm">
                PLEASE ENTER YOUR EMAIL
                <span style={{ color: "red" }}>*</span>
              </h1>
              <div className="relative w-full">
                <input
                  style={{ border: "1px solid #A4B0B1", borderRadius: "4px" }}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Type here"
                  className="hover:border-sky-700 input-bordered h-9 w-full pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[500px] flex flex-col items-center">
            <div className="space-y-2 w-full">
              <h1 className="text-sm">
                PLEASE ENTER YOUR PASSWORD
                <span style={{ color: "red" }}>*</span>
              </h1>
              <div className="relative w-full">
                <input
                  style={{ border: "1px solid #A4B0B1", borderRadius: "4px" }}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Type here"
                  className="hover:border-sky-700 input-bordered h-9 w-full pl-10"
                  required
                />
              </div>

              {errorMessage && (
                <div className="text-red-500 text-sm">{errorMessage}</div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[500px] flex flex-col items-center">
            <div className="relative w-full">
              <button
                type="submit"
                style={{ backgroundColor: "#3CB95D", borderRadius: "4px" }}
                className="input hover:bg-sky-500 h-9 font-semibold text-white w-full pl-10"
              >
                Log In
              </button>
            </div>
          </div>

          <Link  href="/forgottenPass" >
            <h3 style={{ color: "#0088FF", borderRadius: "4px" }}>
              Recover your password
            </h3>
          </Link>
          <div>-OR-</div>
          <div className="w-full flex flex-col items-center">
            <div className="relative w-full text-center">
              <Link
                className="text-xs font-bold underline underline-offset-4"
                href="/signup" // Changed to Next.js 'Link' component
                style={{ color: "#3CB95D" }}
              >
                CREATE ACCOUNT ON ESCROW.COM
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
