// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { PulseLoader } from "react-spinners"; // Add a loader package like react-spinners
// // Adjust to your API slice
// import Image from 'next/image';
// import Link from "next/link"
// import { jwtDecode } from "jwt-decode";

// import { useSelector } from "react-redux";
// import { useGetSingleRecipeQuery } from "@/GlobalRedux/api/api";
// export default function RecipeDetails() {

//   interface CustomJwtPayload {
//     role?: string;
//     userId?: string;
//     useremail?: string;
//   }
// const id=paramd.recipeId
//   const token = useSelector((state) => state.auth.token);
//   const user = token ? jwtDecode<CustomJwtPayload>(token) : null;
//   const role: string = user?.role || "Guest";
 

//   const { data: recipeData, isLoading } = useGetSingleRecipeQuery(id as string);

//   const recipe = recipeData?.data;

//   console.log(recipe);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-black">
//         <PulseLoader color="#A18549" size={15} /> {/* Customizable loader */}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex flex-col items-center p-4 text-black min-h-screen">
//         <div className="max-w-6xl w-full  rounded-lg  p-6 animate__animated animate__fadeIn">
//           <div className="flex flex-col md:flex-row">
//             <div className="w-full md:w-2/3">
//               <Image
//                 style={{ backgroundColor: "#F9F9F9" }}
//                 src={recipe?.image}
//                 alt="Recipe Image"
//                 className="w-full mb-4 h-[500px] transform hover:scale-105 transition-transform duration-300"
//               />
//             </div>
//             <div className="w-full md:w-2/3 px-4">
//               <div className="ms-5 text-gray-400 mb-4 space-y-7">
//                 <div>
//                   <h1
//                     style={{
//                       fontFamily: '"Libre Baskerville", serif',
//                       fontWeight: 400,
//                       color: "rgb(34, 66, 41)",
//                     }}
//                     className="text-2xl text-black font-semibold mb-4"
//                   >
//                     {recipe?.title}
//                   </h1>
//                 </div>
//                 <div>
//                   <h1
//                     style={{
//                       fontFamily: '"Libre Baskerville", serif',
//                       fontWeight: 300,
//                       color: "rgb(34, 66, 41)",
//                     }}
//                     className="text-2xl text-black font-semibold mb-4"
//                   >
//                     Cook Time: {recipe?.time}
//                   </h1>
//                 </div>
//                 <hr />
//                 <div>
//                   <p
//                     style={{ color: "rgb(130, 135, 135)" }}
//                     className="text-justify text-black mb-4"
//                   >
//                     {recipe?.recipe}
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="">
//                     <span className="text-[19px] text-black">
//                       By: {recipe?.user?.name}
//                     </span>
//                   </div>
//                   <div className="">
//                     <span className="text-[19px] text-black">
//                       Rating: {recipe?.rating || "No ratings yet"}
//                     </span>
//                   </div>
//                   {role === "user" && (
//                     <Link href="/comments" state={{ recipe }}> {/* Adjust route for comments if applicable */}
//                       <button
//                         className="mt-9 hover:bg-[#A18549] rounded-bl-lg rounded-tr-lg hover:text-white text-lg
//     md:text-xl lg:text-2xl font-bold border border-[#A18549] rounded-none
//     p-2 md:p-5 lg:p-4 transition-all duration-300 bg-white text-[#A18549] hover:border-[#A18549]"
//                       >
//                         Add Comment
//                       </button>
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <hr />
//       <div
//         style={{ fontFamily: "Libre Baskerville" }}
//         className="flex text-gray-900 text-3xl justify-center space-x-7"
//       >
//         <h1 className="border-gray-900 border-b-2">Description</h1>
//         <h1 className="border-gray-900 border-b-2">Reviews (0)</h1> {/* Adjust reviews count if applicable */}
//       </div>
//       <div style={{ color: "rgb(130, 135, 135)" }} className="container mt-16">
//       <div
//           className="text-gray-600 mb-4"
//           dangerouslySetInnerHTML={{
//             __html: truncateDescription(recipe.recipe),
//           }}
//         /> {/* If there are any instructions or additional info */}
//       </div>
//     </div>
//   );
// }
