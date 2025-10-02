import { GoLocation } from "react-icons/go";
import moment from "moment";
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  return (
    <Link to={`/service-detail/${service?._id}`}>
      <div
        className='w-full md:w-[16rem] 2xl:w-[18rem] h-[16rem] md:h-[18rem] bg-white flex flex-col justify-between shadow-lg 
                rounded-md px-3 py-5 m-5'
      >
        <div className="w-full h-full flex flex-col justify-between">
        <div className='flex gap-3'>
          <img
            src={service?.logo}
            alt={service?.name}
            className='w-14 h-14'
          />

          <div className='w-full h-16 flex flex-col justify-center'>
            <p className='w-full h-12 flex item-center text-lg font-semibold overflow-hidden leading-5 '>{service?.serviceTitle}</p>
            <span className='flex gap-2 items-center'>
              <GoLocation className='text-slate-900 text-sm' />
              {service?.location}
            </span>
          </div>
        </div>

        <div className='py-3'>
          <p className='text-sm'>
            {service?.detail[0]?.desc?.slice(0, 150) + "..."}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p
            className={`
              text-black py-0.5 px-1.5 rounded font-semibold text-sm
              ${service?.serviceType === "Standard" ? "bg-gray-300" : ""}
              ${service?.serviceType === "Premium" ? "bg-yellow-300" : ""}
              ${service?.serviceType === "Budget-friendly" ? "bg-green-300" : ""}
            `}
          >
            {service?.serviceType}
          </p>

          <span className='text-gray-500 text-sm'>
            {moment(service?.createdAt).fromNow()}
          </span>
        </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;