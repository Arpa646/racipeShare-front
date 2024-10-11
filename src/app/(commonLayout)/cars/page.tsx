/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

// import nexiosInstance from "@/config/nexios.config";
// import { Card, CardFooter, CardHeader, Image, Link } from "@nextui-org/react";
// import {getAllUser} from "@/services"
import { useGetFacilitiesQuery } from "@/GlobalRedux/api/api";
const Cars = () => {
  // const res = await fetch("http://localhost:5000/api/v1/cars", {
  //   next: {},
  //   cache: "no-store",
  // });

  //res,json()

  // const { data }: any = await nexiosInstance.get("/cars", {
  //   cache: "no-store",
  //   next: {},
  // });
  //const posts = await getAllUser("ssr", true);
   const { data: facilitiesDataresult, isLoading, error } = useGetFacilitiesQuery(undefined); // Fetching facility data
  console.log(facilitiesDataresult)
//console.log("this is userss",facilitiesDataresult)
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      {/* Page Title */}
      <p className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-14 tracking-wider">
        All Cars
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 w-full max-w-7xl">
     
      </div>
    </div>
  );
};

export default Cars;
