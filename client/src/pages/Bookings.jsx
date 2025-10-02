import React, { useEffect } from 'react'
import { apiRequest } from '../utils'
import { useState } from 'react'
import { ServiceCard, Loading } from '../components'
import { useSelector } from 'react-redux'

const Bookings = () =>
{
    const { user } = useSelector((state) => state.user)
    const [isFetching, setIsFetching] = useState(false)
    const [appliedServices,setAppliedBookings] = useState([])


    const fetchBookings = async () =>{
        setIsFetching(true)
        try{
            const res = await apiRequest({
                url:"/user/applied-services",
                token:user?.token,
                method:"GET"
            })
            setIsFetching(false)
            setAppliedBookings(res?.services)
        }catch(error)
        {
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchBookings()
    },[])

    return (
        isFetching ? (
          <Loading />
        ) : (
          <div className='w-full flex flex-wrap gap-4'>
            {appliedServices.map((service, index) => {
              const newService = {
                name: service?.serviceProvider?.name,
                logo: service?.serviceProvider?.profileUrl,
                ...service,
              };
              return <ServiceCard service={newService} key={index} />;
            })}
          </div>
        )
      );
}

export default Bookings;