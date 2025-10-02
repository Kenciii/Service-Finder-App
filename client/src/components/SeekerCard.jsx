import { useEffect, useState } from "react";
import { apiRequest } from "../utils";
import { Loading } from "../components";

const SeekerCard = ({ id }) => {
  const [applicants, setApplicants] = useState([]);

  const getApplicantDetails = async () => {
    try {
      const res = await apiRequest({
        url: "/services/get-service-detail/" + id,
        method: "GET",
      });

      setApplicants(res?.data?.application || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getApplicantDetails();
  }, [id]);

  return (
    <div className='flex flex-wrap'>
      {applicants.length === 0 ? (
        <Loading />
      ) : (
        <>
          {applicants.map((seeker, index) => (
            <div
              key={index}
              className='w-full md:w-[16rem] 2xl:w-[18rem] h-[16rem] md:h-[18rem] bg-white flex flex-col justify-between shadow-lg rounded-md px-3 py-5'
              style={{ margin: "0.5rem" }}
            >
              <div className='w-full h-full flex flex-col justify-between'>
                <div className='flex gap-3'>
                  <img
                    src={seeker?.profileUrl || "/default-avatar.png"}
                    alt={seeker?.firstName}
                    className='w-14 h-14 rounded-full object-cover'
                  />
                  <div className='w-full h-16 flex flex-col justify-center'>
                    <p className='w-full h-12 flex items-center text-lg font-semibold overflow-hidden leading-5'>
                      {seeker?.firstName} {seeker?.lastName}
                    </p>
                  </div>
                </div>
                <div className='py-3'>
                  <p className='text-sm'>
                    {seeker?.about
                      ? seeker.about.slice(0, 150) + "..."
                      : "No information available"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SeekerCard;