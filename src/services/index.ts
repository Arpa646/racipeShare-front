

import {jwtDecode} from "jwt-decode";
import { useSelector } from "react-redux";

// Interface for the token payload
interface CustomJwtPayload {
  role?: string;
  userId?: string;
  useremail?: string;
}

// Function to return user details from token
export const getUser = () => {
  // Get the token from Redux state
  const token = useSelector((state: any) => state.auth.token);

  // Decode the token to extract user details, if the token exists
  const user: CustomJwtPayload | null = token ? jwtDecode<CustomJwtPayload>(token) : null;

  // Return user details or a guest fallback
  return {
    role: user?.role || "Guest",
    userId: user?.useremail || "Unknown",
    email: user?.userId || "No email",
  };
};
