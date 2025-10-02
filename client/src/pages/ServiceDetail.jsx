import { useEffect, useState } from "react";
import moment from "moment";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { CustomButton, ServiceCard, Loading, SeekerCard } from "../components";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";


const ServiceDetail = () => {
  const { id }= useParams();
  const { user } = useSelector((state)=>state.user)
  const [service, setService] = useState(null);
  const [similarServices,setSimilarServices] = useState([])
  const [selected, setSelected] = useState("0")
  const [isFetching,setIsFetching] = useState(false)
  const [hasApplied,setHasApplied] = useState(false)

  const getServiceDetails = async ()=>{
    setIsFetching(true);

    try{
      const res = await apiRequest({
        url:"/services/get-service-detail/" + id,
        method:"GET"
      });

      setService(res?.data)
      setSimilarServices(res?.similarServices)
      setIsFetching(false)
    }catch(error)
    {
      setIsFetching(false)
      console.log(error)
    }
  }

  const handleDeletePost = async() =>{

    setIsFetching(true)
    try{
    if(window.confirm("Delete Service Post"))
    {
      const res = await apiRequest({
        url:"/services/delete-service/" + service?._id,
        token:user?.token,
        method:"DELETE"
    });

      if(res?.success)
      {
        alert(res?.message);
        window.location.replace("/")
      }
    }
    setIsFetching(false)
  }
    catch(error)
    {
      setIsFetching(false);
       console.log(error)
    }

  }
  useEffect(() => {
    id && getServiceDetails()
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  
 const checkifApplied = async () =>{
  try{
    const res = await apiRequest({
      url:"services/has-user-applied/" + id,
      token:user?.token,
      method:"GET"
    })
    if(res?.applicationstatus)
    {
      setHasApplied(true)
    }
  }
  catch(error)
  {
    console.log(error)
  }
 } 
  
  
  const applyingforService = async() =>{

    try{
      if(window.confirm("Apply for the service"))
      {
        const res = await apiRequest({
          url:"/services/get-service-detail/" + id,
          token:user?.token,
          method:"PUT"
        })

          if(res?.success)
        {
          setHasApplied(true)
          alert(res?.message);
          window.location.reload()
        }
      }
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    checkifApplied()
  },[hasApplied])
  

  return (
    <div className='container mx-auto'>
      <div className='w-full flex flex-col md:flex-row gap-10'>
        {isFetching?(
          <Loading />
        ): ( 

        <div className='w-full h-fit md:w-2/3 2xl:2/4 bg-white px-5 py-10 md:px-10 shadow-md'>
          <div className='w-full flex items-center justify-between'>
            <div className='w-3/4 flex gap-2'>
              <img
                src={service?.serviceProvider?.profileUrl}
                alt={user.name}
                className='w-20 h-20 md:w-24 md:h-20 rounded'
              />
               <div className='flex flex-col'>
                <p className='text-xl font-semibold text-gray-600'>
                  {service?.serviceTitle}
                </p>
                <span className='text-base'>{service?.location}</span>

                <span className='text-base text-blue-600'>
                  {service?.serviceProvider?.name}
                </span>

                <span className='text-gray-500 text-sm'>
                  {moment(service?.createdAt).fromNow()}
                </span>
              </div>
            </div>
            <div className=''>
              <AiOutlineSafetyCertificate className='text-3xl text-blue-500' />
            </div>
          </div>
          <div className='w-full flex flex-wrap md:flex-row gap-2 items-center justify-between my-10'>
            <div className='bg-[#bdf4c8] w-40 h-16 rounded-lg flex flex-col items-center justify-center'>
              <span className='text-sm'>Salary</span>
              <p className='text-lg font-semibold text-gray-700'>
                $ {service?.salary}
              </p>
            </div>
            <div className='bg-[#bae5f4] w-40 h-16 rounded-lg flex flex-col items-center justify-center'>
              <span className='text-sm'>Service Type</span>
              <p className='text-lg font-semibold text-gray-700'>
                {service?.serviceType}
              </p>
            </div>
            <div className='bg-[#fed0ab] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center'>
              <span className='text-sm'>No. of Applicants</span>
              <p className='text-lg font-semibold text-gray-700'>
                {service?.application?.length}
              </p>
            </div>

            <div className='bg-[#cecdff] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center'>
              <span className='text-sm'>Experience</span>
              <p className='text-lg font-semibold text-gray-700'>
                {service?.experience}
              </p>
            </div>
          </div>

          <div className='w-full flex gap-4 py-5'>
          <CustomButton
              onClick={() => setSelected("0")}
              title='Service Description'
              containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm ${
                selected === "0"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-300"
              }`}
            />

            <CustomButton
              onClick={() => setSelected("1")}
              title='Service Provider'
              containerStyles={`w-full flex items-center justify-center  py-3 px-5 outline-none rounded-full text-sm ${
                selected === "1"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-300"
              }`}
            />


            {user?._id === service?.serviceProvider?._id && <CustomButton
              onClick={() => {
                setSelected("2")
              }}
              title='Applicants'
              containerStyles={`w-full flex items-center justify-center  py-3 px-5 outline-none rounded-full text-sm ${
                selected === "2"
                  ? "bg-black text-white"
                  : "bg-white text-black border border-gray-300"
              }`}
            />  }    


          </div>
          <div className='my-6'>
          {selected === "0" ? (
                  <>
                    <p className='text-xl font-semibold'>Service Description</p>
                    <span className='text-base'>{service?.detail[0]?.desc}</span>
                    {service?.detail[0]?.requirements && (
                      <>
                        <p className='text-xl font-semibold mt-8'>Skills</p>
                        <span className='text-base'>
                          {service?.detail[0]?.requirements}
                        </span>
                      </>
                    )}
                  </>
                ) : selected === "1" ? (
                  <>
                    <div className='mb-6 flex flex-col'>
                      <p className='text-xl text-blue-600 font-semibold'>
                        {service?.serviceProvider?.name}
                      </p>
                      <span className='text-base'>{service?.serviceProvider?.location}</span>
                      <span className='text-sm'>{service?.serviceProvider?.email}</span>
                    </div>

                    <p className='text-xl font-semibold'>About Service Provider</p>
                    <span>{service?.serviceProvider?.about}</span>
                  </>
                ) : 
                  <SeekerCard id={id}/>
                }
          </div>

          <div className='w-full'>
          {user?._id === service?.serviceProvider?._id ? (
            <CustomButton
              title='Delete Post'
              onClick={handleDeletePost}
              containerStyles={`w-full flex items-center justify-center text-white bg-black py-3 px-5 outline-none rounded-full text-base`}
            />
          ) : hasApplied ? (
            <CustomButton
              title='You have applied'
              containerStyles={`w-full flex items-center justify-center text-white bg-black py-3 px-5 outline-none rounded-full text-base`}
            />
          ) : (
            <CustomButton
              onClick={applyingforService}
              title='Apply Now'
              containerStyles={`w-full flex items-center justify-center text-white bg-black py-3 px-5 outline-none rounded-full text-base`}
            />
            )}

          </div>
        </div>
        )}

        {/* RIGHT SIDE*/}
        <div className='w-full md:w-1/3 2xl:w-2/4 p-5 mt-20 md:mt-0'>
          <p className='text-gray-500 font-semibold'>Similar Service Post</p>

          <div className='w-full flex flex-wrap gap-4'>
            {similarServices?.slice(0, 6).map((service, index) => {
              const data = {
                name: user.name || "Unknown",
                logo: service?.serviceProvider?.profileUrl || "/logo.png",
                ...service
              }
              return <ServiceCard service={data} key={index} />
            })}

          </div>
        </div>
      </div>
    </div> 
  )
}

export default ServiceDetail;