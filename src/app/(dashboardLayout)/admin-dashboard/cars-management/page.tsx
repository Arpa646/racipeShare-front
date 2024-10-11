/* eslint-disable @typescript-eslint/no-explicit-any */
import nexiosInstance from "@/config/nexios.config";
import AllUser from "./components/AllUser";
//import TableData from "./components/TableData";

const CarsManagement = async () => {
  const res: any = await nexiosInstance.get("/cars", {
    next: {
      tags: ["carsTable"],
    },
  });

  const data=res?.data?.data
  return (
    <>
      <AllUser />
{/* 
      {res?.data?.data?.map((car: any) => (
        <div key={car._id}>
          <h1>{car.name}</h1>
        </div>
      ))} */}


{/* <TableData data={data}></TableData>
 */}







      
    </>
  );
};

export default CarsManagement;
