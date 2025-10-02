import { useEffect, useState } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom/dist';
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { ListBox, ServiceCard, CustomButton, Header } from '../components';
import { serviceTypes, experience } from '../utils/data';
import { apiRequest, updateURL } from '../utils';

const FindService = () => {
  const [sort, setSort] = useState('Newest');
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");
  const [filterServiceTypes, setFilterServiceTypes] = useState([]);
  const [filterExp, setFilterExp] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchServices = async () => {
    setIsFetching(true);
    const newURL = updateURL({
      pageNum: page,
      query: searchQuery,
      cmpLoc: serviceLocation,
      sort: sort,
      navigate: navigate,
      location: location,
      jType: filterServiceTypes,
      exp: filterExp
    });

    try {
      const res = await apiRequest({
        url: "/services" + newURL,
        method: "GET"
      });

      setNumPage(res?.numOfPage);
      setRecordsCount(res?.totalServices);
      setData(res?.data);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
      setIsFetching(false);
    }
  };

  const filterServices = (val) => {
    if (filterServiceTypes?.includes(val)) {
      setFilterServiceTypes(filterServiceTypes.filter((el) => el !== val));
    } else {
      setFilterServiceTypes([...filterServiceTypes, val]);
    }
  };

  const filterExperience = (val) => {
    if (filterExp?.includes(val)) {
      setFilterExp(filterExp.filter((el) => el !== val));
    } else {
      setFilterExp([...filterExp, val]);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchServices();
  };

  const handleShowMore = async (e) => {
    e.preventDefault();
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    fetchServices();
  }, [sort, filterServiceTypes, filterExp, page]);

  return (
    <div>
      <div className='text-center'>
        <Header 
          title={
            <>
              Your trusted guide to the right <span className='bg-blue-500 text-white'>Service Provider</span>
            </>
          }
          type="home"
          handleClick={handleSearchSubmit}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          location={serviceLocation}
          setLocation={setServiceLocation}
        />
      </div>

      <div className='container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f7fdfd]'>
        <div className='hidden md:flex flex-col w-1/6 h-fit bg-white shadow-sm'>
          <p className='text-lg font-semibold text-slate-600'>Filter Search</p>

          {/* Service Type Filter */}
          <div className='py-2'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BiBriefcaseAlt2 />
                Service Type
              </p>
              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>
            <div className='flex flex-col gap-2'>
              {serviceTypes.map((jtype, index) => (
                <div key={index} className='flex gap-2 text-sm md:text-base '>
                  <input
                    type='checkbox'
                    value={jtype}
                    className='w-4 h-4'
                    onChange={(e) => filterServices(e.target.value)}
                    checked={filterServiceTypes.includes(jtype)}
                  />
                  <span>{jtype}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Filter */}
          <div className='py-2 mt-4'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BsStars />
                Experience
              </p>
              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>
            <div className='flex flex-col gap-2'>
              {experience.map((exp) => (
                <div key={exp.title} className='flex gap-3'>
                  <input
                    type='checkbox'
                    value={exp?.value}
                    className='w-4 h-4'
                    onChange={(e) => filterExperience(e.target.value)}
                    checked={filterExp.includes(exp?.value)}
                  />
                  <span>{exp.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div className='w-full md:w-5/6 px-5 md:px-0'>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-sm md:text-base'>
              Showing: <span className='font-semibold'>{recordsCount}</span> Services Available
            </p>
            <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
              <p className='text-sm md:text-base'>Sort By:</p>
              <ListBox sort={sort} setSort={setSort} />
            </div> 
          </div>

          <div className='w-full flex flex-wrap gap-4'>
            {data && data.length > 0 ? (
              data.map((service, index) => {
                const newService = {
                  name: service?.serviceProvider?.name,
                  email: service?.serviceProvider?.email,
                  logo: service?.serviceProvider?.profileUrl,
                  ...service,
                };
                return <ServiceCard service={newService} key={index} />;
              })
            ) : (
              <p>No services found</p>
            )}
          </div>

          {numPage > page && !isFetching && (
            <div className='w-full flex items-center justify-center pt-16'>
              <CustomButton
                onClick={handleShowMore}
                title='Load More'
                containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindService;